// Barrel exports for the graphql module
export { apolloClient } from "./client";
export { DashboardApolloProvider } from "./provider";
export { EVENT_DASHBOARD_DATA } from "./queries";
export type {
  GQLRegistrationSummary,
  GQLOrganizationStat,
  GQLTimeStat,
  GQLEventDashboard,
  GetEventDashboardDataResponse,
  GraphQLResponse,
} from "./types";
