"use client";

import { useTranslations } from "next-intl";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import type { Participant } from "@modules/events/scan/constants";

type ScanParticipantsPanelProps = {
  participants: Participant[];
  totalCount: number;
};

const ScanParticipantsPanel: StyleableFC<ScanParticipantsPanelProps> = ({
  participants,
  totalCount,
  className,
}) => {
  const t = useTranslations("Scan");

  return (
    <section
      className={cn(
        "flex flex-col justify-center rounded-[32px] bg-white px-8 py-10 md:px-14 md:py-14",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <h2 className="headline-medium-emphasized whitespace-nowrap leading-none text-neutral-600">
          {t("participantsPanel.totalAttendees")}
        </h2>
        <p className="shrink-0 whitespace-nowrap text-center">
          <span
            style={{
              color: "var(--Text-Filled, #E36487)",
              fontFamily: "CHULALONGKORNBold, sans-serif",
              fontSize: "96px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
              letterSpacing: "-1.056px",
            }}
          >
            {totalCount}
          </span>
          <span className="display-small-emphasized text-[#E36487]">
            {t("participantsPanel.people")}
          </span>
        </p>
      </div>

      <div className="mt-8 grid w-full grid-cols-[1fr_auto] gap-x-6 gap-y-1">
        <p className="title-large-primary text-neutral-600">
          {t("participantsPanel.recentRegistrants")}
        </p>
        <p className="title-large-primary text-right text-neutral-600">
          {t("participantsPanel.time")}
        </p>

        {participants.map((participant) => (
          <div key={participant.id} className="contents">
            <p className="body-large-primary text-neutral-600">
              {participant.id} {participant.name}
            </p>
            <p className="body-large-primary text-right text-neutral-600">
              {participant.time}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ScanParticipantsPanel;
