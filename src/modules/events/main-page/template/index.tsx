"use client";

import { useState, useEffect } from "react";
import EventCard from "@modules/events/main-page/components/event-card";
import EventCardSkeleton from "@modules/events/main-page/components/event-card-skeleton";
import EventEmptyState from "@modules/events/main-page/components/event-empty-state";
import SortMenu from "@modules/events/main-page/components/sort-menu";
import FilterMenu, {
  DEFAULT_ACCESS_OPTION_IDS,
  FilterValues,
} from "@modules/events/main-page/components/filter-menu";
import Pagination from "@shared/Pagination";
import { useLocale, useTranslations } from "next-intl";

import {
  fetchManagedEvents,
  fetchAttendedEvents,
} from "@services/events.actions";
import type { GetEventsRes, APIPagination } from "@customTypes/events";
import { formatEventDate, formatEventTimeRange } from "@utils/eventDateTime";

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toDateParam = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const FILTERS_STORAGE_KEY = "cunex_events_filters_v1";

interface StoredFiltersState {
  myEventsFilter: FilterValues;
  myEventsSort: string;
  pastEventsFilter: FilterValues;
  pastEventsSort: string;
}

const DEFAULT_ACCESS_RIGHTS: string[] = [...DEFAULT_ACCESS_OPTION_IDS];

const loadStoredFilters = (): StoredFiltersState | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      myEventsFilter: {
        accessRights:
          parsed.myEventsFilter?.accessRights ?? DEFAULT_ACCESS_RIGHTS,
        date: parsed.myEventsFilter?.date
          ? new Date(parsed.myEventsFilter.date)
          : undefined,
      },
      myEventsSort: parsed.myEventsSort ?? "newest",
      pastEventsFilter: {
        accessRights:
          parsed.pastEventsFilter?.accessRights ?? DEFAULT_ACCESS_RIGHTS,
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
    result = result.filter(
      (event) =>
        !event.role ||
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
  const locale = useLocale();
  const [currentPage, setCurrentPage] = useState(1);

  const [managedEvents, setManagedEvents] = useState<GetEventsRes[]>([]);
  const [managedLoading, setManagedLoading] = useState(true);

  const [attendedEvents, setAttendedEvents] = useState<GetEventsRes[]>([]);
  const [attendedPagination, setAttendedPagination] =
    useState<APIPagination | null>(null);
  const [pastLoading, setPastLoading] = useState(true);

  const [myEventsFilter, setMyEventsFilter] = useState<FilterValues>(
    () =>
      loadStoredFilters()?.myEventsFilter ?? {
        accessRights: DEFAULT_ACCESS_RIGHTS,
        date: undefined,
      },
  );
  const [myEventsSort, setMyEventsSort] = useState(
    () => loadStoredFilters()?.myEventsSort ?? "newest",
  );
  const [pastEventsFilter, setPastEventsFilter] = useState<FilterValues>(
    () =>
      loadStoredFilters()?.pastEventsFilter ?? {
        accessRights: DEFAULT_ACCESS_RIGHTS,
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

  // GetMyEvents already excludes ended events server-side, so this is just a
  // defensive re-check in case an event ends while the page stays open.
  const currentManagedEvents = managedEvents.filter(
    (event) => new Date(event.end_time) >= new Date(),
  );

  const filteredCurrentManagedEvents = applyFilterAndSort(
    currentManagedEvents,
    myEventsFilter,
    myEventsSort,
  );

  const totalPages = attendedPagination
    ? Math.max(
        1,
        Math.ceil(attendedPagination.total / attendedPagination.pageSize),
      )
    : 1;

  useEffect(() => {
    const loadManagedEvents = async () => {
      setManagedLoading(true);
      const result = await fetchManagedEvents();

      if (!result.ok) {
        console.error(
          `Failed to fetch managed events [${result.error.code}]: ${result.error.message}`,
        );
      } else {
        setManagedEvents(result.data.data);
      }

      setManagedLoading(false);
    };

    loadManagedEvents();
  }, []);

  useEffect(() => {
    const loadPastEvents = async () => {
      setPastLoading(true);
      const result = await fetchAttendedEvents({
        page: currentPage,
        roles: pastEventsFilter.accessRights,
        date: pastEventsFilter.date
          ? toDateParam(pastEventsFilter.date)
          : undefined,
        sort: pastEventsSort === "oldest" ? "oldest" : "newest",
      });

      if (!result.ok) {
        console.error(
          `Failed to fetch attended events [${result.error.code}]: ${result.error.message}`,
        );
      } else {
        setAttendedEvents(result.data.data);
        if (result.data.meta?.pagination) {
          setAttendedPagination(result.data.meta.pagination);
        }
      }

      setPastLoading(false);
    };

    loadPastEvents();
  }, [currentPage, pastEventsFilter, pastEventsSort]);

  const handleMyEventsFilterChange = (values: FilterValues) => {
    setMyEventsFilter(values);
  };

  const handleMyEventsSortChange = (value: string) => {
    setMyEventsSort(value);
  };

  const handlePastEventsFilterChange = (values: FilterValues) => {
    setPastEventsFilter(values);
    setCurrentPage(1);
  };

  const handlePastEventsSortChange = (value: string) => {
    setPastEventsSort(value);
    setCurrentPage(1);
  };

  return (
    <div className="w-full h-full px-6 py-8 lg:px-24 lg:py-24 pb-30 space-y-8 lg:space-y-16">
      <div className="space-y-4">
        <div className="flex justify-between items-center gap-4">
          <div className="headline-small-emphasized lg:display-medium-emphasized">
            {t("myEvents")}
          </div>
          <div className="flex flex-wrap items-center gap-1 lg:gap-2.25">
            <FilterMenu
              menuId="my-events-filter"
              onFilterChange={handleMyEventsFilterChange}
              initialFilter={myEventsFilter}
            />
            <SortMenu
              menuId="my-events-sort"
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
              value={myEventsSort}
              onSelect={handleMyEventsSortChange}
            />
          </div>
        </div>
        {managedLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : filteredCurrentManagedEvents.length === 0 ? (
          <EventEmptyState
            iconName="AlbumsOutline"
            title={t("noJoinedEventsTitle")}
            description={t("noJoinedEventsDescription")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCurrentManagedEvents.map((event) => {
              const isEnd = new Date(event.end_time) < new Date();
              const hasStarted = new Date(event.start_time) <= new Date();
              const dateStr = formatEventDate(event.start_time, locale);
              const timeStr = formatEventTimeRange(
                event.start_time,
                event.end_time,
                locale,
              );

              return (
                <EventCard
                  key={event.id}
                  eventId={event.id}
                  title={event.name}
                  description={event.description ?? ""}
                  date={dateStr}
                  time={timeStr}
                  location={event.location}
                  organizer={event.organizer}
                  isEnd={isEnd}
                  hasStarted={hasStarted}
                  evaluationForm={event.evaluation_form}
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
                  label: t("sortNewest"),
                  value: "newest",
                },
                {
                  label: t("sortOldest"),
                  value: "oldest",
                },
              ]}
              value={pastEventsSort}
              onSelect={handlePastEventsSortChange}
            />
          </div>
        </div>
        {pastLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <EventCardSkeleton isEnd />
            <EventCardSkeleton isEnd />
          </div>
        ) : attendedEvents.length === 0 ? (
          <EventEmptyState
            iconName="TimerOutline"
            title={t("noPastEventsTitle")}
            description={t("noPastEventsDescription")}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {attendedEvents.map((event) => {
              const isEnd = new Date(event.end_time) < new Date();
              const dateStr = formatEventDate(event.start_time, locale);
              const timeStr = formatEventTimeRange(
                event.start_time,
                event.end_time,
                locale,
              );

              return (
                <EventCard
                  key={event.id}
                  eventId={event.id}
                  title={event.name}
                  description={event.description ?? ""}
                  date={dateStr}
                  time={timeStr}
                  location={event.location}
                  organizer={event.organizer}
                  isEnd={isEnd}
                  evaluationForm={event.evaluation_form}
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
          hasNext={attendedPagination?.hasNext}
        />
      </div>
    </div>
  );
};

export default EventPageTemplate;
