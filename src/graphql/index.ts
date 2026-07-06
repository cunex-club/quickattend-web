// Barrel exports for the graphql module
export { apolloClient } from "./client";
export { DashboardApolloProvider } from "./provider";
export { GET_EVENT_DATA, EVENT_DASHBOARD_DATA } from "./queries";
export type {
  GQLEventData,
  GQLRegistrationSummary,
  GQLOrganizationStat,
  GQLTimeStat,
  GQLEventDashboard,
  GetEventDataResponse,
  GetEventDashboardDataResponse,
  GraphQLResponse,
} from "./types";
