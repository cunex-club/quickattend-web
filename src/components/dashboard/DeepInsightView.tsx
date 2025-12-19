"use client";

import Button from "@components/Button";
import React from "react";
import StatCard from "@components/StatCard";
import Link from "next/link";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@assets/components/ui/skeleton";

// Dynamically import heavy chart components
const BarChartHorizontal = dynamic(
  () => import("@components/charts/BarChartHorizontal").then((mod) => mod.BarChartHorizontal),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
    ssr: false,
  }
);

const BarChartVertical = dynamic(
  () => import("@components/charts/BarChartVertical").then((mod) => mod.BarChartVertical),
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
import { FilterableList } from "./FilterableList";
import {
  dataCategorizeByFaculty,
  dataCategorizeByTime,
  facultyData,
  timeData,
  eventData,
} from "@utils/data";
import SortMenu from "@components/sort-menu";

const verticalChartData = dataCategorizeByFaculty;
const horizontalChartData = dataCategorizeByTime;

export function DeepInsightView() {
  const [selectedFilter, setSelectedFilter] = useState<
    "student" | "staff" | null
  >(null);
  const [selectedFaculties, setSelectedFaculties] = useState<
    Record<string, boolean>
  >({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>(
    {},
  );
  const createSelectionHandler =
    (
      setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
      allItemId: string,
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
    "f-0",
  );
  const handleTimeChange = createSelectionHandler(setSelectedTimes, "t-0");

  const handleClearFilters = () => {
    setSelectedFaculties({});
    setSelectedTimes({});
  };

  const handleSortChange = (value: string) => {
  };

  return (
    <div className="w-full rounded-xl bg-neutral-white space-y-16">
      <section className="flex justify-between">
        <div className="space-x-4">
          <Button
            mode={selectedFilter === null ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() => setSelectedFilter(null)}
          >
            <p className="label-large-emphasized">ทั้งหมด</p>
          </Button>
          <Button
            mode={selectedFilter === "student" ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() => setSelectedFilter("student")}
          >
            <p className="label-large-emphasized">นิสิต</p>
          </Button>
          <Button
            mode={selectedFilter === "staff" ? "filled" : "outline"}
            bordered="square"
            expanded={false}
            onClick={() => setSelectedFilter("staff")}
          >
            <p className="label-large-emphasized">บุคลากร</p>
          </Button>
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button mode="filled" bordered="square" expanded={false}>
                <p className="label-large-emphasized">ตัวกรอง</p>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-screen max-w-md p-8" align="end">
              <div>
                <div className="flex flex-col space-y-8">
                  <p className="headline-large-emphasized mx-auto">
                    ตัวกรองข้อมูล
                  </p>
                  <FilterableList
                    title="คณะ/หน่วยงาน"
                    items={facultyData}
                    selectedItems={selectedFaculties}
                    onCheckedChange={handleFacultyChange}
                    filterVariant="secondary"
                  />

                  <FilterableList
                    title="ช่วงเวลา"
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
                        ล้างตัวกรอง
                      </p>
                    </Button>

                    <PopoverClose asChild>
                      <Button mode="filled" bordered="round" expanded={true}>
                        <p className="title-large-emphasized translate-y-[-6px]">
                          กรองข้อมูล
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

      <div className="h-[250px] md:h-[450px] w-full">
        <StatCard
          title="จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด"
          value={eventData.totalAttendees}
          unit="คน"
          variant="primary"
        >
          <div className="mt-4 hidden md:flex justify-center items-center px-8">
            <span className="headline-small-emphasized pr-2 md:pr-16 text-center">
              นิสิต: {eventData.studentCount} คน
            </span>
            <div className="inline-block w-0.5 self-stretch bg-neutral-100"></div>
            <span className="headline-small-emphasized pl-2 md:pl-16 text-center">
              บุคลากร: {eventData.staffCount} คน
            </span>
          </div>
        </StatCard>
      </div>

      <section className="flex flex-col space-y-8">
        <div className="flex justify-between">
          <p className="headline-small-emphasized md:headline-large-emphasized">
            สถิติการลงทะเบียนแยกตามคณะ/หน่วยงาน
          </p>
          <SortMenu
            options={[
              {
                label: "วันที่จัดกิจกรรม : ใหม่สุด - เก่าสุด",
                value: "newest",
              },
              {
                label: "วันที่จัดกิจกรรม : เก่าสุด - ใหม่สุด",
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
          สถิติการลงทะเบียนแยกตามช่วงเวลา
        </p>
        <div className="w-full h-full">
          <BarChartHorizontal data={horizontalChartData} />
        </div>
      </section>

      <Link href="/dashboard-compare" target="_blank">
        <Button mode="filled" bordered="square" expanded={false}>
          <p className="title-medium-emphasized translate-y-[-2px]">
            เปรียบเทียบสถิติการลงทะเบียนเข้าร่วมกิจกรรม
          </p>
        </Button>
      </Link>
    </div>
  );
}
