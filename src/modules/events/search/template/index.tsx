"use client";

import { useState } from "react";
import SearchBar from "@shared/search-bar";
import IonIcon from "@shared/IonIcon";
import EventCard from "@modules/events/main-page/components/event-card";
import { mockEvents } from "../constant/mock";
import { useTranslations } from "next-intl";

const EventSearchTemplate = () => {
  const t = useTranslations("Events.Search");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredEvents = mockEvents.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hasResults = filteredEvents.length > 0;
  const isSearching = searchQuery.length > 0;

  return (
    <div className="w-full min-h-screen">
      <div className="px-12 pt-20 pb-6">
        <SearchBar placeholder="Search events..." onsearch={handleSearch} />
      </div>

      {!isSearching || !hasResults ? (
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
        <div className="px-12 pb-12">
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                time={event.time}
                location={event.location}
                role={event.role}
                isEnd={event.isEnd}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventSearchTemplate;
