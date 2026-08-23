"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import ScanInfoPanel from "@modules/events/scan/components/ScanInfoPanel";
import ScanCameraPanel from "@modules/events/scan/components/ScanCameraPanel";
import ScanParticipantsPanel from "@modules/events/scan/components/ScanParticipantsPanel";
import ScanResultPanel from "@modules/events/scan/components/ScanResultPanel";
import NoActiveEventsModal from "@modules/events/scan/components/NoActiveEventsModal";
import ScanResultModal, {
  type ScanResultModalData,
} from "@modules/events/scan/components/ScanResultModal";
import type { Participant, ScanEvent } from "@modules/events/scan/constants";
import {
  useIsMobile,
  useIsTablet,
  useIsDesktop2xl,
} from "@assets/hooks/use-mobile";
import { useRouter } from "@i18n/navigation";
import type { APIErrorData } from "@services/events";
import {
  fetchEventById,
  fetchManagedEvents,
  fetchRecentParticipants,
  postParticipantScan,
} from "@services/events.actions";
import type { RecentParticipantRes } from "@services/events";

const formatTime = (isoTime: string) => {
  const date = new Date(isoTime);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getScanLocation = (): Promise<{ lat: number; long: number }> => {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ lat: 0, long: 0 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      () => resolve({ lat: 0, long: 0 }),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 },
    );
  });
};

const buildFailedScanResult = (message: string): ScanResultModalData => ({
  status: "failed",
  participantName: "",
  refId: "",
  organization: "",
  checkInTime: "",
  message,
});

const buildParticipantDisplayName = (
  person: {
    title_th: string | null;
    firstname_th: string | null;
    surname_th: string | null;
    title_en: string | null;
    firstname_en: string | null;
    surname_en: string | null;
  },
  unknownLabel: string,
) =>
  [person.title_th, person.firstname_th, person.surname_th]
    .filter(Boolean)
    .join(" ") ||
  [person.title_en, person.firstname_en, person.surname_en]
    .filter(Boolean)
    .join(" ") ||
  unknownLabel;

const ScanCameraPlaceholder: StyleableFC = ({ className }) => (
  <div
    className={cn(
      "flex items-center justify-center rounded-[40px] bg-white",
      className,
    )}
  >
    <Loader2 className="size-8 animate-spin text-primary" />
  </div>
);

const ScanTemplate = () => {
  const t = useTranslations("Scan");
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop2xl = useIsDesktop2xl();
  // The "mobile" CSS layout (camera-only, no inline result panel) is shown
  // below the `lg` breakpoint (1024px), which spans both the isMobile
  // (<768px) and isTablet (768-1023px) hook ranges. Gating the result modal
  // on isMobile alone left a dead zone (768-1023px) where a scan result
  // never appeared anywhere — no inline panel (CSS says mobile layout) and
  // no modal (JS said not mobile).
  const isCompactLayout = isMobile || isTablet;
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedEventId = searchParams.get("eventId");
  const [events, setEvents] = useState<ScanEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [recentParticipants, setRecentParticipants] = useState<Participant[]>(
    [],
  );
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [isSubmittingScan, setIsSubmittingScan] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isNoEventsModalOpen, setIsNoEventsModalOpen] = useState(false);
  const [loadEventsFailed, setLoadEventsFailed] = useState(false);
  const [isScanCooldown, setIsScanCooldown] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultModalData | null>(
    null,
  );
  const isScanLockedRef = useRef(false);
  const scanCooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const emptySelectedEvent = useMemo<ScanEvent>(
    () => ({
      id: "",
      name: t("page.emptyEventName"),
      startTime: "--:--",
      endTime: "--:--",
    }),
    [t],
  );

  const getFailedScanMessage = (error: APIErrorData) => {
    switch (error.code) {
      case "PARTICIPANT_NO_PERMISSION":
        return t("resultPanel.permissionError");
      case "SCANNER_NO_PERMISSION":
        return t("resultPanel.scannerNoPermissionError");
      case "EVENT_NOT_FOUND":
        return t("resultPanel.eventNotFoundError");
      case "INVALID_QR":
        return t("resultPanel.invalidQrError");
    }

    if (error.status === 403) {
      return t("resultPanel.permissionError");
    }

    if (error.message) {
      return t("resultPanel.serverErrorWithDetail", { message: error.message });
    }

    return t("resultPanel.defaultError");
  };

  const startScanCooldown = () => {
    if (scanCooldownTimerRef.current) {
      clearTimeout(scanCooldownTimerRef.current);
    }

    setIsScanCooldown(true);
    scanCooldownTimerRef.current = setTimeout(() => {
      setIsScanCooldown(false);
      scanCooldownTimerRef.current = null;
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (scanCooldownTimerRef.current) {
        clearTimeout(scanCooldownTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      setLoadEventsFailed(false);
      const result = await fetchManagedEvents();

      if (!result.ok) {
        console.error(
          `${t("errors.failedToFetchEvents")} [${result.error.code}]: ${result.error.message}`,
        );
        setEvents([]);
        setSelectedEventId("");
        // Surface the failure through the same modal used for "no active
        // events" — with distinct copy, since it's a different situation the
        // user can retry, not an empty state. Silently doing nothing here
        // leaves the scan page spinning forever with no way to tell what's
        // wrong.
        setLoadEventsFailed(true);
        setIsNoEventsModalOpen(true);
        return;
      }

      const now = new Date();
      const startedEvents = result.data.data.filter(
        (event) => new Date(event.start_time) <= now,
      );
      const mappedEvents: ScanEvent[] = startedEvents.map((event) => ({
        id: event.id,
        name: event.name,
        startTime: formatTime(event.start_time),
        endTime: formatTime(event.end_time),
        role: event.role,
      }));

      let allEvents = mappedEvents;
      if (
        requestedEventId &&
        !mappedEvents.some((event) => event.id === requestedEventId)
      ) {
        const requestedResult = await fetchEventById(requestedEventId);
        if (requestedResult.ok) {
          const event = requestedResult.data.data;
          const isEnd = new Date(event.end_time) < now;
          const hasStarted = new Date(event.start_time) <= now;
          const canScanRequested = !!event.role || event.allow_all_to_scan;

          if (!isEnd && hasStarted && canScanRequested) {
            allEvents = [
              ...mappedEvents,
              {
                id: requestedEventId,
                name: event.name,
                startTime: formatTime(event.start_time),
                endTime: formatTime(event.end_time),
                role: event.role,
              },
            ];
          }
        }
      }

      setEvents(allEvents);
      setIsNoEventsModalOpen(allEvents.length === 0);
      const requestedEventExists =
        requestedEventId &&
        allEvents.some((event) => event.id === requestedEventId);
      setSelectedEventId(
        (prev) =>
          prev ||
          (requestedEventExists ? requestedEventId : undefined) ||
          allEvents[0]?.id ||
          "",
      );
    };

    loadEvents();
  }, [requestedEventId, t]);

  useEffect(() => {
    const loadSelectedEventDetail = async () => {
      if (!selectedEventId) {
        setTotalParticipants(0);
        return;
      }

      const result = await fetchEventById(selectedEventId);
      if (!result.ok) {
        console.error(
          `${t("errors.failedToFetchEventDetail")} [${result.error.code}]: ${result.error.message}`,
        );
        return;
      }

      setTotalParticipants(result.data.data.total_registered);
    };

    loadSelectedEventDetail();
  }, [selectedEventId, t]);

  useEffect(() => {
    setScanResult(null);
    setIsResultModalOpen(false);

    if (!selectedEventId) {
      setRecentParticipants([]);
      return;
    }

    let cancelled = false;
    const loadRecentParticipants = async () => {
      const result = await fetchRecentParticipants(selectedEventId);
      if (cancelled) return;

      if (!result.ok) {
        console.error(
          `${t("errors.failedToFetchRecentParticipants")} [${result.error.code}]: ${result.error.message}`,
        );
        setRecentParticipants([]);
        return;
      }

      setRecentParticipants(
        result.data.data.map((person: RecentParticipantRes) => ({
          id: String(person.ref_id),
          name: buildParticipantDisplayName(
            person,
            t("resultPanel.unknownParticipant"),
          ),
          time: formatTime(person.check_in_time),
        })),
      );
    };

    loadRecentParticipants();
    return () => {
      cancelled = true;
    };
  }, [selectedEventId]);

  const selectedEvent = useMemo(
    () =>
      events.find((event) => event.id === selectedEventId) ??
      events[0] ??
      emptySelectedEvent,
    [emptySelectedEvent, events, selectedEventId],
  );

  const handleScan = async (text: string) => {
    if (
      !selectedEventId ||
      isScanLockedRef.current ||
      isSubmittingScan ||
      isScanCooldown ||
      (isCompactLayout && isResultModalOpen)
    ) {
      return;
    }

    isScanLockedRef.current = true;
    setIsSubmittingScan(true);

    try {
      const { lat, long } = await getScanLocation();
      const result = await postParticipantScan(
        text,
        selectedEventId,
        long,
        lat,
      );

      if (!result.ok) {
        console.error(
          `Scan failed [${result.error.code}]: ${result.error.message}`,
        );
        setScanResult(
          buildFailedScanResult(getFailedScanMessage(result.error)),
        );
        if (isCompactLayout) {
          setIsResultModalOpen(true);
        }
        return;
      }

      const res = result.data;

      if (!res.data) {
        setScanResult(buildFailedScanResult(t("resultPanel.defaultError")));
        if (isCompactLayout) {
          setIsResultModalOpen(true);
        }
        console.error(t("errors.missingParticipantData"));
        return;
      }

      const participantName = buildParticipantDisplayName(
        res.data,
        t("resultPanel.unknownParticipant"),
      );

      const scannedAt = res.data.check_in_time
        ? formatTime(res.data.check_in_time)
        : "-";

      const organization =
        res.data.organization_th || res.data.organization_en || "-";

      const modalData: ScanResultModalData = {
        participantName,
        refId: res.data.ref_id || "-",
        organization,
        checkInTime: scannedAt,
        status: res.data.status === "duplicate" ? "duplicate" : "success",
        profileImageUrl: res.data.profile_image_url || undefined,
        code: res.data.code,
      };

      if (res.data.status !== "duplicate") {
        setRecentParticipants((prev) =>
          [
            {
              id: res.data.ref_id || "-",
              name: participantName,
              time: scannedAt,
            },
            ...prev,
          ].slice(0, 8),
        );
      }

      setScanResult(modalData);
      if (isCompactLayout) {
        setIsResultModalOpen(true);
      }

      const selectedEventResult = await fetchEventById(selectedEventId);
      if (selectedEventResult.ok) {
        setTotalParticipants(selectedEventResult.data.data.total_registered);
      } else {
        console.error(
          t("errors.failedToFetchEventDetail"),
          selectedEventResult.error,
        );
      }
    } catch (error) {
      console.error(t("errors.unexpectedScanError"));
      setScanResult(buildFailedScanResult(t("resultPanel.defaultError")));
      if (isCompactLayout) {
        setIsResultModalOpen(true);
      }
      console.error(t("errors.failedToSubmitScan"), error);
    } finally {
      setIsSubmittingScan(false);
      isScanLockedRef.current = false;
      startScanCooldown();
    }
  };

  return (
    <div className="min-h-screen w-full lg:bg-neutral-200">
      {/* ── Desktop / laptop (2xl+, ≥1536px): Info panel (with live camera) + Participants stats ── */}
      <div className="hidden 2xl:grid 2xl:grid-cols-[0.8fr_1.2fr] 2xl:gap-6 2xl:p-8 2xl:min-h-screen">
        <ScanInfoPanel
          events={events}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEventId}
          cameraSlot={
            selectedEventId && isDesktop2xl ? (
              <ScanCameraPanel
                paused={isSubmittingScan || isResultModalOpen || isScanCooldown}
                isSubmitting={isSubmittingScan}
                onScan={handleScan}
                className="h-full w-full min-h-[420px] rounded-[40px] bg-transparent"
              />
            ) : (
              <ScanCameraPlaceholder className="h-full w-full min-h-[420px] bg-transparent" />
            )
          }
        />
        {scanResult ? (
          <ScanResultPanel
            result={scanResult}
            onBackToScan={() => setScanResult(null)}
            className="2xl:min-h-0"
          />
        ) : (
          <ScanParticipantsPanel
            participants={recentParticipants}
            totalCount={totalParticipants}
            className="2xl:min-h-0"
          />
        )}
      </div>

      {/* ── Tablet / iPad landscape (lg–2xl, 1024–1535px): Info panel + Camera/Result, side by side ── */}
      <div className="hidden lg:grid lg:grid-cols-[0.85fr_1.15fr] lg:gap-6 lg:p-8 lg:min-h-screen 2xl:hidden">
        <ScanInfoPanel
          events={events}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEventId}
        />
        {scanResult ? (
          <ScanResultPanel
            result={scanResult}
            onBackToScan={() => setScanResult(null)}
            className="min-h-0"
          />
        ) : selectedEventId && !isCompactLayout && !isDesktop2xl ? (
          <ScanCameraPanel
            paused={isSubmittingScan || isResultModalOpen || isScanCooldown}
            isSubmitting={isSubmittingScan}
            onScan={handleScan}
            className="min-h-0"
          />
        ) : (
          <ScanCameraPlaceholder className="min-h-0" />
        )}
      </div>

      {/* ── Mobile / portrait (< lg): Camera + compact event info, no stats ── */}
      <div className="flex flex-col lg:hidden min-h-screen p-4 gap-4">
        {selectedEventId && isCompactLayout ? (
          <ScanCameraPanel
            paused={isSubmittingScan || isResultModalOpen || isScanCooldown}
            isSubmitting={isSubmittingScan}
            onScan={handleScan}
            className="flex-1 min-h-[60vh]"
          />
        ) : (
          <ScanCameraPlaceholder className="flex-1 min-h-[60vh]" />
        )}
        <ScanInfoPanel
          events={events}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEventId}
          compact
        />
      </div>

      <ScanResultModal
        open={isCompactLayout && isResultModalOpen}
        onOpenChange={setIsResultModalOpen}
        result={scanResult}
      />

      <NoActiveEventsModal
        open={isNoEventsModalOpen}
        message={
          loadEventsFailed
            ? t("noActiveEventsModal.loadEventsFailedMessage")
            : undefined
        }
        onCancel={() => setIsNoEventsModalOpen(false)}
        onConfirm={() => {
          setIsNoEventsModalOpen(false);
          router.push("/events");
        }}
      />
    </div>
  );
};

export default ScanTemplate;
