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
} from "@services/events";
import type { APIResponse } from "@customTypes/events";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const JWT_COOKIE_NAME = "jwt";
const API_TIMEOUT_MS = 10_000;

const SCAN_API_TIMEOUT_MS = 40_000;

export type ScanParticipantResult =
  | { ok: true; data: ScanParticipantAPIResponse }
  | { ok: false; error: APIErrorData };

const toApiPage = (page: number) => Math.max(page - 1, 0);

export async function getAuthToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(JWT_COOKIE_NAME)?.value?.trim();

  if (!token) {
    throw new APIRequestError("Not authenticated", "UNAUTHENTICATED", 401);
  }

  return token;
}

export async function fetchEventById(
  eventId: string,
): Promise<EventByIdAPIResponse> {
  const token = await getAuthToken();
  const res = await fetch(`${API_HOST}/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch event ${eventId}: ${res.status}`);
  }

  return res.json();
}

export async function fetchManagedEvents(
  search?: string,
): Promise<EventsAPIResponse> {
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
    throw new Error(`Failed to fetch managed events: ${res.status}`);
  }
  return res.json();
}

export async function fetchAttendedEvents(
  page: number = 1,
  pageSize: number = 8,
  search?: string,
): Promise<EventsAPIResponse> {
  const token = await getAuthToken();
  const params = new URLSearchParams({
    myevents: "false",
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
    throw new Error(`Failed to fetch attended events: ${res.status}`);
  }

  return res.json();
}

export async function fetchDiscoveryEvents(
  page: number = 1,
  pageSize: number = 8,
  search?: string,
): Promise<EventsAPIResponse> {
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
    throw new Error(`Failed to fetch discovery events: ${res.status}`);
  }

  return res.json();
}

export async function createEvent(
  req: CreateEventReq,
): Promise<CreateEventAPIResponse> {
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
  const token = await getAuthToken();
  const res = await fetch(`${API_HOST}/events/${eventId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
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
      let parsedError: APIErrorData | null = null;

      try {
        const body = (await res.json()) as APIResponse<null>;
        parsedError = body.error;
      } catch {
        parsedError = null;
      }

      return {
        ok: false,
        error: parsedError ?? {
          code: "SCAN_REQUEST_FAILED",
          message: `Failed to submit participant scan: ${res.status}`,
          status: res.status,
        },
      };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
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
        code: isTimeout ? "SCAN_REQUEST_TIMEOUT" : "SCAN_UNEXPECTED_ERROR",
        message: isTimeout
          ? "Request timed out"
          : err instanceof Error
            ? err.message
            : "Unknown error",
        status: 0,
      },
    };
  }
}
