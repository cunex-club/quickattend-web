"use client";

import React from "react";
import { useState } from "react";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { StatCard } from "@components/StatCard";
import Button from "@components/Button";
import { FilterableList } from "@components/dashboard/FilterableList";
import {
  FilterFacultyOptions,
  FilterTimeOptions,
  chartDataForComparePage,
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
  //   if (isLoading) {
  //     return <div>Loading...</div>;
  //   }

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
  };
  const handleSubmitComparison = () => {
    if (
      Object.keys(selectedFaculties).length === 0 &&
      Object.keys(selectedTimes).length === 0
    ) {
      toast.error(
        <p className="title-medium-primary text-neutral-white">
          {t("minSelectionError")}
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
                value={860}
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
              <PieChartWithLabel />
            </div>
          </section>

          {/* Chart Section */}
          <section className="flex flex-col space-y-8">
            <p className="headline-large-emphasized">
              {t("facultyStatsTitle")}
            </p>
            <div className="h-auto">
              <BarChartVerticalMulti data={chartDataForComparePage} />
            </div>
          </section>
          <section className="flex flex-col space-y-8">
            <p className="headline-large-emphasized">{t("timeStatsTitle")}</p>
            <div className="h-auto w-full">
              <BarChartHorizontalMulti data={chartDataForComparePage} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
