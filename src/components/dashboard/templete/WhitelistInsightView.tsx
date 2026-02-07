"use client";

import Button from "@components/Button";
import React from "react";
import StatCard from "@components/StatCard";
import InfoCard from "@components/InfoCard";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@assets/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRole } from "@context/RoleContext";
import { cn } from "@assets/lib/utils";

// Dynamically import heavy chart components
const BarChartHorizontal = dynamic(
  () =>
    import("@components/charts/BarChartHorizontal").then(
      (mod) => mod.BarChartHorizontal,
    ),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
    ssr: false,
  },
);

const DonutChart = dynamic(
  () => import("@components/charts/DonutChart").then((mod) => mod.DonutChart),
  {
    loading: () => (
      <Skeleton className="h-full w-full rounded-lg bg-neutral-white" />
    ),
    ssr: false,
  },
);

const PieChartFilter = dynamic(
  () => import("@components/charts/PieChartFilter").then((mod) => mod.PieChartFilter),
  {
    loading: () => (
      <Skeleton className="h-full w-full rounded-lg bg-neutral-white" />
    ),
    ssr: false,
  },
);

const BarChartVerticalStacked = dynamic(
  () =>
    import("@components/charts/BarChartVerticalStacked").then(
      (mod) => mod.BarChartVerticalStacked,
    ),
  {
    loading: () => <Skeleton className="h-full w-full rounded-lg" />,
    ssr: false,
  },
);

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { FilterableList } from "../FilterableList";
import { useDashboardInsightData } from "@graphql/hooks/useDashboardQueries";
import SortMenu from "@components/sort-menu";
import IonIcon from "@shared/IonIcon";
import { FacultyDetailData, TimeDetailData } from "@customTypes/chart";
import {
  filterFacultyData,
  filterTimeData,
  calculateInsightSummaryStats,
  calculateRegistrationStats,
  hasActiveFilters as checkActiveFilters,
} from "@utils/insightHelpers";
import { useFilterLogic } from "../../../hooks/useFilterLogic";

export function WhitelistInsightView() {
  const router = useRouter();
  const { role } = useRole();
  const t = useTranslations("Dashboard.insights");
  const [userFilter, setUserFilter] = useState<"student" | "staff" | null>(
    null,
  );

  // Fetch all insight data via mock GraphQL
  const {
    deepInsightFacultyData,
    deepInsightTimeData,
    filterFacultyOptions: FilterFacultyOptions,
    filterTimeOptions: FilterTimeOptions,
    loading: dataLoading,
  } = useDashboardInsightData();

  const dataSources = useMemo(
    () => ({ deepInsightFacultyData, deepInsightTimeData }),
    [deepInsightFacultyData, deepInsightTimeData],
  );

  // items that user can select to filter
  const facultyFilterOptions = useMemo(
    () => FilterFacultyOptions.filter((item) => item.id !== "f-0"),
    [FilterFacultyOptions],
  );
  const timeFilterOptions = useMemo(
    () => FilterTimeOptions.filter((item) => item.id !== "t-0"),
    [FilterTimeOptions],
  );

  const canViewInsights = role === "manager" || role === "owner";

  useEffect(() => {
    if (!canViewInsights) {
      router.push("/dashboard");
    }
  }, [canViewInsights, router]);

  const {
    selectedFaculties,
    selectedTimes,
    appliedFaculties,
    appliedTimes,
    handleFacultyChange,
    handleTimeChange,
    handleClearFilters,
    handleApplyFilters,
  } = useFilterLogic({
    warnOnEmptyApply: true,
    t,
  });

  const handleSortChange = () => {};

  const hasActiveFilters = useMemo(
    () => checkActiveFilters(appliedFaculties, appliedTimes),
    [appliedFaculties, appliedTimes],
  );

  const filteredFacultyData = useMemo(
    () => filterFacultyData(appliedFaculties, appliedTimes, userFilter, dataSources),
    [appliedFaculties, appliedTimes, userFilter, dataSources],
  );

  const filteredTimeData = useMemo(
    () => filterTimeData(appliedFaculties, appliedTimes, userFilter, dataSources),
    [appliedFaculties, appliedTimes, userFilter, dataSources],
  );

  const summaryStats = useMemo(
    () => calculateInsightSummaryStats(filteredFacultyData, userFilter),
    [filteredFacultyData, userFilter],
  );

  const registrationStats = useMemo(
    () => calculateRegistrationStats(filteredFacultyData),
    [filteredFacultyData],
  );

  const horizontalChartData = useMemo(() => {
    return filteredTimeData.map((item) => ({
      time: item.time,
      total: item.total,
    }));
  }, [filteredTimeData]);

  const verticalStackData = filteredFacultyData;

  const facultyDetailData = useMemo(() => {
    const detailMap: Record<string, FacultyDetailData[]> = {};
    const selectedFacultyIds = Object.keys(appliedFaculties).filter(
      (key) => appliedFaculties[key] && key !== "f-0",
    );

    deepInsightTimeData.forEach((timeItem) => {
      let faculties = timeItem.data;

      if (selectedFacultyIds.length > 0) {
        faculties = faculties.filter((f) =>
          selectedFacultyIds.includes(f.facultyId),
        );
      }

      const facultiesForTime = faculties.map((f) => {
        let total = f.students + f.staff;
        let registered = f.registered;
        let unregistered = f.unregistered;

        if (userFilter === "student") {
          total = f.students;
          const studentRatio = f.students / (f.students + f.staff || 1);
          registered = Math.round(f.registered * studentRatio);
          unregistered = Math.round(f.unregistered * studentRatio);
        } else if (userFilter === "staff") {
          total = f.staff;
          const staffRatio = f.staff / (f.students + f.staff || 1);
          registered = Math.round(f.registered * staffRatio);
          unregistered = Math.round(f.unregistered * staffRatio);
        }

        return {
          faculty: f.faculty,
          registered,
          unregistered,
          total,
        };
      });

      detailMap[timeItem.time] = facultiesForTime;
    });

    return detailMap;
  }, [appliedFaculties, userFilter, deepInsightTimeData]);

  // Generate time detail data for each faculty (for BarChartVerticalStacked detail section)
  // This shows time breakdown for each faculty, filtered by time filter
  const timeDetailData = useMemo(() => {
    const detailMap: Record<string, TimeDetailData[]> = {};
    const selectedTimeIds = Object.keys(appliedTimes).filter(
      (key) => appliedTimes[key] && key !== "t-0",
    );

    // For each faculty in deepInsightFacultyData, get time breakdown
    deepInsightFacultyData.forEach((facultyItem) => {
      let times = facultyItem.data;

      // Filter by selected times if any
      if (selectedTimeIds.length > 0) {
        times = times.filter((t) => selectedTimeIds.includes(t.timeId));
      }

      // Map to TimeDetailData format with user filter applied
      const timesForFaculty = times.map((t) => {
        let total = t.students + t.staff;
        if (userFilter === "student") total = t.students;
        if (userFilter === "staff") total = t.staff;

        return {
          time: t.time,
          total,
        };
      });

      detailMap[facultyItem.faculty] = timesForFaculty;
    });

    return detailMap;
  }, [appliedTimes, userFilter, deepInsightFacultyData]);

  const donutChartData = useMemo(
    () => [
      {
        category: "ลงทะเบียนแล้ว",
        total: registrationStats.registered,
        students: userFilter === "staff" ? 0 : registrationStats.registered,
        staff: userFilter === "student" ? 0 : registrationStats.registered,
      },
      {
        category: "ยังไม่ลงทะเบียน",
        total: registrationStats.unregistered,
        students: userFilter === "staff" ? 0 : registrationStats.unregistered,
        staff: userFilter === "student" ? 0 : registrationStats.unregistered,
      },
    ],
    [registrationStats, userFilter],
  );

  // Calculate totals for InfoCards
  // Eligible to register = registered + unregistered (total eligible people)
  // Not registered = unregistered only
  const totalEligible =
    registrationStats.registered + registrationStats.unregistered;
  const totalUnregistered = registrationStats.unregistered;

  if (!canViewInsights) return null;
  if (dataLoading) return <Skeleton className="h-[600px] w-full rounded-lg" />;

  return (
    <div className="w-full rounded-xl bg-neutral-white space-y-16">
      <section className="flex justify-between">
        <div className="space-x-4 flex items-center">
          <Button
            mode={userFilter === null ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() => setUserFilter(null)}
          >
            <p className="label-large-emphasized">{t("all")}</p>
          </Button>
          <Button
            mode={userFilter === "student" ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() => setUserFilter("student")}
          >
            <p className="label-large-emphasized">{t("student")}</p>
          </Button>
          <Button
            mode={userFilter === "staff" ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() => setUserFilter("staff")}
          >
            <p className="label-large-emphasized">{t("staff")}</p>
          </Button>
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center relative">
                {/* filter icon */}
                <IonIcon
                  name="FunnelOutline"
                  size="32px"
                  className="text-primary cursor-pointer"
                />
                {/* filter status */}
                <div
                  className={cn(
                    "absolute top-2 right-2 w-2 h-2 bg-error rounded-full transition-all duration-300 ease-in-out",
                    hasActiveFilters
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0",
                  )}
                ></div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-screen max-w-md p-8" align="end">
              <div>
                <div className="flex flex-col space-y-8">
                  <p className="headline-large-emphasized mx-auto">
                    {t("filterDataTitle")}
                  </p>
                  <FilterableList
                    title={t("faculty")}
                    items={facultyFilterOptions}
                    selectedItems={selectedFaculties}
                    onCheckedChange={handleFacultyChange}
                    filterVariant="secondary"
                  />

                  <FilterableList
                    title={t("timePeriod")}
                    items={timeFilterOptions}
                    selectedItems={selectedTimes}
                    onCheckedChange={handleTimeChange}
                    filterVariant="secondary"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      mode="outline"
                      bordered="round"
                      expanded={true}
                      className="bg-transparent"
                      onClick={handleClearFilters}
                    >
                      <p className="title-large-emphasized">
                        {t("clearFilter")}
                      </p>
                    </Button>

                    <PopoverClose asChild>
                      <Button
                        mode="filled"
                        bordered="round"
                        expanded={true}
                        onClick={handleApplyFilters}
                      >
                        <p className="title-large-emphasized">
                          {t("applyFilter")}
                        </p>
                      </Button>
                    </PopoverClose>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      <div className="flex flex-col space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full">
            <StatCard
              title={t("totalAttendees")}
              value={summaryStats.totalAttendees}
              unit={t("unit")}
              variant="outline"
              switchNumberPosition={true}
              mobileLeftAlign={true}
              className="lg:py-16"
            >
              <div className="md:mt-2 lg:mt-4 flex justify-start lg:justify-center px-0 lg:px-8">
                <span className="title-medium-emphasized lg:headline-small-emphasized pr-4 lg:pr-16 text-center">
                  {t("students")}: {summaryStats.studentCount} {t("unit")}
                </span>
                <div className="inline-block w-0.5 self-stretch bg-neutral-400"></div>
                <span className="title-medium-emphasized lg:headline-small-emphasized pl-4 lg:pl-16 text-center">
                  {t("staffs")}: {summaryStats.staffCount} {t("unit")}
                </span>
              </div>
            </StatCard>
          </div>
          <div className="w-full">
            {hasActiveFilters ? (
              <PieChartFilter data={donutChartData} />
            ) : (
              <DonutChart data={donutChartData} />
            )}
          </div>
        </section>
        <section
          className={cn(
            "grid grid-cols-2 gap-4 md:gap-8 transition-all duration-500 ease-in-out overflow-hidden",
            hasActiveFilters
              ? "opacity-0 max-h-0 pointer-events-none"
              : "opacity-100 max-h-[500px]",
          )}
        >
          <InfoCard
            value={totalEligible}
            unit={t("unit")}
            titleFull={t("totalEligible")}
            titleShort={t("totalEligibleShort")}
          />
          <InfoCard
            value={totalUnregistered}
            unit={t("unit")}
            titleFull={t("totalUnregistered")}
            titleShort={t("totalUnregisteredShort")}
          />
        </section>
      </div>

      {/* Chart Section */}
      <section className="flex flex-col space-y-8">
        <div className="flex justify-between">
          <p className="headline-small-emphasized sm:headline-medium-emphasized md:headline-large-emphasized">
            {t("facultyStatsTitle")}
          </p>
          <SortMenu
            options={[
              {
                label: t("sortNewest"),
                value: "newest",
              },
              {
                label: t("sortOldest"),
                value: "oldest",
              },
            ]}
            onSelect={handleSortChange}
          />
        </div>
        <div className="h-full">
          <BarChartVerticalStacked
            data={verticalStackData}
            timeDetailData={timeDetailData}
          />
        </div>
      </section>

      <section className="flex flex-col space-y-8 mb-8 sm:mb-10">
        <p className="headline-small-emphasized sm:headline-medium-emphasized md:headline-large-emphasized">
          {t("timeStatsTitle")}
        </p>
        <div className="w-full h-auto">
          <BarChartHorizontal
            data={horizontalChartData}
            facultyDetailData={facultyDetailData}
          />
        </div>
      </section>

      <Link href="/dashboard-compare">
        <Button mode="filled" bordered="square" expanded={false}>
          <p className="title-medium-emphasized">{t("compareButton")}</p>
        </Button>
      </Link>
    </div>
  );
}
