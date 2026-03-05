// ===========================
// Shared / Agenda
// ===========================
export interface AgendaItem {
  activity_name: string;
  start_time: string;
  end_time: string;
}

// ===========================
// GET /events (list)
// ===========================
export interface GetEventsRes {
  id: string;
  name: string;
  organizer: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string;
  role?: string | null;
  evaluation_form: string | null;
}

// ===========================
// GET /events/:id (single)
// ===========================
export interface GetOneEventRes {
  name: string;
  organizer: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string;
  total_registered: number;
  evaluation_form: string | null;
  role: string | null;
  agenda: AgendaItem[];
}

// ===========================
// API response envelope
// ===========================
export interface APIPagination {
  page: number;
  pageSize: number;
  total: number;
  hasNext: boolean;
}

export interface APIResponse<T> {
  data: T;
  error: { code: string; message: string; status: number } | null;
  meta: { pagination: APIPagination } | null;
}

// ===========================
// Legacy types (used by modals / mock-up)
// ===========================
export interface EventInfo {
  name: string;
  organizer: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  total_registered: number;
  evaluation_form: string;
  agenda: AgendaItem[];
}

export interface ManagerStaff {
  id: number;
  role: "staff" | "manager" | "owner";
  name: string;
  organization: string;
  avatar?: string;
}

export interface ShareModalData {
  name: string;
  description: string;
  organizer: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  agenda: AgendaItem[];
  attendance_type: string;
  attendee: number[];
  revealed_fields: string[];
  managers_and_staff: ManagerStaff[];
  allow_all_to_scan: boolean;
  evaluation_form: string;
}
