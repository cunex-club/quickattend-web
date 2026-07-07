export interface Agenda {
  id: string;
  activity_name: string;
  startTime: Date;
  endTime: Date;
}

export const AttendanceType = {
  ALL: "all",
  FACULTIES: "faculties",
  WHITELIST: "whitelist",
} as const;

export type AttendanceType =
  (typeof AttendanceType)[keyof typeof AttendanceType];

export const ParticipantFieldType = {
  NAME: "name",
  ORGANIZATION: "organization",
  REFID: "refid",
  PHOTO: "photo",
} as const;

export type ParticipantFieldType =
  (typeof ParticipantFieldType)[keyof typeof ParticipantFieldType];

export const ScanPermissionType = {
  LIMITED: "limited",
  ANYONE: "anyone",
} as const;

export type ScanPermissionType =
  (typeof ScanPermissionType)[keyof typeof ScanPermissionType];

export interface Student {
  id: string;
  name: string;
}

export const EventManagerType = {
  MANAGER: "manager",
  STAFF: "staff",
};

export type EventManagerType =
  (typeof EventManagerType)[keyof typeof EventManagerType];

export const CardPreviewType = {
  CARD_PREVIEW: "cardPreview",
  DETAIL_PREVIEW: "detailPreview",
};

export type CardPreviewType =
  (typeof CardPreviewType)[keyof typeof CardPreviewType];

export interface EventManager {
  id: string;
  name: string;
  role: EventManagerType;
}

export interface EventFormInterface {
  name: string;
  description: string;
  date: Date | undefined;
  startTime: Date | undefined;
  endTime: Date | undefined;
  location: string;
  lat: number;
  lng: number;
  agenda: Agenda[];
  organizer: string;
  attendance_type: AttendanceType;
  selectedFaculties: string[];
  selectedStudents: Student[];
  revealed_fields: ParticipantFieldType[];
  managers_and_staff: EventManager[];
  allow_all_to_scan: boolean;
  evaluation_form: string;
}
