"use client";

import { useQuery } from "@apollo/client/react";
import {
  GET_EVENT_DATA,
  GET_DASHBOARD_INSIGHT_DATA,
  EVENT_DASHBOARD_DATA,
} from "../queries";
import type {
  GetEventDataResponse,
  GetDashboardInsightDataResponse,
  GetEventDashboardDataResponse,
  GQLEventData,
  GQLDeepInsightFacultyItem,
  GQLDeepInsightTimeItem,
  GQLFilterOption,
  GQLEventDashboard,
} from "../types";

// For the /dashboard overview page
interface UseEventDataReturn {
  eventData: GQLEventData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEventData(): UseEventDataReturn {
  const { data, loading, error, refetch } =
    useQuery<GetEventDataResponse>(GET_EVENT_DATA);

  return {
    eventData: data?.eventData ?? null,
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

// For the /dashboard/insights page
interface UseDashboardInsightDataReturn {
  deepInsightFacultyData: GQLDeepInsightFacultyItem[];
  deepInsightTimeData: GQLDeepInsightTimeItem[];
  filterFacultyOptions: GQLFilterOption[];
  filterTimeOptions: GQLFilterOption[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardInsightData(): UseDashboardInsightDataReturn {
  const { data, loading, error, refetch } =
    useQuery<GetDashboardInsightDataResponse>(GET_DASHBOARD_INSIGHT_DATA);

  return {
    deepInsightFacultyData: data?.deepInsightFacultyData ?? [],
    deepInsightTimeData: data?.deepInsightTimeData ?? [],
    filterFacultyOptions: data?.filterFacultyOptions ?? [],
    filterTimeOptions: data?.filterTimeOptions ?? [],
    loading,
    error: error?.message ?? null,
    refetch,
  };
}

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
