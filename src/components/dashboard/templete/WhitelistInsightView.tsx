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
      (mod) => mod.BarChartHorizontal
    ),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
    ssr: false,
  }
);

const DonutChart = dynamic(
  () => import("../../charts/DonutChart").then((mod) => mod.DonutChart),
  {
    loading: () => (
      <Skeleton className="h-full w-full rounded-lg bg-neutral-white" />
    ),
    ssr: false,
  }
);

const PieChartFilter = dynamic(
  () => import("../../charts/PieChartFilter").then((mod) => mod.PieChartFilter),
  {
    loading: () => (
      <Skeleton className="h-full w-full rounded-lg bg-neutral-white" />
    ),
    ssr: false,
  }
);

const BarChartVerticalStacked = dynamic(
  () =>
    import("../../charts/BarChartVerticalStacked").then(
      (mod) => mod.BarChartVerticalStacked
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
import { FilterableList } from "../FilterableList";
import {
  DeepInSightFacultyData,
  DeepInSightTimeData,
  detailedFacultyData,
  detailedTimeData,
  registeredData,
} from "@utils/data";
import {
  applyFacultyFilters,
  applyTimeFilters,
  applyRegisteredDataFilters,
  calculateSummaryStats,
  calculateRegistrationStats,
} from "@utils/filterHelpers";
import SortMenu from "@components/sort-menu";
import IonIcon from "@shared/IonIcon";
import { toast } from "sonner";

export function WhitelistInsightView() {
  const router = useRouter();
  const { role } = useRole();
  const t = useTranslations("Dashboard.insights");
  const [userFilter, setUserFilter] = useState<"student" | "staff" | null>(
    null
  );

  // Selected filters - updated when user clicks on filter items
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

  // items that user can select to filter
  const facultyFilterOptions = useMemo(
    () => DeepInSightFacultyData.filter((item) => item.id !== "f-0"),
    []
  );
  const timeFilterOptions = useMemo(
    () => DeepInSightTimeData.filter((item) => item.id !== "t-0"),
    []
  );

  const canViewInsights = role === "manager" || role === "owner";

  useEffect(() => {
    if (!canViewInsights) {
      router.push("/dashboard");
    }
  }, [canViewInsights, router]);

  const createSelectionHandler =
    (setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) =>
    (itemId: string, checked: boolean) => {
      setter((prevSelected) => {
        const newSelected = { ...prevSelected };
        if (checked) {
          const selectedCount =
            Object.values(newSelected).filter(Boolean).length;

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
    // Prevent applying if no filters are selected
    if (
      Object.keys(selectedFaculties).length === 0 &&
      Object.keys(selectedTimes).length === 0
    ) {
      toast.warning(
        <p className="title-small-primary">{t("applyFilterWarning")}</p>,
        {
          style: {
            background: "var(--warning)",
            color: "#fff",
          },
        }
      );
      return;
    }

    setAppliedFaculties(selectedFaculties);
    setAppliedTimes(selectedTimes);
  };

  const handleSortChange = () => {};

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    const hasFacultyFilter =
      Object.keys(appliedFaculties).filter((key) => appliedFaculties[key])
        .length > 0;
    const hasTimeFilter =
      Object.keys(appliedTimes).filter((key) => appliedTimes[key]).length > 0;
    return hasFacultyFilter || hasTimeFilter;
  }, [appliedFaculties, appliedTimes]);

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
  // When both faculty and time filters are active, calculate stats from both and use the intersection
  const summaryStats = useMemo(() => {
    const hasFacultyFilter =
      Object.keys(appliedFaculties).filter((key) => appliedFaculties[key])
        .length > 0;
    const hasTimeFilter =
      Object.keys(appliedTimes).filter((key) => appliedTimes[key]).length > 0;

    const facultyStats = calculateSummaryStats(filteredFacultyData, userFilter);
    const timeStats = calculateSummaryStats(filteredTimeData, userFilter);

    // If both filters are active, use the minimum of both to approximate the intersection
    if (hasFacultyFilter && hasTimeFilter) {
      return {
        totalAttendees: Math.min(
          facultyStats.totalAttendees,
          timeStats.totalAttendees
        ),
        studentCount: Math.min(
          facultyStats.studentCount,
          timeStats.studentCount
        ),
        staffCount: Math.min(facultyStats.staffCount, timeStats.staffCount),
      };
    }

    // If only time filter is active, use time stats
    if (hasTimeFilter) {
      return timeStats;
    }

    // Default to faculty stats (includes unfiltered case)
    return facultyStats;
  }, [
    filteredFacultyData,
    filteredTimeData,
    appliedFaculties,
    appliedTimes,
    userFilter,
  ]);

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

  const verticalStackData = filteredRegisteredData;

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

  // Calculate totals for InfoCards
  const totalEligible =
    summaryStats.totalAttendees + registrationStats.unregistered;
  const totalUnregistered = registrationStats.unregistered;

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
                      : "opacity-0 scale-0"
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
              : "opacity-100 max-h-[500px]"
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
          <BarChartVerticalStacked data={verticalStackData} />
        </div>
      </section>

      <section className="flex flex-col space-y-8 mb-8 sm:mb-10">
        <p className="headline-small-emphasized sm:headline-medium-emphasized md:headline-large-emphasized">
          {t("timeStatsTitle")}
        </p>
        <div className="w-full overflow-auto">
          <BarChartHorizontal data={horizontalChartData} />
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
