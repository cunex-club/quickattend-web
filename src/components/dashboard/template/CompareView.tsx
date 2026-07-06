"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { StatCard } from "@components/StatCard";
import Button from "@components/Button";
import { FilterableList } from "@components/dashboard/FilterableList";
import { useRole } from "@context/RoleContext";
import { toast } from "sonner";
import { Skeleton } from "@assets/components/ui/skeleton";
import { useLocale, useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import { useEventDashboardData } from "@graphql/hooks/useDashboardQueries";
import {
  calculateSummaryStats,
  preparePieChartData,
  type CompareStat,
} from "@utils/compareHelpers";
import { formatHourBucket } from "@utils/eventDateTime";
import { toTitleCase } from "@utils/function";
import { FacultyThByEnLower } from "@utils/faculty";

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

const PieChartWithLabel = dynamic(
  () =>
    import("@components/charts/PieChartWithLabel").then((mod) => ({
      default: mod.PieChartWithLabel,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
  },
);

const canViewPage = (role: string) => role === "manager" || role === "owner";

const MAX_SELECTION = 5;

type CompareMode = "faculty" | "time";

interface CompareViewProps {
  eventId: string;
}

export function CompareView({ eventId }: CompareViewProps) {
  const t = useTranslations("Dashboard.compare");
  const locale = useLocale();
  const { role } = useRole();
  const router = useRouter();

  const { dashboardData, loading } = useEventDashboardData(eventId);

  const [mode, setMode] = useState<CompareMode>("faculty");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [applied, setApplied] = useState<Record<string, boolean>>({});
  const [metricFilter, setMetricFilter] = useState<
    "student" | "staff" | null
  >(null);

  const facultyStats: CompareStat[] = useMemo(
    () =>
      (dashboardData?.organizationStats ?? []).map((item) => {
        const thName = FacultyThByEnLower[item.organization.toLowerCase()];
        return {
          id: item.organization,
          label:
            locale === "th" && thName ? thName : toTitleCase(item.organization),
          total: item.totalCount,
          studentCount: item.studentCount,
          staffCount: item.staffCount,
        };
      }),
    [dashboardData, locale],
  );

  const timeStats: CompareStat[] = useMemo(
    () =>
      (dashboardData?.timeSeriesStats ?? []).map((item) => ({
        id: item.timeBucket,
        label: formatHourBucket(item.timeBucket, locale),
        total: item.totalCount,
        studentCount: item.studentCount,
        staffCount: item.staffCount,
      })),
    [dashboardData, locale],
  );

  const activeStats = mode === "faculty" ? facultyStats : timeStats;
  const filterItems = useMemo(
    () => activeStats.map((s) => ({ id: s.id, label: s.label })),
    [activeStats],
  );

  const selectedIds = useMemo(
    () => Object.keys(applied).filter((key) => applied[key]),
    [applied],
  );

  const handleModeChange = (nextMode: CompareMode) => {
    setMode(nextMode);
    setSelected({});
    setApplied({});
    setMetricFilter(null);
  };

  const handleCheckedChange = (itemId: string, checked: boolean) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (checked) {
        const count = Object.values(next).filter(Boolean).length;
        if (count >= MAX_SELECTION) return prev;
        next[itemId] = true;
      } else {
        delete next[itemId];
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setSelected({});
    setApplied({});
  };

  const handleSubmitComparison = () => {
    const hasSelection = Object.keys(selected).length > 0;

    if (!hasSelection) {
      toast.error(
        <p className="title-medium-primary text-neutral-white">
          {mode === "faculty" ? t("noFacultyError") : t("noTimeError")}
        </p>,
        {
          style: { background: "var(--warning)", color: "var(--neutral-white)" },
          duration: 2500,
        },
      );
      return;
    }

    setApplied(selected);

    toast.success(
      <p className="title-medium-primary text-neutral-white">
        {t("comparingData")}
      </p>,
      {
        style: { background: "var(--success)", color: "var(--neutral-white)" },
        duration: 2500,
      },
    );
  };

  const summaryStats = useMemo(
    () => calculateSummaryStats(activeStats, selectedIds),
    [activeStats, selectedIds],
  );

  const pieChartData = useMemo(
    () => preparePieChartData(activeStats, selectedIds, t("other")),
    [activeStats, selectedIds, t],
  );

  const chartData = useMemo(
    () =>
      activeStats
        .filter((s) => selectedIds.includes(s.id))
        .map((s) => ({
          faculty: s.label,
          total:
            metricFilter === "student"
              ? s.studentCount
              : metricFilter === "staff"
                ? s.staffCount
                : s.total,
        })),
    [activeStats, selectedIds, metricFilter],
  );

  const maxChartValue = useMemo(
    () => Math.max(0, ...chartData.map((d) => d.total)),
    [chartData],
  );

  if (!canViewPage(role)) {
    router.push(`/dashboard/${eventId}`);
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col space-y-8 w-full">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    );
  }

  const hasAnyData = (dashboardData?.summary.totalAll ?? 0) > 0;

  return (
    <div className="flex flex-col items-center w-full space-y-8">
      <button
        type="button"
        onClick={() => router.push(`/events/${eventId}`)}
        aria-label={t("back")}
        className="w-full text-primary font-semibold cursor-pointer flex items-center gap-1"
      >
        <IonIcon name="ChevronBack" size="16px" />
        <p className="label-large-emphasized">{t("back")}</p>
      </button>

      <div className="w-full flex flex-col space-y-8">
        {!hasAnyData ? (
          <p className="body-large-primary text-neutral-500 text-center py-10">
            {t("noScanResultsYet")}
          </p>
        ) : (
          <>
            <section className="w-full h-auto flex flex-col space-y-8 bg-neutral-100 p-8 sm:p-12 md:p-16 rounded-2xl">
              <div className="flex justify-center gap-4">
                <Button
                  mode={mode === "faculty" ? "filled" : "outline"}
                  bordered="round"
                  expanded={false}
                  className={mode === "faculty" ? "" : "bg-transparent"}
                  onClick={() => handleModeChange("faculty")}
                >
                  <p className="label-large-emphasized">{t("faculty")}</p>
                </Button>
                <Button
                  mode={mode === "time" ? "filled" : "outline"}
                  bordered="round"
                  expanded={false}
                  className={mode === "time" ? "" : "bg-transparent"}
                  onClick={() => handleModeChange("time")}
                >
                  <p className="label-large-emphasized">{t("timePeriod")}</p>
                </Button>
              </div>

              <FilterableList
                title={mode === "faculty" ? t("faculty") : t("timePeriod")}
                items={filterItems}
                selectedItems={selected}
                onCheckedChange={handleCheckedChange}
                hasDescription
              />
              <div className="flex justify-end">
                <div className="flex flex-col-reverse sm:flex-row gap-3 w-full sm:w-auto">
                  <Button
                    mode="outline"
                    bordered="round"
                    expanded={false}
                    className="bg-transparent"
                    onClick={handleClearFilters}
                  >
                    <p className="label-large-emphasized">{t("clearData")}</p>
                  </Button>
                  <Button
                    mode="filled"
                    bordered="round"
                    expanded={false}
                    onClick={handleSubmitComparison}
                  >
                    <p className="label-large-emphasized">
                      {t("compareData")}
                    </p>
                  </Button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="w-full">
                <StatCard
                  title={t("totalAttendees")}
                  value={summaryStats.totalAttendees}
                  unit={t("unit")}
                  variant="outline"
                  switchNumberPosition={true}
                  mobileLeftAlign={true}
                >
                  <div className="flex flex-col justify-center items-center gap-4 mt-2">
                    <p className="title-medium-emphasized lg:title-large-emphasized text-center">
                      {t("student")}: {summaryStats.studentCount} {t("unit")}{" "}
                      | {t("staff")}: {summaryStats.staffCount} {t("unit")}
                    </p>
                  </div>
                </StatCard>
              </div>
              <div className="w-full h-full">
                <PieChartWithLabel data={pieChartData} />
              </div>
            </section>

            {selectedIds.length > 0 && (
              <section className="flex flex-col space-y-8">
                <p className="headline-large-emphasized">
                  {mode === "faculty"
                    ? t("facultyStatsTitle")
                    : t("timeStatsTitle")}
                </p>
                <div className="w-full relative bg-neutral-100 rounded-[28px] p-4 md:p-6">
                  <div className="h-auto pt-14">
                    {mode === "faculty" ? (
                      <BarChartVerticalOverview data={chartData} />
                    ) : (
                      <BarChartHorizontalOverview
                        data={chartData.map((d) => ({
                          time: d.faculty,
                          total: d.total,
                        }))}
                        maxValue={maxChartValue}
                      />
                    )}
                  </div>
                  <div className="absolute z-10 right-4 top-4">
                    <div className="space-x-4 bg-transparent">
                      <Button
                        mode={metricFilter === "student" ? "filled" : "outline"}
                        bordered="square"
                        expanded={false}
                        onClick={() =>
                          setMetricFilter(
                            metricFilter === "student" ? null : "student",
                          )
                        }
                      >
                        <p className="label-large-emphasized">
                          {t("student")}
                        </p>
                      </Button>
                      <Button
                        mode={metricFilter === "staff" ? "filled" : "outline"}
                        bordered="square"
                        expanded={false}
                        onClick={() =>
                          setMetricFilter(
                            metricFilter === "staff" ? null : "staff",
                          )
                        }
                      >
                        <p className="label-large-emphasized">{t("staff")}</p>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
