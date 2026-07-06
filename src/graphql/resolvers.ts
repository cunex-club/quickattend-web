// Mock GraphQL Resolvers
// Each resolver shows what a real GraphQL server would return.
// Data is sourced from the existing mock dataset in @utils/data.

import { eventData } from "@utils/data";

import type { GetEventDataResponse } from "./types";

// Map of query-operation-name → resolver function.
// The mock client extracts the operation name from the query string
// and calls the matching resolver.

export const resolvers: Record<string, () => unknown> = {
  GetEventData: (): GetEventDataResponse => ({
    eventData: { ...eventData },
  }),
};
