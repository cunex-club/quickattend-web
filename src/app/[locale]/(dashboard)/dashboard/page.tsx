"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Button from "@components/Button";
import { BarChartHorizontalOverview } from "@components/charts/BarChartHorizontalOverview";
import { BarChartVerticalOverview } from "@components/charts/BarChartVerticalOverview";
import { StatCard } from "@components/StatCard";
import { eventData } from "@utils/data";
import FullscreenContent from "@components/dashboard/FullScreenContent";

const event = eventData;

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

  const handleCopyEventLink = () => {
    const eventLink = `${window.location.origin}/events/${event.id}`;
    alert(`ลิงก์กิจกรรม: ${eventLink} คัดลอกไปยังคลิปบอร์ดแล้ว`);
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
            <div className="flex flex-col space-y-8">
              <div className="flex justify-between">
                <p className="headline-large-emphasized">{event.title}</p>
                <button
                  className="h-10 w-10 border-2 border-primary rounded-full"
                  onClick={handleCopyEventLink}
                ></button>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="px-4 space-y-2 body-medium-primary">
                  <span className="flex flex-row space-x-2">
                    <div className="w-5 h-5 bg-primary rounded-full"></div>
                    <p>{event.date}</p>
                  </span>
                  <span className="flex flex-row space-x-2">
                    <div className="w-5 h-5 bg-primary rounded-full"></div>
                    <p>{event.time}</p>
                  </span>
                  <span className="flex flex-row space-x-2">
                    <div className="w-5 h-5 bg-primary rounded-full"></div>
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
                  <p className="label-large-emphasized translate-y-1">
                    ดูเต็มหน้าจอ
                  </p>
                </Button>
              </div>
            </div>
            <div className="h-full w-full">
              <StatCard
                title="จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด"
                value={1096}
                unit="คน"
                variant="primary"
              />
            </div>
          </section>

          {/* chart section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 border">
            <div className="space-y-6">
              <p className="headline-large-emphasized">
                3 อันดับแรกของคณะ/หน่วยงานที่ลงทะเบียน
              </p>
              <BarChartVerticalOverview />
              <Button mode="filled" bordered="square" expanded={false}>
                <p className="label-large-emphasized translate-y-1">
                  ดูทั้งหมด
                </p>
              </Button>
            </div>
            <div className="flex flex-col space-y-6">
              <p className="headline-large-emphasized">
                สถิติการลงทะเบียนแยกตามช่วงเวลา
              </p>
              <div className="h-full">
                <BarChartHorizontalOverview />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* full screen container */}
      <div
        ref={fullscreenContainerRef}
        className={
          `w-full h-full bg-white` +
          (isFullscreen ? "fixed inset-0 z-50" : "hidden")
        }
      >
        {isFullscreen && (
          <FullscreenContent onExit={handleToggleFullscreen} data={event} />
        )}
      </div>
    </div>
  );
}
