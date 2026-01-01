"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "../../../../../context/SidebarContext";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";
import { EventFormInterface } from "@modules/events/create/template";

const EventEditTemplate = () => {
  const { id: eventId } = useParams();
  console.log("Event ID: ", eventId);

  // TODO: Check for validation (id มีอยู่จริงหรือไม่, คนนี้มีสิทธิ์เข้าถึง event นี้หรือไม่)

  const { setShowSidebar } = useSidebar();
  const router = useRouter();
  const tEditEvent = useTranslations("EditEvent");

  const [width, setWidth] = useState(0);

  const [eventForm, setEventForm] = useState<EventFormInterface>();

  useEffect(() => {
    // TODO: Fetch event information using eventID

    setEventForm({
      name: "",
      description: "",
      date: undefined,
      startTime: undefined,
      endTime: undefined,
      location: "",
      agenda: [],
      organizer: "",
      attendance_type: "all",
      selectedFaculties: [],
      selectedStudents: [],
      revealed_fields: [],
      managers_and_staff: [],
      allow_all_to_scan: true,
      evaluation_form: "",
    });
  }, []);

  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    setShowSidebar(false);
    return () => setShowSidebar(true);
  }, [setShowSidebar]);

  const saveEvent = () => {
    alert(`Save Event ${eventId}`);
  };

  return (
    <div className="w-full h-fit min-h-screen bg-neutral-100">
      <header className="w-full h-16 px-4 relative flex items-center justify-between gap-2 shadow-elevation-3">
        <IonIcon
          name="ChevronBack"
          size="16px"
          className="text-primary font-semibold cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <p className="headline-small-emphasized">{tEditEvent("editEvent")}</p>
        <Button
          mode="filled"
          bordered="square"
          expanded={false}
          onClick={saveEvent}
          className="w-fit h-9 px-2 pr-4 flex items-center cursor-pointer"
        >
          <IonIcon
            name="Checkmark"
            size="16px"
            className="font-semibold cursor-pointer"
          />
          <p className="label-large-emphasized">{tEditEvent("save")}</p>
        </Button>
      </header>
    </div>
  );
};

export default EventEditTemplate;
