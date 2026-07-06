"use client";

import Button from "@components/Button";
import React from "react";
import StatCard from "@components/StatCard";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@assets/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useRole } from "@context/RoleContext";

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

const BarChartVertical = dynamic(
  () =>
    import("@components/charts/BarChartVertical").then(
      (mod) => mod.BarChartVertical,
    ),
  {
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
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
import { cn } from "@assets/lib/utils";
import { PieChartFilter } from "@components/charts/PieChartFilter";
import {
  filterFacultyData,
  filterTimeData,
  calculateInsightSummaryStats,
  calculateRegistrationStats,
  hasActiveFilters as checkActiveFilters,
} from "@utils/insightHelpers";
import { useFilterLogic } from "@hooks/useFilterLogic";

export function DeepInsightView() {
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
  } = useFilterLogic();

  const handleSortChange = () => {};

  const hasActiveFilters = useMemo(
    () => checkActiveFilters(appliedFaculties, appliedTimes),
    [appliedFaculties, appliedTimes],
  );

  const filteredFacultyData = useMemo(
    () =>
      filterFacultyData(
        appliedFaculties,
        appliedTimes,
        userFilter,
        dataSources,
      ),
    [appliedFaculties, appliedTimes, userFilter, dataSources],
  );

  const filteredTimeData = useMemo(
    () =>
      filterTimeData(appliedFaculties, appliedTimes, userFilter, dataSources),
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

  // Prepare faculty detail data for each time period (for BarChartHorizontal detail section)
  const facultyDetailData = useMemo(() => {
    const detailMap: Record<
      string,
      {
        faculty: string;
        registered: number;
        unregistered: number;
        total: number;
      }[]
    > = {};
    const selectedFacultyIds = Object.keys(appliedFaculties).filter(
      (key) => appliedFaculties[key] && key !== "f-0",
    );

    // For each time period in deepInsightTimeData, get faculty breakdown
    deepInsightTimeData.forEach((timeItem) => {
      let faculties = timeItem.data;

      // Filter by selected faculties if any
      if (selectedFacultyIds.length > 0) {
        faculties = faculties.filter((f) =>
          selectedFacultyIds.includes(f.facultyId),
        );
      }

      // Map to FacultyDetailData format with user filter applied
      const facultiesForTime = faculties.map((f) => {
        let total = f.students + f.staff;
        let registered = f.registered;
        let unregistered = f.unregistered;

        if (userFilter === "student") {
          total = f.students;
          // Proportionally adjust registered/unregistered for students
          const studentRatio = f.students / (f.students + f.staff || 1);
          registered = Math.round(f.registered * studentRatio);
          unregistered = Math.round(f.unregistered * studentRatio);
        } else if (userFilter === "staff") {
          total = f.staff;
          // Proportionally adjust registered/unregistered for staff
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

  // Prepare time detail data for each faculty (for BarChartVertical detail section)
  const timeDetailData = useMemo(() => {
    const detailMap: Record<string, { time: string; total: number }[]> = {};
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

  // Prepare chart data
  const verticalChartData = useMemo(
    () =>
      filteredFacultyData.map((item) => ({
        faculty: item.faculty,
        total: item.total,
      })),
    [filteredFacultyData],
  );

  const horizontalChartData = useMemo(
    () =>
      filteredTimeData.map((item) => ({ time: item.time, total: item.total })),
    [filteredTimeData],
  );

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
              <button className="flex items-center">
                <IonIcon
                  name="FunnelOutline"
                  size="32px"
                  className="text-primary"
                />
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

      <div
        className={cn(
          "h-auto lg:h-[450px] w-full",
          hasActiveFilters ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "",
        )}
      >
        <StatCard
          title={t("totalAttendees")}
          value={summaryStats.totalAttendees}
          unit={t("unit")}
          variant="outline"
          switchNumberPosition={true}
          mobileLeftAlign={true}
        >
          <div className="lg:mt-4 flex justify-start lg:justify-center px-0 lg:px-8">
            <span className="title-medium-emphasized lg:headline-small-emphasized pr-4 lg:pr-16 text-center">
              {t("students")}: {summaryStats.studentCount} {t("unit")}
            </span>
            <div className="inline-block w-0.5 self-stretch bg-neutral-400"></div>
            <span className="title-medium-emphasized lg:headline-small-emphasized pl-4 lg:pl-16 text-center">
              {t("staffs")}: {summaryStats.staffCount} {t("unit")}
            </span>
          </div>
        </StatCard>
        <div
          className={cn(
            "h-auto lg:h-[450px] w-full",
            hasActiveFilters ? "" : "hidden",
          )}
        >
          <PieChartFilter data={donutChartData} />
        </div>
      </div>

      {/* Chart Section */}
      <section className="flex flex-col space-y-8">
        <div className="flex justify-between">
          <p className="headline-small-emphasized md:headline-large-emphasized">
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
        <div className="h-auto">
          <BarChartVertical
            data={verticalChartData}
            timeDetailData={timeDetailData}
          />
        </div>
      </section>

      <section className="flex flex-col space-y-8">
        <p className="headline-small-emphasized md:headline-large-emphasized">
          {t("timeStatsTitle")}
        </p>
        <div className="w-full h-full overflow-auto">
          <BarChartHorizontal
            data={horizontalChartData}
            facultyDetailData={facultyDetailData}
          />
        </div>
        <Link href="/dashboard-compare">
          <Button mode="filled" bordered="square" expanded={false}>
            <p className="title-medium-emphasized">{t("compareButton")}</p>
          </Button>
        </Link>
      </section>
    </div>
  );
}
