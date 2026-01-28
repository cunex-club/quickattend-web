"use client";

import React from "react";
import { useState, useMemo } from "react";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { StatCard } from "@components/StatCard";
import Button from "@components/Button";
import { FilterableList } from "@components/dashboard/FilterableList";
import {
  FilterFacultyOptions,
  FilterTimeOptions,
  deepInsightFacultyData,
  deepInsightTimeData,
} from "@utils/data";
import { useRole } from "@context/RoleContext";
import { toast } from "sonner";
import { Skeleton } from "@assets/components/ui/skeleton";
import { useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import Link from "next/link";

const BarChartHorizontalMulti = dynamic(
  () =>
    import("@components/charts/BarChartHorizontalMulti").then((mod) => ({
      default: mod.BarChartHorizontalMulti,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[450px] w-full rounded-lg" />,
  },
);

const BarChartVerticalMulti = dynamic(
  () =>
    import("@components/charts/BarChartVerticalMulti").then((mod) => ({
      default: mod.BarChartVerticalMulti,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full rounded-lg" />,
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

const canViewPage = (role: string) => {
  return role === "manager" || role === "owner";
};

export function CompareView() {
  const t = useTranslations("Dashboard.compare");
  const { role } = useRole();
  const [selectedFaculties, setSelectedFaculties] = useState<
    Record<string, boolean>
  >({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>(
    {},
  );
  
  // Applied filters - only updated when user clicks "Compare Data"
  const [appliedFaculties, setAppliedFaculties] = useState<
    Record<string, boolean>
  >({});
  const [appliedTimes, setAppliedTimes] = useState<Record<string, boolean>>({});

  if (!canViewPage(role)) {
    redirect("/dashboard");
    return null;
  }

  const createSelectionHandler =
    (
      setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
      allItemId: string, // ID of the "all" item (e.g., "f-0" or "t-0")
    ) =>
    (itemId: string, checked: boolean) => {
      setter((prevSelected) => {
        const newSelected = { ...prevSelected };

        if (checked) {
          if (itemId === allItemId) {
            return { [allItemId]: true };
          }

          delete newSelected[allItemId];

          const selectedCount =
            Object.values(newSelected).filter(Boolean).length;
          if (selectedCount >= 5) {
            toast.error(
              <p className="title-medium-primary text-neutral-white">
                {t("maxSelectionError")}
              </p>,
              {
                style: {
                  background: "var(--error)",
                  color: "var(--neutral-white)",
                },
                duration: 2500,
              },
            );
            return prevSelected;
          }
          newSelected[itemId] = true;
        } else {
          delete newSelected[itemId];
        }
        return newSelected;
      });
    };

  const handleFacultyChange = createSelectionHandler(
    setSelectedFaculties,
    "f-0",
  );
  const handleTimeChange = createSelectionHandler(setSelectedTimes, "t-0");
  const handleClearSelection = () => {
    setSelectedFaculties({});
    setSelectedTimes({});
    setAppliedFaculties({});
    setAppliedTimes({});
  };
  const handleSubmitComparison = () => {
    const hasFacultySelection = Object.keys(selectedFaculties).length > 0;
    const hasTimeSelection = Object.keys(selectedTimes).length > 0;

    // Case 1: No time and no faculty filter
    if (!hasFacultySelection && !hasTimeSelection) {
      toast.error(
        <p className="title-medium-primary text-neutral-white">
          {t("noFacultyAndTimeError")}
        </p>,
        {
          style: {
            background: "var(--error)",
            color: "var(--neutral-white)",
            width: "max-content",
          },
          duration: 2500,
        },
      );
      return;
    }

    // Case 2: No time filter
    if (!hasTimeSelection) {
      toast.error(
        <p className="title-medium-primary text-neutral-white">
          {t("noTimeError")}
        </p>,
        {
          style: {
            background: "var(--warning)",
            color: "var(--neutral-white)",
            width: "max-content",
          },
          duration: 2500,
        },
      );
      return;
    }

    // Case 3: No faculty filter
    if (!hasFacultySelection) {
      toast.error(
        <p className="title-medium-primary text-neutral-white">
          {t("noFacultyError")}
        </p>,
        {
          style: {
            background: "var(--warning)",
            color: "var(--neutral-white)",
            width: "max-content",
          },
          duration: 2500,
        },
      );
      return;
    }

    // Check if both "All" options are selected
    if (selectedFaculties["f-0"] && selectedTimes["t-0"]) {
      toast.error(
        <p className="title-medium-primary text-neutral-white">
          {t("bothAllError")}
        </p>,
        {
          style: {
            background: "var(--error)",
            color: "var(--neutral-white)",
            width: "max-content",
          },
          duration: 2500,
        },
      );
      return;
    }

    // Apply the filters
    setAppliedFaculties(selectedFaculties);
    setAppliedTimes(selectedTimes);

    toast.success(
      <p className="title-medium-primary text-neutral-white">
        {t("comparingData")}
      </p>,
      {
        style: {
          background: "var(--success)",
          color: "var(--neutral-white)",
        },
        duration: 2500,
      },
    );
  };

  // Filter and transform faculty data for comparison
  const comparedFacultyData = useMemo(() => {
    const selectedFacultyIds = Object.keys(appliedFaculties).filter(
      (key) => appliedFaculties[key] && key !== "f-0",
    );
    const selectedTimeIds = Object.keys(appliedTimes).filter(
      (key) => appliedTimes[key] && key !== "t-0",
    );

    // If "All" is selected for faculties, or no selection, return empty for comparison
    if (appliedFaculties["f-0"] || selectedFacultyIds.length === 0) {
      return [];
    }

    // Filter faculties
    let faculties = deepInsightFacultyData.filter((f) =>
      selectedFacultyIds.includes(f.facultyId),
    );

    // Transform to comparison format
    return faculties.map((faculty) => {
      let timeData = faculty.data;

      // Filter by selected times if any (and not "All")
      if (!appliedTimes["t-0"] && selectedTimeIds.length > 0) {
        timeData = timeData.filter((t) => selectedTimeIds.includes(t.timeId));
      }

      return {
        faculty: faculty.faculty,
        data: timeData.map((t) => ({
          time: t.time,
          total: t.total,
        })),
      };
    });
  }, [appliedFaculties, appliedTimes]);

  // Filter and transform time data for comparison
  const comparedTimeData = useMemo(() => {
    const selectedFacultyIds = Object.keys(appliedFaculties).filter(
      (key) => appliedFaculties[key] && key !== "f-0",
    );
    const selectedTimeIds = Object.keys(appliedTimes).filter(
      (key) => appliedTimes[key] && key !== "t-0",
    );

    // If "All" is selected for times, or no selection, return empty for comparison
    if (appliedTimes["t-0"] || selectedTimeIds.length === 0) {
      return [];
    }

    // Filter time periods
    let times = deepInsightTimeData.filter((t) =>
      selectedTimeIds.includes(t.timeId),
    );

    // For time comparison, we need to show each selected faculty as a series
    // Get unique faculties to show
    const facultiesToShow = selectedFacultyIds.length > 0 
      ? deepInsightFacultyData.filter(f => selectedFacultyIds.includes(f.facultyId))
      : deepInsightFacultyData;

    // Transform to comparison format - each faculty becomes a data series
    return facultiesToShow.map((faculty) => {
      // Get this faculty's data for each selected time period
      const facultyTimeData = times.map((timeItem) => {
        // Find this faculty's data in this time period
        const facultyEntry = timeItem.data.find(
          (f) => f.facultyId === faculty.facultyId
        );
        
        return {
          time: timeItem.time,
          total: facultyEntry ? facultyEntry.total : 0,
        };
      });

      return {
        faculty: faculty.faculty,
        data: facultyTimeData,
      };
    });
  }, [appliedFaculties, appliedTimes]);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const selectedFacultyIds = Object.keys(appliedFaculties).filter(
      (key) => appliedFaculties[key] && key !== "f-0",
    );
    const selectedTimeIds = Object.keys(appliedTimes).filter(
      (key) => appliedTimes[key] && key !== "t-0",
    );

    let faculties = deepInsightFacultyData;
    if (!appliedFaculties["f-0"] && selectedFacultyIds.length > 0) {
      faculties = faculties.filter((f) =>
        selectedFacultyIds.includes(f.facultyId),
      );
    }

    // Calculate totals
    let totalAttendees = 0;
    let totalRegistered = 0;
    let totalUnregistered = 0;

    faculties.forEach((faculty) => {
      let timeData = faculty.data;

      // Filter by selected times if any
      if (!appliedTimes["t-0"] && selectedTimeIds.length > 0) {
        timeData = timeData.filter((t) => selectedTimeIds.includes(t.timeId));
      }

      // Aggregate (avoid double counting by using Set logic)
      timeData.forEach((t) => {
        totalRegistered += t.registered;
        totalUnregistered += t.unregistered;
      });
    });

    // For comparison page, we sum across all selected items
    // But need to prevent double counting when both faculties and times are selected
    if (selectedFacultyIds.length > 0 && selectedTimeIds.length > 0) {
      // When both are selected, count only once
      totalAttendees = totalRegistered;
    } else {
      totalAttendees = totalRegistered;
    }

    const studentCount = Math.round(totalAttendees * 0.8); // 80% students
    const staffCount = totalAttendees - studentCount; // 20% staff

    return {
      totalAttendees,
      studentCount,
      staffCount,
      totalRegistered,
      totalUnregistered,
    };
  }, [appliedFaculties, appliedTimes]);

  // Prepare data for pie chart (student vs staff distribution)
  const pieChartData = useMemo(() => {
    return [
      { name: "นิสิต", value: summaryStats.studentCount, fill: "var(--color-primary)" },
      { name: "บุคลากร", value: summaryStats.staffCount, fill: "var(--chart-pink-200)" },
    ];
  }, [summaryStats]);

  // layout
  return (
    <div className="flex flex-col items-center w-full min-h-screen px-4 md:px-8 py-12 bg-neutral-white">
      <div className="container flex flex-col items-center bg-neutral-white space-y-4">
        {/* back button */}
        <div className="relative flex items-center w-full h-10">
          <Link
            href="/dashboard/insights"
            className="flex flex-row space-x-1 items-center cursor-pointer z-10 text-primary transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-80"
          >
            <IonIcon name="ChevronBackOutline" size="20px" />
            <p className="label-large-emphasized hidden md:block">
              {t("back")}
            </p>
          </Link>

          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <p className="headline-small-emphasized text-center whitespace-nowrap">
              {t("title")}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full rounded-xl bg-neutral-white space-y-16">
          {/* filter section */}
          <section className="w-full h-auto flex flex-col space-y-8 bg-neutral-100 p-8 sm:p-12 md:p-16 rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FilterableList
                title={t("faculty")}
                items={FilterFacultyOptions}
                selectedItems={selectedFaculties}
                onCheckedChange={handleFacultyChange}
                hasDescription
              />
              <FilterableList
                title={t("timePeriod")}
                items={FilterTimeOptions}
                selectedItems={selectedTimes}
                onCheckedChange={handleTimeChange}
                hasDescription
              />
            </div>
            <div className="flex justify-end">
              <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-8 w-full md:w-auto">
                <div className="w-full md:w-[240px]">
                  <Button
                    mode="outline"
                    bordered="round"
                    expanded={true}
                    className="bg-transparent"
                    onClick={handleClearSelection}
                  >
                    <p className="title-large-emphasized">{t("clearData")}</p>
                  </Button>
                </div>
                <div className="w-full md:w-[240px]">
                  <Button
                    mode="filled"
                    bordered="round"
                    expanded={true}
                    onClick={handleSubmitComparison}
                  >
                    <p className="title-large-emphasized">{t("compareData")}</p>
                  </Button>
                </div>
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
              >
                <div className="flex flex-col justify-center items-center gap-4">
                  <p className="title-medium-emphasized lg:title-large-emphasized">
                    {t("outOfTotal")} 1096 {t("unit")}
                  </p>
                </div>
              </StatCard>
            </div>
            <div className="w-full h-full">
              <PieChartWithLabel data={pieChartData} />
            </div>
          </section>

          {/* Chart Section */}
          {comparedFacultyData.length > 0 && (
            <section className="flex flex-col space-y-8">
              <p className="headline-large-emphasized">
                {t("facultyStatsTitle")}
              </p>
              <div className="h-auto">
                <BarChartVerticalMulti data={comparedFacultyData} />
              </div>
            </section>
          )}
          {comparedTimeData.length > 0 && (
            <section className="flex flex-col space-y-8">
              <p className="headline-large-emphasized">{t("timeStatsTitle")}</p>
              <div className="h-auto w-full">
                <BarChartHorizontalMulti data={comparedTimeData} />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
