"use client";

import { useState, useEffect } from "react";
import EventCard from "@modules/events/main-page/components/event-card";
import EventCardSkeleton from "@modules/events/main-page/components/event-card-skeleton";
import EventEmptyState from "@modules/events/main-page/components/event-empty-state";
import SortMenu from "@modules/events/main-page/components/sort-menu";
import FilterMenu, {
  FilterValues,
} from "@modules/events/main-page/components/filter-menu";
import Pagination from "@shared/Pagination";
import { useTranslations } from "next-intl";

import { Link } from "@i18n/navigation";
import IonIcon from "@shared/IonIcon";
import { fetchManagedEvents, fetchAttendedEvents } from "@services/events";
import type { GetEventsRes, APIPagination } from "@customTypes/events";

const EventPageTemplate = () => {
  const t = useTranslations("Events");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [managedEvents, setManagedEvents] = useState<GetEventsRes[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<GetEventsRes[]>([]);
  const [attendedPagination, setAttendedPagination] =
    useState<APIPagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Separate current and past managed events
  const currentManagedEvents = managedEvents.filter(
    (event) => new Date(event.end_time) >= new Date(),
  );
  const pastManagedEvents = managedEvents.filter(
    (event) => new Date(event.end_time) < new Date(),
  );

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const [managedRes, attendedRes] = await Promise.all([
          fetchManagedEvents(),
          fetchAttendedEvents(currentPage),
        ]);

        console.log("Managed Events:", managedRes.data);
        console.log("Attended Events:", attendedRes.data);

        setManagedEvents(managedRes.data);
        setAttendedEvents(attendedRes.data);
        if (attendedRes.meta?.pagination) {
          setAttendedPagination(attendedRes.meta.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [currentPage]);

  const totalPages = attendedPagination
    ? Math.ceil(attendedPagination.total / attendedPagination.pageSize)
    : 1;

  const handleMyEventsFilterChange = (values: FilterValues) => {
    console.log("กิจกรรมของฉัน filter:", {
      accessRights: values.accessRights,
      date: values.date?.toLocaleDateString("th-TH"),
    });
  };

  const handleMyEventsSortChange = (value: string) => {
    setSortOrder(value);
    console.log("กิจกรรมของฉัน sort:", value);
  };

  const handlePastEventsFilterChange = (values: FilterValues) => {
    console.log("กิจกรรมที่ผ่านมา filter:", {
      accessRights: values.accessRights,
      date: values.date?.toLocaleDateString("th-TH"),
    });
  };

  const handlePastEventsSortChange = (value: string) => {
    console.log("กิจกรรมที่ผ่านมา sort:", value);
  };

  return (
    <div className="w-full h-full px-6 py-8 lg:px-24 lg:py-24 pb-30 space-y-8 lg:space-y-16">
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="headline-small-emphasized lg:display-medium-emphasized">
            {t("myEvents")}
          </div>
          <Link href="/search" className="lg:hidden text-primary p-1">
            <IonIcon name="SearchOutline" className="w-6 h-6" />
          </Link>
          <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-1 lg:gap-2.25">
            <FilterMenu onFilterChange={handleMyEventsFilterChange} />
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
              onSelect={handleMyEventsSortChange}
            />
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : currentManagedEvents.length === 0 ? (
          <EventEmptyState
            iconName="AlbumsOutline"
            title="ยังไม่มีกิจกรรมที่เข้าร่วม"
            description="เริ่มเข้าร่วมกิจกรรม เพื่อสร้างประวัติและประสบการณ์ของคุณ"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentManagedEvents.map((event) => {
              const start = new Date(event.start_time);
              const end = new Date(event.end_time);
              const isEnd = end < new Date();
              const dateStr = start.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              const timeStr = `${start.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.`;

              return (
                <EventCard
                  key={event.id}
                  eventId={event.id}
                  title={event.name}
                  description={event.description ?? ""}
                  date={dateStr}
                  time={timeStr}
                  location={event.location}
                  role={event.role ?? ""}
                  isEnd={isEnd}
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="space-y-8">
        <div className="flex justify-between items-center gap-4">
          <div className="headline-small-emphasized lg:display-medium-emphasized">
            {t("pastEvents")}
          </div>
          <div className="flex flex-wrap items-center gap-1 lg:gap-2.25">
            <FilterMenu onFilterChange={handlePastEventsFilterChange} />
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
              onSelect={handlePastEventsSortChange}
            />
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EventCardSkeleton isEnd />
            <EventCardSkeleton isEnd />
          </div>
        ) : pastManagedEvents.length === 0 && attendedEvents.length === 0 ? (
          <EventEmptyState
            iconName="TimerOutline"
            title="ยังไม่มีกิจกรรมที่ผ่านมา"
            description={
              <>
                เมื่อคุณเข้าร่วมและทำกิจกรรมสำเร็จ
                ประวัติและประสบการณ์ทั้งหมดของคุณจะแสดงที่นี่
              </>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {[...pastManagedEvents, ...attendedEvents].map((event) => {
              const start = new Date(event.start_time);
              const end = new Date(event.end_time);
              const isEnd = end < new Date();
              const dateStr = start.toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              const timeStr = `${start.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.`;

              return (
                <EventCard
                  key={event.id}
                  eventId={event.id}
                  title={event.name}
                  description={event.description ?? ""}
                  date={dateStr}
                  time={timeStr}
                  location={event.location}
                  role={event.role ?? ""}
                  isEnd={isEnd}
                />
              );
            })}
          </div>
        )}
      </div>
      <div className="flex justify-center pt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default EventPageTemplate;
