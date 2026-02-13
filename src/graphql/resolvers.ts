// Mock GraphQL Resolvers
// Each resolver show what a real GraphQL server would return.
// Data is sourced from the existing mock dataset in @utils/data.

import {
  eventData,
  deepInsightFacultyData,
  deepInsightTimeData,
  FilterFacultyOptions,
  FilterTimeOptions,
} from "@utils/data";

import type {
  GetEventDataResponse,
  GetDashboardInsightDataResponse,
} from "./types";

// Map of query-operation-name → resolver function.
// The mock client extracts the operation name from the query string
// and calls the matching resolver.

export const resolvers: Record<string, () => unknown> = {
  GetEventData: (): GetEventDataResponse => ({
    eventData: { ...eventData },
  }),

  GetDashboardInsightData: (): GetDashboardInsightDataResponse => ({
    deepInsightFacultyData: deepInsightFacultyData.map((f) => ({
      ...f,
      data: f.data.map((d) => ({ ...d })),
    })),
    deepInsightTimeData: deepInsightTimeData.map((t) => ({
      ...t,
      data: t.data.map((d) => ({ ...d })),
    })),
    filterFacultyOptions: FilterFacultyOptions.map((o) => ({ ...o })),
    filterTimeOptions: FilterTimeOptions.map((o) => ({ ...o })),
  }),
};
