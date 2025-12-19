"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Button from "@components/Button";
import { StatCard } from "@components/StatCard";
import { chartDataID1, chartDataMonthID1, eventData } from "@utils/data";
import IonIcon from "@components/IonIcon";
import { toast } from "sonner";
import { Skeleton } from "@assets/components/ui/skeleton";

// Lazy load charts for better initial page load performance
const BarChartHorizontalOverview = dynamic(
  () => import("@components/charts/BarChartHorizontalOverview").then(mod => ({
    default: mod.BarChartHorizontalOverview
  })),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />
  }
);

const BarChartVerticalOverview = dynamic(
  () => import("@components/charts/BarChartVerticalOverview").then(mod => ({
    default: mod.BarChartVerticalOverview
  })),
  { 
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />
  }
);

// Only load FullscreenContent when needed (after user clicks button)
const FullscreenContent = dynamic(
  () => import("@components/dashboard/FullScreenContent"),
  { ssr: false }
);

const event = eventData;
const chartDataTop3 = chartDataID1;
const chartDataTime = chartDataMonthID1;

export default function OverviewPage() {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);

  const handleToggleFullscreen = useCallback(() => {
    if (!fullscreenContainerRef.current) return;
    if (!document.fullscreenElement) {
      fullscreenContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleCopyEventLink = async () => {
    const eventLink = `${window.location.origin}/events/${event.id}`;
    try {
      await navigator.clipboard.writeText(eventLink);
      toast.success(
        <p className="title-medium-emphasized text-neutral-white -translate-y-[3px]">
          คัดลอกลิงก์กิจกรรมเรียบร้อยแล้ว
        </p>,
        {
          style: {
            background: "var(--success)",
            color: "var(--neutral-white)",
          },
          duration: 1500,
        }
      );
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error(
        <p className="title-medium-emphasized text-neutral-white -translate-y-[3px]">
          ไม่สามารถคัดลอกลิงก์ได้
        </p>,
        {
          style: {
            background: "var(--error)",
            color: "var(--neutral-white)",
          },
          duration: 1500,
        }
      );
    }
  };

  useEffect(() => {
    // Sync React state with browser fullscreen state
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {!isFullscreen && (
        <div className="flex flex-col space-y-16">
          {/* event information section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-8 order-2 md:order-1">
              <div className="flex justify-between">
                <p className="headline-large-emphasized">{event.title}</p>
                <button
                  className="border border-primary rounded-full w-auto h-auto p-0.5 hover:bg-neutral-100 transition-colors duration-200"
                  onClick={handleCopyEventLink}
                >
                  <IonIcon name="Link" size="20px" className="text-primary" />
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="px-4 space-y-0 body-medium-primary ">
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Calendar"
                      size="20px"
                      className="text-primary"
                    />
                    <p>{event.date}</p>
                  </span>
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Time"
                      size="20px"
                      className="text-secondary"
                    />
                    <p>{event.time}</p>
                  </span>
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Location"
                      size="20px"
                      className="text-primary"
                    />
                    <p>{event.location}</p>
                  </span>
                </div>
                <div className="flex flex-col space-y-2 px-4 ">
                  <p className="headline-small-emphasized">รายละเอียดกิจกรรม</p>
                  <p className="body-large-primary">{event.description}</p>
                </div>
              </div>

              <div>
                <Button
                  mode="filled"
                  bordered="square"
                  expanded={false}
                  onClick={handleToggleFullscreen}
                >
                  <p className="label-large-emphasized">ดูเต็มหน้าจอ</p>
                </Button>
              </div>
            </div>
            <div className="h-full w-full order-1 md:order-2">
              <StatCard
                title="จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด"
                value={event.totalAttendees}
                unit="คน"
                variant="primary"
              />
            </div>
          </section>

          {/* chart section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <p className="headline-large-emphasized">
                3 อันดับแรกของคณะ/หน่วยงานที่ลงทะเบียน
              </p>
              <BarChartVerticalOverview data={chartDataTop3} />
              <Button mode="filled" bordered="square" expanded={false}>
                <p className="label-large-emphasized">ดูทั้งหมด</p>
              </Button>
            </div>
            <div className="flex flex-col space-y-6">
              <p className="headline-large-emphasized">
                สถิติการลงทะเบียนแยกตามช่วงเวลา
              </p>
              <div className="h-full">
                <BarChartHorizontalOverview data={chartDataTime} />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* full screen container */}
      <div
        ref={fullscreenContainerRef}
        className={isFullscreen ? "w-full h-full bg-white" : "hidden"}
      >
        {isFullscreen && (
          <FullscreenContent onExit={handleToggleFullscreen} data={event} />
        )}
      </div>
    </div>
  );
}
