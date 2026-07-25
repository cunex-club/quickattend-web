"use client";

import { useEffect, useState } from "react";
import SearchBar from "@shared/search-bar";
import IonIcon from "@shared/IonIcon";
import EventCard from "@modules/events/main-page/components/event-card";
import EventCardSkeleton from "@modules/events/main-page/components/event-card-skeleton";
import { useLocale, useTranslations } from "next-intl";
import { fetchDiscoveryEvents } from "@services/events.actions";
import type { GetEventsRes } from "@customTypes/events";
import { formatEventDate, formatEventTimeRange } from "@utils/eventDateTime";

const SEARCH_STORAGE_KEY = "cunex_events_search_query_v1";

const loadStoredSearchQuery = (): string => {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(SEARCH_STORAGE_KEY) ?? "";
};

const EventSearchTemplate = () => {
  const t = useTranslations("Events.Search");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState(loadStoredSearchQuery);
  const [events, setEvents] = useState<GetEventsRes[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(SEARCH_STORAGE_KEY, searchQuery);
  }, [searchQuery]);

  const isSearching = searchQuery.length > 0;

  useEffect(() => {
    if (!isSearching) {
      setEvents([]);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setLoading(true);
      const result = await fetchDiscoveryEvents(1, 10, searchQuery);
      if (cancelled) return;

      if (!result.ok) {
        console.error(
          `Failed to fetch discovery events [${result.error.code}]: ${result.error.message}`,
        );
        setEvents([]);
        setLoading(false);
        return;
      }

      setEvents(result.data.data);
      setLoading(false);
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [searchQuery, isSearching]);

  const hasResults = events.length > 0;

  return (
    <div className="w-full min-h-screen">
      <div className="px-4 sm:px-8 md:px-12 pt-20 pb-6">
        <SearchBar
          placeholder={t("placeholder")}
          onsearch={handleSearch}
          defaultValue={searchQuery}
        />
      </div>

      {!isSearching || (!loading && !hasResults) ? (
        <div className="flex flex-col justify-center items-center space-y-4 py-16">
          <div className="p-6">
            <IonIcon
              name="SearchOutline"
              size="216px"
              className="text-primary"
            />
          </div>
          <div className="title-large-primary">
            {isSearching && !hasResults ? t("notFound") : t("searching")}
          </div>
        </div>
      ) : (
        <div className="px-4 sm:px-8 md:px-12 pb-12">
          <div className="space-y-6">
            {loading
              ? [1, 2].map((key) => <EventCardSkeleton key={key} />)
              : events.map((event) => {
                  const isEnd = new Date(event.end_time) < new Date();
                  const hasStarted =
                    new Date(event.start_time) <= new Date();
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
                      hideRole
                      isEnd={isEnd}
                      hasStarted={hasStarted}
                      evaluationForm={event.evaluation_form}
                    />
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSearchTemplate;
