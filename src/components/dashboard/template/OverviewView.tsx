"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import { useRouter } from "@i18n/navigation";
import Button from "@components/Button";
import { StatCard } from "@components/StatCard";
import IonIcon from "@shared/IonIcon";
import { toast } from "sonner";
import { Skeleton } from "@assets/components/ui/skeleton";
import { useTranslations, useLocale } from "next-intl";
import {
  useEventDashboardData,
  isDashboardForbiddenError,
} from "@graphql/hooks/useDashboardQueries";
import { fetchEventById } from "@services/events.actions";
import type { GetOneEventRes } from "@customTypes/events";
import { FacultyNameEnByCode } from "@utils/faculty";
import {
  formatEventDate,
  formatEventTimeRange,
  formatHourBucket,
} from "@utils/eventDateTime";
import { toTitleCase } from "@utils/function";

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

export function OverviewView({ eventId }: OverviewViewProps) {
  const t = useTranslations("Dashboard.overview");
  const locale = useLocale();
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<
    "student" | "staff" | null
  >(null);
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState<
    "student" | "staff" | null
  >(null);
  const [eventDetail, setEventDetail] = useState<GetOneEventRes | null>(null);
  const [eventDetailLoading, setEventDetailLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;
    const loadEvent = async () => {
      setEventDetailLoading(true);
      const result = await fetchEventById(eventId);
      if (cancelled) return;

      if (!result.ok) {
        console.error(
          `Failed to fetch event [${result.error.code}]: ${result.error.message}`,
        );
        setEventDetailLoading(false);
        return;
      }

      setEventDetail(result.data.data);
      setEventDetailLoading(false);
    };

    loadEvent();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const {
    dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useEventDashboardData(eventId);

  const loading = eventDetailLoading || dashboardLoading;

  const facultyStatsRaw = useMemo(() => {
    const stats = dashboardData?.organizationStats ?? [];

    const baseline = new Map<
      string,
      { student: number; staff: number; total: number }
    >();
    for (const { faculty_no } of eventDetail?.allowed_faculties ?? []) {
      const name = FacultyNameEnByCode[faculty_no];
      if (name)
        baseline.set(toTitleCase(name), { student: 0, staff: 0, total: 0 });
    }
    for (const item of stats) {
      const name = toTitleCase(item.organization);
      const prev = baseline.get(name) ?? { student: 0, staff: 0, total: 0 };
      baseline.set(name, {
        student: prev.student + item.studentCount,
        staff: prev.staff + item.staffCount,
        total: prev.total + item.totalCount,
      });
    }

    return [...baseline.entries()]
      .sort(
        ([nameA, a], [nameB, b]) =>
          b.total - a.total || nameA.localeCompare(nameB),
      )
      .map(([faculty, v]) => ({ faculty, ...v }));
  }, [dashboardData, eventDetail]);

  const facultyStats = useMemo(
    () =>
      facultyStatsRaw.map(({ faculty, student, staff, total }) => ({
        faculty,
        total:
          selectedFacultyFilter === "student"
            ? student
            : selectedFacultyFilter === "staff"
              ? staff
              : total,
      })),
    [facultyStatsRaw, selectedFacultyFilter],
  );

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
        studentCount: dashboardData?.summary.totalStudent ?? 0,
        staffCount: dashboardData?.summary.totalStaff ?? 0,
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

  if (dashboardError) {
    return (
      <div role="alert" className="flex flex-col items-center gap-4 py-16">
        <p className="body-large-primary text-error">
          {isDashboardForbiddenError(dashboardError)
            ? t("noAccess")
            : t("loadFailed")}
        </p>
        <Button
          mode="outline"
          bordered="round"
          expanded={false}
          onClick={
            isDashboardForbiddenError(dashboardError)
              ? () => router.push(`/events/${eventId}`)
              : refetchDashboard
          }
        >
          <p className="label-large-emphasized">
            {isDashboardForbiddenError(dashboardError)
              ? t("backToEvent")
              : t("retry")}
          </p>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isFullscreen && (
        <div className="flex flex-col space-y-8">
          <button
            type="button"
            onClick={() => router.push(`/events/${eventId}`)}
            aria-label={t("back")}
            className="w-full text-primary font-semibold cursor-pointer flex items-center gap-1"
          >
            <IonIcon name="ChevronBack" size="16px" />
            <p className="label-large-emphasized">{t("back")}</p>
          </button>

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
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Person"
                      size="20px"
                      className="text-primary"
                    />
                    <p>{eventDetail?.organizer}</p>
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
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex space-x-2.5 title-medium-primary text-neutral-white whitespace-nowrap">
                    <p>
                      {t("student")}: {dashboardData?.summary.totalStudent ?? 0}{" "}
                      {t("unit")}
                    </p>
                    <p>|</p>
                    <p>
                      {t("staff")}: {dashboardData?.summary.totalStaff ?? 0}{" "}
                      {t("unit")}
                    </p>
                  </div>
                  {dashboardData?.summary.totalEligible != null && (
                    <p className="body-medium-primary text-neutral-white/80 whitespace-nowrap">
                      {t("eligible")}: {dashboardData.summary.totalEligible}{" "}
                      {t("unit")}
                    </p>
                  )}
                </div>
              </StatCard>
            </div>
          </section>

          {/* chart section */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-6 md:space-y-4">
              <p className="headline-medium-emphasized">
                {t("facultyStatsTitle")}
              </p>
              {eventTotal === 0 ? (
                <p className="body-large-primary text-neutral-500 text-center py-10">
                  {t("noScanResultsYet")}
                </p>
              ) : (
                <div className="w-full relative bg-neutral-100 rounded-[28px] p-4 md:p-6">
                  <div className="h-[400px] md:h-[360px] lg:h-[350px] xl:max-h-[320px] overflow-auto pt-14">
                    <BarChartVerticalOverview data={facultyStats} />
                  </div>
                  <div className="absolute z-10 right-4 top-4">
                    <div className="space-x-4 bg-transparent">
                      <Button
                        mode={
                          selectedFacultyFilter === "student"
                            ? "filled"
                            : "outline"
                        }
                        bordered="square"
                        expanded={false}
                        onClick={() =>
                          setSelectedFacultyFilter(
                            selectedFacultyFilter === "student"
                              ? null
                              : "student",
                          )
                        }
                      >
                        <p className="label-large-emphasized">{t("student")}</p>
                      </Button>
                      <Button
                        mode={
                          selectedFacultyFilter === "staff"
                            ? "filled"
                            : "outline"
                        }
                        bordered="square"
                        expanded={false}
                        onClick={() =>
                          setSelectedFacultyFilter(
                            selectedFacultyFilter === "staff" ? null : "staff",
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
            <div className="flex flex-col space-y-3 md:space-y-4">
              <p className="headline-medium-emphasized">
                {t("timeStatsTitle")}
              </p>
              {eventTotal === 0 ? (
                <p className="body-large-primary text-neutral-500 text-center py-10">
                  {t("noScanResultsYet")}
                </p>
              ) : (
                <div className="w-full relative bg-neutral-100 rounded-[28px] p-4 md:p-6">
                  <div className="h-[400px] md:h-[360px] lg:h-[350px] xl:max-h-[320px] overflow-auto pt-14">
                    <BarChartHorizontalOverview
                      data={filteredTime}
                      maxValue={maxTimeValue}
                    />
                  </div>
                  <div className="absolute z-10 right-4 top-4">
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
                        <p className="label-large-emphasized">{t("student")}</p>
                      </Button>
                      <Button
                        mode={selectedFilter === "staff" ? "filled" : "outline"}
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
              student: t("student"),
              staff: t("staff"),
            }}
            onExit={handleToggleFullscreen}
          />
        )}
      </div>
    </div>
  );
}
