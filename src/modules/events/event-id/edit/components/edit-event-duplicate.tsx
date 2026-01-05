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
import Button from "@shared/Button";
import EditableTime from "@modules/events/create/components/editable-time";

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

  const [agendaStart, setAgendaStart] = useState<string>("");
  const [agendaEnd, setAgendaEnd] = useState<string>("");
  const [agendaName, setAgendaName] = useState<string>("");

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

  const buildAgendaDate = (baseDate: Date, time: string) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date(baseDate);
    d.setHours(h, m, 0, 0);
    return d;
  };

  const clampTime = (time: string, min?: Date, max?: Date): string => {
    if (!min || !max) return time;

    const [h, m] = time.split(":").map(Number);
    const d = new Date(min);
    d.setHours(h, m, 0, 0);

    if (d < min) return format(min, "HH:mm");
    if (d > max) return format(max, "HH:mm");

    return time;
  };

  const handleAddAgenda = () => {
    if (!duplicatedEventForm.startTime || !duplicatedEventForm.endTime) return;

    if (!agendaStart || !agendaEnd || !agendaName) return;

    const start = buildAgendaDate(duplicatedEventForm.startTime, agendaStart);
    const end = buildAgendaDate(duplicatedEventForm.startTime, agendaEnd);

    if (
      start < duplicatedEventForm.startTime ||
      end > duplicatedEventForm.endTime
    )
      return;

    if (end < start) return;

    const newAgenda = {
      id: crypto.randomUUID(),
      activity_name: agendaName,
      startTime: start,
      endTime: end,
    };

    const sortedAgenda = [...duplicatedEventForm.agenda, newAgenda].sort(
      (a, b) =>
        a.startTime.getTime() - b.startTime.getTime() ||
        a.endTime.getTime() - b.endTime.getTime()
    );

    setDuplicatedEventForm({
      ...duplicatedEventForm,
      agenda: sortedAgenda,
    });

    setAgendaStart(format(duplicatedEventForm.startTime, "HH:mm"));
    setAgendaEnd(format(duplicatedEventForm.endTime, "HH:mm"));
    setAgendaName("");
  };

  const handleRemoveAgenda = (index: number) => {
    const newAgenda = duplicatedEventForm.agenda.filter((_, i) => i !== index);

    setDuplicatedEventForm({
      ...duplicatedEventForm,
      agenda: newAgenda,
    });
  };

  const updateAgendaTime = (
    index: number,
    field: "startTime" | "endTime",
    time: string
  ) => {
    const updated = [...duplicatedEventForm.agenda];
    const base = updated[index][field];
    const newDate = updateTime(base, time);

    if (!duplicatedEventForm.startTime || !duplicatedEventForm.endTime) return;

    if (field === "startTime" && newDate > updated[index].endTime) return;
    if (field === "startTime" && newDate < duplicatedEventForm.startTime)
      return;

    if (field === "endTime" && newDate < updated[index].startTime) return;
    if (field === "endTime" && newDate > duplicatedEventForm.endTime) return;

    updated[index] = {
      ...updated[index],
      [field]: newDate,
    };

    const sortedAgenda = updated.sort(
      (a, b) =>
        a.startTime.getTime() - b.startTime.getTime() ||
        a.endTime.getTime() - b.endTime.getTime()
    );

    setDuplicatedEventForm({ ...duplicatedEventForm, agenda: sortedAgenda });
  };

  const updateAgendaName = (index: number, name: string) => {
    const updated = [...duplicatedEventForm.agenda];
    updated[index] = { ...updated[index], activity_name: name };
    setDuplicatedEventForm({ ...duplicatedEventForm, agenda: updated });
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
          <p className="title-large-emphasized">
            {tEditEvent("date")} <span className="text-primary">*</span>
          </p>

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
          <p className="title-large-emphasized">
            {tEditEvent("time")} <span className="text-primary">*</span>
          </p>

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
        <p className="title-large-emphasized">
          {tEditEvent("location")} <span className="text-primary">*</span>
        </p>
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

      {/* Agenda */}
      <div className="flex flex-col gap-4">
        <p className="title-large-emphasized">{tEditEvent("agenda")}</p>

        <div className="flex flex-col gap-4 px-4 py-6 rounded-4xl bg-neutral-100">
          {/* Title */}
          <p className="title-medium-emphasized">{tEditEvent("agendaText")}</p>

          {/* Time */}
          <div className="flex gap-4 w-full">
            {/* Start Time */}
            <div className="flex flex-col gap-2 w-full">
              <label className="relative">
                <input
                  type="time"
                  step="60"
                  value={agendaStart}
                  min={formatTime(duplicatedEventForm.startTime) ?? undefined}
                  max={formatTime(duplicatedEventForm.endTime) ?? undefined}
                  disabled={
                    !duplicatedEventForm.startTime ||
                    !duplicatedEventForm.endTime
                  }
                  onChange={(e) => {
                    const value = clampTime(
                      e.target.value,
                      duplicatedEventForm.startTime,
                      duplicatedEventForm.endTime
                    );

                    setAgendaStart(value);

                    if (agendaEnd && value >= agendaEnd) {
                      setAgendaEnd(value);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                <div
                  className={cn(
                    "w-full h-10 flex items-center justify-between border rounded-md pl-3 body-large-primary",
                    !isDateSelected && "opacity-50 pointer-events-none"
                  )}
                >
                  <span>{agendaStart || tEditEvent("timePlaceholder")}</span>
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
                  value={agendaEnd}
                  min={
                    (agendaStart ||
                      formatTime(duplicatedEventForm.startTime)) ??
                    undefined
                  }
                  max={formatTime(duplicatedEventForm.endTime) ?? undefined}
                  disabled={
                    !duplicatedEventForm.startTime ||
                    !duplicatedEventForm.endTime
                  }
                  onChange={(e) => {
                    const value = clampTime(
                      e.target.value,
                      duplicatedEventForm.startTime,
                      duplicatedEventForm.endTime
                    );

                    if (agendaStart && value <= agendaStart) {
                      setAgendaEnd(agendaStart);
                    } else {
                      setAgendaEnd(value);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                <div
                  className={cn(
                    "w-full h-10 flex items-center justify-between border rounded-md pl-3 body-large-primary",
                    !isDateSelected && "opacity-50 pointer-events-none"
                  )}
                >
                  <span>{agendaEnd || tEditEvent("timePlaceholder")}</span>
                  <IonIcon name="Time" size="16px" className="text-primary" />
                </div>
              </label>

              <p className="pl-3 body-small-primary text-neutral-500">
                {tEditEvent("endTime")}
              </p>
            </div>
          </div>

          {/* Description */}
          <Input
            value={agendaName}
            placeholder={tEditEvent("descriptionPlaceholder")}
            onChange={(e) => setAgendaName(e.target.value)}
            className="w-full sm:flex-1 body-large-primary"
          />

          {/* Button */}
          <Button
            mode="filled"
            bordered="square"
            expanded={false}
            onClick={handleAddAgenda}
            className={`h-9 w-fit ${
              agendaStart && agendaEnd && agendaName
                ? "cursor-pointer"
                : "cursor-default border-neutral-400 text-neutral-400 bg-transparent"
            }`}
          >
            {tEditEvent("addAgenda")}
          </Button>
        </div>
      </div>

      {/* Agenda List */}
      {duplicatedEventForm.agenda.map((item, index) => (
        <div
          key={item.id}
          className="flex items-center gap-2 border rounded-md px-3 py-2"
        >
          {/* Remove */}
          <button
            type="button"
            onClick={() => handleRemoveAgenda(index)}
            className="text-primary mt-2"
          >
            <IonIcon name="RemoveCircleOutline" size="18px" />
          </button>

          {/* Content */}
          <div className="flex flex-col gap-2 w-full min-w-0">
            {/* Time Row */}
            <div className="flex gap-3 w-full flex-wrap">
              {/* Start Time */}
              <EditableTime
                value={item.startTime}
                min={duplicatedEventForm.startTime}
                max={item.endTime}
                onChange={(time) => updateAgendaTime(index, "startTime", time)}
              />

              {/* End Time */}
              <EditableTime
                value={item.endTime}
                min={item.startTime}
                max={duplicatedEventForm.endTime}
                onChange={(time) => updateAgendaTime(index, "endTime", time)}
              />
            </div>

            {/* Name */}
            <Input
              value={item.activity_name}
              onChange={(e) => updateAgendaName(index, e.target.value)}
              className="body-large-primary"
              placeholder={tEditEvent("descriptionPlaceholder")}
            />
          </div>
        </div>
      ))}

      {/* Organizer */}
      <div className="flex flex-col gap-2">
        <p className="title-large-emphasized">
          {tEditEvent("organizer")} <span className="text-primary">*</span>
        </p>
        <Input
          value={duplicatedEventForm.organizer}
          placeholder={tEditEvent("organizerPlaceholder")}
          className="body-large-primary focus:border-primary focus-visible:ring-0"
          onChange={(e) =>
            setDuplicatedEventForm({
              ...duplicatedEventForm,
              organizer: e.target.value,
            })
          }
        />
      </div>

      {/* Evaluation Form */}
      <div className="flex flex-col gap-2">
        <p className="title-large-emphasized">
          {tEditEvent("evaluationFormLink")}
        </p>
        <Input
          type="url"
          value={duplicatedEventForm.evaluation_form}
          placeholder={tEditEvent("evaluationFormLinkPlaceholder")}
          className="body-large-primary focus:border-primary focus-visible:ring-0"
          onChange={(e) => {
            setDuplicatedEventForm({
              ...duplicatedEventForm,
              evaluation_form: e.target.value,
            });
          }}
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
