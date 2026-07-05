"use client";

import { useEffect, useState } from "react";
import SearchBar from "@shared/search-bar";
import IonIcon from "@shared/IonIcon";
import EventCard from "@modules/events/main-page/components/event-card";
import EventCardSkeleton from "@modules/events/main-page/components/event-card-skeleton";
import { useTranslations } from "next-intl";
import { fetchDiscoveryEvents } from "@services/events";
import type { GetEventsRes } from "@customTypes/events";

const SEARCH_STORAGE_KEY = "cunex_events_search_query_v1";

const loadStoredSearchQuery = (): string => {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(SEARCH_STORAGE_KEY) ?? "";
};

const EventSearchTemplate = () => {
  const t = useTranslations("Events.Search");
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
      try {
        const res = await fetchDiscoveryEvents(1, 10, searchQuery);
        if (!cancelled) {
          setEvents(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch discovery events:", err);
        if (!cancelled) {
          setEvents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
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
          placeholder="Search events..."
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
                      role=""
                      hideRole
                      isEnd={isEnd}
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
