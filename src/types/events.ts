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
  firstname_th: string;
  surname_th: string;
  title_th: string;
  faculty_name_th: string;
  firstname_en: string;
  surname_en: string;
  title_en: string;
  faculty_name_en: string;
  profile_image_url: string;
  role: string;
}

export interface GetOneEventWhitelist {
  ref_id: string;
  firstname_th: string;
  surname_th: string;
  title_th: string;
  faculty_name_th: string;
  firstname_en: string;
  surname_en: string;
  title_en: string;
  faculty_name_en: string;
  profile_image_url: string;
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
  allowed_faculties: GetOneEventAllowedFaculty[];
  whitelist: GetOneEventWhitelist[];
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
