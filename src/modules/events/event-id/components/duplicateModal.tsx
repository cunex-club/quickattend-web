"use client";

import { useState } from "react";
import { cn } from "@assets/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@assets/components/ui/dialog";
import Button from "@shared/Button";
import DatePicker from "@shared/DatePicker";
import EventTimePicker from "@shared/EventTimePicker";
import { EventInfo } from "@customTypes/events";
import TextField from "@shared/TextField";
import DuplicateEventSchedule from "./duplicateEventSchedule";

import { useTranslations } from "next-intl";

interface DuplicateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData: EventInfo;
}

const DuplicateModal = ({
  open,
  onOpenChange,
  eventData,
}: DuplicateModalProps) => {
  const t = useTranslations("EventDetail");
  const [step, setStep] = useState(1);
  const [schedules, setSchedules] = useState<
    { startTime: string; endTime: string; description: string }[]
  >([]);
  const [evaluationLink, setEvaluationLink] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAddSchedule = (newSchedule: {
    startTime: string;
    endTime: string;
    description: string;
  }) => {
    setSchedules([...schedules, newSchedule]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i: number) => i !== index));
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
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setStep(1);
      }}
    >
      <DialogContent
        className="!max-w-2xl bg-neutral-white shadow-sm border border-neutral-200 p-10 rounded-xl"
        showCloseButton={false}
      >
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="headline-large-emphasized text-primary">
                {t("duplicateEvent")}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 m-4 ">
              {/* Event Name */}
              <div className="headline-medium-emphasized">{eventData.name}</div>

              {/* Event Description */}
              <div className="space-y-2">
                <div className="headline-small-emphasized">
                  {t("eventDetails")}
                </div>
                <div className="body-large-primary">
                  {eventData.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date */}
                <div className="space-y-2">
                  <label className="body-large-primary">
                    {t("date")} <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={date}
                    onChange={setDate}
                    placeholder="วัน / เดือน / ปี"
                  />
                </div>

                {/* Time */}
                <div className="space-y-2">
                  <label className="body-large-primary">
                    {t("time")} <span className="text-red-500">*</span>
                  </label>
                  <EventTimePicker
                    startTime={startTime}
                    endTime={endTime}
                    onStartTimeChange={setStartTime}
                    onEndTimeChange={setEndTime}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="body-large-primary">
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
                <div className="headline-small-emphasized">
                  {t("organizer")}
                </div>
                <div className="body-large-primary">
                  {t("defaultOrganizerName")}
                </div>
              </div>

              {/* Next Button */}
              <div className="flex justify-end pt-2">
                <Button
                  mode="filled"
                  bordered="round"
                  expanded={false}
                  className="title-large-emphasized px-12 py-6"
                  onClick={() => setStep(2)}
                >
                  {t("next")}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <DuplicateEventSchedule
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onRemoveSchedule={handleRemoveSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            evaluationLink={evaluationLink}
            onEvaluationLinkChange={setEvaluationLink}
            onClose={() => onOpenChange(false)}
            onBack={() => setStep(1)}
            onConfirm={() => {
              console.log("Confirm duplicate event", {
                schedules,
                evaluationLink,
              });
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateModal;
