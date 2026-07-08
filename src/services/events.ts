import type {
  GetEventsRes,
  GetOneEventRes,
  APIPagination,
  APIResponse,
} from "@customTypes/events";

export type { GetEventsRes, GetOneEventRes, APIPagination };
export type EventsAPIResponse = APIResponse<GetEventsRes[]>;
export type EventByIdAPIResponse = APIResponse<GetOneEventRes>;
export type ScanParticipantAPIResponse = APIResponse<ScanParticipantRes>;

export type APIErrorData = {
  code: string;
  message: string;
  status: number;
};

export class APIRequestError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "APIRequestError";
    this.code = code;
    this.status = status;
  }
}

export type CreateEventAttendanceType = "ALL" | "WHITELIST" | "FACULTIES";
export type CreateEventParticipantField =
  | "NAME"
  | "ORGANIZATION"
  | "REFID"
  | "PHOTO";
export type CreateEventManagerRole = "OWNER" | "STAFF" | "MANAGER";

export interface CreateEventAgenda {
  activity_name: string;
  start_time: string;
  end_time: string;
}

export interface CreateEventManager {
  ref_id: number;
  role: CreateEventManagerRole;
}

export interface CreateEventReq {
  name: string;
  description?: string;
  organizer: string;
  start_time: string;
  end_time: string;
  timezone: string;
  location: string;
  location_lat?: number;
  location_long?: number;
  agenda: CreateEventAgenda[];
  attendance_type: CreateEventAttendanceType;
  attendee: number[];
  revealed_fields: CreateEventParticipantField[];
  managers_and_staff: CreateEventManager[];
  allow_all_to_scan: boolean;
  evaluation_form?: string;
}

export interface CreateEventRes {
  id: string;
}

export type CreateEventAPIResponse = APIResponse<CreateEventRes>;

export interface UpdateEventRes {
  id: string;
}

export type UpdateEventAPIResponse = APIResponse<UpdateEventRes>;

export interface ScanParticipantRes {
  firstname_th: string | null;
  surname_th: string | null;
  title_th: string | null;
  firstname_en: string | null;
  surname_en: string | null;
  title_en: string | null;
  ref_id: string | null;
  organization_th: string | null;
  organization_en: string | null;
  check_in_time: string;
  status: string;
  code: string;
  profile_image_url: string | null;
}
