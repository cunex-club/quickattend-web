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

type EventCardProps = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  role: string;
  isEnd: boolean;
};

const EventCard: StyleableFC<EventCardProps> = ({
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
  if (!isEnd) {
    return (
      <div
        className={cn(
          "p-4 sm:px-8 sm:py-6 rounded-xl shadow-lg bg-neutral-100 space-y-4",
          className,
        )}
        {...props}
      >
        <div className="flex justify-between items-center ">
          <div className="title-large-emphasized lg:display-small-emphasized">
            {title}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Sort"
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
            </DropdownMenuTrigger>{" "}
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
          <div className="order-2 sm:order-1 sm:flex-2 lg:px-4">
            <div className="headline-small-emphasized mb-2 hidden sm:block">
              {t("activityDetails")}
            </div>
            <div className="body-large-primary line-clamp-3 sm:line-clamp-none mb-4 sm:mb-0">
              {description}
            </div>
            <div className="flex items-center gap-2 sm:hidden">
              <IonIcon name="Person" size="16px" className="text-primary" />
              <span className="body-large-primary">{role}</span>
            </div>
          </div>

          <div className="order-1 sm:order-2 sm:flex-1 space-y-2 lg:px-4">
            <div className="flex items-center gap-2">
              <IonIcon name="Calendar" size="16px" className="text-primary" />
              <span className="body-large-primary">{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <IonIcon name="Time" size="16px" className="text-primary" />
              {/* replace with time later*/}
              <span className="body-large-primary">{time}</span>
            </div>
            <div className="flex items-center gap-2">
              <IonIcon name="Location" size="16px" className="text-primary" />
              <span className="body-large-primary">{location}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <IonIcon name="Person" size="16px" className="text-primary" />
              <span className="body-large-primary">{role}</span>
            </div>
          </div>
        </div>
        {/* Desktop View */}
        <div className="hidden lg:flex flex-row gap-4 sm:gap-6">
          <Button mode="filled" bordered="round" expanded>
            <div className="flex justify-center items-center gap-2">
              <IonIcon name="ScanOutline" size="36px" className="text-white" />
              <div className="title-large-primary text-white ">
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
              />
              <div className="title-large-primary text-primary hidden sm:block">
                {t("activityStatistics")}
              </div>
            </div>
          </Button>
        </div>

        {/* Mobile View */}
        <div className="flex lg:hidden flex-row gap-4 sm:gap-6">
          <Button mode="filled" bordered="round" expanded>
            <div className="flex justify-center items-center gap-2">
              <IonIcon name="ScanOutline" size="36px" className="text-white" />
              <div className="title-large-primary text-white ">
                {t("scanParticipant")}
              </div>
            </div>
          </Button>
          <Button mode="outline" bordered="round" expanded={false}>
            <div className="flex justify-center items-center gap-2">
              <IonIcon
                name="TrendingUpOutline"
                size="36px"
                className="text-primary"
              />
              <div className="title-large-primary text-primary hidden sm:block">
                {t("activityStatistics")}
              </div>
            </div>
          </Button>
        </div>
        <div className="hidden lg:">
          <Button mode="filled" bordered="round" expanded>
            <div className="flex justify-center items-center gap-2">
              <IonIcon name="ScanOutline" size="36px" className="text-white" />
              <div className="title-large-primary text-white ">
                {t("scanParticipant")}
              </div>
            </div>
          </Button>
          <Button mode="outline" bordered="round" expanded={false}>
            <div className="flex justify-center items-center gap-2">
              <IonIcon
                name="TrendingUpOutline"
                size="36px"
                className="text-primary"
              />
              <div className="title-large-primary text-primary hidden sm:block">
                {t("activityStatistics")}
              </div>
            </div>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <Accordion
      type="single"
      collapsible
      className={cn("", className)}
      {...props}
    >
      <AccordionItem
        value="event-details"
        className="p-4 sm:px-8 sm:py-6 rounded-xl shadow-lg bg-neutral-100 border-none"
      >
        <AccordionTrigger className="hover:no-underline items-center">
          <div className="flex justify-between items-center w-full">
            <div className="display-small-emphasized">{title}</div>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col sm:flex-row sm:items-start gap-y-4 sm:gap-x-6 md:gap-x-12.5 pt-4">
            <div className="sm:flex-2 px-4">
              <div className="headline-small-emphasized mb-2">
                {t("eventDetails")}
              </div>
              <div className="body-large-primary">{description}</div>
            </div>

            <div className="sm:flex-1 space-y-2 px-4">
              <div className="flex items-center gap-2">
                <Icon
                  name="calendar_month"
                  size={16}
                  className="text-primary"
                />
                <span className="body-large-primary">{date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="timer" size={16} className="text-primary" />
                <span className="body-large-primary">{time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  name="location_on"
                  size={16}
                  className="text-primary body-large"
                />
                <span className="body-large-primary">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="person" size={16} className="text-primary" fill />
                <span className="body-large-primary">{role}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
            <Button mode="filled" bordered="round" expanded>
              <div className="flex justify-center items-center gap-2">
                <IonIcon
                  name="TrendingUpOutline"
                  size="36px"
                  className="text-white"
                />
                <div className="title-large-primary">
                  {t("activityStatistics")}
                </div>
              </div>
            </Button>
            <Button mode="outline" bordered="round" expanded={false}>
              <div className="flex justify-center items-center">
                <IonIcon
                  name="DownloadOutline"
                  size="36px"
                  className="text-primary"
                />
              </div>
            </Button>
            <Button mode="outline" bordered="round" expanded={false}>
              <div className="flex justify-center items-center">
                <IonIcon
                  name="DuplicateOutline"
                  size="36px"
                  className="text-primary"
                />
              </div>
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default EventCard;
