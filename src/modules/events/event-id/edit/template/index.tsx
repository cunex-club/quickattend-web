"use client";

import { useTranslations } from "next-intl";
import { useSidebar } from "../../../../../context/SidebarContext";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";
import {
  AttendanceType,
  CardPreviewType,
  EventFormInterface,
} from "@modules/events/create/template";
import EditEventSection1 from "../components/edit-event-section1";
import EditEventSection2 from "../components/edit-event-section2";
import EditEventSection3 from "../components/edit-event-section3";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@assets/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@assets/components/ui/select";
import EditEventPreview from "../components/edit-event-preview";

export const EditPreviewType = {
  NAVIGATE: "navigate",
  PREVIEW: "preview",
};

export type EditPreviewType =
  (typeof EditPreviewType)[keyof typeof EditPreviewType];

const EventEditTemplate = () => {
  const { id: eventId } = useParams();
  console.log("Event ID: ", eventId);

  // TODO: Check for validation (id มีอยู่จริงหรือไม่, คนนี้มีสิทธิ์เข้าถึง event นี้หรือไม่)

  const { setShowSidebar } = useSidebar();
  const router = useRouter();
  const tEditEvent = useTranslations("EditEvent");

  const [width, setWidth] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [cardMode, setCardMode] = useState<CardPreviewType>(
    CardPreviewType.CARD_PREVIEW
  );

  const [previewMode, setPreviewMode] = useState<EditPreviewType>(
    EditPreviewType.NAVIGATE
  );

  // NOTE: MOCK VERSION
  const [eventForm, setEventForm] = useState<EventFormInterface>({
    name: "Sample Event",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: new Date("2026-02-10"),
    startTime: new Date("2026-02-10T09:00:00"),
    endTime: new Date("2026-02-10T16:00:00"),
    location: "Main Auditorium, Building A",
    agenda: [
      {
        id: "1",
        activity_name: "Opening Ceremony",
        startTime: new Date("2026-02-10T09:00:00"),
        endTime: new Date("2026-02-10T09:30:00"),
      },
      {
        id: "2",
        activity_name: "Keynote Speech",
        startTime: new Date("2026-02-10T09:30:00"),
        endTime: new Date("2026-02-10T10:30:00"),
      },
    ],
    organizer: "Student Affairs Office",
    attendance_type: "faculties",
    selectedFaculties: ["คณะวิศวกรรมศาสตร์"],
    selectedStudents: [],
    revealed_fields: ["name"],
    managers_and_staff: [
      {
        id: "6631333321",
        name: "บลา บาล",
        role: "manager",
      },
    ],
    allow_all_to_scan: true,
    evaluation_form: "https://forms.google.com/sample-evaluation-form",
  });

  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Fetch event information using eventID
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
    const agendaText = eventForm.agenda
      .map((item, index) => {
        return `${index + 1}. ${item.activity_name} 
                        - Start: ${item.startTime}
                        - End: ${item.endTime}`;
      })
      .join("\n");

    let attendeeText = "-";
    if (eventForm.attendance_type == AttendanceType.FACULTIES) {
      attendeeText = eventForm.selectedFaculties
        .map((item, index) => {
          return `${index + 1} ${item}`;
        })
        .join("\n");
    } else if (eventForm.attendance_type == AttendanceType.WHITELIST) {
      attendeeText = eventForm.selectedStudents
        .map((item, index) => {
          return `${index + 1} ${item.id} ${item.name}`;
        })
        .join("\n");
    }

    const revealedFieldText = eventForm.revealed_fields.join(", ");

    const managerAndStaffText = eventForm.managers_and_staff
      .map((item, index) => {
        return `${index + 1} ${item.id} ${item.name} ${item.role}`;
      })
      .join("\n");

    alert(`Name: ${eventForm.name}
    Description: ${eventForm.description}
    Date: ${eventForm.date}
    Start Time: ${eventForm.startTime}
    End Date: ${eventForm.endTime}
    Location: ${eventForm.location}
    Agenda: ${agendaText}
    Organizer: ${eventForm.organizer}
    Attendance Type: ${eventForm.attendance_type}
    Attendee: ${attendeeText}
    Revealed Fields: ${revealedFieldText}
    Manager and Staff: ${managerAndStaffText}
    Allow All to Scan: ${eventForm.allow_all_to_scan}
    Evaluation Form: ${eventForm.evaluation_form}`);
  };

  return (
    <>
      <div className="w-full h-fit min-h-screen max-w-screen bg-neutral-100">
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
            className="w-fit h-9 px-1 pr-2 flex items-center cursor-pointer"
          >
            <IonIcon
              name="Checkmark"
              size="16px"
              className="font-semibold cursor-pointer"
            />
            <p className="label-large-emphasized">{tEditEvent("save")}</p>
          </Button>
        </header>

        <main className="w-full flex gap-4 px-4 py-8">
          {/* Buttons */}
          <div className="h-fit py-4 bg-neutral-white rounded-4xl grid-cols-1 gap-8 place-items-center flex-1 hidden sm:grid">
            <IonIcon
              name="List"
              size="18px"
              className="text-primary cursor-pointer"
              onClick={() => {
                setShowExample(true);
                setPreviewMode(EditPreviewType.NAVIGATE);
              }}
            />
            <IonIcon
              name="EyeOutline"
              size="18px"
              className="text-primary cursor-pointer"
              onClick={() => {
                setShowExample(true);
                setPreviewMode(EditPreviewType.PREVIEW);
              }}
            />
            <hr className="border-neutral-300 border w-[60%]" />
            <IonIcon
              name="DuplicateOutline"
              size="18px"
              className="text-primary cursor-pointer"
            />
            <IonIcon
              name="TrashOutline"
              size="18px"
              className="text-primary cursor-pointer"
            />
          </div>

          {/* Preview and Navigation */}
          <div className="flex-6 h-fit max-h-[80vh] hidden sm:block">
            {previewMode == EditPreviewType.NAVIGATE && <div></div>}
            {previewMode == EditPreviewType.PREVIEW && (
              <div className="flex flex-col gap-4 h-fit max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between gap-2 flex-wrap">
                  <h2 className="title-large-emphasized text-neutral-600">
                    {tEditEvent("eventPreview")}
                  </h2>

                  <Select value={cardMode} onValueChange={setCardMode}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder={tEditEvent("eventPreview")} />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={CardPreviewType.CARD_PREVIEW}>
                          {tEditEvent(CardPreviewType.CARD_PREVIEW)}
                        </SelectItem>
                        <SelectItem value={CardPreviewType.DETAIL_PREVIEW}>
                          {tEditEvent(CardPreviewType.DETAIL_PREVIEW)}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content */}
                <div
                  className={`max-w-full h-fit max-h-[60vh] bg-neutral-white rounded-4xl ${cardMode == CardPreviewType.CARD_PREVIEW && "bg-neutral-100"} rounded-4xl p-4 mb-6 overflow-y-auto break-all`}
                >
                  <EditEventPreview eventForm={eventForm} cardMode={cardMode} />
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="py-4 sm:py-0 pb-24 w-full flex flex-col gap-8 bg-neutral-white sm:bg-transparent flex-13">
            {/* Section 1 */}
            <div
              className="flex flex-col px-4 sm:py-8 bg-neutral-white sm:rounded-4xl"
              ref={section1Ref}
            >
              <EditEventSection1
                eventForm={eventForm}
                setEventForm={setEventForm}
              />
            </div>

            {/* Section 2 */}
            <div
              className="flex flex-col px-4 sm:py-8 bg-neutral-white sm:rounded-2xl"
              ref={section2Ref}
            >
              <EditEventSection2
                eventForm={eventForm}
                setEventForm={setEventForm}
              />
            </div>

            {/* Section 3 */}
            <div
              className="flex flex-col px-4 sm:py-8 bg-neutral-white sm:rounded-2xl"
              ref={section3Ref}
            >
              <EditEventSection3
                eventForm={eventForm}
                setEventForm={setEventForm}
              />
            </div>
          </div>
        </main>

        <footer className="sm:hidden fixed bottom-0 left-0 w-full h-16 px-4 bg-neutral-200 rounded-t-4xl z-50 grid grid-cols-4 gap-2 place-items-center">
          <IonIcon
            name="List"
            size="18px"
            className="text-primary cursor-pointer"
          />
          <IonIcon
            name="EyeOutline"
            size="18px"
            className="text-primary cursor-pointer"
            onClick={() => {
              setShowExample(true);
              setPreviewMode(EditPreviewType.PREVIEW);
            }}
          />
          <IonIcon
            name="DuplicateOutline"
            size="18px"
            className="text-primary cursor-pointer"
          />
          <IonIcon
            name="TrashOutline"
            size="18px"
            className="text-primary cursor-pointer"
          />
        </footer>
      </div>

      {/* Show Example */}
      {width < 640 && (
        <Drawer open={showExample} onOpenChange={setShowExample}>
          <DrawerContent className="px-4 py-2 bg-neutral-white h-fit max-h-[80vh]">
            <DrawerHeader>
              <div className="flex justify-between gap-2 flex-wrap">
                <DrawerTitle className="title-large-emphasized text-primary">
                  {tEditEvent("eventPreview")}
                </DrawerTitle>

                <Select value={cardMode} onValueChange={setCardMode}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder={tEditEvent("eventPreview")} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={CardPreviewType.CARD_PREVIEW}>
                        {tEditEvent(CardPreviewType.CARD_PREVIEW)}
                      </SelectItem>
                      <SelectItem value={CardPreviewType.DETAIL_PREVIEW}>
                        {tEditEvent(CardPreviewType.DETAIL_PREVIEW)}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </DrawerHeader>

            <div
              className={`max-w-full h-fit max-h-[60vh] ${cardMode == CardPreviewType.CARD_PREVIEW && "bg-neutral-100"} rounded-4xl p-4 mb-6 overflow-y-auto break-all`}
            >
              <EditEventPreview eventForm={eventForm} cardMode={cardMode} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default EventEditTemplate;
