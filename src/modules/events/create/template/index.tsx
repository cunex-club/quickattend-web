"use client";

import { useEffect, useRef, useState } from "react";
import { useSidebar } from "../../../../context/SidebarContext";
import { useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import { useRouter } from "next/navigation";
import CreateEventStep1 from "../components/create-event-step1";
import CreateEventStep2 from "../components/create-event-step2";
import CreateEventStep3 from "../components/create-event-step3";
import Button from "@shared/Button";
import CreateEventResult from "../components/create-event-result";

export interface Agenda {
  activity_name: string;
  startTime: Date;
  endTime: Date;
}
export interface EventFormInterface {
  name: string;
  description: string;
  date: Date | undefined;
  startTime: Date | undefined;
  endTime: Date | undefined;
  location: string;
  agenda: Agenda[];
  organizer: string;
}

const EventCreateTemplate = () => {
  const { setShowSidebar } = useSidebar();
  const tCreateEvent = useTranslations("CreateEvent");
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [showExample, setShowExample] = useState(false);
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
  });

  const [validStep1, setValidStep1] = useState(false);
  const [validStep2, setValidStep2] = useState(false);
  const [validStep3, setValidStep3] = useState(false);

  useEffect(() => {
    if (
      eventForm.name &&
      eventForm.date &&
      eventForm.startTime &&
      eventForm.endTime &&
      eventForm.location &&
      eventForm.organizer
    ) {
      setValidStep1(true);
    } else {
      setValidStep1(false);
    }

    if (true) {
      setValidStep2(true);
    } else {
      setValidStep2(false);
    }

    if (true) {
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

  return (
    <div className="w-full h-fit min-h-screen bg-neutral-200">
      <header
        ref={topRef}
        className="w-full h-16 relative flex items-center justify-center shadow-elevation-3"
      >
        <IonIcon
          name="ChevronBack"
          size="16px"
          className="absolute left-4 top-6 text-primary font-semibold cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <p className="headline-small-emphasized">
          {tCreateEvent("createEvent")}
        </p>
      </header>

      <main className="w-full flex flex-col">
        <div
          className={`
            w-full flex gap-4 ${width < 320 ? "flex-col" : "flex-row flex-wrap justify-between"}
            sm:items-center sm:justify-center px-4 py-8`}
        >
          {/* Progress Bar */}
          <div
            className={`w-full ${width < 320 ? "max-w-4/5" : "max-w-1/2"} sm:max-w-4/5 sm:mx-auto flex items-center`}
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
            className="w-fit h-9 sm:hidden"
            onClick={() => setShowExample(true)}
          >
            <p className="label-large-primary -translate-y-1">
              {tCreateEvent("showExample")}
            </p>
          </Button>
        </div>

        {/* Content */}
        <div className="w-full px-4 py-8 bg-neutral-white">
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
      </main>

      <footer className="w-full flex px-4 py-8 justify-between gap-4 flex-wrap items-center">
        <Button
          mode="outline"
          bordered="square"
          expanded
          className={`${
            step != 1
              ? "cursor-pointer border-primary text-neutral-black"
              : "cursor-default border-neutral-400 text-neutral-400"
          } max-w-40 h-9`}
          onClick={() => {
            if (step != 1) {
              setStep((prev) => prev - 1);
            }
            scrollToTop();
          }}
        >
          {tCreateEvent("back")}
        </Button>
        {step != 3 && (
          <Button
            mode="outline"
            bordered="square"
            expanded
            className={`${
              (step == 1 && validStep1) || (step == 2 && validStep2)
                ? "cursor-pointer border-primary text-neutral-black"
                : "cursor-default border-neutral-400 text-neutral-400"
            } max-w-40 h-9`}
            onClick={() => {
              if (step != 3) {
                if ((step == 1 && validStep1) || (step == 2 && validStep2)) {
                  setStep((prev) => prev + 1);
                  return;
                }
              }
              scrollToTop();
            }}
          >
            {tCreateEvent("next")}
          </Button>
        )}
        {step == 3 && (
          <Button
            mode="filled"
            bordered="square"
            expanded
            className="cursor-pointer max-w-40 h-9"
            onClick={() => {
              if (step == 3 && validStep3) {
                const agendaText = eventForm.agenda
                  .map((item, index) => {
                    return `${index + 1}. ${item.activity_name} 
                    - Start: ${item.startTime}
                    - End: ${item.endTime}`;
                  })
                  .join("\n\n");

                alert(`Name: ${eventForm.name}
                Description: ${eventForm.description}
                Date: ${eventForm.date}
                Start Time: ${eventForm.startTime}
                End Date: ${eventForm.endTime}
                Location: ${eventForm.location}
                Agenda: ${agendaText}
                Organizer: ${eventForm.organizer}`);
              }
            }}
          >
            {tCreateEvent("create")}
          </Button>
        )}
      </footer>

      {showExample && <CreateEventResult />}
    </div>
  );
};

export default EventCreateTemplate;
