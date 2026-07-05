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

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const FILTERS_STORAGE_KEY = "cunex_events_filters_v1";

interface StoredFiltersState {
  myEventsFilter: FilterValues;
  myEventsSort: string;
  pastEventsFilter: FilterValues;
  pastEventsSort: string;
}

const loadStoredFilters = (): StoredFiltersState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      myEventsFilter: {
        accessRights: parsed.myEventsFilter?.accessRights ?? [],
        date: parsed.myEventsFilter?.date
          ? new Date(parsed.myEventsFilter.date)
          : undefined,
      },
      myEventsSort: parsed.myEventsSort ?? "newest",
      pastEventsFilter: {
        accessRights: parsed.pastEventsFilter?.accessRights ?? [],
        date: parsed.pastEventsFilter?.date
          ? new Date(parsed.pastEventsFilter.date)
          : undefined,
      },
      pastEventsSort: parsed.pastEventsSort ?? "newest",
    };
  } catch {
    return null;
  }
};

const applyFilterAndSort = (
  events: GetEventsRes[],
  filter: FilterValues,
  sortOrder: string,
) => {
  let result = events;

  if (filter.accessRights.length > 0) {
    result = result.filter((event) =>
      filter.accessRights.some(
        (right) => event.role?.toLowerCase() === right.toLowerCase(),
      ),
    );
  }

  if (filter.date) {
    result = result.filter((event) =>
      isSameDay(new Date(event.start_time), filter.date!),
    );
  }

  return [...result].sort((a, b) => {
    const diff =
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    return sortOrder === "oldest" ? diff : -diff;
  });
};

const EventPageTemplate = () => {
  const t = useTranslations("Events");
  const [currentPage, setCurrentPage] = useState(1);

  const [managedEvents, setManagedEvents] = useState<GetEventsRes[]>([]);
  const [attendedEvents, setAttendedEvents] = useState<GetEventsRes[]>([]);
  const [attendedPagination, setAttendedPagination] =
    useState<APIPagination | null>(null);
  const [loading, setLoading] = useState(true);

  const [myEventsFilter, setMyEventsFilter] = useState<FilterValues>(
    () =>
      loadStoredFilters()?.myEventsFilter ?? {
        accessRights: [],
        date: undefined,
      },
  );
  const [myEventsSort, setMyEventsSort] = useState(
    () => loadStoredFilters()?.myEventsSort ?? "newest",
  );
  const [pastEventsFilter, setPastEventsFilter] = useState<FilterValues>(
    () =>
      loadStoredFilters()?.pastEventsFilter ?? {
        accessRights: [],
        date: undefined,
      },
  );
  const [pastEventsSort, setPastEventsSort] = useState(
    () => loadStoredFilters()?.pastEventsSort ?? "newest",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const state: StoredFiltersState = {
      myEventsFilter,
      myEventsSort,
      pastEventsFilter,
      pastEventsSort,
    };
    sessionStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(state));
  }, [myEventsFilter, myEventsSort, pastEventsFilter, pastEventsSort]);

  // Separate current and past managed events
  const currentManagedEvents = managedEvents.filter(
    (event) => new Date(event.end_time) >= new Date(),
  );
  const pastManagedEvents = managedEvents.filter(
    (event) => new Date(event.end_time) < new Date(),
  );

  const filteredCurrentManagedEvents = applyFilterAndSort(
    currentManagedEvents,
    myEventsFilter,
    myEventsSort,
  );
  const filteredPastEvents = applyFilterAndSort(
    [...pastManagedEvents, ...attendedEvents],
    pastEventsFilter,
    pastEventsSort,
  );

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const [managedRes, attendedRes] = await Promise.all([
          fetchManagedEvents(),
          fetchAttendedEvents(currentPage),
        ]);

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
    setMyEventsFilter(values);
  };

  const handleMyEventsSortChange = (value: string) => {
    setMyEventsSort(value);
  };

  const handlePastEventsFilterChange = (values: FilterValues) => {
    setPastEventsFilter(values);
  };

  const handlePastEventsSortChange = (value: string) => {
    setPastEventsSort(value);
  };

  return (
    <div className="w-full h-full px-6 py-8 lg:px-24 lg:py-24 pb-30 space-y-8 lg:space-y-16">
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="headline-small-emphasized lg:display-medium-emphasized">
            {t("myEvents")}
          </div>
          <div className="hidden lg:flex lg:flex-wrap lg:items-center lg:gap-1 lg:gap-2.25">
            <FilterMenu
              menuId="my-events-filter"
              onFilterChange={handleMyEventsFilterChange}
              initialFilter={myEventsFilter}
            />
            <SortMenu
              menuId="my-events-sort"
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
              value={myEventsSort}
              onSelect={handleMyEventsSortChange}
            />
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : filteredCurrentManagedEvents.length === 0 ? (
          <EventEmptyState
            iconName="AlbumsOutline"
            title="ยังไม่มีกิจกรรมที่เข้าร่วม"
            description="เริ่มเข้าร่วมกิจกรรม เพื่อสร้างประวัติและประสบการณ์ของคุณ"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCurrentManagedEvents.map((event) => {
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
            <FilterMenu
              menuId="past-events-filter"
              onFilterChange={handlePastEventsFilterChange}
              initialFilter={pastEventsFilter}
            />
            <SortMenu
              menuId="past-events-sort"
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
              value={pastEventsSort}
              onSelect={handlePastEventsSortChange}
            />
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EventCardSkeleton isEnd />
            <EventCardSkeleton isEnd />
          </div>
        ) : filteredPastEvents.length === 0 ? (
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
            {filteredPastEvents.map((event) => {
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
