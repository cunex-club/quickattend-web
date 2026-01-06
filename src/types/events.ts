export interface AgendaItem {
  activity_name: string;
  start_time: string;
  end_time: string;
}

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
