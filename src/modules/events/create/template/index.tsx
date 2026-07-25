"use client";

import { useEffect, useRef, useState } from "react";
import { useSidebar } from "../../../../context/SidebarContext";
import { useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import { useRouter } from "@i18n/navigation";
import CreateEventStep1 from "../components/create-event-step1";
import CreateEventStep2 from "../components/create-event-step2";
import CreateEventStep3 from "../components/create-event-step3";
import Button from "@shared/Button";
import CreateEventPreview from "../components/create-event-preview";
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
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@assets/components/ui/dialog";
import { DEFAULT_CENTER } from "../components/map-selection";
import { createEvent } from "@services/events.actions";
import { buildCreateEventReq } from "../mappers";
import { isSafeExternalUrl } from "@utils/url";
import {
  AttendanceType,
  CardPreviewType,
  type EventFormInterface,
} from "../types";

export * from "../types";

const EventCreateTemplate = () => {
  const { setShowSidebar } = useSidebar();
  const tCreateEvent = useTranslations("CreateEvent");
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [showPreview, setShowPreview] = useState(false);
  const [width, setWidth] = useState(0);

  const [eventForm, setEventForm] = useState<EventFormInterface>({
    name: "",
    description: "",
    date: undefined,
    startTime: undefined,
    endTime: undefined,
    location: "",
    agenda: [],
    organizer: "",
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
    attendance_type: "all",
    selectedFaculties: [],
    selectedStudents: [],
    revealed_fields: [],
    managers_and_staff: [],
    allow_all_to_scan: true,
    evaluation_form: "",
  });

  const [validStep1, setValidStep1] = useState(false);
  const [validStep2, setValidStep2] = useState(false);
  const [validStep3, setValidStep3] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cardMode, setCardMode] = useState<CardPreviewType>(
    CardPreviewType.CARD_PREVIEW,
  );

  useEffect(() => {
    if (
      eventForm.name.trim() &&
      eventForm.date &&
      eventForm.startTime &&
      eventForm.endTime &&
      eventForm.location.trim() &&
      eventForm.organizer.trim()
    ) {
      setValidStep1(true);
    } else {
      setValidStep1(false);
    }

    if (
      (eventForm.attendance_type == AttendanceType.ALL ||
        (eventForm.attendance_type == AttendanceType.FACULTIES &&
          eventForm.selectedFaculties.length > 0) ||
        (eventForm.attendance_type == AttendanceType.WHITELIST &&
          eventForm.selectedStudents.length > 0)) &&
      eventForm.revealed_fields.length > 0
    ) {
      setValidStep2(true);
    } else {
      setValidStep2(false);
    }

    if (
      !eventForm.evaluation_form.trim() ||
      isSafeExternalUrl(eventForm.evaluation_form.trim())
    ) {
      setValidStep3(true);
    } else {
      setValidStep3(false);
    }
  }, [eventForm]);

  const topRef = useRef<HTMLDivElement | null>(null);

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

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCreateEvent = async () => {
    if (!eventForm.date || !eventForm.startTime || !eventForm.endTime) return;

    const body = buildCreateEventReq(eventForm);

    setIsSubmitting(true);
    const result = await createEvent(body);
    setIsSubmitting(false);

    if (!result.ok) {
      alert(result.error.message || tCreateEvent("createFailed"));
      return;
    }

    router.push(`/events/${result.data.data.id}`);
  };

  return (
    <div className="w-full h-fit min-h-screen bg-neutral-200">
      <header
        ref={topRef}
        className="w-full min-h-16 relative flex items-center justify-center shadow-elevation-3 py-4"
      >
        <button
          onClick={() => {
            router.back();
          }}
          className="absolute left-4 top-4 text-primary font-semibold cursor-pointer flex items-center"
        >
          <IonIcon name="ChevronBack" size="16px" />
          <p className="hidden md:block label-large-emphasized">
            {tCreateEvent("back")}
          </p>
        </button>
        <p className="headline-small-emphasized">
          {tCreateEvent("createEvent")}
        </p>
      </header>

      <main className="w-full flex flex-col">
        <div
          className={`
            w-full flex gap-4 ${width < 320 ? "flex-col" : "flex-row flex-wrap justify-between"}
            md:items-center md:justify-center px-4 py-8`}
        >
          {/* Progress Bar */}
          <div
            className={`w-full ${width < 320 ? "max-w-4/5" : "max-w-1/2"} md:max-w-4/5 md:mx-auto flex items-center`}
          >
            {[1, 2, 3].map((stepNumber) => {
              const isActive = stepNumber === step;
              const isCompleted = stepNumber < step;
              const isLast = stepNumber === 3;

              return (
                <div
                  key={stepNumber}
                  className={`${isLast ? "w-fit" : "w-full"} flex items-center`}
                >
                  {/* Step Circle */}
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`
                            w-8 h-8 rounded-full flex items-center justify-center
                            font-bold text-lg transition-colors duration-200 ease-out
                            ${
                              isActive || isCompleted
                                ? "border bg-primary text-neutral-white"
                                : "border border-primary text-neutral-600"
                            }
                        `}
                      style={{
                        transitionDelay: `${stepNumber * 75}ms`,
                      }}
                    >
                      <p className="label-medium-primary -translate-y-0.5">
                        {stepNumber}
                      </p>
                    </div>
                  </div>

                  {/* Progress Line */}
                  {!isLast && (
                    <div className="relative min-w-6 w-full h-1 mx-2 rounded-full">
                      <div className="absolute inset-0 bg-gray-300" />
                      <div
                        className={`
                            absolute inset-0 bg-primary transition-all duration-400 ease-out
                            ${isCompleted ? "w-full" : ""}
                            ${isActive ? "w-1/2" : ""}
                            ${!isActive && !isCompleted ? "w-0" : ""}
                        `}
                        style={{
                          transitionDelay: `${stepNumber * 100}ms`,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Show Example */}
          <Button
            mode="outline"
            bordered="square"
            expanded
            className="w-fit h-9 md:hidden"
            onClick={() => setShowPreview(true)}
          >
            <p className="label-large-primary -translate-y-1">
              {tCreateEvent("showExample")}
            </p>
          </Button>
        </div>

        <div className="flex gap-6 md:px-4">
          {/* Preview */}
          <div className="w-full flex-1 hidden md:flex md:flex-col md:flex-2 md:gap-4">
            {/* Header */}
            <div className="flex justify-between gap-2 flex-wrap">
              <h2 className="title-large-emphasized text-primary">
                {tCreateEvent("eventPreview")}
              </h2>

              <Select value={cardMode} onValueChange={setCardMode}>
                <SelectTrigger className="w-[150px] bg-neutral-white">
                  <SelectValue placeholder={tCreateEvent("eventPreview")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={CardPreviewType.CARD_PREVIEW}>
                      {tCreateEvent(CardPreviewType.CARD_PREVIEW)}
                    </SelectItem>
                    <SelectItem value={CardPreviewType.DETAIL_PREVIEW}>
                      {tCreateEvent(CardPreviewType.DETAIL_PREVIEW)}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div
              className={`max-w-full ${cardMode == CardPreviewType.CARD_PREVIEW ? "max-h-[55vh]" : "max-h-screen"} h-fit bg-neutral-white rounded-4xl px-4 py-6 overflow-y-auto break-all`}
            >
              <CreateEventPreview eventForm={eventForm} cardMode={cardMode} />
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-4">
            {/* Form */}
            <div className="w-full flex-4 min-h-fit bg-neutral-white px-4 py-8 md:rounded-4xl">
              {step === 1 && (
                <CreateEventStep1
                  eventForm={eventForm}
                  setEventForm={setEventForm}
                />
              )}
              {step === 2 && (
                <CreateEventStep2
                  eventForm={eventForm}
                  setEventForm={setEventForm}
                />
              )}
              {step === 3 && (
                <CreateEventStep3
                  eventForm={eventForm}
                  setEventForm={setEventForm}
                />
              )}
            </div>

            {/* Buttons */}
            <div className="w-full flex px-4 py-8 justify-between gap-4 flex-wrap items-center">
              <Button
                mode="outline"
                bordered="square"
                expanded
                disabled={step == 1}
                className={`${
                  step != 1
                    ? "cursor-pointer border-primary text-neutral-black"
                    : "cursor-default border-neutral-400 text-neutral-400"
                } max-w-40 h-9`}
                onClick={() => {
                  if (step != 1) {
                    setStep((prev) => prev - 1);
                    scrollToTop();
                    return;
                  }
                }}
              >
                <p className="-translate-y-1">{tCreateEvent("back")}</p>
              </Button>
              {step != 3 && (
                <Button
                  mode="outline"
                  bordered="square"
                  expanded
                  disabled={
                    (step == 1 && !validStep1) || (step == 2 && !validStep2)
                  }
                  className={`${
                    (step == 1 && validStep1) || (step == 2 && validStep2)
                      ? "cursor-pointer border-primary text-neutral-black"
                      : "cursor-default border-neutral-400 text-neutral-400"
                  } max-w-40 h-9`}
                  onClick={() => {
                    if (step != 3) {
                      if (
                        (step == 1 && validStep1) ||
                        (step == 2 && validStep2)
                      ) {
                        setStep((prev) => prev + 1);
                        scrollToTop();
                        return;
                      }
                    }
                  }}
                >
                  <p className="-translate-y-1">{tCreateEvent("next")}</p>
                </Button>
              )}
              {step == 3 && (
                <Button
                  mode="filled"
                  bordered="square"
                  expanded
                  disabled={(step == 3 && !validStep3) || isSubmitting}
                  className={`cursor-pointer max-w-40 h-9 ${
                    validStep3
                      ? "cursor-pointer border-primary"
                      : "cursor-default border-neutral-400 bg-transparent text-neutral-400"
                  }`}
                  onClick={() => {
                    if (step == 3 && validStep3 && !isSubmitting) {
                      handleCreateEvent();
                    }
                  }}
                >
                  <p className="-translate-y-1">
                    {isSubmitting
                      ? tCreateEvent("creating")
                      : tCreateEvent("create")}
                  </p>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* For Mobile */}
      {width < 425 && (
        <Drawer open={showPreview} onOpenChange={setShowPreview}>
          <DrawerContent className="px-4 py-2 bg-neutral-white h-fit max-h-[80vh]">
            <DrawerHeader>
              <div className="flex justify-between gap-2 flex-wrap items-center">
                <DrawerTitle className="title-large-emphasized text-primary">
                  {tCreateEvent("eventPreview")}
                </DrawerTitle>

                <Select value={cardMode} onValueChange={setCardMode}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder={tCreateEvent("eventPreview")} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={CardPreviewType.CARD_PREVIEW}>
                        {tCreateEvent(CardPreviewType.CARD_PREVIEW)}
                      </SelectItem>
                      <SelectItem value={CardPreviewType.DETAIL_PREVIEW}>
                        {tCreateEvent(CardPreviewType.DETAIL_PREVIEW)}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </DrawerHeader>

            <div
              className={`max-w-full h-fit max-h-[60vh] ${cardMode == CardPreviewType.CARD_PREVIEW && "bg-neutral-100"} rounded-4xl p-4 mb-6 overflow-y-auto break-all`}
            >
              <CreateEventPreview eventForm={eventForm} cardMode={cardMode} />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* For Tablet */}
      {width >= 425 && width < 768 && (
        <>
          {/* Preview */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent
              className={`bg-transparent border-none [&>button]:hidden min-w-[60vw] max-w-[80vw] ${cardMode == CardPreviewType.CARD_PREVIEW ? "h-fit" : "h-[80vh]"} p-0`}
            >
              {/* Header */}
              <div
                className={`w-full ${cardMode == CardPreviewType.CARD_PREVIEW ? "h-fit" : "h-full"} flex justify-between gap-2 px-6 py-4 bg-neutral-white rounded-2xl items-center`}
              >
                <DialogTitle className="headline-small-emphasized text-primary">
                  {tCreateEvent("eventPreview")}
                </DialogTitle>

                <Select value={cardMode} onValueChange={setCardMode}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CardPreviewType.CARD_PREVIEW}>
                      {tCreateEvent(CardPreviewType.CARD_PREVIEW)}
                    </SelectItem>
                    <SelectItem value={CardPreviewType.DETAIL_PREVIEW}>
                      {tCreateEvent(CardPreviewType.DETAIL_PREVIEW)}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content */}
              <div className="w-full flex items-center justify-center bg-neutral-white py-4 rounded-2xl h-full overflow-auto">
                <div
                  className={`w-full h-fit max-h-full ${cardMode == CardPreviewType.CARD_PREVIEW && "bg-neutral-100 max-w-[60vw]"} rounded-4xl p-4 overflow-y-auto break-all`}
                >
                  <CreateEventPreview
                    eventForm={eventForm}
                    cardMode={cardMode}
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default EventCreateTemplate;
