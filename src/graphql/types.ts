// GraphQL Response Types

// Event overview data
export interface GQLEventData {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  totalAttendees: number;
  studentCount: number;
  staffCount: number;
}

// Single time-slot record inside a faculty entry
export interface GQLFacultyTimeSlot {
  timeId: string;
  time: string;
  students: number;
  staff: number;
  total: number;
  registered: number;
  unregistered: number;
}

// Faculty-centric insight data
export interface GQLDeepInsightFacultyItem {
  facultyId: string;
  faculty: string;
  data: GQLFacultyTimeSlot[];
}

// Single faculty record inside a time entry
export interface GQLTimeFacultySlot {
  facultyId: string;
  faculty: string;
  students: number;
  staff: number;
  total: number;
  registered: number;
  unregistered: number;
}

// Time-centric insight data
export interface GQLDeepInsightTimeItem {
  timeId: string;
  time: string;
  data: GQLTimeFacultySlot[];
}

// Filter option
export interface GQLFilterOption {
  id: string;
  label: string;
}

// Query Response Shapes
export interface GetEventDataResponse {
  eventData: GQLEventData;
}

export interface GetDashboardInsightDataResponse {
  deepInsightFacultyData: GQLDeepInsightFacultyItem[];
  deepInsightTimeData: GQLDeepInsightTimeItem[];
  filterFacultyOptions: GQLFilterOption[];
  filterTimeOptions: GQLFilterOption[];
}

// Real backend dashboard data (per-event attendance stats)
export interface GQLRegistrationSummary {
  totalEligible: number | null;
  totalStudent: number;
  totalStaff: number;
  totalAll: number;
}

export interface GQLOrganizationStat {
  organization: string;
  studentCount: number;
  staffCount: number;
  totalCount: number;
}

export interface GQLTimeStat {
  timeBucket: string;
  studentCount: number;
  staffCount: number;
  totalCount: number;
}

export interface GQLEventDashboard {
  summary: GQLRegistrationSummary;
  organizationStats: GQLOrganizationStat[];
  timeSeriesStats: GQLTimeStat[];
}

export interface GetEventDashboardDataResponse {
  eventDashboardData: GQLEventDashboard;
}

// Generic GraphQL Result
export interface GraphQLResponse<T = unknown> {
  data: T | null;
  errors?: { message: string }[];
  loading: boolean;
}
