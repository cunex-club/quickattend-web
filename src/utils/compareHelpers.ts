import {
  deepInsightFacultyData,
  deepInsightTimeData,
} from "./data";
import { getSelectedIds } from "./filterUtils";

export interface ComparisonFacultyData {
  faculty: string;
  data: {
    time: string;
    total: number;
  }[];
}

export interface ComparisonTimeData {
  faculty: string;
  data: {
    time: string;
    total: number;
  }[];
}

export interface SummaryStats {
  totalAttendees: number;
  studentCount: number;
  staffCount: number;
  totalRegistered: number;
  totalUnregistered: number;
}

export interface PieChartDataItem {
  name: string;
  value: number;
  fill: string;
}



// Transform faculty data for comparison charts
// Shows faculty breakdown with time periods
export function transformFacultyDataForComparison(
  appliedFaculties: Record<string, boolean>,
  appliedTimes: Record<string, boolean>
): ComparisonFacultyData[] {
  const selectedFacultyIds = getSelectedIds(appliedFaculties, "f-0");
  const selectedTimeIds = getSelectedIds(appliedTimes, "t-0");

  // If "All" is selected for faculties, or no selection, return empty for comparison
  if (appliedFaculties["f-0"] || selectedFacultyIds.length === 0) {
    return [];
  }

  // Filter faculties
  const faculties = deepInsightFacultyData.filter((f) =>
    selectedFacultyIds.includes(f.facultyId)
  );

  // Transform to comparison format
  return faculties.map((faculty) => {
    let timeData = faculty.data;

    // Filter by selected times if any (and not "All")
    if (!appliedTimes["t-0"] && selectedTimeIds.length > 0) {
      timeData = timeData.filter((t) => selectedTimeIds.includes(t.timeId));
    }

    return {
      faculty: faculty.faculty,
      data: timeData.map((t) => ({
        time: t.time,
        total: t.total,
      })),
    };
  });
}


// Transform time data for comparison charts
// Shows time period breakdown with faculty series
export function transformTimeDataForComparison(
  appliedFaculties: Record<string, boolean>,
  appliedTimes: Record<string, boolean>
): ComparisonTimeData[] {
  const selectedFacultyIds = getSelectedIds(appliedFaculties, "f-0");
  const selectedTimeIds = getSelectedIds(appliedTimes, "t-0");

  // If "All" is selected for times, or no selection, return empty for comparison
  if (appliedTimes["t-0"] || selectedTimeIds.length === 0) {
    return [];
  }

  // Filter time periods
  const times = deepInsightTimeData.filter((t) =>
    selectedTimeIds.includes(t.timeId)
  );

  // Get unique faculties to show
  const facultiesToShow =
    selectedFacultyIds.length > 0
      ? deepInsightFacultyData.filter((f) =>
          selectedFacultyIds.includes(f.facultyId)
        )
      : deepInsightFacultyData;

  // Transform to comparison format - each faculty becomes a data series
  return facultiesToShow.map((faculty) => {
    // Get this faculty's data for each selected time period
    const facultyTimeData = times.map((timeItem) => {
      // Find this faculty's data in this time period
      const facultyEntry = timeItem.data.find(
        (f) => f.facultyId === faculty.facultyId
      );

      return {
        time: timeItem.time,
        total: facultyEntry ? facultyEntry.total : 0,
      };
    });

    return {
      faculty: faculty.faculty,
      data: facultyTimeData,
    };
  });
}


// Calculate summary statistics based on selected filters
export function calculateSummaryStats(
  appliedFaculties: Record<string, boolean>,
  appliedTimes: Record<string, boolean>
): SummaryStats {
  // Before any comparison is submitted both maps are empty → return zeros
  // (keeps stat cards consistent with the pie chart "No Data" placeholder)
  const hasAppliedFilters =
    Object.keys(appliedFaculties).length > 0 &&
    Object.keys(appliedTimes).length > 0;

  if (!hasAppliedFilters) {
    return {
      totalAttendees: 0,
      studentCount: 0,
      staffCount: 0,
      totalRegistered: 0,
      totalUnregistered: 0,
    };
  }

  const selectedFacultyIds = getSelectedIds(appliedFaculties, "f-0");
  const selectedTimeIds = getSelectedIds(appliedTimes, "t-0");

  let faculties = deepInsightFacultyData;
  if (!appliedFaculties["f-0"] && selectedFacultyIds.length > 0) {
    faculties = faculties.filter((f) =>
      selectedFacultyIds.includes(f.facultyId)
    );
  }

  // Calculate totals by summing data from selected faculties/times
  let totalStudents = 0;
  let totalStaff = 0;
  let totalRegistered = 0;
  let totalUnregistered = 0;

  faculties.forEach((faculty) => {
    let timeData = faculty.data;

    // Filter by selected times if specified
    if (!appliedTimes["t-0"] && selectedTimeIds.length > 0) {
      timeData = timeData.filter((t) => selectedTimeIds.includes(t.timeId));
    }

    // Sum up the values
    timeData.forEach((t) => {
      totalStudents += t.students;
      totalStaff += t.staff;
      totalRegistered += t.registered;
      totalUnregistered += t.unregistered;
    });
  });

  // Total Attendees = Registered (actual participants)
  const totalAttendees = totalRegistered;
  
  // Student/Staff counts (eligible totals)
  const studentCount = totalStudents;
  const staffCount = totalStaff;

  return {
    totalAttendees,      // Registered participants
    studentCount,        // Total students (eligible)
    staffCount,          // Total staff (eligible)
    totalRegistered,     // Registered participants (same  as totalAttendees)
    totalUnregistered,   // Unregistered (eligible but didn't attend)
  };
}

// Prepare pie chart data showing faculty distribution
// Limits to top 5 items, grouping the rest as "อื่นๆ" (Other)

export function preparePieChartData(
  appliedFaculties: Record<string, boolean>,
  appliedTimes: Record<string, boolean>
): PieChartDataItem[] {
  // Check if comparison has been submitted successfully
  const hasAppliedFilters =
    Object.keys(appliedFaculties).length > 0 &&
    Object.keys(appliedTimes).length > 0;

  // If no filters applied yet, show gray placeholder
  if (!hasAppliedFilters) {
    return [{ name: "No Data", value: 1, fill: "var(--neutral-300)" }];
  }

  const selectedFacultyIds = getSelectedIds(appliedFaculties, "f-0");
  const selectedTimeIds = getSelectedIds(appliedTimes, "t-0");

  const colors = [
    "var(--color-chart-1)",
    "var(--color-chart-2)",
    "var(--color-chart-3)",
    "var(--color-chart-4)",
    "var(--color-chart-5)",
  ];

  // Determine which faculties to display
  const facultiesToDisplay =
    selectedFacultyIds.length > 0 && !appliedFaculties["f-0"]
      ? selectedFacultyIds
      : deepInsightFacultyData.map((f) => f.facultyId);

  const facultyDistribution = facultiesToDisplay
    .map((facultyId) => {
      const faculty = deepInsightFacultyData.find(
        (f) => f.facultyId === facultyId
      );
      if (!faculty) return null;

      let timeData = faculty.data;

      // Filter by selected times if any
      if (!appliedTimes["t-0"] && selectedTimeIds.length > 0) {
        timeData = timeData.filter((t) => selectedTimeIds.includes(t.timeId));
      }

      const total = timeData.reduce((sum, t) => sum + t.total, 0);

      return {
        name: faculty.faculty,
        value: total,
      };
    })
    .filter(
      (item): item is { name: string; value: number } => item !== null && item.value > 0
    )
    // Sort by value descending to get top items
    .sort((a, b) => b.value - a.value);

  // If more than 5 items, take top 5 and group rest as "อื่นๆ"
  if (facultyDistribution.length > 5) {
    const top5 = facultyDistribution.slice(0, 5);
    const others = facultyDistribution.slice(5);
    
    const othersTotal = others.reduce((sum, item) => sum + item.value, 0);
    
    // Add colors to top 5
    const top5WithColors = top5.map((item, index) => ({
      ...item,
      fill: colors[index],
    }));

    // Add "อื่นๆ" with neutral gray color for distinction
    return [
      ...top5WithColors,
      {
        name: "อื่นๆ",
        value: othersTotal,
        fill: "var(--neutral-300)", // Use neutral color for "Other"
      },
    ];
  }

  // If 5 or fewer items, just add colors
  return facultyDistribution.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));
}


// Validation result types for comparison submission
export type ValidationErrorType =
  | "NO_FACULTY_AND_TIME"
  | "NO_TIME"
  | "NO_FACULTY"
  | "BOTH_ALL_SELECTED"
  | null;

export interface ValidationResult {
  isValid: boolean;
  errorType: ValidationErrorType;
  severity: "error" | "warning" | null;
}


// Validate comparison filter selections
// Returns validation result indicating if selections are valid and what error exists

export function validateComparisonFilters(
  selectedFaculties: Record<string, boolean>,
  selectedTimes: Record<string, boolean>
): ValidationResult {
  const hasFacultySelection = Object.keys(selectedFaculties).length > 0;
  const hasTimeSelection = Object.keys(selectedTimes).length > 0;

  // Case 1: No time and no faculty filter
  if (!hasFacultySelection && !hasTimeSelection) {
    return {
      isValid: false,
      errorType: "NO_FACULTY_AND_TIME",
      severity: "error",
    };
  }

  // Case 2: No time filter
  if (!hasTimeSelection) {
    return {
      isValid: false,
      errorType: "NO_TIME",
      severity: "warning",
    };
  }

  // Case 3: No faculty filter
  if (!hasFacultySelection) {
    return {
      isValid: false,
      errorType: "NO_FACULTY",
      severity: "warning",
    };
  }

  // Case 4: Both "All" options are selected
  if (selectedFaculties["f-0"] && selectedTimes["t-0"]) {
    return {
      isValid: false,
      errorType: "BOTH_ALL_SELECTED",
      severity: "error",
    };
  }

  // All validations passed
  return {
    isValid: true,
    errorType: null,
    severity: null,
  };
}


