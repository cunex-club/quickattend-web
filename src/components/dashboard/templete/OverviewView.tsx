"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Button from "@components/Button";
import { StatCard } from "@components/StatCard";
import IonIcon from "@shared/IonIcon";
import { toast } from "sonner";
import { Skeleton } from "@assets/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useRole } from "@context/RoleContext";
import { eventData } from "@utils/data";

// Lazy load charts for better initial page load performance
const BarChartHorizontalOverview = dynamic(
  () =>
    import("@components/charts/BarChartHorizontalOverview").then((mod) => ({
      default: mod.BarChartHorizontalOverview,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[300px] w-full rounded-lg" />,
  }
);

const BarChartVerticalOverview = dynamic(
  () =>
    import("@components/charts/BarChartVerticalOverview").then((mod) => ({
      default: mod.BarChartVerticalOverview,
    })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-lg" />,
  }
);

// Only load FullscreenContent when needed (after user clicks button)
const FullscreenContent = dynamic(
  () => import("@components/dashboard/FullScreenContent"),
  { ssr: false }
);

const mockEvent = eventData;

const mockTop3 = [
  { faculty: "วิศวกรรมศาสตร์", student: 320, staff: 70 },
  { faculty: "บริหารธุรกิจ", student: 210, staff: 60 },
  { faculty: "วิทยาศาสตร์", student: 180, staff: 45 },
].map((item) => ({ ...item, total: item.student + item.staff }));

const mockTime = [
  { time: "08:00", student: 35, staff: 18 },
  { time: "09:00", student: 68, staff: 22 },
  { time: "10:00", student: 94, staff: 26 },
  { time: "08:00", student: 35, staff: 18 },
  { time: "09:00", student: 68, staff: 22 },
  { time: "10:00", student: 94, staff: 26 },
  { time: "11:00", student: 86, staff: 24 },
  { time: "12:00", student: 72, staff: 23 },
  { time: "13:00", student: 78, staff: 26 },
  { time: "14:00", student: 82, staff: 28 },
  { time: "15:00", student: 71, staff: 25 },
  { time: "16:00", student: 64, staff: 18 },
  { time: "17:00", student: 50, staff: 20 },
].map((item) => ({ ...item, total: item.student + item.staff }));

const maxTimeValue = Math.max(...mockTime.map((item) => item.total));

export function OverviewView() {
  const t = useTranslations("Dashboard.overview");
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<
    "student" | "staff" | null
  >(null);
  const { role } = useRole();
  const canViewInsights = role === "manager" || role === "owner";

  const filteredTime = useMemo(
    () =>
      mockTime.map((item) => ({
        time: item.time,
        total:
          selectedFilter === "student"
            ? item.student
            : selectedFilter === "staff"
              ? item.staff
              : item.total,
      })),
    [selectedFilter]
  );

  const eventTotal = mockEvent.totalAttendees;

  const handleToggleFullscreen = useCallback(() => {
    if (!fullscreenContainerRef.current) return;
    if (!document.fullscreenElement) {
      fullscreenContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  const handleViewInsights = () => {
    if (canViewInsights) {
      router.push("./dashboard/insights");
    }
  };

  const handleCopyEventLink = async () => {
    const eventLink = `${window.location.origin}/events/${mockEvent.id}`;
    try {
      await navigator.clipboard.writeText(eventLink);
      toast.success(
        <p className="title-medium-primary text-neutral-white">
          {t("linkCopied")}
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
        <p className="title-medium-primary text-neutral-white">
          {t("linkCopyFailed")}
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
    <div className="relative">
      {!isFullscreen && (
        <div className="flex flex-col space-y-8">
          {/* event information section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-6 order-2 lg:order-1">
              <div className="flex justify-between items-center">
                <p className="headline-large-emphasized">{mockEvent.title}</p>
                <button
                  className="border border-primary rounded-full w-auto h-auto p-0.5 hover:bg-neutral-100 transition-colors duration-200 cursor-pointer"
                  onClick={handleCopyEventLink}
                >
                  <IonIcon name="Link" size="20px" className="text-primary" />
                </button>
              </div>
              <div className="flex flex-col space-y-4">
                <div className="px-4 space-y-0 body-medium-primary">
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Calendar"
                      size="20px"
                      className="text-primary"
                    />
                    <p>{mockEvent.date}</p>
                  </span>
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Time"
                      size="20px"
                      className="text-secondary"
                    />
                    <p>{mockEvent.time}</p>
                  </span>
                  <span className="flex flex-row space-x-2 items-center">
                    <IonIcon
                      name="Location"
                      size="20px"
                      className="text-primary"
                    />
                    <p>{mockEvent.location}</p>
                  </span>
                </div>
                <div className="flex flex-col space-y-2 px-4 ">
                  <p className="headline-small-emphasized">
                    {t("eventDetails")}
                  </p>
                  <p className="body-large-primary">{mockEvent.description}</p>
                </div>
              </div>

              <div>
                <Button
                  mode="filled"
                  bordered="square"
                  expanded={false}
                  onClick={handleToggleFullscreen}
                >
                  <p className="label-large-emphasized">
                    {t("viewFullscreen")}
                  </p>
                </Button>
              </div>
            </div>
            <div className="h-full w-full order-1 lg:order-2">
              <StatCard
                title={t("totalAttendees")}
                value={eventTotal}
                unit={t("unit")}
                variant="filled"
                className="p-8 min-h-[230px]"
              />
            </div>
          </section>

          {/* chart section */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-6 md:space-y-4">
              <p className="headline-medium-emphasized">{t("top3Title")}</p>
              <div className="max-h-[280px] md:max-h-[320px]">
                <BarChartVerticalOverview data={mockTop3} />
              </div>
              <Button
                mode="filled"
                bordered="square"
                expanded={false}
                disabled={!canViewInsights}
                onClick={handleViewInsights}
                className={
                  !canViewInsights ? "opacity-50 cursor-not-allowed" : ""
                }
              >
                <p className="label-large-emphasized">{t("viewAll")}</p>
              </Button>
            </div>
            <div className="flex flex-col space-y-3 md:space-y-4">
              <p className="headline-medium-emphasized">
                {t("timeStatsTitle")}
              </p>
              <div className="w-full relative">
                <div className="h-[400px] md:h-[360px] lg:h-[350px] xl:max-h-[320px] overflow-auto">
                  <BarChartHorizontalOverview
                    data={filteredTime}
                    maxValue={maxTimeValue}
                  />
                </div>
                <div className="absolute z-10 right-0 top-0">
                  <div className="space-x-4 bg-transparent">
                    <Button
                      mode={selectedFilter === "student" ? "filled" : "outline"}
                      bordered="square"
                      expanded={false}
                      onClick={() =>
                        setSelectedFilter(
                          selectedFilter === "student" ? null : "student"
                        )
                      }
                    >
                      <p className="label-large-emphasized">{t("student")}</p>
                    </Button>
                    <Button
                      mode={selectedFilter === "staff" ? "filled" : "outline"}
                      bordered="square"
                      expanded={false}
                      onClick={() =>
                        setSelectedFilter(
                          selectedFilter === "staff" ? null : "staff"
                        )
                      }
                    >
                      <p className="label-large-emphasized">{t("staff")}</p>
                    </Button>
                  </div>
                </div>
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
          <FullscreenContent
            onExit={handleToggleFullscreen}
            data={mockEvent}
            translations={{
              eventDetails: t("eventDetails"),
              totalAttendees: t("totalAttendees"),
              unit: t("unit"),
            }}
          />
        )}
      </div>
    </div>
  );
}
