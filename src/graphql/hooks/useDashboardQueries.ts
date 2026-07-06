"use client";

import { useQuery } from "@apollo/client/react";
import { EVENT_DASHBOARD_DATA } from "../queries";
import type { GetEventDashboardDataResponse, GQLEventDashboard } from "../types";

// Real per-event attendance stats, used by the /dashboard/:id overview page
interface UseEventDashboardDataReturn {
  dashboardData: GQLEventDashboard | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEventDashboardData(
  eventId: string,
): UseEventDashboardDataReturn {
  const { data, loading, error, refetch } =
    useQuery<GetEventDashboardDataResponse>(EVENT_DASHBOARD_DATA, {
      variables: { eventId },
      skip: !eventId,
    });

  return {
    dashboardData: data?.eventDashboardData ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}
