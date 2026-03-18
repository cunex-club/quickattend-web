"use client";

import { useEffect, useMemo, useState } from "react";
import ScanInfoPanel from "@modules/events/scan/components/ScanInfoPanel";
import ScanCameraPanel from "@modules/events/scan/components/ScanCameraPanel";
import ScanParticipantsPanel from "@modules/events/scan/components/ScanParticipantsPanel";
import ScanResultPanel from "../components/ScanResultPanel";
import NoActiveEventsModal from "../components/NoActiveEventsModal";
import ScanResultModal, {
  type ScanResultModalData,
} from "../components/ScanResultModal";
import type { Participant, ScanEvent } from "@modules/events/scan/constants";
import { useIsMobile } from "@assets/hooks/use-mobile";
import { useRouter } from "@i18n/navigation";
import {
  APIRequestError,
  fetchEventById,
  fetchManagedEvents,
  postParticipantScan,
} from "@services/events";

const EMPTY_SELECTED_EVENT: ScanEvent = {
  id: "",
  name: "No events available",
  startTime: "--:--",
  endTime: "--:--",
};

const formatTime = (isoTime: string) => {
  const date = new Date(isoTime);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const ScanTemplate = () => {
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
        console.error("Failed to fetch events for scan page:", error);
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
        console.error("Failed to fetch selected event detail:", error);
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
      EMPTY_SELECTED_EVENT,
    [events, selectedEventId],
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
        console.error("Scan failed: missing participant data");
        return;
      }

      const participantName =
        [res.data.title_th, res.data.firstname_th, res.data.surname_th]
          .filter(Boolean)
          .join(" ") ||
        [res.data.title_en, res.data.firstname_en, res.data.surname_en]
          .filter(Boolean)
          .join(" ") ||
        "Unknown participant";

      const scannedAt = res.data.check_in_time
        ? `${formatTime(res.data.check_in_time)} น.`
        : "-";

      const organization =
        res.data.organization_th || res.data.organization_en || "-";

      const modalData: ScanResultModalData = {
        participantName,
        refId: res.data.ref_id || "-",
        organization,
        checkInTime: scannedAt,
        status: res.data.status,
      };

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

      const selectedEventRes = await fetchEventById(selectedEventId);
      setTotalParticipants(selectedEventRes.data.total_registered);

      setScanResult(modalData);
      if (isMobile) {
        setIsResultModalOpen(true);
      }
    } catch (error) {
      if (error instanceof APIRequestError) {
        console.error(`Scan failed [${error.code}]: ${error.message}`);
      } else {
        console.error("Scan failed: unexpected error");
      }
      console.error("Failed to submit participant scan:", error);
    } finally {
      setIsSubmittingScan(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-neutral-200">
      {/* ── Desktop / laptop (2xl+, ≥1536px): Info panel + Participants stats, no camera ── */}
      <div className="hidden 2xl:grid 2xl:grid-cols-2 2xl:gap-6 2xl:p-8 2xl:min-h-screen">
        <ScanInfoPanel
          events={events}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEventId}
        />
        <ScanParticipantsPanel
          participants={recentParticipants}
          totalCount={totalParticipants}
          className="2xl:min-h-0"
        />
      </div>

      {/* ── Tablet / iPad landscape (lg–2xl, 1024–1535px): Info panel + Camera/Result, side by side ── */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:p-8 lg:min-h-screen 2xl:hidden">
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
          <ScanCameraPanel onScan={handleScan} className="min-h-0" />
        )}
      </div>

      {/* ── Mobile / portrait (< lg): Camera + compact event info, no stats ── */}
      <div className="flex flex-col lg:hidden min-h-screen p-4 gap-4">
        <ScanCameraPanel onScan={handleScan} className="flex-1 min-h-[60vh]" />
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
            {isSubmittingScan ? "Scanning..." : "Loading..."}
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
