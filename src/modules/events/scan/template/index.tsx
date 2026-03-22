"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useIsMobile } from "@assets/hooks/use-mobile";
import { useRouter } from "@i18n/navigation";
import {
  APIRequestError,
  fetchEventById,
  fetchManagedEvents,
  postParticipantScan,
} from "@services/events";

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

const ScanTemplate = () => {
  const t = useTranslations("Scan");
  const isMobile = useIsMobile();
  const router = useRouter();
  const [events, setEvents] = useState<ScanEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [recentParticipants, setRecentParticipants] = useState<Participant[]>(
    [],
  );
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isSubmittingScan, setIsSubmittingScan] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isNoEventsModalOpen, setIsNoEventsModalOpen] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResultModalData | null>(
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

  useEffect(() => {
    const loadEvents = async () => {
      setLoadingEvents(true);

      try {
        const res = await fetchManagedEvents();
        const mappedEvents: ScanEvent[] = res.data.map((event) => ({
          id: event.id,
          name: event.name,
          startTime: formatTime(event.start_time),
          endTime: formatTime(event.end_time),
        }));

        setEvents(mappedEvents);
        setIsNoEventsModalOpen(mappedEvents.length === 0);
        setSelectedEventId((prev) => prev || mappedEvents[0]?.id || "");
      } catch (error) {
        console.error(t("errors.failedToFetchEvents"), error);
        setEvents([]);
        setSelectedEventId("");
        setIsNoEventsModalOpen(false);
      } finally {
        setLoadingEvents(false);
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

      setLoadingDetail(true);
      try {
        const res = await fetchEventById(selectedEventId);
        setTotalParticipants(res.data.total_registered);
      } catch (error) {
        console.error(t("errors.failedToFetchEventDetail"), error);
      } finally {
        setLoadingDetail(false);
      }
    };

    loadSelectedEventDetail();
  }, [selectedEventId]);

  useEffect(() => {
    setScanResult(null);
    setIsResultModalOpen(false);
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
      isSubmittingScan ||
      (isMobile && isResultModalOpen)
    ) {
      return;
    }

    setIsSubmittingScan(true);

    try {
      const res = await postParticipantScan(text, selectedEventId);

      if (!res.data) {
        setScanResult(buildFailedScanResult(t("resultPanel.defaultError")));
        if (isMobile) {
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
        ? `${formatTime(res.data.check_in_time)} ${t("infoPanel.timeSuffix")}`
        : "-";

      const organization =
        res.data.organization_th || res.data.organization_en || "-";

      const modalData: ScanResultModalData = {
        participantName,
        refId: res.data.ref_id || "-",
        organization,
        checkInTime: scannedAt,
        status: res.data.status === "duplicate" ? "duplicate" : "success",
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

      const selectedEventRes = await fetchEventById(selectedEventId);
      setTotalParticipants(selectedEventRes.data.total_registered);

      setScanResult(modalData);
      if (isMobile) {
        setIsResultModalOpen(true);
      }
    } catch (error) {
      if (error instanceof APIRequestError) {
        console.error(`Scan failed [${error.code}]: ${error.message}`);
        setScanResult(buildFailedScanResult(getFailedScanMessage(error)));
        if (isMobile) {
          setIsResultModalOpen(true);
        }
      } else {
        console.error(t("errors.unexpectedScanError"));
        setScanResult(buildFailedScanResult(t("resultPanel.defaultError")));
        if (isMobile) {
          setIsResultModalOpen(true);
        }
      }
      console.error(t("errors.failedToSubmitScan"), error);
    } finally {
      setIsSubmittingScan(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:bg-neutral-200">
      {/* ── Desktop / laptop (2xl+, ≥1536px): Info panel + Participants stats, no camera ── */}
      <div className="hidden 2xl:grid 2xl:grid-cols-[0.8fr_1.2fr] 2xl:gap-6 2xl:p-8 2xl:min-h-screen">
        <ScanInfoPanel
          events={events}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEventId}
        />
        {scanResult ? (
          <ScanResultPanel
            result={scanResult}
            totalCount={totalParticipants}
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
            totalCount={totalParticipants}
            onBackToScan={() => setScanResult(null)}
            className="min-h-0"
          />
        ) : (
          <ScanCameraPanel
            key={selectedEventId}
            paused={isSubmittingScan || isResultModalOpen}
            onScan={handleScan}
            className="min-h-0"
          />
        )}
      </div>

      {/* ── Mobile / portrait (< lg): Camera + compact event info, no stats ── */}
      <div className="flex flex-col lg:hidden min-h-screen p-4 gap-4">
        <ScanCameraPanel
          key={selectedEventId}
          paused={isSubmittingScan || isResultModalOpen}
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

      {(loadingEvents || loadingDetail || isSubmittingScan) && (
        <div className="fixed bottom-4 right-4 rounded-full bg-white/95 px-4 py-2 shadow-elevation-2">
          <span className="label-medium-primary text-neutral-600">
            {isSubmittingScan ? t("page.scanning") : t("page.loading")}
          </span>
        </div>
      )}

      <ScanResultModal
        open={isMobile && isResultModalOpen}
        onOpenChange={(open) => {
          setIsResultModalOpen(open);
          if (!open) {
            setScanResult(null);
          }
        }}
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
