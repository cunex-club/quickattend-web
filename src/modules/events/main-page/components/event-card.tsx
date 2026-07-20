"use client";

import { StyleableFC } from "@utils/misc";
import { cn } from "@assets/lib/utils";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";
import { useTranslations } from "next-intl";
import { useRouter } from "@i18n/navigation";
import type { KeyboardEvent, MouseEvent } from "react";

type EventCardProps = {
  eventId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer?: string;
  isEnd: boolean;
  hideRole?: boolean;
  evaluationForm?: string | null;
};

const EventCard: StyleableFC<EventCardProps> = ({
  eventId,
  title,
  description,
  date,
  time,
  location,
  organizer,
  isEnd,
  hideRole = false,
  evaluationForm,
  className,
  ...props
}) => {
  const t = useTranslations("Events.EventCard");
  const router = useRouter();
  const showEvaluationForm = isEnd && !!evaluationForm;

  const handleEvaluationFormClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    window.open(evaluationForm!, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    router.push(`/events/${eventId}`);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  const handleScanClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/scan?eventId=${eventId}`);
  };

  const handleStatsClick = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    router.push(`/dashboard/${eventId}`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={cn(
        "block p-4 sm:px-8 sm:py-6 rounded-xl shadow-lg bg-neutral-100 space-y-4 cursor-pointer hover:shadow-xl transition-shadow",
        className,
      )}
      {...props}
    >
      <div className="flex justify-between items-center gap-2">
        <div className="headline-large-emphasized">{title}</div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-start gap-y-4 sm:gap-x-6 md:gap-x-12.5">
        <div className="flex flex-col order-1 sm:order-2 sm:flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <IonIcon
              name="Calendar"
              size="16px"
              className="text-primary"
              noPadding
            />
            <span className="body-large-primary">{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <IonIcon
              name="Time"
              size="16px"
              className="text-primary"
              noPadding
            />
            <span className="body-large-primary">{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <IonIcon
              name="Location"
              size="16px"
              className="text-primary"
              noPadding
            />
            <span className="body-large-primary">{location}</span>
          </div>
          <div className="order-2 sm:order-1 sm:flex-2 mt-3">
            <div className="headline-small-emphasized mb-1">
              {t("eventDetails")}
            </div>
            <div className="body-large-primary line-clamp-3 sm:line-clamp-none mb-4 sm:mb-0">
              {description || "-"}
            </div>
          </div>
          {!hideRole && (
            <div className="hidden sm:flex items-center gap-2">
              <IonIcon
                name="Person"
                size="16px"
                className="text-primary"
                noPadding
              />
              <span className="body-large-primary">
                {organizer ? `${organizer}` : "-"}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Desktop View */}
      <div
        className={cn(
          "hidden lg:flex flex-row gap-4 sm:gap-6",
          isEnd && "justify-end",
        )}
      >
        {!isEnd && (
          <Button
            mode="filled"
            bordered="round"
            expanded
            onClick={handleScanClick}
          >
            <div className="flex justify-center items-center gap-2">
              <IonIcon
                name="ScanOutline"
                size="36px"
                className="text-white"
                noPadding
              />
              <div className="title-medium-emphasized text-white ">
                {t("scanParticipant")}
              </div>
            </div>
          </Button>
        )}
        <Button
          mode="outline"
          bordered="round"
          expanded
          onClick={handleStatsClick}
        >
          <div className="flex justify-center items-center gap-2">
            <IonIcon
              name="TrendingUpOutline"
              size="36px"
              className="text-primary"
              noPadding
            />
            <div className="title-medium-emphasized text-primary hidden sm:block">
              {t("activityStatistics")}
            </div>
          </div>
        </Button>
        {showEvaluationForm && (
          <Button
            mode="outline"
            bordered="round"
            expanded
            onClick={handleEvaluationFormClick}
          >
            <div className="flex justify-center items-center gap-2">
              <IonIcon
                name="DocumentText"
                size="36px"
                className="text-primary"
                noPadding
              />
              <div className="title-medium-emphasized text-primary hidden sm:block">
                {t("evaluationForm")}
              </div>
            </div>
          </Button>
        )}
      </div>

      {/* Mobile View */}
      <div
        className={cn(
          "flex lg:hidden flex-row gap-4 sm:gap-6",
          isEnd && "justify-end",
        )}
      >
        {!isEnd && (
          <Button
            mode="filled"
            bordered="round"
            expanded
            onClick={handleScanClick}
            className="!px-4 !py-2"
          >
            <div className="flex justify-center items-center gap-2">
              <IonIcon
                name="ScanOutline"
                size="20px"
                className="text-white"
                noPadding
              />
              <div className="title-large-emphasized text-white ">
                {t("scanParticipant")}
              </div>
            </div>
          </Button>
        )}
        <Button
          mode="outline"
          bordered="round"
          expanded={false}
          className="!px-4 !py-2"
          onClick={handleStatsClick}
        >
          <div className="flex justify-center items-center gap-2">
            <IonIcon
              name="TrendingUpOutline"
              size="20px"
              className="text-primary"
              noPadding
            />
          </div>
        </Button>
        {showEvaluationForm && (
          <Button
            mode="outline"
            bordered="round"
            expanded={false}
            className="!px-4 !py-2"
            onClick={handleEvaluationFormClick}
          >
            <div className="flex justify-center items-center gap-2">
              <IonIcon
                name="DocumentText"
                size="20px"
                className="text-primary"
                noPadding
              />
            </div>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
