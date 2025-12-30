"use client";

import Button from "@components/Button";
import React from "react";
import StatCard from "@components/StatCard";
import Link from "next/link";
import { useState } from "react";
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
  () => import("../charts/DonutChart").then((mod) => mod.DonutChart),
  {
    loading: () => <Skeleton className="h-full w-full rounded-lg" />,
    ssr: false,
  }
);

const BarChartVerticalStacked = dynamic(
  () =>
    import("../charts/BarChartVerticalStacked").then(
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
import { FilterableList } from "./FilterableList";
import {
  dataCategorizeByTime,
  facultyData,
  registeredData,
  registrationStatusData,
  timeData,
} from "@utils/data";
import SortMenu from "@components/sort-menu";
import IonIcon from "@components/IonIcon";

const horizontalChartData = dataCategorizeByTime;
const verticalStackData = registeredData;
const donutChartData = registrationStatusData;

export function WhitelistInsightView() {
  const t = useTranslations("Dashboard.insights");
  const [selectedFilter, setSelectedFilter] = useState<
    "student" | "staff" | null
  >(null);
  const [selectedFaculties, setSelectedFaculties] = useState<
    Record<string, boolean>
  >({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>(
    {}
  );
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
  };

  const handleSortChange = (value: string) => {};

  return (
    <div className="w-full rounded-xl bg-neutral-white space-y-16">
      <section className="flex justify-between">
        <div className="space-x-4 flex items-center">
          <Button
            mode={selectedFilter === null ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() => setSelectedFilter(null)}
          >
            <p className="label-large-emphasized">{t("all")}</p>
          </Button>
          <Button
            mode={selectedFilter === "student" ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() => setSelectedFilter("student")}
          >
            <p className="label-large-emphasized">{t("student")}</p>
          </Button>
          <Button
            mode={selectedFilter === "staff" ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() => setSelectedFilter("staff")}
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
                      <p className="title-large-emphasized translate-y-[-6px]">
                        {t("clearFilter")}
                      </p>
                    </Button>

                    <PopoverClose asChild>
                      <Button mode="filled" bordered="round" expanded={true}>
                        <p className="title-large-emphasized translate-y-[-6px]">
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
          <div className="h-[250px] md:h-[450px] w-full">
            <StatCard
              title={t("totalAttendees")}
              value={500}
              unit={t("unit")}
              variant="primary-outline"
            >
              <div className="mt-0 md:mt-4 hidden md:flex justify-center items-center px-8">
                <span className="headline-small-emphasized pr-4 sm:pr-10 md:pr-16 text-center">
                  {t("students")}: 455 {t("unit")}
                </span>
                <div className="inline-block w-0.5 self-stretch bg-neutral-400"></div>
                <span className="headline-small-emphasized pl-4 sm:pl-10 md:pl-16 text-center">
                  {t("staffs")}: 5 {t("unit")}
                </span>
              </div>
            </StatCard>
          </div>
          <div className="w-full">
            <DonutChart data={donutChartData} />
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 min-h-[400px] gap-8">
          <div className="h-full w-full">
            <StatCard
              title={t("totalEligible")}
              value={600}
              unit={t("unit")}
              variant="secondary"
            />
          </div>
          <div className="h-full w-full">
            <StatCard
              title={t("totalUnregistered")}
              value={100}
              unit={t("unit")}
              variant="secondary"
            />
          </div>
        </section>
      </div>

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

      <Link href="/dashboard-compare" target="_blank">
        <Button mode="filled" bordered="square" expanded={false}>
          <p className="title-medium-emphasized translate-y-[-2px]">
            {t("compareButton")}
          </p>
        </Button>
      </Link>
    </div>
  );
}
