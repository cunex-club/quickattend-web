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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@assets/components/ui/dialog";
import EditEventDuplicate from "../components/edit-event-duplicate";
import EditEventDelete from "../components/edit-event-delete";
import { deepEqual } from "@utils/function";
import { DEFAULT_CENTER } from "@modules/events/create/components/map-selection";

export const SideTabType = {
  NAVIGATE: "navigate",
  PREVIEW: "preview",
};

export type SideTabType = (typeof SideTabType)[keyof typeof SideTabType];

const EventEditTemplate = () => {
  const { id: eventId } = useParams();
  console.log("Event ID: ", eventId);

  // TODO: Check for validation (id มีอยู่จริงหรือไม่, คนนี้มีสิทธิ์เข้าถึง event นี้หรือไม่)

  const { setShowSidebar } = useSidebar();
  const router = useRouter();
  const tEditEvent = useTranslations("EditEvent");

  const [width, setWidth] = useState(0);
  const [sidetabMode, setSidetabMode] = useState<SideTabType | null>(null);
  const [openDuplicate, setOpenDuplicate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [cardMode, setCardMode] = useState<CardPreviewType>(
    CardPreviewType.CARD_PREVIEW,
  );

  const [valid, setValid] = useState(false);

  // NOTE: MOCK VERSION
  const fetchedEventForm: EventFormInterface = {
    name: "Sample Event",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    date: new Date("2026-02-10"),
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
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
  };

  const [lastSavedEventForm, setLastSavedEventForm] =
    useState<EventFormInterface>(fetchedEventForm);
  const [eventForm, setEventForm] =
    useState<EventFormInterface>(fetchedEventForm);
  const [canSave, setCanSave] = useState(false);

  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO: Fetch event information using eventID
  }, []);

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setCanSave(!deepEqual(lastSavedEventForm, eventForm));
  }, [eventForm, lastSavedEventForm]);

  useEffect(() => {
    if (
      // Section 1
      eventForm.name.trim() &&
      eventForm.date &&
      eventForm.startTime &&
      eventForm.endTime &&
      eventForm.location.trim() &&
      eventForm.organizer.trim() &&
      // Section 2
      (eventForm.attendance_type == AttendanceType.ALL ||
        (eventForm.attendance_type == AttendanceType.FACULTIES &&
          eventForm.selectedFaculties.length > 0) ||
        (eventForm.attendance_type == AttendanceType.WHITELIST &&
          eventForm.selectedStudents.length > 0)) &&
      eventForm.revealed_fields.length > 0 &&
      // Section 3
      (!eventForm.evaluation_form.trim() ||
        isValidUrl(eventForm.evaluation_form.trim()))
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [eventForm]);

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

  useEffect(() => {
    if ((openDelete || openDuplicate) && width < 768) {
      setSidetabMode(null);
    }
  }, [openDelete, openDuplicate, width]);

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
    Lat: ${eventForm.lat}
    Lng: ${eventForm.lng}
    Agenda: ${agendaText}
    Organizer: ${eventForm.organizer}
    Attendance Type: ${eventForm.attendance_type}
    Attendee: ${attendeeText}
    Revealed Fields: ${revealedFieldText}
    Manager and Staff: ${managerAndStaffText}
    Allow All to Scan: ${eventForm.allow_all_to_scan}
    Evaluation Form: ${eventForm.evaluation_form}`);

    setLastSavedEventForm(eventForm);
  };

  const saveAndExit = () => {
    saveEvent();
    window.location.href = "/events";
  };

  return (
    <>
      <div className="w-full h-fit min-h-screen max-w-screen bg-neutral-100">
        <header className="w-full min-h-16 relative flex items-center justify-between shadow-elevation-3 gap-2 py-4 pl-2 pr-4">
          <button
            onClick={() => {
              router.back();
            }}
            className="text-primary font-semibold cursor-pointer flex items-center"
          >
            <IonIcon name="ChevronBack" size="16px" />
            <p className="hidden md:block label-large-emphasized">
              {tEditEvent("back")}
            </p>
          </button>

          <p className="headline-small-emphasized">{tEditEvent("editEvent")}</p>

          <div className="flex gap-2 items-center">
            <Button
              mode="outline"
              bordered="round"
              expanded={false}
              disabled={!canSave}
              onClick={() => {
                if (canSave) {
                  saveEvent();
                }
              }}
              className={`${
                canSave
                  ? "cursor-pointer border-primary text-primary"
                  : "cursor-default border-neutral-400 bg-transparent text-neutral-400"
              } w-fit h-9 px-1 pr-2 flex items-center`}
            >
              <IonIcon
                name="SaveOutline"
                size="16px"
                className="font-semibold"
              />
            </Button>
            <Button
              mode="filled"
              bordered="square"
              expanded={false}
              disabled={!valid}
              onClick={() => {
                if (valid) {
                  saveAndExit();
                }
              }}
              className={`${
                valid
                  ? "cursor-pointer border-primary"
                  : "cursor-default border-neutral-400 bg-transparent text-neutral-400"
              } w-fit h-10 px-1 pr-2 flex items-center`}
            >
              <IonIcon
                name="Checkmark"
                size="16px"
                className="font-semibold cursor-pointer"
              />
              <p className="label-large-emphasized">{tEditEvent("save")}</p>
            </Button>
          </div>
        </header>

        <main className={`w-full flex gap-4 px-4 py-8`}>
          {/* Buttons */}
          <div className="h-fit py-4 bg-neutral-white rounded-4xl grid-cols-1 gap-8 place-items-center flex-1 hidden md:grid">
            <IonIcon
              name="List"
              size="18px"
              className="text-primary cursor-pointer"
              onClick={() => {
                setSidetabMode(null);
              }}
            />
            <IonIcon
              name="EyeOutline"
              size="18px"
              className="text-primary cursor-pointer"
              onClick={() => {
                setSidetabMode(SideTabType.PREVIEW);
              }}
            />
            <hr className="border-neutral-300 border w-[60%]" />
            <IonIcon
              name="DuplicateOutline"
              size="18px"
              className="text-primary cursor-pointer"
              onClick={() => {
                setOpenDuplicate(true);
              }}
            />
            <IonIcon
              name="TrashOutline"
              size="18px"
              className="text-primary cursor-pointer"
              onClick={() => {
                setOpenDelete(true);
              }}
            />
          </div>

          <>
            {(sidetabMode == SideTabType.NAVIGATE || sidetabMode == null) && (
              // Navigatation
              <div className="hidden md:flex flex-6 flex-col gap-8 h-fit max-h-[80vh] bg-neutral-white rounded-4xl p-4 overflow-y-auto break-all">
                {/* Header */}
                <h2 className="headline-medium-emphasized text-primary pl-2">
                  {tEditEvent("category")}
                </h2>

                {/* Content */}
                <div
                  className={`flex flex-col gap-6 max-w-full h-fit rounded-4xl mb-6`}
                >
                  <span
                    className="flex gap-2 items-center cursor-pointer"
                    onClick={() => {
                      section1Ref.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    <IonIcon
                      name="DocumentText"
                      size="18px"
                      className="text-primary"
                    />
                    <p className="translate-y-1">{tEditEvent("eventDetail")}</p>
                  </span>

                  <span
                    className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 rounded-2xl"
                    onClick={() => {
                      section2Ref.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    <IonIcon
                      name="DocumentText"
                      size="18px"
                      className="text-primary"
                    />
                    <p className="translate-y-1">{tEditEvent("setting")}</p>
                  </span>

                  <span
                    className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 rounded-2xl"
                    onClick={() => {
                      section3Ref.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                  >
                    <IonIcon
                      name="DocumentText"
                      size="18px"
                      className="text-primary"
                    />
                    <p className="translate-y-1">
                      {tEditEvent("evaluationForm")}
                    </p>
                  </span>
                </div>
              </div>
            )}

            {sidetabMode == SideTabType.PREVIEW && (
              // Preview
              <div className="w-full hidden md:flex md:flex-col md:flex-6 md:gap-4 p-4">
                {/* Header */}
                <div className="flex justify-between gap-2 flex-wrap">
                  <h2 className="title-large-emphasized text-primary">
                    {tEditEvent("eventPreview")}
                  </h2>

                  <Select value={cardMode} onValueChange={setCardMode}>
                    <SelectTrigger className="w-[150px] bg-neutral-white">
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
                  className={`max-w-full ${cardMode == CardPreviewType.CARD_PREVIEW ? "max-h-[55vh]" : "max-h-screen"} h-fit bg-neutral-white rounded-4xl px-4 py-6 overflow-y-auto break-all`}
                >
                  <EditEventPreview eventForm={eventForm} cardMode={cardMode} />
                </div>
              </div>
            )}
          </>

          {/* Form */}
          <div className="py-4 md:py-0 pb-12 w-full flex flex-col gap-8 bg-neutral-white md:bg-transparent flex-13">
            {/* Section 1 */}
            <div
              className="flex flex-col px-4 md:py-8 bg-neutral-white md:rounded-4xl"
              ref={section1Ref}
            >
              <EditEventSection1
                eventForm={eventForm}
                setEventForm={setEventForm}
              />
            </div>

            {/* Section 2 */}
            <div
              className="flex flex-col px-4 md:py-8 bg-neutral-white md:rounded-2xl"
              ref={section2Ref}
            >
              <EditEventSection2
                eventForm={eventForm}
                setEventForm={setEventForm}
              />
            </div>

            {/* Section 3 */}
            <div
              className="flex flex-col px-4 md:py-8 bg-neutral-white md:rounded-2xl"
              ref={section3Ref}
            >
              <EditEventSection3
                eventForm={eventForm}
                setEventForm={setEventForm}
              />
            </div>
          </div>
        </main>

        <footer className="md:hidden fixed bottom-0 left-0 w-full h-16 px-4 bg-neutral-200 rounded-t-4xl z-50 grid grid-cols-4 gap-2 place-items-center">
          <IonIcon
            name="List"
            size="18px"
            className="text-primary cursor-pointer"
            onClick={() => {
              setSidetabMode(SideTabType.NAVIGATE);
            }}
          />
          <IonIcon
            name="EyeOutline"
            size="18px"
            className="text-primary cursor-pointer"
            onClick={() => {
              setSidetabMode(SideTabType.PREVIEW);
            }}
          />
          <IonIcon
            name="DuplicateOutline"
            size="18px"
            className="text-primary cursor-pointer"
            onClick={() => {
              setOpenDuplicate(true);
            }}
          />
          <IonIcon
            name="TrashOutline"
            size="18px"
            className="text-primary cursor-pointer"
            onClick={() => {
              setOpenDelete(true);
            }}
          />
        </footer>
      </div>

      {/* For Mobile */}
      {width < 425 && (
        <>
          {/* Navigation */}
          <Drawer
            open={sidetabMode == SideTabType.NAVIGATE}
            onOpenChange={() => {
              if (sidetabMode == SideTabType.NAVIGATE) {
                setSidetabMode(null);
              } else {
                setSidetabMode(SideTabType.NAVIGATE);
              }
            }}
          >
            <DrawerContent className="px-4 py-2 bg-neutral-white h-fit min-h-[50vh] max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle className="title-large-emphasized text-primary">
                  {tEditEvent("category")}
                </DrawerTitle>
              </DrawerHeader>

              <div
                className={`flex flex-col gap-8 max-w-full h-fit rounded-4xl p-4 mb-6`}
              >
                <span
                  className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 rounded-2xl"
                  onClick={() => {
                    setSidetabMode(null);
                    section1Ref.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  <IonIcon
                    name="DocumentText"
                    size="18px"
                    className="text-primary"
                  />
                  <p className="translate-y-1">{tEditEvent("eventDetail")}</p>
                </span>

                <span
                  className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 rounded-2xl"
                  onClick={() => {
                    setSidetabMode(null);
                    section2Ref.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  <IonIcon
                    name="DocumentText"
                    size="18px"
                    className="text-primary"
                  />
                  <p className="translate-y-1">{tEditEvent("setting")}</p>
                </span>

                <span
                  className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 rounded-2xl"
                  onClick={() => {
                    setSidetabMode(null);
                    section3Ref.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  <IonIcon
                    name="DocumentText"
                    size="18px"
                    className="text-primary"
                  />
                  <p className="translate-y-1">
                    {tEditEvent("evaluationForm")}
                  </p>
                </span>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Preview */}
          <Drawer
            open={sidetabMode == SideTabType.PREVIEW}
            onOpenChange={() => {
              if (sidetabMode == SideTabType.PREVIEW) {
                setSidetabMode(null);
              } else {
                setSidetabMode(SideTabType.PREVIEW);
              }
            }}
          >
            <DrawerContent className="px-4 py-2 bg-neutral-white h-fit max-h-[80vh]">
              <DrawerHeader>
                <div className="flex justify-between gap-2 flex-wrap items-center">
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

          {/* Duplicate */}
          <Drawer open={openDuplicate} onOpenChange={setOpenDuplicate}>
            <DrawerContent className="px-4 py-2 bg-neutral-white h-fit max-h-[80vh]">
              <DrawerHeader>
                <DrawerTitle className="title-large-emphasized text-primary">
                  {tEditEvent("eventDuplicate")}
                </DrawerTitle>
              </DrawerHeader>

              <div
                className={`max-w-full h-fit max-h-[60vh] rounded-4xl p-4 mb-6 overflow-y-auto break-all`}
              >
                <EditEventDuplicate
                  eventForm={lastSavedEventForm}
                  setOpenDuplicate={setOpenDuplicate}
                  width={width}
                />
              </div>
            </DrawerContent>
          </Drawer>

          {/* Delete */}
          <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogContent className="[&>button]:hidden min-w-[60vw] max-w-[80vw] h-[80vh] bg-neutral-white flex flex-col gap-4">
              {/* Header */}
              <DialogTitle className="flex flex-col items-center gap-4 headline-medium-emphasized text-primary">
                <IonIcon name="Trash" size="48px" />
                <p>{tEditEvent("eventDelete")}</p>
              </DialogTitle>

              {/* Content */}
              <>
                <EditEventDelete setOpenDelete={setOpenDelete} />
              </>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* For Tablet */}
      {width >= 425 && width < 768 && (
        <>
          {/* Navigation */}
          <Dialog
            open={sidetabMode == SideTabType.NAVIGATE}
            onOpenChange={() => {
              if (sidetabMode == SideTabType.NAVIGATE) {
                setSidetabMode(null);
              } else {
                setSidetabMode(SideTabType.NAVIGATE);
              }
            }}
          >
            <DialogContent className="[&>button]:hidden min-w-[60vw] max-w-[80vw] h-fit max-h-[80vh] bg-neutral-white rounded-2xl">
              {/* Header */}
              <DialogTitle className="headline-medium-emphasized text-primary pl-2">
                {tEditEvent("category")}
              </DialogTitle>

              {/* Content */}
              <div
                className={`flex flex-col gap-8 max-w-full h-fit rounded-4xl pt-2 pb-6`}
              >
                <span
                  className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 rounded-2xl label-large-primary hover:label-large-emphasized"
                  onClick={() => {
                    setSidetabMode(null);
                    section1Ref.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  <IonIcon
                    name="DocumentText"
                    size="24px"
                    className="text-primary"
                  />
                  <p className="translate-y-1">{tEditEvent("eventDetail")}</p>
                </span>

                <span
                  className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 rounded-2xl label-large-primary hover:label-large-emphasized"
                  onClick={() => {
                    setSidetabMode(null);
                    section2Ref.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  <IonIcon
                    name="DocumentText"
                    size="24px"
                    className="text-primary"
                  />
                  <p className="translate-y-1">{tEditEvent("setting")}</p>
                </span>

                <span
                  className="flex gap-2 items-center cursor-pointer hover:bg-neutral-200 rounded-2xl label-large-primary hover:label-large-emphasized"
                  onClick={() => {
                    setSidetabMode(null);
                    section3Ref.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  <IonIcon
                    name="DocumentText"
                    size="24px"
                    className="text-primary"
                  />
                  <p className="translate-y-1">
                    {tEditEvent("evaluationForm")}
                  </p>
                </span>
              </div>
            </DialogContent>
          </Dialog>

          {/* Preview */}
          <Dialog
            open={sidetabMode == SideTabType.PREVIEW}
            onOpenChange={() => {
              if (sidetabMode == SideTabType.PREVIEW) {
                setSidetabMode(null);
              } else {
                setSidetabMode(SideTabType.PREVIEW);
              }
            }}
          >
            <DialogContent
              className={`bg-transparent border-none [&>button]:hidden min-w-[60vw] max-w-[80vw] ${cardMode == CardPreviewType.CARD_PREVIEW ? "h-fit" : "h-[80vh]"} p-0`}
            >
              {/* Header */}
              <div
                className={`w-full ${cardMode == CardPreviewType.CARD_PREVIEW ? "h-fit" : "h-full"} flex justify-between gap-2 px-6 py-4 bg-neutral-white rounded-2xl items-center`}
              >
                <DialogTitle className="headline-small-emphasized text-primary">
                  {tEditEvent("eventPreview")}
                </DialogTitle>

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
              <div className="w-full flex items-center justify-center bg-neutral-white py-4 rounded-2xl h-full overflow-auto">
                <div
                  className={`w-full h-fit max-h-full ${cardMode == CardPreviewType.CARD_PREVIEW && "bg-neutral-100 max-w-[60vw]"} rounded-4xl p-4 overflow-y-auto break-all`}
                >
                  <EditEventPreview eventForm={eventForm} cardMode={cardMode} />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Duplicate */}
          <Dialog open={openDuplicate} onOpenChange={setOpenDuplicate}>
            <DialogContent className="[&>button]:hidden min-w-[60vw] overflow-auto max-w-[80vw] h-[80vh] bg-neutral-white flex flex-col gap-4">
              {/* Header */}
              <DialogTitle className="headline-large-emphasized text-primary">
                {tEditEvent("eventDuplicate")}
              </DialogTitle>

              {/* Content */}
              <>
                <EditEventDuplicate
                  eventForm={lastSavedEventForm}
                  setOpenDuplicate={setOpenDuplicate}
                  width={width}
                />
              </>
            </DialogContent>
          </Dialog>

          {/* Delete */}
          <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogContent className="[&>button]:hidden min-w-[60vw] max-w-[80vw] h-fit max-h-[80vh] bg-neutral-white flex flex-col gap-4">
              {/* Header */}
              <DialogTitle className="flex flex-col items-center gap-4 headline-large-emphasized text-primary">
                <IonIcon name="Trash" size="60px" />
                <p>{tEditEvent("eventDelete")}</p>
              </DialogTitle>

              {/* Content */}
              <>
                <EditEventDelete setOpenDelete={setOpenDelete} />
              </>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* For PC */}
      {width >= 768 && (
        <>
          {/* Duplicate */}
          <Dialog open={openDuplicate} onOpenChange={setOpenDuplicate}>
            <DialogContent className="[&>button]:hidden min-w-[60vw] max-w-[80vw] h-fit max-h-[80vh] bg-neutral-white flex flex-col gap-4 overflow-auto">
              {/* Header */}
              <DialogTitle className="headline-large-emphasized text-primary">
                {tEditEvent("eventDuplicate")}
              </DialogTitle>

              {/* Content */}
              <>
                <EditEventDuplicate
                  eventForm={lastSavedEventForm}
                  setOpenDuplicate={setOpenDuplicate}
                  width={width}
                />
              </>
            </DialogContent>
          </Dialog>

          {/* Delete */}
          <Dialog open={openDelete} onOpenChange={setOpenDelete}>
            <DialogContent className="[&>button]:hidden min-w-[60vw] max-w-[80vw] h-fit max-h-[80vh] bg-neutral-white flex flex-col gap-4">
              {/* Header */}
              <DialogTitle className="flex flex-col items-center gap-4 headline-large-emphasized text-primary">
                <IonIcon name="Trash" size="60px" />
                <p>{tEditEvent("eventDelete")}</p>
              </DialogTitle>

              {/* Content */}
              <>
                <EditEventDelete setOpenDelete={setOpenDelete} />
              </>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default EventEditTemplate;
