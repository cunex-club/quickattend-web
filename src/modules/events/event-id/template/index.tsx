"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@assets/lib/utils";
import IonIcon from "@shared/IonIcon";
import Icon from "@shared/Icon";
import Button from "@shared/Button";
import { fetchEventById } from "@services/events.actions";
import EventDetailSkeleton from "@modules/events/event-id/components/event-detail-skeleton";
import type { GetOneEventRes } from "@customTypes/events";
import { useRouter } from "@i18n/navigation";
import { formatEventDate, formatEventTimeRange } from "@utils/eventDateTime";
import { isSafeExternalUrl, parseContentDispositionFilename } from "@utils/url";

interface EventIdPageTemplateProps {
  eventId: string;
}

const EventIdPageTemplate = ({ eventId }: EventIdPageTemplateProps) => {
  const t = useTranslations("EventDetail");
  const tError = useTranslations("ErrorPage");
  const locale = useLocale();
  const router = useRouter();

  const [eventData, setEventData] = useState<GetOneEventRes | null>(null);
  const [loading, setLoading] = useState(true);
  // A 404 means the event genuinely doesn't exist; anything else (expired
  // session, network error, timeout, 5xx) is a real failure that deserves a
  // retry, not "Event not found" — those are different situations for the
  // user and shouldn't look the same.
  const [loadFailedNotFound, setLoadFailedNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    setLoadFailedNotFound(false);

    const result = await fetchEventById(eventId);
    if (!result.ok) {
      console.error(
        `Failed to fetch event [${result.error.code}]: ${result.error.message}`,
      );
      if (result.error.status === 404) {
        setLoadFailedNotFound(true);
      } else {
        setLoadError(true);
      }
      setLoading(false);
      return;
    }

    setEventData(result.data.data);
    setLoading(false);
  }, [eventId]);

  useEffect(() => {
    loadEvent();
  }, [loadEvent]);

  if (loading) {
    return <EventDetailSkeleton />;
  }

  if (loadError) {
    return (
      <div className="w-full flex flex-col justify-center items-center py-20 gap-4">
        <div className="body-large-primary">{tError("description")}</div>
        <Button
          mode="outline"
          bordered="round"
          expanded={false}
          onClick={loadEvent}
        >
          {tError("retry")}
        </Button>
      </div>
    );
  }

  if (loadFailedNotFound || !eventData) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="body-large-primary">{t("notFound")}</div>
      </div>
    );
  }

  const canEdit = eventData.role === "OWNER" || eventData.role === "MANAGER";
  const isEnd = new Date(eventData.end_time) < new Date();
  const hasStarted = new Date(eventData.start_time) <= new Date();
  const showEvaluationForm =
    isEnd &&
    !!eventData.evaluation_form &&
    isSafeExternalUrl(eventData.evaluation_form);

  const roleLabel =
    eventData.role === "OWNER"
      ? t("owner")
      : eventData.role === "MANAGER"
        ? t("manager")
        : eventData.role === "STAFF"
          ? t("staff")
          : null;

  const formatAgendaTime = (startTime: string, endTime: string) =>
    formatEventTimeRange(startTime, endTime, locale);

  const exportParticipants = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch(`/api/events/${eventId}/export`);
      if (!response.ok) {
        // 401: the session cookie expired or was rejected — retrying the
        // same request can never succeed, the user needs to log in again.
        // Anything else (504 timeout, 5xx) is worth a plain retry prompt.
        setExportError(
          response.status === 401
            ? t("exportSessionExpired")
            : t("exportFailed"),
        );
        return;
      }

      const blob = await response.blob();
      const filename =
        parseContentDispositionFilename(
          response.headers.get("content-disposition"),
        ) ?? `participants-${eventId}.xlsx`;
      const file = new File([blob], filename, {
        type:
          blob.type ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const downloadBlob = () => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        // Firefox only honours programmatic clicks on anchors that are in the
        // document, and the object URL has to outlive the click.
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 0);
      };

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: filename });
          return;
        } catch (error) {
          // Dismissing the share sheet is not a failure; anything else means
          // sharing is unavailable, so fall through to a plain download.
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
        }
      }

      downloadBlob();
    } catch {
      setExportError(t("exportFailed"));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-6 md:px-10 lg:px-25 py-10 gap-6 lg:gap-7.5 pb-24">
      <button
        type="button"
        onClick={() => router.push("/events")}
        aria-label={t("back")}
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
                {formatEventDate(eventData.start_time, locale)}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Time" size="16px" className="text-secondary" />
              <div className="body-large-primary">
                {formatEventTimeRange(
                  eventData.start_time,
                  eventData.end_time,
                  locale,
                )}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Location" size="16px" className="text-secondary" />
              <div className="body-large-primary">{eventData.location}</div>
            </div>
            {roleLabel && (
              <div className="flex gap-2 items-center">
                <IonIcon name="Person" size="16px" className="text-secondary" />
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
              {eventData.agenda.length === 0 ? (
                <div>-</div>
              ) : (
                eventData.agenda.map((item) => (
                  <div
                    key={item.start_time}
                    className="flex w-full justify-between"
                  >
                    <div>{item.activity_name}</div>
                    <div>
                      {formatAgendaTime(item.start_time, item.end_time)}
                    </div>
                  </div>
                ))
              )}
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
          </div>
          <div className="flex-1 lg:flex-none flex flex-col justify-center items-start gap-2.5 bg-neutral-100 px-8 py-6 rounded-3xl shadow-xs text-center">
            <div className="headline-small-emphasized">{t("organizedBy")}</div>
            <div className="body-large-primary">{eventData.organizer}</div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-row w-full gap-4 lg:gap-6",
          isEnd && "justify-end",
        )}
      >
        {!isEnd && (
          <Button
            mode="filled"
            bordered="round"
            expanded={true}
            className="flex-1"
            disabled={!hasStarted}
            onClick={() => router.push(`/scan?eventId=${eventId}`)}
          >
            <div className="flex justify-center items-center gap-2 text-neutral-white">
              <IonIcon name="Scan" className="w-6 h-6 md:w-9 md:h-9" />
              <div className="label-large-primary md:title-large-primary whitespace-nowrap">
                {t("scanParticipant")}
              </div>
            </div>
          </Button>
        )}
        {canEdit && (
          <Button
            mode="outline"
            bordered="round"
            expanded={true}
            className="flex-1"
            disabled={isExporting || eventData.total_registered === 0}
            onClick={exportParticipants}
          >
            <div className="flex justify-center text-primary items-center gap-2">
              <IonIcon
                name="DownloadOutline"
                className="w-6 h-6 md:w-9 md:h-9"
              />
              <div className="label-large-primary md:title-large-primary whitespace-nowrap">
                {isExporting
                  ? t("exportingParticipants")
                  : t("exportParticipants")}
              </div>
            </div>
          </Button>
        )}
        <Button
          mode="outline"
          bordered="round"
          expanded={true}
          className="hidden md:block flex-1"
          disabled={!hasStarted}
          onClick={() => router.push(`/dashboard/${eventId}`)}
        >
          <div className="flex justify-center text-primary items-center gap-2">
            <IonIcon name="TrendingUp" className="w-6 h-6 md:w-9 md:h-9" />
            <div className="title-large-primary whitespace-nowrap">
              {t("activityStats")}
            </div>
          </div>
        </Button>
        {showEvaluationForm && (
          <Button
            mode="outline"
            bordered="round"
            expanded={true}
            className="hidden md:block flex-1"
            onClick={() =>
              window.open(
                eventData.evaluation_form!,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            <div className="flex justify-center text-primary items-center gap-2">
              <IonIcon name="DocumentText" className="w-6 h-6 md:w-9 md:h-9" />
              <div className="title-large-primary whitespace-nowrap">
                {t("evaluationForm")}
              </div>
            </div>
          </Button>
        )}
        <div className="flex gap-2 justify-center md:justify-start">
          <Button
            mode="outline"
            bordered="round"
            expanded={false}
            className="md:hidden"
            disabled={!hasStarted}
            onClick={() => router.push(`/dashboard/${eventId}`)}
          >
            <IonIcon
              name="TrendingUp"
              className="w-6 h-6 md:w-9 md:h-9 text-primary"
            />
          </Button>
          {showEvaluationForm && (
            <Button
              mode="outline"
              bordered="round"
              expanded={false}
              className="md:hidden"
              onClick={() =>
                window.open(
                  eventData.evaluation_form!,
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              <IonIcon
                name="DocumentText"
                className="w-6 h-6 md:w-9 md:h-9 text-primary"
              />
            </Button>
          )}
        </div>
      </div>
      {exportError && (
        <p role="alert" className="w-full text-sm text-red-600">
          {exportError}
        </p>
      )}
    </div>
  );
};

export default EventIdPageTemplate;
