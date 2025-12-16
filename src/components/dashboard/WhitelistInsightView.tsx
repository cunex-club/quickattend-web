"use client";

import Button from "@components/Button";
import { BarChartHorizontal } from "@components/charts/BarChartHorizontal";
import { DonutChart } from "../charts/DonutChart";
import React from "react";
import StatCard from "@components/StatCard";
import Link from "next/dist/client/link";
import { useState } from "react";
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
import { BarChartVerticalStacked } from "../charts/BarChartVerticalStacked";
import SortMenu from "@components/sort-menu";

const horizontalChartData = dataCategorizeByTime;
const verticalStackData = registeredData;
const donutChartData = registrationStatusData;

export function WhitelistInsightView() {
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
    console.log("sort:", value);
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

      <div className="flex flex-col space-y-8">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-[250px] md:h-[450px] w-full">
            <StatCard
              title="จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด"
              value={500}
              unit="คน"
              variant="primary"
            >
              <div className="mt-4 hidden md:flex justify-center items-center px-8">
                <span className="headline-small-emphasized pr-4 sm:pr-10 md:pr-16 text-center">
                  นิสิต: 455 คน
                </span>
                <div className="inline-block w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div>
                <span className="headline-small-emphasized pl-4 sm:pl-10 md:pl-16 text-center">
                  บุคลากร: 5 คน
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
              title="จำนวนผู้มีสิทธิลงทะเบียนเข้าร่วมกิจกรรม"
              value={600}
              unit="คน"
              variant="secondary"
              className="shadow-elevation-4"
            />
          </div>
          <div className="h-full w-full">
            <StatCard
              title="จำนวนผู้ที่ยังไม่ได้ลงทะเบียนเข้าร่วมกิจกรรม"
              value={100}
              unit="คน"
              variant="secondary"
              className="shadow-elevation-4"
            />
          </div>
        </section>
      </div>

      <section className="flex flex-col space-y-8">
        <div className="flex justify-between">
          <p className="headline-small-emphasized sm:headline-medium-emphasized md:headline-large-emphasized">
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
          <BarChartVerticalStacked data={verticalStackData} />
        </div>
      </section>

      <section className="flex flex-col space-y-8 mb-0sm:mb-10">
        <p className="headline-small-emphasized sm:headline-medium-emphasized md:headline-large-emphasized">
          สถิติการลงทะเบียนแยกตามช่วงเวลา
        </p>
        <div>
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
