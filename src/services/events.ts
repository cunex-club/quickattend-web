import type {
  GetEventsRes,
  GetOneEventRes,
  APIPagination,
  APIResponse,
} from "@customTypes/events";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const TOKEN = process.env.NEXT_PUBLIC_LOG_IN_TOKEN;
const OWNER_REF_ID = process.env.NEXT_PUBLIC_LOG_IN_REF_ID;

const toApiPage = (page: number) => Math.max(page - 1, 0);

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

export async function fetchEventById(
  eventId: string,
): Promise<EventByIdAPIResponse> {
  const res = await fetch(`${API_HOST}/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch event ${eventId}: ${res.status}`);
  }

  return res.json();
}

export async function fetchManagedEvents(
  search?: string,
): Promise<EventsAPIResponse> {
  const params = new URLSearchParams({
    myevents: "true",
  });
  if (search) params.set("search", search);

  const res = await fetch(`${API_HOST}/events?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch managed events: ${res.status}`);
  }
  return res.json();
}

export async function fetchAttendedEvents(
  page: number = 1,
  pageSize: number = 8,
  search?: string,
): Promise<EventsAPIResponse> {
  const params = new URLSearchParams({
    myevents: "false",
    page: toApiPage(page).toString(),
    pageSize: pageSize.toString(),
  });
  if (search) params.set("search", search);

  const res = await fetch(`${API_HOST}/events?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch attended events: ${res.status}`);
  }

  return res.json();
}

export async function fetchDiscoveryEvents(
  page: number = 1,
  pageSize: number = 8,
  search?: string,
): Promise<EventsAPIResponse> {
  const params = new URLSearchParams({
    page: toApiPage(page).toString(),
    pageSize: pageSize.toString(),
  });
  if (search) params.set("search", search);

  const res = await fetch(`${API_HOST}/events?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch discovery events: ${res.status}`);
  }

  return res.json();
}

export async function createEvent(
  req: CreateEventReq,
): Promise<CreateEventAPIResponse> {
  const managersAndStaff = req.managers_and_staff;
  const isOwnerIncluded = managersAndStaff.some(
    (manager) => manager.role === "OWNER",
  );

  if (!isOwnerIncluded && OWNER_REF_ID) {
    managersAndStaff.push({
      ref_id: Number(OWNER_REF_ID),
      role: "OWNER",
    });
  }

  const res = await fetch(`${API_HOST}/events`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...req, managers_and_staff: managersAndStaff }),
  });

  if (!res.ok) {
    let parsedError: APIErrorData | null = null;

    try {
      const body = (await res.json()) as APIResponse<null>;
      parsedError = body.error;
    } catch {
      parsedError = null;
    }

    if (parsedError) {
      throw new APIRequestError(
        parsedError.message,
        parsedError.code,
        parsedError.status,
      );
    }

    throw new APIRequestError(
      `Failed to create event: ${res.status}`,
      "CREATE_EVENT_FAILED",
      res.status,
    );
  }

  return res.json();
}

export async function updateEvent(
  eventId: string,
  req: CreateEventReq,
): Promise<UpdateEventAPIResponse> {
  const res = await fetch(`${API_HOST}/events/${eventId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    let parsedError: APIErrorData | null = null;

    try {
      const body = (await res.json()) as APIResponse<null>;
      parsedError = body.error;
    } catch {
      parsedError = null;
    }

    if (parsedError) {
      throw new APIRequestError(
        parsedError.message,
        parsedError.code,
        parsedError.status,
      );
    }

    throw new APIRequestError(
      `Failed to update event ${eventId}: ${res.status}`,
      "UPDATE_EVENT_FAILED",
      res.status,
    );
  }

  return res.json();
}

export async function postParticipantScan(
  qrCode: string,
  eventId: string,
  scannedLocationLong: number = 0,
  scannedLocationLat: number = 0,
): Promise<ScanParticipantAPIResponse> {
  const res = await fetch(
    `${API_HOST}/participant/${encodeURIComponent(qrCode)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event_id: eventId,
        scanned_location_long: scannedLocationLong,
        scanned_location_lat: scannedLocationLat,
      }),
    },
  );

  if (!res.ok) {
    let parsedError: APIErrorData | null = null;

    try {
      const body = (await res.json()) as APIResponse<null>;
      parsedError = body.error;
    } catch {
      parsedError = null;
    }

    if (parsedError) {
      throw new APIRequestError(
        parsedError.message,
        parsedError.code,
        parsedError.status,
      );
    }

    throw new APIRequestError(
      `Failed to submit participant scan: ${res.status}`,
      "SCAN_REQUEST_FAILED",
      res.status,
    );
  }

  return res.json();
}
