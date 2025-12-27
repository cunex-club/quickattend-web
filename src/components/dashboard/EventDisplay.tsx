import React from "react";
import { StatCard } from "@components/StatCard";

interface EventProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    totalAttendees: number;
  };
}

export const EventDisplay: React.FC<EventProps> = ({ event }) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full ">
      <div className="flex flex-col space-y-8">
        <p className="headline-large-emphasized">{event.title}</p>

        <div className="flex flex-col space-y-4">
          <div className="px-4 space-y-2 body-medium-primary">
            <p>{event.date}</p>
            <p>{event.time}</p>
            <p>{event.location}</p>
          </div>
          <div className="flex flex-col space-y-2 px-4 ">
            <p className="headline-small-emphasized">รายละเอียดกิจกรรม</p>
            <p className="body-large-primary">{event.description}</p>
          </div>
        </div>
      </div>
      <div className="h-full w-full">
        <StatCard
          title="จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด"
          value={event.totalAttendees}
          unit="คน"
          variant="primary-filled"
        />
      </div>
    </section>
  );
};
