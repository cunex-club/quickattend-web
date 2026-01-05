import { Calendar } from "@assets/components/ui/calendar";
import { Input } from "@assets/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";
import { cn } from "@assets/lib/utils";
import {
  AttendanceType,
  EventFormInterface,
} from "@modules/events/create/template";
import IonIcon from "@shared/IonIcon";
import { format, startOfDay } from "date-fns";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SideTabType } from "../template";
import Button from "@shared/Button";

interface EditEventDuplicateProps {
  eventForm: EventFormInterface;
  setOpenDuplicate: (bool: boolean) => void;
}

const EditEventDuplicate = ({
  eventForm,
  setOpenDuplicate,
}: EditEventDuplicateProps) => {
  const tEditEvent = useTranslations("EditEvent");
  const today = startOfDay(new Date());
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);
  const [duplicatedEventForm, setDuplicatedEventForm] = useState(eventForm);
  const [valid, setValid] = useState(false);

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (
      // Section 1
      duplicatedEventForm.name &&
      duplicatedEventForm.date &&
      duplicatedEventForm.startTime &&
      duplicatedEventForm.endTime &&
      duplicatedEventForm.location &&
      duplicatedEventForm.organizer &&
      // Section 2
      (duplicatedEventForm.attendance_type == AttendanceType.ALL ||
        (duplicatedEventForm.attendance_type == AttendanceType.FACULTIES &&
          duplicatedEventForm.selectedFaculties.length > 0) ||
        (duplicatedEventForm.attendance_type == AttendanceType.WHITELIST &&
          duplicatedEventForm.selectedStudents.length > 0)) &&
      duplicatedEventForm.revealed_fields.length > 0 &&
      // Section 3
      (!duplicatedEventForm.evaluation_form ||
        isValidUrl(duplicatedEventForm.evaluation_form))
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [duplicatedEventForm]);

  const isDateSelected = !!duplicatedEventForm.date;

  const updateTime = (baseDate: Date, time: string): Date => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const addMins = (date: Date, mins: number): Date => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() + mins);
    return d;
  };

  const formatDate = (date: string, locale: string) => {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date?: Date) => (date ? format(date, "HH:mm") : null);

  const isEndAfterStart = (start?: Date, end?: Date) => {
    if (!start || !end) return true;
    return end.getTime() > start.getTime();
  };

  const handleSelectDate = (date?: Date) => {
    if (!date) return;

    setDuplicatedEventForm({
      ...duplicatedEventForm,
      date,
    });
  };

  const handleStartTimeChange = (time: string) => {
    if (!duplicatedEventForm.startTime) return;

    const newStart = updateTime(duplicatedEventForm.startTime, time);
    let endTime = duplicatedEventForm.endTime;

    if (!isEndAfterStart(newStart, duplicatedEventForm.endTime)) {
      endTime = addMins(newStart, 1);
    }

    setDuplicatedEventForm({
      ...duplicatedEventForm,
      startTime: newStart,
      endTime,
    });
  };

  const handleEndTimeChange = (time: string) => {
    if (!duplicatedEventForm.startTime || !duplicatedEventForm.endTime) return;

    const newEnd = updateTime(duplicatedEventForm.endTime, time);

    if (!isEndAfterStart(duplicatedEventForm.startTime, newEnd)) return;

    setDuplicatedEventForm({
      ...duplicatedEventForm,
      endTime: newEnd,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Name */}
      <h1 className="title-large-emphasized line-clamp-2">
        {duplicatedEventForm.name || tEditEvent("namePlaceholder")}
      </h1>

      {/* Description */}
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="title-medium-emphasized text-neutral-600">
          {tEditEvent("descriptionPreview")}
        </h2>
        <p className="body-small-primary text-neutral-600 line-clamp-5 whitespace-pre-wrap">
          {duplicatedEventForm.description ||
            tEditEvent("descriptionPlaceholder")}
        </p>
      </div>

      {/* Date and Time */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Date */}
        <div className="flex flex-col gap-2 w-full">
          <p className="title-large-emphasized">{tEditEvent("date")}</p>

          <Popover>
            <PopoverTrigger asChild>
              <div className="w-full h-10 flex items-center justify-between border rounded-md cursor-pointer pl-3 body-large-primary">
                <span>
                  {!mounted
                    ? tEditEvent("datePlaceholder")
                    : duplicatedEventForm.date
                      ? formatDate(
                          duplicatedEventForm.date.toISOString(),
                          locale
                        )
                      : tEditEvent("datePlaceholder")}
                </span>

                <div className="h-full w-10 flex items-center justify-center bg-primary text-white rounded-r-md">
                  <IonIcon name="Calendar" size="16px" />
                </div>
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                selected={duplicatedEventForm.date}
                onSelect={(date) => {
                  handleSelectDate(date);
                }}
                defaultMonth={today}
                disabled={(date) => date < today}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time */}
        <div className="flex flex-col gap-2 w-full">
          <p className="title-large-emphasized">{tEditEvent("time")}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Start Time */}
            <div className="flex flex-col gap-2 w-full">
              <label className="relative">
                <input
                  type="time"
                  step="60"
                  disabled={!isDateSelected}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  value={formatTime(duplicatedEventForm.startTime) ?? ""}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                />

                <div
                  className={cn(
                    "w-full h-10 flex items-center justify-between border rounded-md pl-3 body-large-primary",
                    !isDateSelected && "opacity-50 pointer-events-none"
                  )}
                >
                  <span>
                    {formatTime(duplicatedEventForm.startTime) ??
                      tEditEvent("timePlaceholder")}
                  </span>
                  <IonIcon name="Time" size="16px" className="text-primary" />
                </div>
              </label>

              <p className="pl-3 body-small-primary text-neutral-500">
                {tEditEvent("startTime")}
              </p>
            </div>

            {/* End Time */}
            <div className="flex flex-col gap-2 w-full">
              <label className="relative">
                <input
                  type="time"
                  step="60"
                  disabled={!isDateSelected}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  value={formatTime(duplicatedEventForm.endTime) ?? ""}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                />

                <div
                  className={cn(
                    "w-full h-10 flex items-center justify-between border rounded-md pl-3 body-large-primary",
                    !isDateSelected && "opacity-50 pointer-events-none"
                  )}
                >
                  <span>
                    {formatTime(duplicatedEventForm.endTime) ??
                      tEditEvent("timePlaceholder")}
                  </span>
                  <IonIcon name="Time" size="16px" className="text-primary" />
                </div>
              </label>

              <p className="pl-3 body-small-primary text-neutral-500">
                {tEditEvent("endTime")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <p className="title-large-emphasized">{tEditEvent("location")}</p>
        <Input
          value={duplicatedEventForm.location}
          placeholder={tEditEvent("locationPlaceholder")}
          className="body-large-primary focus:border-primary focus-visible:ring-0"
          onChange={(e) =>
            setDuplicatedEventForm({
              ...duplicatedEventForm,
              location: e.target.value,
            })
          }
        />
      </div>

      {/* Button */}
      <Button
        mode="filled"
        bordered="round"
        expanded={false}
        onClick={() => {
          if (valid) {
            // ===============
            // TODO: create an event using API
            // ===============

            window.location.href = "/events";
            setOpenDuplicate(false);
          }
        }}
        className={`${
          valid
            ? "cursor-pointer border-primary"
            : "cursor-default border-neutral-400 bg-transparent text-neutral-400"
        } h-9 px-1 pr-2 flex items-center`}
      >
        <span className="translate-y-1">{tEditEvent("duplicate")}</span>
      </Button>
    </div>
  );
};

export default EditEventDuplicate;
