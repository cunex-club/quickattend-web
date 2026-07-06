import { gql } from "@apollo/client";

// Fetches attendance stats for a single event (real backend query)
export const EVENT_DASHBOARD_DATA = gql`
  query EventDashboardData($eventId: ID!) {
    eventDashboardData(eventID: $eventId) {
      summary {
        totalEligible
        totalStudent
        totalStaff
        totalAll
      }
      organizationStats {
        organization
        studentCount
        staffCount
        totalCount
      }
      timeSeriesStats {
        timeBucket
        studentCount
        staffCount
        totalCount
      }
    }
  }
`;
