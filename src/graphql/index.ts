// Barrel exports for the graphql module
export { apolloClient } from "./client";
export { DashboardApolloProvider } from "./provider";
export {
  GET_EVENT_DATA,
  GET_DASHBOARD_INSIGHT_DATA,
} from "./queries";
export type {
  GQLEventData,
  GQLDeepInsightFacultyItem,
  GQLDeepInsightTimeItem,
  GQLFacultyTimeSlot,
  GQLTimeFacultySlot,
  GQLFilterOption,
  GetEventDataResponse,
  GetDashboardInsightDataResponse,
  GraphQLResponse,
} from "./types";
