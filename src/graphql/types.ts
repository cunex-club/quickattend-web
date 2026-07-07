// GraphQL Response Types

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
