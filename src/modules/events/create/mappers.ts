import { FacultyCodeMap } from "@utils/faculty";
import {
  AttendanceType,
  EventManagerType,
  ParticipantFieldType,
  type EventFormInterface,
} from "./types";
import type {
  CreateEventAttendanceType,
  CreateEventManagerRole,
  CreateEventParticipantField,
  CreateEventReq,
} from "@services/events";
import type { GetOneEventRes } from "@customTypes/events";

const ATTENDANCE_TYPE_TO_API: Record<
  AttendanceType,
  CreateEventAttendanceType
> = {
  [AttendanceType.ALL]: "ALL",
  [AttendanceType.FACULTIES]: "FACULTIES",
  [AttendanceType.WHITELIST]: "WHITELIST",
};

const API_TO_ATTENDANCE_TYPE: Record<
  CreateEventAttendanceType,
  AttendanceType
> = {
  ALL: AttendanceType.ALL,
  FACULTIES: AttendanceType.FACULTIES,
  WHITELIST: AttendanceType.WHITELIST,
};

const PARTICIPANT_FIELD_TO_API: Record<
  ParticipantFieldType,
  CreateEventParticipantField
> = {
  [ParticipantFieldType.NAME]: "NAME",
  [ParticipantFieldType.ORGANIZATION]: "ORGANIZATION",
  [ParticipantFieldType.REFID]: "REFID",
  [ParticipantFieldType.PHOTO]: "PHOTO",
};

const API_TO_PARTICIPANT_FIELD: Record<string, ParticipantFieldType> = {
  NAME: ParticipantFieldType.NAME,
  ORGANIZATION: ParticipantFieldType.ORGANIZATION,
  REFID: ParticipantFieldType.REFID,
  PHOTO: ParticipantFieldType.PHOTO,
};

const MANAGER_ROLE_TO_API: Record<EventManagerType, CreateEventManagerRole> = {
  [EventManagerType.MANAGER]: "MANAGER",
  [EventManagerType.STAFF]: "STAFF",
};

const API_TO_MANAGER_ROLE: Record<string, EventManagerType> = {
  MANAGER: EventManagerType.MANAGER,
  STAFF: EventManagerType.STAFF,
};

const FACULTY_NO_TO_NAME: Record<number, string> = Object.fromEntries(
  Object.entries(FacultyCodeMap).map(([name, code]) => [code, name]),
);

function formatPersonName(person: {
  title_th: string;
  firstname_th: string;
  surname_th: string;
  title_en: string;
  firstname_en: string;
  surname_en: string;
  ref_id: string;
}) {
  return (
    [person.title_th, person.firstname_th, person.surname_th]
      .filter(Boolean)
      .join(" ") ||
    [person.title_en, person.firstname_en, person.surname_en]
      .filter(Boolean)
      .join(" ") ||
    person.ref_id
  );
}

export function buildCreateEventReq(
  eventForm: EventFormInterface,
): CreateEventReq {
  const startTime = eventForm.startTime!;
  const endTime = eventForm.endTime!;

  let attendee: number[] = [];
  if (eventForm.attendance_type == AttendanceType.WHITELIST) {
    attendee = eventForm.selectedStudents.map((student) => Number(student.id));
  } else if (eventForm.attendance_type == AttendanceType.FACULTIES) {
    attendee = eventForm.selectedFaculties
      .map((faculty) => FacultyCodeMap[faculty])
      .filter((code): code is number => code !== undefined);
  }

  return {
    name: eventForm.name,
    description: eventForm.description || undefined,
    organizer: eventForm.organizer,
    start_time: startTime.toISOString(),
    end_time: endTime.toISOString(),
    timezone: "Asia/Bangkok",
    location: eventForm.location,
    location_lat: eventForm.lat,
    location_long: eventForm.lng,
    agenda: eventForm.agenda.map((item) => ({
      activity_name: item.activity_name,
      start_time: item.startTime.toISOString(),
      end_time: item.endTime.toISOString(),
    })),
    attendance_type: ATTENDANCE_TYPE_TO_API[eventForm.attendance_type],
    attendee,
    revealed_fields: eventForm.revealed_fields.map(
      (field) => PARTICIPANT_FIELD_TO_API[field],
    ),
    managers_and_staff: eventForm.managers_and_staff.map((manager) => ({
      ref_id: Number(manager.id),
      role: MANAGER_ROLE_TO_API[manager.role],
    })),
    allow_all_to_scan: eventForm.allow_all_to_scan,
    evaluation_form: eventForm.evaluation_form || undefined,
  };
}

export function mapEventResToForm(res: GetOneEventRes): {
  form: EventFormInterface;
  ownerRefId: string | null;
} {
  const startTime = new Date(res.start_time);
  const endTime = new Date(res.end_time);

  const owner = res.users.find((user) => user.role === "OWNER");

  const form: EventFormInterface = {
    name: res.name,
    description: res.description ?? "",
    date: startTime,
    startTime,
    endTime,
    location: res.location,
    lat: res.location_lat,
    lng: res.location_long,
    agenda: res.agenda.map((item) => ({
      id: crypto.randomUUID(),
      activity_name: item.activity_name,
      startTime: new Date(item.start_time),
      endTime: new Date(item.end_time),
    })),
    organizer: res.organizer,
    attendance_type: API_TO_ATTENDANCE_TYPE[res.attendance_type],
    selectedFaculties: res.allowed_faculties
      .map((f) => FACULTY_NO_TO_NAME[f.faculty_no])
      .filter((name): name is string => name !== undefined),
    selectedStudents: res.whitelist.map((w) => ({
      id: w.ref_id,
      name: formatPersonName(w),
    })),
    revealed_fields: res.revealed_fields
      .map((field) => API_TO_PARTICIPANT_FIELD[field])
      .filter((field): field is ParticipantFieldType => field !== undefined),
    managers_and_staff: res.users
      .filter((user) => user.role !== "OWNER")
      .map((user) => ({
        id: user.ref_id,
        name: formatPersonName(user),
        role: API_TO_MANAGER_ROLE[user.role],
      }))
      .filter((manager) => manager.role !== undefined),
    allow_all_to_scan: res.allow_all_to_scan,
    evaluation_form: res.evaluation_form ?? "",
  };

  return { form, ownerRefId: owner?.ref_id ?? null };
}
