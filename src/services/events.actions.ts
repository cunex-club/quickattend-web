"use server";

import { cookies } from "next/headers";

import {
  APIRequestError,
  type APIErrorData,
  type CreateEventReq,
  type CreateEventAPIResponse,
  type UpdateEventAPIResponse,
  type EventsAPIResponse,
  type EventByIdAPIResponse,
  type ScanParticipantAPIResponse,
  type RecentParticipantsAPIResponse,
} from "@services/events";
import type { APIResponse } from "@customTypes/events";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const JWT_COOKIE_NAME = "jwt";
const API_TIMEOUT_MS = 10_000;

const SCAN_API_TIMEOUT_MS = 40_000;

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: APIErrorData };

export type ScanParticipantResult = ActionResult<ScanParticipantAPIResponse>;

const toApiPage = (page: number) => Math.max(page - 1, 0);

export async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value?.trim();

  if (!token) {
    throw new APIRequestError("Not authenticated", "UNAUTHENTICATED", 401);
  }

  return token;
}

// Reads the backend's {data, error, meta} envelope off a non-ok response,
// falling back to a synthesized error if the body isn't JSON or has no
// `error` field (e.g. a proxy/timeout response).
async function parseErrorBody(
  res: Response,
  fallbackCode: string,
  fallbackMessage: string,
): Promise<APIErrorData> {
  try {
    const body = (await res.json()) as APIResponse<null>;
    if (body.error) return body.error;
  } catch {
    // not JSON — fall through to the synthesized error below
  }
  return { code: fallbackCode, message: fallbackMessage, status: res.status };
}

// Normalizes a thrown error (auth failure, network error, timeout) into the
// same APIErrorData shape used for non-ok HTTP responses, so callers only
// ever have to handle one error shape.
function toCaughtErrorResult(
  err: unknown,
  timeoutCode: string,
  unexpectedCode: string,
): { ok: false; error: APIErrorData } {
  if (err instanceof APIRequestError) {
    return {
      ok: false,
      error: { code: err.code, message: err.message, status: err.status },
    };
  }

  const isTimeout = err instanceof Error && err.name === "TimeoutError";
  return {
    ok: false,
    error: {
      code: isTimeout ? timeoutCode : unexpectedCode,
      message: isTimeout
        ? "Request timed out"
        : err instanceof Error
          ? err.message
          : "Unknown error",
      status: 0,
    },
  };
}

export async function fetchEventById(
  eventId: string,
): Promise<ActionResult<EventByIdAPIResponse>> {
  try {
    const token = await getAuthToken();
    const res = await fetch(
      `${API_HOST}/events/${encodeURIComponent(eventId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      },
    );

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "FETCH_EVENT_FAILED",
          `Failed to fetch event ${eventId}: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "FETCH_EVENT_TIMEOUT",
      "FETCH_EVENT_UNEXPECTED_ERROR",
    );
  }
}

export async function fetchRecentParticipants(
  eventId: string,
): Promise<ActionResult<RecentParticipantsAPIResponse>> {
  try {
    const token = await getAuthToken();
    const res = await fetch(
      `${API_HOST}/events/${encodeURIComponent(eventId)}/participants/recent`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      },
    );

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "FETCH_RECENT_PARTICIPANTS_FAILED",
          `Failed to fetch recent participants for event ${eventId}: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "FETCH_RECENT_PARTICIPANTS_TIMEOUT",
      "FETCH_RECENT_PARTICIPANTS_UNEXPECTED_ERROR",
    );
  }
}

export async function fetchManagedEvents(
  search?: string,
): Promise<ActionResult<EventsAPIResponse>> {
  try {
    const token = await getAuthToken();
    const params = new URLSearchParams({
      myevents: "true",
    });
    if (search) params.set("search", search);

    const res = await fetch(`${API_HOST}/events?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "FETCH_MANAGED_EVENTS_FAILED",
          `Failed to fetch managed events: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "FETCH_MANAGED_EVENTS_TIMEOUT",
      "FETCH_MANAGED_EVENTS_UNEXPECTED_ERROR",
    );
  }
}

export interface FetchAttendedEventsOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  roles?: string[];
  date?: string;
  sort?: "newest" | "oldest";
}

export async function fetchAttendedEvents(
  options: FetchAttendedEventsOptions = {},
): Promise<ActionResult<EventsAPIResponse>> {
  const { page = 1, pageSize = 8, search, roles, date, sort } = options;
  try {
    const token = await getAuthToken();
    const params = new URLSearchParams({
      myevents: "false",
      page: toApiPage(page).toString(),
      pageSize: pageSize.toString(),
    });
    if (search) params.set("search", search);
    if (roles !== undefined) params.set("role", roles.join(","));
    if (date) params.set("date", date);
    if (sort) params.set("sort", sort);

    const res = await fetch(`${API_HOST}/events?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "FETCH_ATTENDED_EVENTS_FAILED",
          `Failed to fetch attended events: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "FETCH_ATTENDED_EVENTS_TIMEOUT",
      "FETCH_ATTENDED_EVENTS_UNEXPECTED_ERROR",
    );
  }
}

export async function fetchDiscoveryEvents(
  page: number = 1,
  pageSize: number = 8,
  search?: string,
): Promise<ActionResult<EventsAPIResponse>> {
  try {
    const token = await getAuthToken();
    const params = new URLSearchParams({
      page: toApiPage(page).toString(),
      pageSize: pageSize.toString(),
    });
    if (search) params.set("search", search);

    const res = await fetch(`${API_HOST}/events?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "FETCH_DISCOVERY_EVENTS_FAILED",
          `Failed to fetch discovery events: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "FETCH_DISCOVERY_EVENTS_TIMEOUT",
      "FETCH_DISCOVERY_EVENTS_UNEXPECTED_ERROR",
    );
  }
}

export async function createEvent(
  req: CreateEventReq,
): Promise<ActionResult<CreateEventAPIResponse>> {
  try {
    const token = await getAuthToken();

    const res = await fetch(`${API_HOST}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "CREATE_EVENT_FAILED",
          `Failed to create event: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "CREATE_EVENT_TIMEOUT",
      "CREATE_EVENT_UNEXPECTED_ERROR",
    );
  }
}

export async function updateEvent(
  eventId: string,
  req: CreateEventReq,
): Promise<ActionResult<UpdateEventAPIResponse>> {
  try {
    const token = await getAuthToken();
    const res = await fetch(
      `${API_HOST}/events/${encodeURIComponent(eventId)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      },
    );

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "UPDATE_EVENT_FAILED",
          `Failed to update event ${eventId}: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "UPDATE_EVENT_TIMEOUT",
      "UPDATE_EVENT_UNEXPECTED_ERROR",
    );
  }
}

export async function deleteEvent(
  eventId: string,
): Promise<ActionResult<null>> {
  try {
    const token = await getAuthToken();
    const res = await fetch(
      `${API_HOST}/events/${encodeURIComponent(eventId)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: AbortSignal.timeout(API_TIMEOUT_MS),
      },
    );

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "DELETE_EVENT_FAILED",
          `Failed to delete event ${eventId}: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: null };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "DELETE_EVENT_TIMEOUT",
      "DELETE_EVENT_UNEXPECTED_ERROR",
    );
  }
}

export async function commentOnParticipant(
  oneTimeCode: string,
  comment: string,
): Promise<ActionResult<null>> {
  try {
    const token = await getAuthToken();
    const res = await fetch(`${API_HOST}/participant/comment`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ one_time_code: oneTimeCode, comment }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "COMMENT_REQUEST_FAILED",
          `Failed to save comment: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: null };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "COMMENT_REQUEST_TIMEOUT",
      "COMMENT_UNEXPECTED_ERROR",
    );
  }
}

export async function postParticipantScan(
  qrCode: string,
  eventId: string,
  scannedLocationLong: number = 0,
  scannedLocationLat: number = 0,
): Promise<ScanParticipantResult> {
  try {
    const token = await getAuthToken();
    const res = await fetch(
      `${API_HOST}/participant/${encodeURIComponent(qrCode)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
          scanned_location_long: scannedLocationLong,
          scanned_location_lat: scannedLocationLat,
        }),
        signal: AbortSignal.timeout(SCAN_API_TIMEOUT_MS),
      },
    );

    if (!res.ok) {
      return {
        ok: false,
        error: await parseErrorBody(
          res,
          "SCAN_REQUEST_FAILED",
          `Failed to submit participant scan: ${res.status}`,
        ),
      };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
    return toCaughtErrorResult(
      err,
      "SCAN_REQUEST_TIMEOUT",
      "SCAN_UNEXPECTED_ERROR",
    );
  }
}
