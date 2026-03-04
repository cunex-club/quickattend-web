"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import IonIcon from "@shared/IonIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@assets/components/ui/dropdown-menu";
import barcodeReaderIcon from "@assets/images/logo/smartphone-payment-barcode-reader_svgrepo.com.png";

const events = [
  {
    id: "freshmen-night",
    name: "Freshmen night",
    startTime: "16:00",
    endTime: "21:00",
  },
  {
    id: "orientation-day",
    name: "Orientation day",
    startTime: "13:00",
    endTime: "18:00",
  },
  {
    id: "welcome-party",
    name: "Welcome party",
    startTime: "17:30",
    endTime: "22:00",
  },
];

const recentParticipants = [
  { id: "652392178", name: "นางสาวปรียดา สวัสดีสุข", time: "16:20 น." },
  { id: "672392178", name: "นายปฏิภัค สวัสดี", time: "16:23 น." },
  { id: "662392378", name: "นายปฏิภัค สวัสดี", time: "16:28 น." },
];

const ScanTemplate = () => {
  const [selectedEventId, setSelectedEventId] = useState(events[0].id);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? events[0],
    [selectedEventId],
  );

  return (
    <div className="min-h-screen bg-neutral-200 p-6 md:p-8">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="flex min-h-[720px] flex-col items-center justify-between rounded-[32px] p-8">
          <div className="flex flex-col items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex items-end gap-1 text-neutral-600 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label="Select event"
                >
                  <span className="display-medium-emphasized md:display-large-emphasized">
                    {selectedEvent.name}
                  </span>
                  <IonIcon
                    name="ChevronDownOutline"
                    size="24px"
                    className="text-primary"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="min-w-65">
                {events.map((event) => (
                  <DropdownMenuItem
                    key={event.id}
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <span className="title-medium-primary text-neutral-600">
                      {event.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <p className="title-large-primary mt-1 text-neutral-600">
              {selectedEvent.startTime} –{selectedEvent.endTime} น.
            </p>
          </div>

          <Image
            src={barcodeReaderIcon}
            alt="Scan barcode"
            width={150}
            height={210}
            className="h-auto w-[130px] md:w-[150px]"
            priority
          />

          <p className="headline-medium-emphasized text-center">
            สแกนนิสิต CU NEX
            <br />
            เพื่อลงทะเบียนเข้าร่วมกิจกรรม
          </p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-neutral-600">
              <IonIcon
                name="PersonOutline"
                size="16px"
                className="text-primary"
              />
              <span className="title-medium-emphasized">ผู้ดูแลกิจกรรม</span>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 shadow-elevation-1"
              aria-label="Copy event link"
            >
              <IonIcon
                name="LinkOutline"
                size="16px"
                className="text-primary"
              />
            </button>
          </div>
        </section>

        <section className="h-full min-h-[720px] rounded-[32px] bg-white px-8 py-10 md:px-14 md:py-14 flex flex-col justify-center">
          <div className="mx-auto flex w-full max-w-[620px] items-center justify-between gap-4">
            <h2 className="headline-medium-emphasized text-neutral-600 leading-none whitespace-nowrap">
              จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด
            </h2>
            <p className="shrink-0 whitespace-nowrap text-center">
              <span
                style={{
                  color: "var(--Text-Filled, #E36487)",
                  fontFamily: "CHULALONGKORNBold, sans-serif",
                  fontSize: "96px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "-1.056px",
                }}
              >
                240
              </span>{" "}
              <span className="display-small-emphasized text-neutral-600">
                คน
              </span>
            </p>
          </div>

          <div className="mx-auto mt-8 grid w-full max-w-[620px] grid-cols-[1fr_auto] gap-x-6 gap-y-1">
            <p className="title-large-primary text-neutral-600">
              ผู้ลงทะเบียนล่าสุด
            </p>
            <p className="title-large-primary text-right text-neutral-600">
              เวลา
            </p>

            {recentParticipants.map((participant) => (
              <div key={participant.id} className="contents">
                <p className="body-large-primary text-neutral-600">
                  {participant.id} {participant.name}
                </p>
                <p className="body-large-primary text-right text-neutral-600">
                  {participant.time}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ScanTemplate;
