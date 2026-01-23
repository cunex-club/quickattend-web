"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@assets/components/ui/sheet";
import Button from "@shared/Button";
import DatePicker from "@shared/DatePicker";
import TextField from "@shared/TextField";
import Icon from "@shared/Icon";
import IonIcon from "@shared/IonIcon";
import { EventInfo } from "@customTypes/events";
import EventTimePicker from "@shared/EventTimePicker";

interface MobileDuplicateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData: EventInfo;
}

const MobileDuplicateSheet = ({
  open,
  onOpenChange,
  eventData,
}: MobileDuplicateSheetProps) => {
  const t = useTranslations("EventDetail");
  const [step, setStep] = useState(1);
  const [schedules, setSchedules] = useState<
    { startTime: string; endTime: string; description: string }[]
  >([]);
  const [newSchedule, setNewSchedule] = useState({
    startTime: "",
    endTime: "",
    description: "",
  });
  const [evaluationLink, setEvaluationLink] = useState("");

  const handleAddSchedule = () => {
    if (newSchedule.startTime && newSchedule.endTime) {
      setSchedules([...schedules, newSchedule]);
      setNewSchedule({ startTime: "", endTime: "", description: "" });
    }
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleUpdateSchedule = (
    index: number,
    field: "startTime" | "endTime" | "description",
    value: string,
  ) => {
    const newSchedules = [...schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setSchedules(newSchedules);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setStep(1);
      }}
    >
      <SheetContent
        side="bottom"
        className="rounded-t-[20px] px-4 pb-8 pt-4 h-[90vh] overflow-y-auto flex flex-col"
      >
        <SheetHeader className="mb-4 shrink-0">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-neutral-200 mb-2" />
          <SheetTitle className="headline-medium-emphasized text-primary text-center">
            {t("duplicateEvent")}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pb-20">
          {/* --- Step 1 Content: Event Info --- */}
          {/* Event Name */}
          <div className="headline-medium-emphasized">{eventData.name}</div>

          {/* Description */}
          <div className="space-y-2">
            <div className="headline-small-emphasized">{t("eventDetails")}</div>
            <div className="body-large-primary">{eventData.description}</div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="headline-small-emphasized">
              {t("date")} <span className="text-red-500">*</span>
            </label>
            <DatePicker placeholder="วัน / เดือน / ปี" />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label className="headline-small-emphasized">
              {t("time")} <span className="text-red-500">*</span>
            </label>
            <EventTimePicker layout="col" className="gap-4" />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="headline-small-emphasized">
              {t("location")} <span className="text-red-500">*</span>
            </label>
            <TextField
              type="text"
              placeholder={t("locationPlaceholder")}
              defaultValue={eventData.location}
              inputClassName="body-large-primary"
            />
          </div>

          {/* Organizer */}
          <div className="space-y-2">
            <div className="headline-small-emphasized">{t("organizer")}</div>
            <div className="body-large-primary">
              {t("defaultOrganizerName")}
            </div>
          </div>

          {/* --- Step 2 Content: Schedule --- */}
          {step >= 2 && (
            <div className="pt-6 border-t border-neutral-200 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Schedule Section */}
              <div className="space-y-4">
                <div className="headline-small-emphasized text-primary">
                  {t("eventSchedule")} <span className="text-red-500">*</span>
                </div>

                {/* Add Schedule Block */}
                <div className="bg-neutral-100 p-4 rounded-xl space-y-4">
                  <div className="title-medium-emphasized">
                    {t("addScheduleSlot")}
                  </div>
                  <EventTimePicker
                    startTime={newSchedule.startTime}
                    endTime={newSchedule.endTime}
                    onStartTimeChange={(v) =>
                      setNewSchedule({ ...newSchedule, startTime: v })
                    }
                    onEndTimeChange={(v) =>
                      setNewSchedule({ ...newSchedule, endTime: v })
                    }
                    className="!grid-cols-2 gap-2"
                  />

                  <TextField
                    placeholder={t("openingCeremonyPlaceholder")}
                    value={newSchedule.description}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        description: e.target.value,
                      })
                    }
                    className="w-full bg-white body-medium-primary"
                  />
                  <Button
                    mode="filled"
                    bordered="round"
                    expanded={false}
                    className="bg-primary hover:bg-primary/90 w-full"
                    onClick={handleAddSchedule}
                  >
                    <p className="label-large-emphasized text-white">
                      {t("addSchedule")}
                    </p>
                  </Button>
                </div>

                {/* Schedule List */}
                <div className="space-y-4">
                  {schedules.map((item, index) => (
                    <div
                      key={index}
                      className="space-y-2 border-b pb-4 last:border-0"
                    >
                      <div className="flex items-start gap-4">
                        <button
                          className="mt-3 text-red-500 shrink-0"
                          onClick={() => handleRemoveSchedule(index)}
                        >
                          <Icon name="remove_circle_outline" size={24} />
                        </button>
                        <div className="flex-1">
                          <EventTimePicker
                            startTime={item.startTime}
                            endTime={item.endTime}
                            onStartTimeChange={(v) =>
                              handleUpdateSchedule(index, "startTime", v)
                            }
                            onEndTimeChange={(v) =>
                              handleUpdateSchedule(index, "endTime", v)
                            }
                            className="!grid-cols-2 gap-2"
                          />
                        </div>
                      </div>
                      <TextField
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateSchedule(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>

                {/* Evaluation Link */}
                <div className="space-y-2 pt-4">
                  <div className="headline-small-emphasized">
                    {t("evaluationFormLink")}
                  </div>
                  <TextField
                    placeholder={t("evaluationFormLinkPlaceholder")}
                    value={evaluationLink}
                    onChange={(e) => setEvaluationLink(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-100">
          {step === 1 ? (
            <Button
              mode="filled"
              bordered="round"
              expanded={true}
              className="title-large-emphasized py-3"
              onClick={() => {
                setStep(2);
                // Optional: Scroll to bottom could be added here if ref was used,
                // but usually the expansion is enough visibility or user scrolls.
              }}
            >
              {t("next")}
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button
                mode="outline"
                bordered="round"
                expanded={true}
                className="title-large-emphasized py-3 border-pink-500 text-pink-500 hover:bg-pink-50"
                onClick={() => setStep(1)}
              >
                {t("back")}
              </Button>
              <Button
                mode="filled"
                bordered="round"
                expanded={true}
                className="title-large-emphasized py-3"
                onClick={() => {
                  console.log("Confirm duplicate", {
                    schedules,
                    evaluationLink,
                  });
                  onOpenChange(false);
                }}
              >
                {t("submitDuplicate")}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileDuplicateSheet;
