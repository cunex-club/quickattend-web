"use client";

import React from "react";
import { useState } from "react";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";
import { StatCard } from "@components/StatCard";
import Button from "@components/Button";
import { FilterableList } from "@components/dashboard/FilterableList";
import { facultyData, timeData } from "@utils/data";
import { useRole } from "@context/RoleContext";
import { toast } from "sonner";

const BarChartHorizontalMulti = dynamic(
  () =>
    import("@components/charts/BarChartHorizontalMulti").then((mod) => ({
      default: mod.BarChartHorizontalMulti,
    })),
  { ssr: false }
);

const BarChartVerticalMulti = dynamic(
  () =>
    import("@components/charts/BarChartVerticalMulti").then((mod) => ({
      default: mod.BarChartVerticalMulti,
    })),
  { ssr: false }
);

const PieChartWithLabel = dynamic(
  () =>
    import("@components/charts/PieChartWithLabel").then((mod) => ({
      default: mod.PieChartWithLabel,
    })),
  { ssr: false }
);

const canViewPage = (role: string) => {
  return role === "manager" || role === "owner";
};

export default function ComparePage() {
  const { role } = useRole();
  const [selectedFaculties, setSelectedFaculties] = useState<
    Record<string, boolean>
  >({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>(
    {}
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
      allItemId: string // ID of the "all" item (e.g., "f-0" or "t-0")
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
              <p className="title-medium-emphasized text-neutral-white -translate-y-[3px]">
                คุณสามารถเลือกได้สูงสุด 5 ตัวเลือก
              </p>,
              {
                style: {
                  background: "var(--error)",
                  color: "var(--neutral-white)",
                },
                duration: 1500,
              }
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
    "f-0"
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
        <p className="title-medium-emphasized text-neutral-white -translate-y-[3px]">
          กรุณาเลือกอย่างน้อยหนึ่งตัวเลือกเพื่อเปรียบเทียบข้อมูล
        </p>,
        {
          style: {
            background: "var(--error)",
            color: "var(--neutral-white)",
            width: "max-content",
          },
          duration: 1500,
        }
      );
      return;
    }

    // Check if both "All" options are selected
    if (selectedFaculties["f-0"] && selectedTimes["t-0"]) {
      toast.error(
        <p className="title-medium-emphasized text-neutral-white -translate-y-[3px]">
          ไม่สามารถเลือก "ทุกคณะ/หน่วยงาน" และ "ทุกช่วงเวลา" พร้อมกันได้ 
        </p>,
        {
          style: {
            background: "var(--error)",
            color: "var(--neutral-white)",
            width: "max-content",
          },
          duration: 2000,
        }
      );
      return;
    }

    toast.success(
      <p className="title-medium-emphasized text-neutral-white -translate-y-[3px]">
        กำลังเปรียบเทียบข้อมูล...
      </p>,
      {
        style: {
          background: "var(--success)",
          color: "var(--neutral-white)",
        },
        duration: 1500,
      }
    );
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-4 md:px-8 py-16 bg-neutral-white">
      <div className="container max-w-[1440px] flex flex-col items-center bg-neutral-white ">
        <div className="flex flex-col w-full rounded-xl bg-neutral-white space-y-16">
          <span className="mx-auto">
            <p className="display-small-emphasized">เปรียบเทียบข้อมูล</p>
          </span>

          {/* filter section */}
          <section className="w-full h-auto flex flex-col bg-neutral-200 p-8 sm:p-12 md:p-16 rounded-2xl space-y-8">
            <FilterableList
              title="คณะ/หน่วยงาน"
              items={facultyData}
              selectedItems={selectedFaculties}
              onCheckedChange={handleFacultyChange}
              hasDescription
            />
            <FilterableList
              title="ช่วงเวลา"
              items={timeData}
              selectedItems={selectedTimes}
              onCheckedChange={handleTimeChange}
              hasDescription
            />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <Button
                mode="outline"
                bordered="round"
                expanded={true}
                className="bg-transparent"
                onClick={handleClearSelection}
              >
                <p className="title-large-emphasized translate-y-[-6px]">
                  ล้างข้อมูล
                </p>
              </Button>
              <Button
                mode="filled"
                bordered="round"
                expanded={true}
                onClick={handleSubmitComparison}
              >
                <p className="title-large-emphasized translate-y-[-6px]">
                  เปรียบเทียบข้อมูล
                </p>
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="w-full">
              <StatCard
                title="จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด"
                value={860}
                unit="คน"
                variant="primary"
              >
                <div className="flex flex-col justify-center items-center gap-4">
                  <p className="title-medium-emphasized lg:title-large-emphasized">
                    จากจำนวนทั้งหมด 1096 คน
                  </p>
                </div>
              </StatCard>
            </div>
            <div className="w-full h-full">
              <PieChartWithLabel />
            </div>
          </section>
          <section className="flex flex-col space-y-8">
            <p className="headline-large-emphasized">
              สถิติการลงทะเบียนแยกตามคณะ/หน่วยงาน
            </p>
            <div className="h-auto">
              <BarChartVerticalMulti />
            </div>
          </section>
          <section className="flex flex-col space-y-8">
            <p className="headline-large-emphasized">
              สถิติการลงทะเบียนแยกตามช่วงเวลา
            </p>
            <div className="h-auto">
              <BarChartHorizontalMulti />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
