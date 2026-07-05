"use client";

import { StyleableFC } from "@utils/misc";
import { cn } from "@assets/lib/utils";
import Icon from "@shared/Icon";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@assets/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@assets/components/ui/dropdown-menu";
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
  role: string;
  isEnd: boolean;
};

const EventCard: StyleableFC<EventCardProps> = ({
  eventId,
  title,
  description,
  date,
  time,
  location,
  role,
  isEnd,
  className,
  ...props
}) => {
  const t = useTranslations("Events.EventCard");
  const router = useRouter();

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
    router.push("/scan");
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
      <div className="flex justify-between items-center">
        <div className="headline-large-emphasized">{title}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Sort"
              onClick={(event) => event.stopPropagation()}
              className="m-2.5 text-primary cursor-pointer rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <Icon
                name="more_vert"
                size={20}
                className="text-primary lg:hidden"
              />
              <Icon
                name="more_vert"
                size={32}
                className="text-primary hidden lg:block"
              />
            </button>
          </DropdownMenuTrigger>
          {/* will replace with custom drop down later */}
          <DropdownMenuContent align="end" className="py-2">
            <DropdownMenuItem>
              <div className="body-small-primary">{t("shareQr")}</div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="body-small-primary">{t("shareStatistics")}</div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="body-small-primary">{t("repeatActivity")}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-start gap-y-4 sm:gap-x-6 md:gap-x-12.5">
        <div className="flex flex-col order-1 sm:order-2 sm:flex-1 space-y-2">
          <div className="flex justify-start space-x-4 pl-0">
            <div className="flex items-center gap-1">
              <IonIcon
                name="Calendar"
                size="16px"
                className="text-primary"
                noPadding
              />
              <span className="body-large-primary">{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <IonIcon
                name="Time"
                size="16px"
                className="text-primary"
                noPadding
              />
              <span className="body-large-primary">{time}</span>
            </div>
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
            <div className="body-large-primary line-clamp-3 sm:line-clamp-none mb-4 sm:mb-0">
              {description}
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <IonIcon
              name="Person"
              size="16px"
              className="text-primary"
              noPadding
            />
            <span className="body-large-primary">{role || "-"}</span>
          </div>
        </div>
      </div>
      {/* Desktop View */}
      <div className="hidden lg:flex flex-row gap-4 sm:gap-6">
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
        <Button mode="outline" bordered="round" expanded>
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
      </div>

      {/* Mobile View */}
      <div className="flex lg:hidden flex-row gap-4 sm:gap-6">
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
        <Button
          mode="outline"
          bordered="round"
          expanded={false}
          className="!px-4 !py-2"
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
      </div>
    </div>
  );
};

export default EventCard;
