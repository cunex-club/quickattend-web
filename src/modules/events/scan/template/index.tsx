"use client";

import { useMemo, useState } from "react";
import ScanInfoPanel from "@modules/events/scan/components/ScanInfoPanel";
import ScanCameraPanel from "@modules/events/scan/components/ScanCameraPanel";
import ScanParticipantsPanel from "@modules/events/scan/components/ScanParticipantsPanel";
import {
  MOCK_EVENTS,
  MOCK_RECENT_PARTICIPANTS,
  TOTAL_PARTICIPANTS,
} from "@modules/events/scan/constants";

const ScanTemplate = () => {
  const [selectedEventId, setSelectedEventId] = useState(MOCK_EVENTS[0].id);

  const selectedEvent = useMemo(
    () => MOCK_EVENTS.find((e) => e.id === selectedEventId) ?? MOCK_EVENTS[0],
    [selectedEventId],
  );

  const handleScan = (text: string) => {
    // TODO: handle scan result (e.g. register student attendance)
    console.log("Scanned:", text);
  };

  return (
    <div className="min-h-screen w-full bg-neutral-200">
      {/* ── Desktop / laptop (2xl+, ≥1536px): Info panel + Participants stats, no camera ── */}
      <div className="hidden 2xl:grid 2xl:grid-cols-2 2xl:gap-6 2xl:p-8 2xl:min-h-screen">
        <ScanInfoPanel
          events={MOCK_EVENTS}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEventId}
        />
        <ScanParticipantsPanel
          participants={MOCK_RECENT_PARTICIPANTS}
          totalCount={TOTAL_PARTICIPANTS}
          className="2xl:min-h-0"
        />
      </div>

      {/* ── Tablet / iPad landscape (lg–2xl, 1024–1535px): Info panel + Camera, side by side ── */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:p-8 lg:min-h-screen 2xl:hidden">
        <ScanInfoPanel
          events={MOCK_EVENTS}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEventId}
        />
        <ScanCameraPanel onScan={handleScan} className="min-h-0" />
      </div>

      {/* ── Mobile / portrait (< lg): Camera + compact event info, no stats ── */}
      <div className="flex flex-col lg:hidden min-h-screen p-4 gap-4">
        <ScanCameraPanel onScan={handleScan} className="flex-1 min-h-[60vh]" />
        <ScanInfoPanel
          events={MOCK_EVENTS}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEventId}
          compact
        />
      </div>
    </div>
  );
};

export default ScanTemplate;
