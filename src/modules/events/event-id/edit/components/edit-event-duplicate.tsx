import { EventFormInterface } from "@modules/events/create/template";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Button from "@shared/Button";
import EditEventDuplicateStep1 from "./edit-event-duplicate-step1";
import EditEventDuplicateStep2 from "./edit-event-duplicate-step2";

interface EditEventDuplicateProps {
  eventForm: EventFormInterface;
  setOpenDuplicate: (bool: boolean) => void;
  width: number;
}

const EditEventDuplicate = ({
  eventForm,
  setOpenDuplicate,
  width,
}: EditEventDuplicateProps) => {
  const tEditEvent = useTranslations("EditEvent");

  const [duplicatedEventForm, setDuplicatedEventForm] = useState(eventForm);
  const [validStep1, setValidStep1] = useState(false);
  const [validStep2, setValidStep2] = useState(false);

  const [step, setStep] = useState(1);

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (
      // Step 1
      duplicatedEventForm.name &&
      duplicatedEventForm.date &&
      duplicatedEventForm.startTime &&
      duplicatedEventForm.endTime &&
      duplicatedEventForm.location
    ) {
      setValidStep1(true);
    } else {
      setValidStep1(false);
    }

    if (
      // Step 2
      duplicatedEventForm.organizer &&
      (!duplicatedEventForm.evaluation_form ||
        isValidUrl(duplicatedEventForm.evaluation_form))
    ) {
      setValidStep2(true);
    } else {
      setValidStep2(false);
    }
  }, [duplicatedEventForm]);

  return (
    <div className="flex flex-col gap-4">
      {width < 768 ? (
        <>
          <EditEventDuplicateStep1
            duplicatedEventForm={duplicatedEventForm}
            setDuplicatedEventForm={setDuplicatedEventForm}
          />

          <EditEventDuplicateStep2
            duplicatedEventForm={duplicatedEventForm}
            setDuplicatedEventForm={setDuplicatedEventForm}
          />

          {/* Button */}
          <Button
            mode="filled"
            bordered="round"
            expanded={false}
            disabled={!validStep1 || !validStep2}
            onClick={() => {
              if (validStep1 && validStep2) {
                // ===============
                // TODO: create an event using API
                // ===============

                window.location.href = "/events";
                setOpenDuplicate(false);
              }
            }}
            className={`${
              validStep1 && validStep2
                ? "cursor-pointer border-primary"
                : "cursor-default border-neutral-400 bg-transparent text-neutral-400"
            } h-9 px-1 pr-2 flex items-center`}
          >
            <p className="-translate-y-1">{tEditEvent("submitDuplicate")}</p>
          </Button>
        </>
      ) : (
        <>
          {step == 1 && (
            <>
              <EditEventDuplicateStep1
                duplicatedEventForm={duplicatedEventForm}
                setDuplicatedEventForm={setDuplicatedEventForm}
              />

              {/* Buttons */}
              <div className="flex justify-end">
                <Button
                  mode="filled"
                  bordered="round"
                  expanded={false}
                  disabled={!validStep1}
                  onClick={() => {
                    if (validStep1) {
                      setStep(2);
                    }
                  }}
                  className={`${
                    validStep1
                      ? "cursor-pointer border-primary"
                      : "cursor-default border-neutral-400 bg-transparent text-neutral-400"
                  } w-full max-w-40 h-9 px-1 pr-2 flex items-center`}
                >
                  {tEditEvent("next")}
                </Button>
              </div>
            </>
          )}
          {step == 2 && (
            <>
              <EditEventDuplicateStep2
                duplicatedEventForm={duplicatedEventForm}
                setDuplicatedEventForm={setDuplicatedEventForm}
              />

              {/* Buttons */}
              <div className="flex justify-between gap-4">
                <Button
                  mode="outline"
                  bordered="round"
                  expanded={false}
                  onClick={() => {
                    setStep(1);
                  }}
                  className="w-full max-w-40 h-9 px-1 pr-2 flex items-center text-primary cursor-pointer"
                >
                  {tEditEvent("back")}
                </Button>

                <Button
                  mode="filled"
                  bordered="round"
                  expanded={false}
                  disabled={!validStep2}
                  onClick={() => {
                    if (validStep2) {
                      // ===============
                      // TODO: create an event using API
                      // ===============

                      window.location.href = "/events";
                      setOpenDuplicate(false);
                    }
                  }}
                  className={`${
                    validStep2
                      ? "cursor-pointer border-primary"
                      : "cursor-default border-neutral-400 bg-transparent text-neutral-400"
                  } w-full max-w-40 h-9 px-1 pr-2 flex items-center`}
                >
                  {tEditEvent("submitDuplicate")}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default EditEventDuplicate;
