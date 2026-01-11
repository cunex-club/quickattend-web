"use client";

import Button from "@components/Button";
import React from "react";
import StatCard from "@components/StatCard";
import Link from "next/link";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@assets/components/ui/skeleton";
import { useTranslations } from "next-intl";

// Dynamically import heavy chart components
const BarChartHorizontal = dynamic(
  () =>
    import("@components/charts/BarChartHorizontal").then(
      (mod) => mod.BarChartHorizontal
    ),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
    ssr: false,
  }
);

const DonutChart = dynamic(
  () =>
    import("@components/charts/PieChartStacked").then(
      (mod) => mod.PieChartStacked
    ),
  {
    loading: () => <Skeleton className="h-full w-full rounded-lg" />,
    ssr: false,
  }
);

const BarChartVertical = dynamic(
  () =>
    import("@components/charts/BarChartVertical").then(
      (mod) => mod.BarChartVertical
    ),
  {
    loading: () => <Skeleton className="h-full w-full rounded-lg" />,
    ssr: false,
  }
);

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { FilterableList } from "@components/dashboard/FilterableList";
import {
  dataCategorizeByTime,
  facultyData,
  registeredData,
  registrationStatusData,
  timeData,
  detailedFacultyData,
  detailedTimeData,
} from "@utils/data";
import {
  applyFacultyFilters,
  applyTimeFilters,
  applyRegisteredDataFilters,
  calculateSummaryStats,
  calculateRegistrationStats,
} from "@utils/filterHelpers";
import SortMenu from "@components/sort-menu";
import InfoCard from "@components/InfoCard";

export default function FilterView() {
  const t = useTranslations("Dashboard.insights");
  const [userFilter, setUserFilter] = useState<"student" | "staff" | null>(
    null
  );
  const [selectedFaculties, setSelectedFaculties] = useState<
    Record<string, boolean>
  >({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>(
    {}
  );

  // Applied filters - only updated when user clicks "Apply Filter"
  const [appliedFaculties, setAppliedFaculties] = useState<
    Record<string, boolean>
  >({});
  const [appliedTimes, setAppliedTimes] = useState<Record<string, boolean>>({});
  const createSelectionHandler =
    (
      setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
      allItemId: string
    ) =>
    (itemId: string, checked: boolean) => {
      setter((prevSelected) => {
        const newSelected = { ...prevSelected };
        if (checked) {
          if (itemId === allItemId) return { [allItemId]: true };
          delete newSelected[allItemId];
          const selectedCount =
            Object.values(newSelected).filter(Boolean).length;
          if (selectedCount >= 5) return prevSelected;
          newSelected[itemId] = true;
        } else {
          delete newSelected[itemId];
        }
        return newSelected;
      });
    };

  const handleFacultyChange = createSelectionHandler(
    setSelectedFaculties,
    "f-0"
  );
  const handleTimeChange = createSelectionHandler(setSelectedTimes, "t-0");

  const handleClearFilters = () => {
    setSelectedFaculties({});
    setSelectedTimes({});
    // Also clear applied filters immediately
    setAppliedFaculties({});
    setAppliedTimes({});
  };

  const handleApplyFilters = () => {
    setAppliedFaculties(selectedFaculties);
    setAppliedTimes(selectedTimes);
  };

  const handleSortChange = (value: string) => {};

  // Apply filters to data using useMemo for performance
  // Note: User type filter (student/staff) applies immediately
  // Faculty and time filters only apply when "Apply Filter" is clicked
  const filteredFacultyData = useMemo(
    () =>
      applyFacultyFilters(detailedFacultyData, {
        selectedFaculties: appliedFaculties,
        userType: userFilter,
      }),
    [appliedFaculties, userFilter]
  );

  const filteredTimeData = useMemo(
    () =>
      applyTimeFilters(detailedTimeData, {
        selectedTimes: appliedTimes,
        userType: userFilter,
      }),
    [appliedTimes, userFilter]
  );

  const filteredRegisteredData = useMemo(
    () =>
      applyRegisteredDataFilters(registeredData, {
        selectedFaculties: appliedFaculties,
        userType: userFilter,
      }),
    [appliedFaculties, userFilter]
  );

  // Calculate summary statistics
  const summaryStats = useMemo(
    () => calculateSummaryStats(filteredFacultyData, userFilter),
    [filteredFacultyData, userFilter]
  );

  const registrationStats = useMemo(
    () => calculateRegistrationStats(filteredRegisteredData, userFilter),
    [filteredRegisteredData, userFilter]
  );

  // Prepare chart data
  const horizontalChartData = useMemo(
    () =>
      filteredTimeData.map((item) => ({ time: item.time, total: item.total })),
    [filteredTimeData]
  );

  const verticalChartData = filteredFacultyData.map((item) => ({
    faculty: item.faculty,
    total: item.total,
  }));

  const donutChartData = useMemo(
    () => [
      {
        category: "ลงทะเบียนแล้ว",
        total: registrationStats.registered,
        students: userFilter === "staff" ? 0 : registrationStats.students,
        staff: userFilter === "student" ? 0 : registrationStats.staff,
      },
      {
        category: "ยังไม่ลงทะเบียน",
        total: registrationStats.unregistered,
        students: userFilter === "staff" ? 0 : registrationStats.students,
        staff: userFilter === "student" ? 0 : registrationStats.staff,
      },
    ],
    [registrationStats, userFilter]
  );

  return (
    <div className="w-full rounded-xl bg-neutral-white space-y-16">
      <section className="flex justify-between">
        <div className="space-x-4">
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
              <Button mode="filled" bordered="square" expanded={false}>
                <p className="label-large-emphasized">{t("filter")}</p>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-screen max-w-md p-8" align="end">
              <div>
                <div className="flex flex-col space-y-8">
                  <p className="headline-large-emphasized mx-auto">
                    {t("filterDataTitle")}
                  </p>
                  <FilterableList
                    title={t("faculty")}
                    items={facultyData}
                    selectedItems={selectedFaculties}
                    onCheckedChange={handleFacultyChange}
                    filterVariant="secondary"
                  />

                  <FilterableList
                    title={t("timePeriod")}
                    items={timeData}
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

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[250px] md:h-[450px] w-full">
          <StatCard
            title={t("totalAttendees")}
            value={summaryStats.totalAttendees}
            unit={t("unit")}
            variant="outline"
          >
            <div className="mt-4 hidden md:flex justify-center items-center px-8">
              <span className="headline-small-emphasized pr-4 sm:pr-10 md:pr-16 text-center">
                {t("students")}: {summaryStats.studentCount} {t("unit")}
              </span>
              <div className="inline-block w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>
              <span className="headline-small-emphasized pl-4 sm:pl-10 md:pr-16 text-center">
                {t("staffs")}: {summaryStats.staffCount} {t("unit")}
              </span>
            </div>
          </StatCard>
        </div>
        <div className="h-[250px] md:h-[450px] w-full">
          <DonutChart data={donutChartData} />
        </div>
      </section>

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
        <div className="h-auto">
          <BarChartVertical data={verticalChartData} />
        </div>
      </section>

      <section className="flex flex-col space-y-8 mb-0sm:mb-10">
        <p className="headline-small-emphasized sm:headline-medium-emphasized md:headline-large-emphasized">
          {t("timeStatsTitle")}
        </p>
        <div>
          <BarChartHorizontal data={horizontalChartData} />
        </div>
      </section>

      <Link href="/dashboard-compare" target="_blank">
        <Button mode="filled" bordered="square" expanded={false}>
          <p className="title-medium-emphasized">{t("compareButton")}</p>
        </Button>
      </Link>
    </div>
  );
}
