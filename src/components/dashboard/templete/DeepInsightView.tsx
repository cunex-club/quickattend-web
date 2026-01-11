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
      (mod) => mod.BarChartHorizontal
    ),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
    ssr: false,
  }
);

const BarChartVertical = dynamic(
  () =>
    import("@components/charts/BarChartVertical").then(
      (mod) => mod.BarChartVertical
    ),
  {
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
    ssr: false,
  }
);
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { FilterableList } from "../FilterableList";
import {
  dataCategorizeByFaculty,
  dataCategorizeByTime,
  facultyData,
  timeData,
  eventData,
  detailedFacultyData,
  detailedTimeData,
} from "@utils/data";
import {
  applyFacultyFilters,
  applyTimeFilters,
  calculateSummaryStats,
} from "@utils/filterHelpers";
import SortMenu from "@components/sort-menu";
import IonIcon from "@components/IonIcon";

export function DeepInsightView() {
  const router = useRouter();
  const { role } = useRole();
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

  const facultyFilterOptions = useMemo(
    () => facultyData.filter((item) => item.id !== "f-0"),
    []
  );
  const timeFilterOptions = useMemo(
    () => timeData.filter((item) => item.id !== "t-0"),
    []
  );

  const canViewInsights = role === "manager" || role === "owner";

  useEffect(() => {
    if (!canViewInsights) {
      router.push("/dashboard");
    }
  }, [canViewInsights, router]);
  const createSelectionHandler = (
    setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  ) =>
    (itemId: string, checked: boolean) => {
      setter((prevSelected) => {
        const newSelected = { ...prevSelected };
        if (checked) {
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

  const handleFacultyChange = createSelectionHandler(setSelectedFaculties);
  const handleTimeChange = createSelectionHandler(setSelectedTimes);

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

  const handleSortChange = () => {};

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

  // Calculate summary statistics
  const summaryStats = useMemo(
    () => calculateSummaryStats(filteredFacultyData, userFilter),
    [filteredFacultyData, userFilter]
  );

  // Prepare chart data
  const verticalChartData = useMemo(
    () =>
      filteredFacultyData.map((item) => ({
        faculty: item.faculty,
        total: item.total,
      })),
    [filteredFacultyData]
  );

  const horizontalChartData = useMemo(
    () =>
      filteredTimeData.map((item) => ({ time: item.time, total: item.total })),
    [filteredTimeData]
  );

  if (!canViewInsights) return null;

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

      <div className="h-auto lg:h-[450px] w-full">
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
          <BarChartVertical data={verticalChartData} />
        </div>
      </section>

      <section className="flex flex-col space-y-8">
        <p className="headline-small-emphasized md:headline-large-emphasized">
          {t("timeStatsTitle")}
        </p>
        <div className="w-full h-full overflow-auto">
          <BarChartHorizontal data={horizontalChartData} />
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
