"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import Icon from "@shared/Icon";
import Button from "@shared/Button";
import { fetchEventById } from "@services/events";
import EventDetailSkeleton from "@modules/events/event-id/components/event-detail-skeleton";
import type { GetOneEventRes } from "@customTypes/events";
import { useRouter } from "@i18n/navigation";

interface EventIdPageTemplateProps {
  eventId: string;
}

const EventIdPageTemplate = ({ eventId }: EventIdPageTemplateProps) => {
  const t = useTranslations("EventDetail");
  const router = useRouter();

  const [eventData, setEventData] = useState<GetOneEventRes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true);
      try {
        const res = await fetchEventById(eventId);
        console.log("Event by ID:", res.data);
        setEventData(res.data);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (!eventData) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="body-large-primary">Event not found.</div>
      </div>
    );
  }

  const canEdit = eventData.role === "OWNER" || eventData.role === "MANAGER";

  const roleLabel =
    eventData.role === "OWNER"
      ? t("owner")
      : eventData.role === "MANAGER"
        ? t("manager")
        : eventData.role === "STAFF"
          ? t("staff")
          : null;

  // Format date from ISO string to "3 สิงหาคม 2568"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  // Format time from ISO string to "HH:MM น."
  const formatTime = (isoStr: string) => {
    const date = new Date(isoStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Format agenda time range
  const formatAgendaTime = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)} น.`;
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-6 md:px-10 lg:px-25 py-10 lg:pt-35 gap-6 lg:gap-7.5 pb-24">
      <button
        type="button"
        onClick={() => router.back()}
        aria-label="Go back"
        className="w-full text-primary font-semibold cursor-pointer flex items-center gap-1"
      >
        <IonIcon name="ChevronBack" size="16px" />
        <p className="label-large-emphasized">{t("back")}</p>
      </button>
      <div className="w-full flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="lg:flex-[4] bg-neutral-100 p-6 lg:p-10 space-y-5 rounded-3xl shadow-xs">
          <div className="flex w-full items-center justify-between">
            <div className="display-medium-emphasized ">{eventData.name}</div>
            {canEdit && (
              <button
                type="button"
                aria-label={t("edit")}
                onClick={() => router.push(`/events/${eventId}/edit`)}
                className="cursor-pointer"
              >
                <Icon name="edit" size={32} className="text-primary" />
              </button>
            )}
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Calendar" size="16px" className="text-secondary" />
              <div className="body-large-primary">
                {formatDate(eventData.start_time)}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Time" size="16px" className="text-secondary" />
              <div className="body-large-primary">
                {formatTime(eventData.start_time)} -{" "}
                {formatTime(eventData.end_time)} น.
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Location" size="16px" className="text-secondary" />
              <div className="body-large-primary">{eventData.location}</div>
            </div>
            {roleLabel && (
              <div className="flex gap-2 items-center">
                <IonIcon
                  name="Person"
                  size="16px"
                  className="text-secondary"
                />
                <div className="body-large-primary">{roleLabel}</div>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="headline-small-emphasized">{t("eventDetails")}</div>
            <div className="body-large-primary">
              {eventData.description || "-"}
            </div>
          </div>
          <div>
            <div className="headline-small-emphasized">{t("agenda")}</div>
            <div className="body-large-primary">
              {eventData.agenda.map((item) => (
                <div
                  key={item.start_time}
                  className="flex w-full justify-between"
                >
                  <div>{item.activity_name}</div>
                  <div>{formatAgendaTime(item.start_time, item.end_time)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:flex-1 flex flex-col sm:flex-row lg:flex-col justify-between gap-6 lg:gap-10">
          <div className="flex-1 flex flex-col justify-center items-start lg:items-center bg-primary h-full px-8 py-6 lg:p-10 text-white rounded-3xl shadow-xs">
            <div className="headline-small-emphasized lg:headline-small-emphasized whitespace-nowrap">
              {t("registeredCount")}
            </div>
            <div className="flex items-baseline gap-2">
              <div
                className="text-center display-small-emphasized lg:text-[72px] lg:leading-[140%] lg:tracking-[-0.792px] lg:font-bold"
                style={{
                  fontFamily:
                    "CHULALONGKORNBold, var(--font-chula-bold), sans-serif",
                }}
              >
                {eventData.total_registered}
              </div>
              <div className="title-small-primary lg:title-large-primary">
                {t("people")}
              </div>
            </div>
            <div className="flex space-x-2.5 title-medium-primary lg:title-small-primary whitespace-nowrap">
              <div>
                {t("student")} : {eventData.total_registered} {t("people")}
              </div>
              <div>|</div>
              <div>
                {t("staff")} : {eventData.users.length} {t("people")}
              </div>
            </div>
          </div>
          <div className="flex-1 lg:flex-none flex flex-col justify-center items-start gap-2.5 bg-neutral-100 px-8 py-6 rounded-3xl shadow-xs text-center">
            <div className="headline-small-emphasized">{t("organizedBy")}</div>
            <div className="body-large-primary">{eventData.organizer}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full gap-4 lg:gap-6">
        <Button
          mode="filled"
          bordered="round"
          expanded={true}
          className="flex-1"
          onClick={() => router.push("/scan")}
        >
          <div className="flex justify-center items-center gap-2 text-neutral-white">
            <IonIcon name="Scan" className="w-6 h-6 md:w-9 md:h-9" />
            <div className="label-large-primary md:title-large-primary whitespace-nowrap">
              {t("scanParticipant")}
            </div>
          </div>
        </Button>
        <Button
          mode="outline"
          bordered="round"
          expanded={true}
          className="hidden md:block flex-1"
          onClick={() => router.push("/dashboard/insights")}
        >
          <div className="flex justify-center text-primary items-center gap-2">
            <IonIcon name="TrendingUp" className="w-6 h-6 md:w-9 md:h-9" />
            <div className="title-large-primary whitespace-nowrap">
              {t("activityStats")}
            </div>
          </div>
        </Button>
        <div className="flex gap-2 justify-center md:justify-start">
          <Button
            mode="outline"
            bordered="round"
            expanded={false}
            className="md:hidden"
            onClick={() => router.push("/dashboard/insights")}
          >
            <IonIcon
              name="TrendingUp"
              className="w-6 h-6 md:w-9 md:h-9 text-primary"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventIdPageTemplate;
