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
    <div className="min-h-screen w-full bg-white">
      {/* ── Desktop (lg+): Info panel + Participants stats, no camera ── */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 lg:p-8 lg:min-h-screen">
        <ScanInfoPanel
          events={MOCK_EVENTS}
          selectedEvent={selectedEvent}
          onEventChange={setSelectedEventId}
        />
        <ScanParticipantsPanel
          participants={MOCK_RECENT_PARTICIPANTS}
          totalCount={TOTAL_PARTICIPANTS}
          className="min-h-[720px] lg:min-h-0"
        />
      </div>

      {/* ── Mobile / tablet (< lg): Camera + compact event info, no stats ── */}
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
