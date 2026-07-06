// Barrel exports for the graphql module
export { apolloClient } from "./client";
export { DashboardApolloProvider } from "./provider";
export {
  GET_EVENT_DATA,
  GET_DASHBOARD_INSIGHT_DATA,
  EVENT_DASHBOARD_DATA,
} from "./queries";
export type {
  GQLEventData,
  GQLDeepInsightFacultyItem,
  GQLDeepInsightTimeItem,
  GQLFacultyTimeSlot,
  GQLTimeFacultySlot,
  GQLFilterOption,
  GQLRegistrationSummary,
  GQLOrganizationStat,
  GQLTimeStat,
  GQLEventDashboard,
  GetEventDataResponse,
  GetDashboardInsightDataResponse,
  GetEventDashboardDataResponse,
  GraphQLResponse,
} from "./types";
