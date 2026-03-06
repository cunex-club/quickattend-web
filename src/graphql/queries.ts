import { gql } from "@apollo/client";

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

// Fetches all deep-insight data for /dashboard/insights and /dashboard/compare pages
// (faculty data, time data)
// (filter options) to be used in the filter dropdowns
export const GET_DASHBOARD_INSIGHT_DATA = gql`
  query GetDashboardInsightData {
    deepInsightFacultyData {
      facultyId
      faculty
      data {
        timeId
        time
        students
        staff
        total
        registered
        unregistered
      }
    }
    deepInsightTimeData {
      timeId
      time
      data {
        facultyId
        faculty
        students
        staff
        total
        registered
        unregistered
      }
    }
    filterFacultyOptions {
      id
      label
    }
    filterTimeOptions {
      id
      label
    }
  }
`;
