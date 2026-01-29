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
  () => import("../../charts/DonutChart").then((mod) => mod.DonutChart),
  {
    loading: () => (
      <Skeleton className="h-full w-full rounded-lg bg-neutral-white" />
    ),
    ssr: false,
  },
);

const PieChartFilter = dynamic(
  () => import("../../charts/PieChartFilter").then((mod) => mod.PieChartFilter),
  {
    loading: () => (
      <Skeleton className="h-full w-full rounded-lg bg-neutral-white" />
    ),
    ssr: false,
  },
);

const BarChartVerticalStacked = dynamic(
  () =>
    import("../../charts/BarChartVerticalStacked").then(
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
import {
  FilterFacultyOptions,
  FilterTimeOptions,
  deepInsightFacultyData,
  deepInsightTimeData,
} from "@utils/data";
import SortMenu from "@components/sort-menu";
import IonIcon from "@shared/IonIcon";
import { toast } from "sonner";
import { FacultyDetailData, TimeDetailData } from "@customTypes/chart";

export function WhitelistInsightView() {
  const router = useRouter();
  const { role } = useRole();
  const t = useTranslations("Dashboard.insights");
  const [userFilter, setUserFilter] = useState<"student" | "staff" | null>(
    null,
  );

  // Selected filters - updated when user clicks on filter items
  const [selectedFaculties, setSelectedFaculties] = useState<
    Record<string, boolean>
  >({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>(
    {},
  );

  // Applied filters - only updated when user clicks "Apply Filter"
  const [appliedFaculties, setAppliedFaculties] = useState<
    Record<string, boolean>
  >({});
  const [appliedTimes, setAppliedTimes] = useState<Record<string, boolean>>({});

  // items that user can select to filter
  const facultyFilterOptions = useMemo(
    () => FilterFacultyOptions.filter((item) => item.id !== "f-0"),
    [],
  );
  const timeFilterOptions = useMemo(
    () => FilterTimeOptions.filter((item) => item.id !== "t-0"),
    [],
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
        },
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

  // Filter faculty data: filter by selected faculties and optionally by time periods
  const filteredFacultyData = useMemo(() => {
    const selectedFacultyIds = Object.keys(appliedFaculties).filter(
      (key) => appliedFaculties[key] && key !== "f-0",
    );
    const selectedTimeIds = Object.keys(appliedTimes).filter(
      (key) => appliedTimes[key] && key !== "t-0",
    );

    // Filter faculties
    let faculties = deepInsightFacultyData;
    if (selectedFacultyIds.length > 0) {
      faculties = faculties.filter((f) =>
        selectedFacultyIds.includes(f.facultyId),
      );
    }

    // For each faculty, filter time periods and aggregate
    return faculties.map((faculty) => {
      let timeData = faculty.data;

      // Filter by selected times if any
      if (selectedTimeIds.length > 0) {
        timeData = timeData.filter((t) => selectedTimeIds.includes(t.timeId));
      }

      // Aggregate time data for this faculty
      const students = timeData.reduce((sum, t) => sum + t.students, 0);
      const staff = timeData.reduce((sum, t) => sum + t.staff, 0);
      const totalRegistered = timeData.reduce(
        (sum, t) => sum + t.registered,
        0,
      );
      const totalUnregistered = timeData.reduce(
        (sum, t) => sum + t.unregistered,
        0,
      );

      let total = students + staff;
      let registered = totalRegistered;
      let unregistered = totalUnregistered;

      if (userFilter === "student") {
        total = students;
        // Apply proportional adjustment for students
        const studentRatio = students / (students + staff || 1);
        registered = Math.round(totalRegistered * studentRatio);
        unregistered = Math.round(totalUnregistered * studentRatio);
      } else if (userFilter === "staff") {
        total = staff;
        // Apply proportional adjustment for staff
        const staffRatio = staff / (students + staff || 1);
        registered = Math.round(totalRegistered * staffRatio);
        unregistered = Math.round(totalUnregistered * staffRatio);
      }

      return {
        facultyId: faculty.facultyId,
        faculty: faculty.faculty,
        students,
        staff,
        total,
        registered,
        unregistered,
      };
    });
  }, [appliedFaculties, appliedTimes, userFilter]);

  // Filter time data: filter by selected times and optionally by faculties
  const filteredTimeData = useMemo(() => {
    const selectedFacultyIds = Object.keys(appliedFaculties).filter(
      (key) => appliedFaculties[key] && key !== "f-0",
    );
    const selectedTimeIds = Object.keys(appliedTimes).filter(
      (key) => appliedTimes[key] && key !== "t-0",
    );

    // Filter time periods
    let times = deepInsightTimeData;
    if (selectedTimeIds.length > 0) {
      times = times.filter((t) => selectedTimeIds.includes(t.timeId));
    }

    // For each time period, filter faculties and aggregate
    return times.map((timeItem) => {
      let facultyData = timeItem.data;

      // Filter by selected faculties if any
      if (selectedFacultyIds.length > 0) {
        facultyData = facultyData.filter((f) =>
          selectedFacultyIds.includes(f.facultyId),
        );
      }

      // Aggregate faculty data for this time period
      const students = facultyData.reduce((sum, f) => sum + f.students, 0);
      const staff = facultyData.reduce((sum, f) => sum + f.staff, 0);
      const totalRegistered = facultyData.reduce(
        (sum, f) => sum + f.registered,
        0,
      );
      const totalUnregistered = facultyData.reduce(
        (sum, f) => sum + f.unregistered,
        0,
      );

      let total = students + staff;
      let registered = totalRegistered;
      let unregistered = totalUnregistered;

      if (userFilter === "student") {
        total = students;
        // Apply proportional adjustment for students
        const studentRatio = students / (students + staff || 1);
        registered = Math.round(totalRegistered * studentRatio);
        unregistered = Math.round(totalUnregistered * studentRatio);
      } else if (userFilter === "staff") {
        total = staff;
        // Apply proportional adjustment for staff
        const staffRatio = staff / (students + staff || 1);
        registered = Math.round(totalRegistered * staffRatio);
        unregistered = Math.round(totalUnregistered * staffRatio);
      }

      return {
        timeId: timeItem.timeId,
        time: timeItem.time,
        students,
        staff,
        total,
        registered,
        unregistered,
      };
    });
  }, [appliedFaculties, appliedTimes, userFilter]);

  // Calculate summary statistics
  // When both faculty and time filters are active, calculate from the filtered data
  const summaryStats = useMemo(() => {
    const totalStudents = filteredFacultyData.reduce(
      (sum, f) => sum + f.students,
      0,
    );
    const totalStaff = filteredFacultyData.reduce((sum, f) => sum + f.staff, 0);
    const totalRegistered = filteredFacultyData.reduce(
      (sum, f) => sum + f.registered,
      0,
    );

    // totalAttendees should be the registered count (actual participants)
    const totalAttendees = totalRegistered;
    let studentCount = totalStudents;
    let staffCount = totalStaff;

    if (userFilter === "student") {
      studentCount = totalStudents;
      staffCount = 0;
    } else if (userFilter === "staff") {
      studentCount = 0;
      staffCount = totalStaff;
    }

    return {
      totalAttendees,
      studentCount,
      staffCount,
    };
  }, [filteredFacultyData, userFilter]);

  const registrationStats = useMemo(() => {
    // filteredFacultyData already has registered/unregistered adjusted for user filter
    const totalRegistered = filteredFacultyData.reduce(
      (sum, f) => sum + f.registered,
      0,
    );
    const totalUnregistered = filteredFacultyData.reduce(
      (sum, f) => sum + f.unregistered,
      0,
    );
    const totalStudents = filteredFacultyData.reduce(
      (sum, f) => sum + f.students,
      0,
    );
    const totalStaff = filteredFacultyData.reduce((sum, f) => sum + f.staff, 0);

    return {
      registered: totalRegistered,
      unregistered: totalUnregistered,
      students: totalStudents,
      staff: totalStaff,
    };
  }, [filteredFacultyData]);

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
  }, [appliedFaculties, userFilter]);

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
  }, [appliedTimes, userFilter]);

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
