"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Button from "@components/Button";
import { StatCard } from "@components/StatCard";
import IonIcon from "@shared/IonIcon";
import { toast } from "sonner";
import { Skeleton } from "@assets/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";
import { useRole } from "@context/RoleContext";
import { useEventDashboardData } from "@graphql/hooks/useDashboardQueries";
import { fetchEventById } from "@services/events";
import type { GetOneEventRes } from "@customTypes/events";
import { FacultyNameEnByCode } from "@modules/events/create/components/create-event-step2";

// Lazy load charts for better initial page load performance
const BarChartHorizontalOverview = dynamic(
  () =>
    import("@components/charts/BarChartHorizontalOverview").then((mod) => ({
      default: mod.BarChartHorizontalOverview,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
  },
);

const BarChartVerticalOverview = dynamic(
  () =>
    import("@components/charts/BarChartVerticalOverview").then((mod) => ({
      default: mod.BarChartVerticalOverview,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
  },
);

// Only load FullscreenContent when needed (after user clicks button)
const FullscreenContent = dynamic(
  () => import("@components/dashboard/FullScreenContent"),
  { ssr: false },
);

interface OverviewViewProps {
  eventId: string;
}

const localeToIntlTag = (locale: string) =>
  locale === "th" ? "th-TH" : "en-US";

const formatEventDate = (isoStr: string, locale: string) =>
  new Date(isoStr).toLocaleDateString(localeToIntlTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatEventTimeRange = (
  startIso: string,
  endIso: string,
  locale: string,
) => {
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  const tag = localeToIntlTag(locale);
  const start = new Date(startIso).toLocaleTimeString(tag, opts);
  const end = new Date(endIso).toLocaleTimeString(tag, opts);
  return locale === "th" ? `${start} - ${end} น.` : `${start} - ${end}`;
};

const formatHourBucket = (isoStr: string, locale: string) =>
  new Date(isoStr).toLocaleTimeString(localeToIntlTag(locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const MINOR_WORDS = new Set(["of"]);
const toTitleCase = (str: string) =>
  str
    .split(" ")
    .map((word) =>
      MINOR_WORDS.has(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join(" ");

export function OverviewView({ eventId }: OverviewViewProps) {
  const t = useTranslations("Dashboard.overview");
  const locale = useLocale();
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<
    "student" | "staff" | null
  >(null);
  const { role } = useRole();
  const canViewInsights = role === "manager" || role === "owner";

  const [eventDetail, setEventDetail] = useState<GetOneEventRes | null>(null);
  const [eventDetailLoading, setEventDetailLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;
    const loadEvent = async () => {
      setEventDetailLoading(true);
      try {
        const res = await fetchEventById(eventId);
        if (!cancelled) {
          setEventDetail(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        if (!cancelled) {
          setEventDetailLoading(false);
        }
      }
    };

    loadEvent();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const { dashboardData, loading: dashboardLoading } =
    useEventDashboardData(eventId);

  const loading = eventDetailLoading || dashboardLoading;

  const top3 = useMemo(() => {
    const stats = dashboardData?.organizationStats ?? [];

    const baseline = new Map<string, number>();
    for (const { faculty_no } of eventDetail?.allowed_faculties ?? []) {
      const name = FacultyNameEnByCode[faculty_no];
      if (name) baseline.set(toTitleCase(name), 0);
    }
    for (const item of stats) {
      const name = toTitleCase(item.organization);
      baseline.set(name, (baseline.get(name) ?? 0) + item.totalCount);
    }

    const sorted = [...baseline.entries()].sort(
      ([nameA, totalA], [nameB, totalB]) =>
        totalB - totalA || nameA.localeCompare(nameB),
    );

    const top = sorted.slice(0, 3).map(([faculty, total]) => ({
      faculty,
      total,
    }));

    return top;
  }, [dashboardData, eventDetail, t]);

  const timeStats = useMemo(
    () =>
      (dashboardData?.timeSeriesStats ?? []).map((item) => ({
        time: formatHourBucket(item.timeBucket, locale),
        student: item.studentCount,
        staff: item.staffCount,
        total: item.totalCount,
      })),
    [dashboardData, locale],
  );

  const filteredTime = useMemo(
    () =>
      timeStats.map((item) => ({
        time: item.time,
        total:
          selectedFilter === "student"
            ? item.student
            : selectedFilter === "staff"
              ? item.staff
              : item.total,
      })),
    [timeStats, selectedFilter],
  );

  const maxTimeValue = useMemo(
    () => Math.max(0, ...timeStats.map((item) => item.total)),
    [timeStats],
  );

  const eventTotal = dashboardData?.summary.totalAll ?? 0;

  const handleToggleFullscreen = useCallback(() => {
    if (!fullscreenContainerRef.current) return;
    if (!document.fullscreenElement) {
      fullscreenContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleViewInsights = () => {
    if (canViewInsights) {
      router.push(`/dashboard/${eventId}/insights`);
    }
  };

  const handleCopyEventLink = async () => {
    const eventLink = `${window.location.origin}/events/${eventId}`;
    try {
      await navigator.clipboard.writeText(eventLink);
      toast.success(
        <p className="title-medium-primary text-neutral-white">
          {t("linkCopied")}
        </p>,
        {
          style: {
            background: "var(--success)",
            color: "var(--neutral-white)",
          },
          duration: 1500,
        },
      );
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error(
        <p className="title-medium-primary text-neutral-white">
          {t("linkCopyFailed")}
        </p>,
        {
          style: {
            background: "var(--error)",
            color: "var(--neutral-white)",
          },
          duration: 1500,
        },
      );
    }
  };

  useEffect(() => {
    // Sync React state with browser fullscreen state
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const fullscreenData = eventDetail
    ? {
        title: eventDetail.name,
        date: formatEventDate(eventDetail.start_time, locale),
        time: formatEventTimeRange(
          eventDetail.start_time,
          eventDetail.end_time,
          locale,
        ),
        location: eventDetail.location,
        description: eventDetail.description ?? "",
        totalAttendees: eventTotal,
      }
    : null;

  if (loading) {
    return (
      <div className="flex flex-col space-y-16">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-8">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex flex-col space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-12 w-32" />
          </div>
          <Skeleton className="h-[250px] w-full" />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <Skeleton className="h-12 w-32" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isFullscreen && (
        <div className="flex flex-col space-y-8">
          {/* event information section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-6 order-2 lg:order-1">
              <div className="flex justify-between items-center">
                <p className="headline-large-emphasized">{eventDetail?.name}</p>
                <button
                  className="border border-primary rounded-full w-auto h-auto p-0.5 hover:bg-neutral-100 transition-colors duration-200 cursor-pointer"
                  onClick={handleCopyEventLink}
                >
                  <IonIcon name="Link" size="20px" className="text-primary" />
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="px-4 space-y-0 body-medium-primary">
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Calendar"
                      size="20px"
                      className="text-primary"
                    />
                    <p>
                      {eventDetail &&
                        formatEventDate(eventDetail.start_time, locale)}
                    </p>
                  </span>
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Time"
                      size="20px"
                      className="text-secondary"
                    />
                    <p>
                      {eventDetail &&
                        formatEventTimeRange(
                          eventDetail.start_time,
                          eventDetail.end_time,
                          locale,
                        )}
                    </p>
                  </span>
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Location"
                      size="20px"
                      className="text-primary"
                    />
                    <p>{eventDetail?.location}</p>
                  </span>
                </div>
                <div className="flex flex-col space-y-2 px-4 ">
                  <p className="headline-small-emphasized">
                    {t("eventDetails")}
                  </p>
                  <p className="body-large-primary">
                    {eventDetail?.description}
                  </p>
                </div>
              </div>

              <div>
                <Button
                  mode="filled"
                  bordered="square"
                  expanded={false}
                  onClick={handleToggleFullscreen}
                >
                  <p className="label-large-emphasized">
                    {t("viewFullscreen")}
                  </p>
                </Button>
              </div>
            </div>
            <div className="h-full w-full order-1 lg:order-2">
              <StatCard
                title={t("totalAttendees")}
                value={eventTotal}
                unit={t("unit")}
                variant="filled"
                className="p-8 min-h-[230px]"
              />
            </div>
          </section>

          {/* chart section */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-6 md:space-y-4">
              <p className="headline-medium-emphasized">{t("topTitle")}</p>
              {eventTotal === 0 ? (
                <p className="body-large-primary text-neutral-500 text-center py-10">
                  {t("noScanResultsYet")}
                </p>
              ) : (
                <div className="max-h-[280px] md:max-h-[320px]">
                  <BarChartVerticalOverview data={top3} />
                </div>
              )}
              <Button
                mode="filled"
                bordered="square"
                expanded={false}
                disabled={!canViewInsights}
                onClick={handleViewInsights}
                className={
                  !canViewInsights ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                <p className="label-large-emphasized">{t("viewAll")}</p>
              </Button>
            </div>
            <div className="flex flex-col space-y-3 md:space-y-4">
              <p className="headline-medium-emphasized">
                {t("timeStatsTitle")}
              </p>
              {eventTotal === 0 ? (
                <p className="body-large-primary text-neutral-500 text-center py-10">
                  {t("noScanResultsYet")}
                </p>
              ) : (
                <div className="w-full relative">
                  <div className="h-[400px] md:h-[360px] lg:h-[350px] xl:max-h-[320px] overflow-auto">
                    <BarChartHorizontalOverview
                      data={filteredTime}
                      maxValue={maxTimeValue}
                    />
                  </div>
                  <div className="absolute z-10 right-0 top-0">
                    <div className="space-x-4 bg-transparent">
                      <Button
                        mode={
                          selectedFilter === "student" ? "filled" : "outline"
                        }
                        bordered="square"
                        expanded={false}
                        onClick={() =>
                          setSelectedFilter(
                            selectedFilter === "student" ? null : "student",
                          )
                        }
                      >
                        <p className="label-large-emphasized">
                          {t("student")}
                        </p>
                      </Button>
                      <Button
                        mode={
                          selectedFilter === "staff" ? "filled" : "outline"
                        }
                        bordered="square"
                        expanded={false}
                        onClick={() =>
                          setSelectedFilter(
                            selectedFilter === "staff" ? null : "staff",
                          )
                        }
                      >
                        <p className="label-large-emphasized">{t("staff")}</p>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* full screen container */}
      {/* Kept mounted (not display:none) even when inactive — the
          Fullscreen API rejects requestFullscreen() on a display:none
          element, so it's hidden off-screen instead. */}
      <div
        ref={fullscreenContainerRef}
        className={
          isFullscreen
            ? "w-full h-full bg-white"
            : "absolute inset-0 -z-10 h-0 w-0 overflow-hidden opacity-0"
        }
      >
        {isFullscreen && fullscreenData && (
          <FullscreenContent
            data={fullscreenData}
            translations={{
              eventDetails: t("eventDetails"),
              totalAttendees: t("totalAttendees"),
              unit: t("unit"),
            }}
          />
        )}
      </div>
    </div>
  );
}
