import type {
  GetEventsRes,
  GetOneEventRes,
  APIPagination,
  APIResponse,
} from "@customTypes/events";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const TOKEN = process.env.NEXT_PUBLIC_LOG_IN_TOKEN;

export type { GetEventsRes, GetOneEventRes, APIPagination };
export type EventsAPIResponse = APIResponse<GetEventsRes[]>;
export type EventByIdAPIResponse = APIResponse<GetOneEventRes>;

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
  const params = new URLSearchParams({ myevents: "true" });
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
    page: page.toString(),
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
    page: page.toString(),
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
