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
import {
  deepInsightFacultyData,
  deepInsightTimeData,
  FilterFacultyOptions,
  FilterTimeOptions,
} from "@utils/data";
import SortMenu from "@components/sort-menu";
import IonIcon from "@shared/IonIcon";
import { cn } from "@assets/lib/utils";
import { PieChartFilter } from "@components/charts/PieChartFilter";

export function DeepInsightView() {
  const router = useRouter();
  const { role } = useRole();
  const t = useTranslations("Dashboard.insights");
  const [userFilter, setUserFilter] = useState<"student" | "staff" | null>(
    null,
  );
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
  const summaryStats = useMemo(() => {
    // Calculate from filteredFacultyData
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
