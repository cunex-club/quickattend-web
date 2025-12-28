"use client";

import { useEffect, useState } from "react";
import { useSidebar } from "../../../../context/SidebarContext";
import { useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import { useRouter } from "next/navigation";
import CreateEventStep1 from "../components/create-event-step1";
import CreateEventStep2 from "../components/create-event-step2";
import CreateEventStep3 from "../components/create-event-step3";
import Button from "@shared/Button";
import CreateEventResult from "../components/create-event-result";

const EventCreateTemplate = () => {
  const { setShowSidebar } = useSidebar();
  const tCreateEvent = useTranslations("CreateEvent");
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showExample, setShowExample] = useState(false);
  const [width, setWidth] = useState(0);

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

  return (
    <>
      <header className="w-full h-16 bg-neutral-200 relative flex items-center justify-center shadow-elevation-3">
        <IonIcon
          name="ChevronBack"
          size="16px"
          className="absolute left-4 top-6 text-primary font-semibold cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <p className="headline-small-primary font-bold">
          {tCreateEvent("createEvent")}
        </p>
      </header>
      <main className="w-full flex flex-col">
        <div
          className={`
            w-full flex gap-4 ${width < 320 ? "flex-col" : "flex-row flex-wrap justify-between"}
            sm:items-center sm:justify-center bg-neutral-200 px-4 py-8`}
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
                        font-bold text-lg transition-colors duration-300
                        ${
                          isActive || isCompleted
                            ? "border bg-primary text-neutral-white"
                            : "border border-primary text-neutral-600"
                        }`}
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
                            absolute inset-0 bg-primary transition-all duration-300
                            ${isCompleted ? "w-full" : ""}
                            ${isActive ? "w-1/2" : ""}
                            ${!isActive && !isCompleted ? "w-0" : ""}
                            `}
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
        <div className="w-full px-4 py-8">
          {step === 1 && <CreateEventStep1 />}
          {step === 2 && <CreateEventStep2 />}
          {step === 3 && <CreateEventStep3 />}
        </div>
      </main>

      {showExample && <CreateEventResult />}
    </>
  );
};

export default EventCreateTemplate;
