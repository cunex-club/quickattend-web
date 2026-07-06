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

// Fetches overview data for the /dashboard page
// (event metadata + attendee counts)
export const GET_EVENT_DATA = gql`
  query GetEventData {
    eventData {
      id
      title
      date
      time
      location
      description
      totalAttendees
      studentCount
      staffCount
    }
  }
`;
