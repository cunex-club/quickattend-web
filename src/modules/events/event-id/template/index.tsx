"use client";

import { useState } from "react";
import IonIcon from "@shared/IonIcon";
import Icon from "@shared/Icon";
import Button from "@shared/Button";
import ShareModal from "@modules/events/event-id/components/shareModal";
import {
  MOCK_EVENT_INFO,
  MOCK_SHARE_MODAL_DATA,
} from "@modules/events/event-id/constants/mock-up";

const EventIdPageTemplate = () => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const eventData = MOCK_EVENT_INFO;

  // Format date from "2025-08-03" to "3 สิงหาคม 2568"
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  // Format time from ISO string to "HH:MM น."
  const formatTime = (isoStr: string) => {
    const date = new Date(isoStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Format agenda time range
  const formatAgendaTime = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)} น.`;
  };

  return (
    <div className="w-full flex flex-col justify-center items-center px-25 pt-35 gap-7.5">
      <div className="w-full flex flex-row gap-10">
        <div className="flex-4 bg-neutral-100 p-10 space-y-5 rounded-3xl shadow-xs">
          <div className="flex w-full items-center justify-between">
            <div className="display-medium-emphasized ">{eventData.name}</div>
            <div>
              <Icon name="edit" size={32} className="text-primary" />
            </div>
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Calendar" size="16px" className="text-secondary" />
              <div className="body-large-primary">
                {formatDate(eventData.date)}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Time" size="16px" className="text-secondary" />
              <div className="body-large-primary">
                {formatTime(eventData.start_time)} -{" "}
                {formatTime(eventData.end_time)} น.
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Location" size="16px" className="text-secondary" />
              <div className="body-large-primary">{eventData.location}</div>
            </div>
            <div className="flex gap-2 items-center">
              <IonIcon name="Person" size="16px" className="text-secondary" />
              <div className="body-large-primary">Owner</div>
            </div>
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="headline-small-emphasized">รายละเอียดกิจกรรม</div>
            <div className="body-large-primary">{eventData.description}</div>
          </div>
          <div>
            <div className="headline-small-emphasized">กำหนดการกิจกรรม</div>
            <div className="body-large-primary">
              {eventData.agenda.map((item) => (
                <div key={item.start_time} className="flex w-full justify-between">
                  <div>{item.activity_name}</div>
                  <div>{formatAgendaTime(item.start_time, item.end_time)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between gap-10">
          <div className="flex flex-col justify-center items-center bg-primary h-full p-10 text-white rounded-3xl shadow-xs">
            <div className="headline-small-emphasized">จำนวนผู้ลงทะเบียน</div>
            <div className="flex items-baseline gap-2">
              <div
                className="text-center"
                style={{
                  color: "var(--Color-Neutral-White, #FFF)",
                  fontFamily:
                    "CHULALONGKORNBold, var(--font-chula-bold), sans-serif",
                  fontSize: "72px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "140%",
                  letterSpacing: "-0.792px",
                }}
              >
                {eventData.total_registered}
              </div>
              <div className="title-large-primary">คน</div>
            </div>
            <div className="flex space-x-2.5 title-small-primary">
              <div>นิสิต : 1090 คน</div>
              <div>|</div>
              <div>บุคลากร : 6 คน</div>
            </div>
          </div>
          <div className="bg-neutral-100 p-5 rounded-3xl shadow-xs">
            <div className="headline-small-emphasized">กิจกรรมโดย</div>
            <div className="body-large-primary">{eventData.organizer}</div>
          </div>
        </div>
      </div>
      <div className="flex w-full gap-6">
        <Button mode="filled" bordered="round" expanded={true}>
          <div className="flex justify-center items-center gap-2 text-neutral-white">
            <IonIcon name="Scan" size="36px" />
            <div className="title-large-primary">สแกนผู้เข้าร่วมกิจกรรม</div>
          </div>
        </Button>
        <Button mode="outline" bordered="round" expanded={true}>
          <div className="flex justify-center text-primary items-center gap-2">
            <IonIcon name="TrendingUp" size="36px" />
            <div className="title-large-primary">สถิติกิจกรรม</div>
          </div>
        </Button>
        <div className="flex gap-2">
          <Button mode="outline" bordered="round" expanded={false}>
            <IonIcon
              name="DuplicateOutline"
              size="36px"
              className="text-primary"
            />
          </Button>
          <Button 
            mode="outline" 
            bordered="round" 
            expanded={false}
            onClick={() => setIsShareModalOpen(true)}
          >
            <IonIcon
              name="ArrowRedoOutline"
              size="36px"
              className="text-primary"
            />
          </Button>
        </div>
      </div>

      <ShareModal
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        eventData={MOCK_SHARE_MODAL_DATA}
      />
    </div>
  );
};

export default EventIdPageTemplate;
