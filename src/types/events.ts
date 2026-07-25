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
export interface GetOneEventUser {
  ref_id: string;
  user_type: "student" | "staff";
  firstname_th: string | null;
  surname_th: string | null;
  title_th: string | null;
  faculty_name_th: string | null;
  firstname_en: string | null;
  surname_en: string | null;
  title_en: string | null;
  faculty_name_en: string | null;
  role: string;
}

export interface GetOneEventWhitelist {
  ref_id: string;
  user_type: "student" | "staff";
  firstname_th: string | null;
  surname_th: string | null;
  title_th: string | null;
  faculty_name_th: string | null;
  firstname_en: string | null;
  surname_en: string | null;
  title_en: string | null;
  faculty_name_en: string | null;
}

export interface GetOneEventUserPending {
  ref_id: string;
  role: string;
}

export interface GetOneEventWhitelistPending {
  ref_id: string;
}

export interface GetOneEventAllowedFaculty {
  faculty_no: number;
}

export interface GetOneEventRes {
  name: string;
  organizer: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string;
  location_lat: number;
  location_long: number;
  total_registered: number;
  evaluation_form: string | null;
  allow_all_to_scan: boolean;
  attendance_type: "ALL" | "WHITELIST" | "FACULTIES";
  revealed_fields: string[];
  role: string | null;
  agenda: AgendaItem[];
  users: GetOneEventUser[];
  users_pending: GetOneEventUserPending[];
  allowed_faculties: GetOneEventAllowedFaculty[];
  whitelist: GetOneEventWhitelist[];
  whitelist_pending: GetOneEventWhitelistPending[];
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
