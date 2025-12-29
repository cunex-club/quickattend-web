import { useTranslations } from "next-intl";
import { EventFormInterface } from "../template";
import { Input } from "@assets/components/ui/input";
import { Calendar } from "@assets/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";
import { format } from "date-fns";
import IonIcon from "@shared/IonIcon";
import { useEffect, useState } from "react";
import { cn } from "@assets/lib/utils";
import Button from "@shared/Button";
import EditableTime from "./editable-time";

interface CreateEventStep1Props {
  eventForm: EventFormInterface;
  setEventForm: (formdata: EventFormInterface) => void;
}

const CreateEventStep1 = ({
  eventForm,
  setEventForm,
}: CreateEventStep1Props) => {
  const tCreateEvent = useTranslations("CreateEvent");

  const [mounted, setMounted] = useState(false);
  const [agendaStart, setAgendaStart] = useState<string>("");
  const [agendaEnd, setAgendaEnd] = useState<string>("");
  const [agendaName, setAgendaName] = useState<string>("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!eventForm.startTime || !eventForm.endTime) return;
    setAgendaStart(format(eventForm.startTime, "HH:mm"));
    setAgendaEnd(format(eventForm.endTime, "HH:mm"));
  }, [eventForm.startTime, eventForm.endTime]);

  const isDateSelected = !!eventForm.date;

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

  const formatTime = (date?: Date) => (date ? format(date, "HH:mm") : null);

  const isEndAfterStart = (start?: Date, end?: Date) => {
    if (!start || !end) return true;
    return end.getTime() > start.getTime();
  };

  const handleSelectDate = (date?: Date) => {
    if (!date) return;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(0, 1, 0, 0);

    setEventForm({
      ...eventForm,
      date,
      startTime: start,
      endTime: end,
    });
  };

  const handleStartTimeChange = (time: string) => {
    if (!eventForm.startTime) return;

    const newStart = updateTime(eventForm.startTime, time);
    let endTime = eventForm.endTime;

    if (!isEndAfterStart(newStart, eventForm.endTime)) {
      endTime = addMins(newStart, 1);
    }

    const newAgenda = eventForm.agenda.map((agenda) => {
      if (agenda.startTime.getTime() < newStart.getTime()) {
        agenda.startTime = newStart;
      }
      if (!isEndAfterStart(agenda.startTime, agenda.endTime)) {
        agenda.endTime = addMins(agenda.startTime, 1);
      }
      return agenda;
    });

    setEventForm({
      ...eventForm,
      startTime: newStart,
      endTime,
      agenda: newAgenda,
    });
  };

  const handleEndTimeChange = (time: string) => {
    if (!eventForm.startTime || !eventForm.endTime) return;

    const newEnd = updateTime(eventForm.endTime, time);

    if (!isEndAfterStart(eventForm.startTime, newEnd)) return;

    const newAgenda = eventForm.agenda.map((agenda) => {
      if (agenda.endTime.getTime() > newEnd.getTime()) {
        agenda.endTime = newEnd;
      }
      return agenda;
    });

    setEventForm({
      ...eventForm,
      endTime: newEnd,
      agenda: newAgenda,
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
    if (!eventForm.startTime || !eventForm.endTime) return;

    if (!agendaStart || !agendaEnd || !agendaName) return;

    const start = buildAgendaDate(eventForm.startTime, agendaStart);
    const end = buildAgendaDate(eventForm.startTime, agendaEnd);

    if (start < eventForm.startTime || end > eventForm.endTime) return;

    if (end < start) return;

    const newAgenda = {
      id: crypto.randomUUID(),
      activity_name: agendaName,
      startTime: start,
      endTime: end,
    };

    const sortedAgenda = [...eventForm.agenda, newAgenda].sort(
      (a, b) =>
        a.startTime.getTime() - b.startTime.getTime() ||
        a.endTime.getTime() - b.endTime.getTime()
    );

    setEventForm({
      ...eventForm,
      agenda: sortedAgenda,
    });

    setAgendaStart(format(eventForm.startTime, "HH:mm"));
    setAgendaEnd(format(eventForm.endTime, "HH:mm"));
    setAgendaName("");
  };

  const handleRemoveAgenda = (index: number) => {
    const newAgenda = eventForm.agenda.filter((_, i) => i !== index);

    setEventForm({
      ...eventForm,
      agenda: newAgenda,
    });
  };

  const updateAgendaTime = (
    index: number,
    field: "startTime" | "endTime",
    time: string
  ) => {
    const updated = [...eventForm.agenda];
    const base = updated[index][field];
    const newDate = updateTime(base, time);

    if (!eventForm.startTime || !eventForm.endTime) return;

    if (field === "startTime" && newDate > updated[index].endTime) return;
    if (field === "startTime" && newDate < eventForm.startTime) return;

    if (field === "endTime" && newDate < updated[index].startTime) return;
    if (field === "endTime" && newDate > eventForm.endTime) return;

    updated[index] = {
      ...updated[index],
      [field]: newDate,
    };

    setEventForm({ ...eventForm, agenda: updated });
  };

  const updateAgendaName = (index: number, name: string) => {
    const updated = [...eventForm.agenda];
    updated[index] = { ...updated[index], activity_name: name };
    setEventForm({ ...eventForm, agenda: updated });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="title-large-emphasized mb-4 text-center">
        {tCreateEvent("eventDetail")}
      </h1>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <p className="title-medium-primary">
          {tCreateEvent("name")} <span className="text-primary">*</span>
        </p>
        <Input
          value={eventForm.name}
          placeholder={tCreateEvent("namePlaceholder")}
          className="!body-large-primary focus:border-primary focus-visible:ring-0"
          onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2">
        <p className="title-medium-primary">{tCreateEvent("description")}</p>
        <Input
          value={eventForm.description}
          placeholder={tCreateEvent("descriptionPlaceholder")}
          className="!body-large-primary focus:border-primary focus-visible:ring-0"
          onChange={(e) =>
            setEventForm({ ...eventForm, description: e.target.value })
          }
        />
      </div>

      {/* Date and Time */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Date */}
        <div className="flex flex-col gap-2 w-full">
          <p className="title-medium-primary">
            {tCreateEvent("date")} <span className="text-primary">*</span>
          </p>

          <Popover>
            <PopoverTrigger asChild>
              <div className="w-full h-10 flex items-center justify-between border rounded-md cursor-pointer pl-3 !body-large-primary">
                <span>
                  {!mounted
                    ? tCreateEvent("datePlaceholder")
                    : eventForm.date
                      ? format(eventForm.date, "dd / MM / yyyy")
                      : tCreateEvent("datePlaceholder")}
                </span>

                <div className="h-full w-10 flex items-center justify-center bg-primary text-white rounded-r-md">
                  <IonIcon name="Calendar" size="16px" />
                </div>
              </div>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0" align="start">
              <Calendar
                mode="single"
                required={false}
                selected={eventForm.date}
                onSelect={handleSelectDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time */}
        <div className="flex flex-col gap-2 w-full">
          <p className="title-medium-primary">
            {tCreateEvent("time")} <span className="text-primary">*</span>
          </p>

          <div className="flex gap-4">
            {/* Start Time */}
            <div className="flex flex-col gap-2 w-full">
              <label className="relative">
                <input
                  type="time"
                  step="60"
                  disabled={!isDateSelected}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  value={formatTime(eventForm.startTime) ?? ""}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                />

                <div
                  className={cn(
                    "w-full h-10 flex items-center justify-between border rounded-md pl-3 !body-large-primary",
                    !isDateSelected && "opacity-50 pointer-events-none"
                  )}
                >
                  <span>
                    {formatTime(eventForm.startTime) ??
                      tCreateEvent("timePlaceholder")}
                  </span>
                  <IonIcon name="Time" size="16px" className="text-primary" />
                </div>
              </label>

              <p className="!body-small-primary text-neutral-500">
                {tCreateEvent("startTime")}
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
                  value={formatTime(eventForm.endTime) ?? ""}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                />

                <div
                  className={cn(
                    "w-full h-10 flex items-center justify-between border rounded-md pl-3 !body-large-primary",
                    !isDateSelected && "opacity-50 pointer-events-none"
                  )}
                >
                  <span>
                    {formatTime(eventForm.endTime) ??
                      tCreateEvent("timePlaceholder")}
                  </span>
                  <IonIcon name="Time" size="16px" className="text-primary" />
                </div>
              </label>

              <p className="!body-small-primary text-neutral-500">
                {tCreateEvent("endTime")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-2">
        <p className="title-medium-primary">
          {tCreateEvent("location")} <span className="text-primary">*</span>
        </p>
        <Input
          value={eventForm.location}
          placeholder={tCreateEvent("locationPlaceholder")}
          className="!body-large-primary focus:border-primary focus-visible:ring-0"
          onChange={(e) =>
            setEventForm({ ...eventForm, location: e.target.value })
          }
        />
      </div>

      {/* Agenda */}
      <div className="flex flex-col gap-4">
        <p className="title-medium-primary">{tCreateEvent("agenda")}</p>

        {/* Time */}
        <div className="flex gap-4 w-full">
          {/* Start Time */}
          <div className="flex flex-col gap-2 w-full">
            <label className="relative">
              <input
                type="time"
                step="60"
                value={agendaStart}
                min={formatTime(eventForm.startTime) ?? undefined}
                max={formatTime(eventForm.endTime) ?? undefined}
                disabled={!eventForm.startTime || !eventForm.endTime}
                onChange={(e) => {
                  const value = clampTime(
                    e.target.value,
                    eventForm.startTime,
                    eventForm.endTime
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
                  "w-full h-10 flex items-center justify-between border rounded-md pl-3 !body-large-primary",
                  !isDateSelected && "opacity-50 pointer-events-none"
                )}
              >
                <span>{agendaStart || tCreateEvent("timePlaceholder")}</span>
                <IonIcon name="Time" size="16px" className="text-primary" />
              </div>
            </label>

            <p className="!body-small-primary text-neutral-500">
              {tCreateEvent("startTime")}
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
                  (agendaStart || formatTime(eventForm.startTime)) ?? undefined
                }
                max={formatTime(eventForm.endTime) ?? undefined}
                disabled={!eventForm.startTime || !eventForm.endTime}
                onChange={(e) => {
                  const value = clampTime(
                    e.target.value,
                    eventForm.startTime,
                    eventForm.endTime
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
                  "w-full h-10 flex items-center justify-between border rounded-md pl-3 !body-large-primary",
                  !isDateSelected && "opacity-50 pointer-events-none"
                )}
              >
                <span>{agendaEnd || tCreateEvent("timePlaceholder")}</span>
                <IonIcon name="Time" size="16px" className="text-primary" />
              </div>
            </label>

            <p className="!body-small-primary text-neutral-500">
              {tCreateEvent("endTime")}
            </p>
          </div>
        </div>

        {/* Description */}
        <Input
          value={agendaName}
          placeholder={tCreateEvent("descriptionPlaceholder")}
          onChange={(e) => setAgendaName(e.target.value)}
          className="w-full sm:flex-1"
        />

        {/* Button */}
        <Button
          mode="filled"
          bordered="square"
          expanded={false}
          onClick={handleAddAgenda}
          className={`h-9 w-fit ${agendaStart && agendaEnd && agendaName ? "cursor-pointer" : "cursor-default border-neutral-400 text-neutral-400 bg-transparent"}`}
        >
          {tCreateEvent("addAgenda")}
        </Button>
      </div>

      {/* Agenda List */}
      {eventForm.agenda.map((item, index) => (
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
                min={eventForm.startTime}
                max={item.endTime}
                onChange={(time) => updateAgendaTime(index, "startTime", time)}
              />

              {/* End Time */}
              <EditableTime
                value={item.endTime}
                min={item.startTime}
                max={eventForm.endTime}
                onChange={(time) => updateAgendaTime(index, "endTime", time)}
              />
            </div>

            {/* Name */}
            <Input
              value={item.activity_name}
              onChange={(e) => updateAgendaName(index, e.target.value)}
              className="!body-medium-primary"
            />
          </div>
        </div>
      ))}

      {/* Organizer */}
      <div className="flex flex-col gap-2">
        <p className="title-medium-primary">
          {tCreateEvent("organizer")} <span className="text-primary">*</span>
        </p>
        <Input
          value={eventForm.organizer}
          placeholder={tCreateEvent("organizerPlaceholder")}
          className="!body-large-primary focus:border-primary focus-visible:ring-0"
          onChange={(e) =>
            setEventForm({ ...eventForm, organizer: e.target.value })
          }
        />
      </div>
    </div>
  );
};

export default CreateEventStep1;
