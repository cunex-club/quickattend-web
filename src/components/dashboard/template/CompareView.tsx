"use client";

import React from "react";
import { useMemo } from "react";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { StatCard } from "@components/StatCard";
import Button from "@components/Button";
import { FilterableList } from "@components/dashboard/FilterableList";
import { FilterFacultyOptions, FilterTimeOptions } from "@utils/data";
import { useRole } from "@context/RoleContext";
import { toast } from "sonner";
import { Skeleton } from "@assets/components/ui/skeleton";
import { useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import Link from "next/link";
import { useFilterLogic } from "@hooks/useFilterLogic";
import {
  transformFacultyDataForComparison,
  transformTimeDataForComparison,
  calculateSummaryStats,
  preparePieChartData,
} from "@utils/compareHelpers";

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
    maxSelectionLimit: 5,
  });

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

    handleApplyFilters();

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
  const comparedFacultyData = useMemo(
    () => transformFacultyDataForComparison(appliedFaculties, appliedTimes),
    [appliedFaculties, appliedTimes],
  );

  // Filter and transform time data for comparison
  const comparedTimeData = useMemo(
    () => transformTimeDataForComparison(appliedFaculties, appliedTimes),
    [appliedFaculties, appliedTimes],
  );

  const summaryStats = useMemo(
    () => calculateSummaryStats(appliedFaculties, appliedTimes),
    [appliedFaculties, appliedTimes],
  );

  const pieChartData = useMemo(
    () => preparePieChartData(appliedFaculties, appliedTimes),
    [appliedFaculties, appliedTimes],
  );

  if (!canViewPage(role)) {
    redirect("/dashboard");
    return null;
  }

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
                    onClick={handleClearFilters}
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
                value={summaryStats.totalRegistered.toLocaleString("en-US")}
                unit={t("unit")}
                variant="outline"
                switchNumberPosition={true}
                mobileLeftAlign={true}
              >
                <div className="flex flex-col justify-center items-center gap-4 mt-2">
                  <p className="title-medium-emphasized lg:title-large-emphasized text-center">
                    {t("outOfTotal")}{" "}
                    {summaryStats.totalRegistered +
                      summaryStats.totalUnregistered}{" "}
                    {t("unit")}
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
