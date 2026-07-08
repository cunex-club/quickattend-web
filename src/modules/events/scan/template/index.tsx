"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ScanInfoPanel from "@modules/events/scan/components/ScanInfoPanel";
import ScanCameraPanel from "@modules/events/scan/components/ScanCameraPanel";
import ScanParticipantsPanel from "@modules/events/scan/components/ScanParticipantsPanel";
import ScanResultPanel from "@modules/events/scan/components/ScanResultPanel";
import NoActiveEventsModal from "@modules/events/scan/components/NoActiveEventsModal";
import ScanResultModal, {
  type ScanResultModalData,
} from "@modules/events/scan/components/ScanResultModal";
import type { Participant, ScanEvent } from "@modules/events/scan/constants";
import { useIsMobile, useIsTablet } from "@assets/hooks/use-mobile";
import { useRouter } from "@i18n/navigation";
import { APIRequestError } from "@services/events";
import {
  fetchEventById,
  fetchManagedEvents,
  postParticipantScan,
} from "@services/events.actions";

const formatTime = (isoTime: string) => {
  const date = new Date(isoTime);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const buildFailedScanResult = (message: string): ScanResultModalData => ({
  status: "failed",
  participantName: "",
  refId: "",
  organization: "",
  checkInTime: "",
  message,
});

const RECENT_PARTICIPANTS_STORAGE_PREFIX = "cunex_scan_recent_participants_";

const loadStoredRecentParticipants = (eventId: string): Participant[] => {
  if (typeof window === "undefined" || !eventId) return [];
  try {
    const raw = localStorage.getItem(
      `${RECENT_PARTICIPANTS_STORAGE_PREFIX}${eventId}`,
    );
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredRecentParticipants = (
  eventId: string,
  participants: Participant[],
) => {
  if (typeof window === "undefined" || !eventId) return;
  try {
    localStorage.setItem(
      `${RECENT_PARTICIPANTS_STORAGE_PREFIX}${eventId}`,
      JSON.stringify(participants),
    );
  } catch {
    // storage quota/serialization errors — non-critical, ignore
  }
};

const ScanTemplate = () => {
  const t = useTranslations("Scan");
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  // The "mobile" CSS layout (camera-only, no inline result panel) is shown
  // below the `lg` breakpoint (1024px), which spans both the isMobile
  // (<768px) and isTablet (768-1023px) hook ranges. Gating the result modal
  // on isMobile alone left a dead zone (768-1023px) where a scan result
  // never appeared anywhere — no inline panel (CSS says mobile layout) and
  // no modal (JS said not mobile).
  const isCompactLayout = isMobile || isTablet;
  const router = useRouter();
  const [events, setEvents] = useState<ScanEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [recentParticipants, setRecentParticipants] = useState<Participant[]>(
    [],
  );
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [isSubmittingScan, setIsSubmittingScan] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isNoEventsModalOpen, setIsNoEventsModalOpen] = useState(false);
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

  const getFailedScanMessage = (error: APIRequestError) => {
    if (error.code === "PARTICIPANT_NO_PERMISSION" || error.status === 403) {
      return t("resultPanel.permissionError");
    }

    return error.message || t("resultPanel.defaultError");
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
      try {
        const res = await fetchManagedEvents();
        const mappedEvents: ScanEvent[] = res.data.map((event) => ({
          id: event.id,
          name: event.name,
          startTime: formatTime(event.start_time),
          endTime: formatTime(event.end_time),
          role: event.role,
        }));

        setEvents(mappedEvents);
        setIsNoEventsModalOpen(mappedEvents.length === 0);
        setSelectedEventId((prev) => prev || mappedEvents[0]?.id || "");
      } catch (error) {
        console.error(t("errors.failedToFetchEvents"), error);
        setEvents([]);
        setSelectedEventId("");
        setIsNoEventsModalOpen(false);
      }
    };

    loadEvents();
  }, []);

  useEffect(() => {
    const loadSelectedEventDetail = async () => {
      if (!selectedEventId) {
        setTotalParticipants(0);
        return;
      }

      try {
        const res = await fetchEventById(selectedEventId);
        setTotalParticipants(res.data.total_registered);
      } catch (error) {
        console.error(t("errors.failedToFetchEventDetail"), error);
      }
    };

    loadSelectedEventDetail();
  }, [selectedEventId]);

  useEffect(() => {
    setScanResult(null);
    setIsResultModalOpen(false);
    setRecentParticipants(loadStoredRecentParticipants(selectedEventId));
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
      const res = await postParticipantScan(text, selectedEventId);

      if (!res.data) {
        setScanResult(buildFailedScanResult(t("resultPanel.defaultError")));
        if (isCompactLayout) {
          setIsResultModalOpen(true);
        }
        console.error(t("errors.missingParticipantData"));
        return;
      }

      const participantName =
        [res.data.title_th, res.data.firstname_th, res.data.surname_th]
          .filter(Boolean)
          .join(" ") ||
        [res.data.title_en, res.data.firstname_en, res.data.surname_en]
          .filter(Boolean)
          .join(" ") ||
        t("resultPanel.unknownParticipant");

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
      };

      if (res.data.status !== "duplicate") {
        setRecentParticipants((prev) => {
          const next = [
            {
              id: res.data.ref_id || "-",
              name: participantName,
              time: scannedAt,
            },
            ...prev,
          ].slice(0, 8);
          saveStoredRecentParticipants(selectedEventId, next);
          return next;
        });
      }

      const selectedEventRes = await fetchEventById(selectedEventId);
      setTotalParticipants(selectedEventRes.data.total_registered);

      setScanResult(modalData);
      if (isCompactLayout) {
        setIsResultModalOpen(true);
      }
    } catch (error) {
      if (error instanceof APIRequestError) {
        console.error(`Scan failed [${error.code}]: ${error.message}`);
        setScanResult(buildFailedScanResult(getFailedScanMessage(error)));
        if (isCompactLayout) {
          setIsResultModalOpen(true);
        }
      } else {
        console.error(t("errors.unexpectedScanError"));
        setScanResult(buildFailedScanResult(t("resultPanel.defaultError")));
        if (isCompactLayout) {
          setIsResultModalOpen(true);
        }
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
            <ScanCameraPanel
              key={selectedEventId}
              paused={isSubmittingScan || isResultModalOpen || isScanCooldown}
              onScan={handleScan}
              className="h-full w-full min-h-[420px] rounded-[40px] bg-transparent"
            />
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
        ) : (
          <ScanCameraPanel
            key={selectedEventId}
            paused={isSubmittingScan || isResultModalOpen || isScanCooldown}
            onScan={handleScan}
            className="min-h-0"
          />
        )}
      </div>

      {/* ── Mobile / portrait (< lg): Camera + compact event info, no stats ── */}
      <div className="flex flex-col lg:hidden min-h-screen p-4 gap-4">
        <ScanCameraPanel
          key={selectedEventId}
          paused={isSubmittingScan || isResultModalOpen || isScanCooldown}
          onScan={handleScan}
          className="flex-1 min-h-[60vh]"
        />
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
