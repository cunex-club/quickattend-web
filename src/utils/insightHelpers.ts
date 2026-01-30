import {
  deepInsightFacultyData,
  deepInsightTimeData,
} from "./data";
import { getSelectedIds } from "./filterUtils";

// Re-export for backward compatibility
export { hasActiveFilters } from "./filterUtils";

export interface FilteredFacultyItem {
  facultyId: string;
  faculty: string;
  students: number;
  staff: number;
  total: number;
  registered: number;
  unregistered: number;
}

export interface FilteredTimeItem {
  timeId: string;
  time: string;
  students: number;
  staff: number;
  total: number;
  registered: number;
  unregistered: number;
}

export interface SummaryStatsResult {
  totalAttendees: number;
  studentCount: number;
  staffCount: number;
}

export interface RegistrationStatsResult {
  registered: number;
  unregistered: number;
  students: number;
  staff: number;
}

export type UserFilter = "student" | "staff" | null;

export function filterFacultyData(
  appliedFaculties: Record<string, boolean>,
  appliedTimes: Record<string, boolean>,
  userFilter: UserFilter
): FilteredFacultyItem[] {
  const selectedFacultyIds = getSelectedIds(appliedFaculties, "f-0");
  const selectedTimeIds = getSelectedIds(appliedTimes, "t-0");

  let faculties = deepInsightFacultyData;
  if (selectedFacultyIds.length > 0) {
    faculties = faculties.filter((f) =>
      selectedFacultyIds.includes(f.facultyId)
    );
  }

  return faculties.map((faculty) => {
    let timeData = faculty.data;

    if (selectedTimeIds.length > 0) {
      timeData = timeData.filter((t) => selectedTimeIds.includes(t.timeId));
    }

    // Sum up raw data first
    const students = timeData.reduce((sum, t) => sum + t.students, 0);
    const staff = timeData.reduce((sum, t) => sum + t.staff, 0);
    const totalRegistered = timeData.reduce(
      (sum, t) => sum + t.registered,
      0
    );
    const totalUnregistered = timeData.reduce(
      (sum, t) => sum + t.unregistered,
      0
    );

    // Apply userFilter to calculate final values
    let total = students + staff;           // Total eligible
    let registered = totalRegistered;        // Total registered
    let unregistered = totalUnregistered;    // Total unregistered

    // Show only students or staff
    if (userFilter === "student") {
      total = students;
    } else if (userFilter === "staff") {
      total = staff;
    }
    const ratio = students / (students + staff || 1);
    registered = Math.round(totalRegistered * ratio);
    unregistered = Math.round(totalUnregistered * ratio);

    return {
      facultyId: faculty.facultyId,
      faculty: faculty.faculty,
      students,        // Always actual student count
      staff,           // Always actual staff count
      total,           // Eligible (filtered by userFilter)
      registered,      // Registered (filtered by userFilter estimate)
      unregistered,    // Unregistered (filtered by userFilter estimate)
    };
  });
}


// Filter and transform time data based on applied filters and user filter
export function filterTimeData(
  appliedFaculties: Record<string, boolean>,
  appliedTimes: Record<string, boolean>,
  userFilter: UserFilter
): FilteredTimeItem[] {
  const selectedFacultyIds = getSelectedIds(appliedFaculties, "f-0");
  const selectedTimeIds = getSelectedIds(appliedTimes, "t-0");

  let times = deepInsightTimeData;
  if (selectedTimeIds.length > 0) {
    times = times.filter((t) => selectedTimeIds.includes(t.timeId));
  }

  return times.map((timeItem) => {
    let facultyData = timeItem.data;

    if (selectedFacultyIds.length > 0) {
      facultyData = facultyData.filter((f) =>
        selectedFacultyIds.includes(f.facultyId)
      );
    }

    // Sum up raw data first
    const students = facultyData.reduce((sum, f) => sum + f.students, 0);
    const staff = facultyData.reduce((sum, f) => sum + f.staff, 0);
    const totalRegistered = facultyData.reduce(
      (sum, f) => sum + f.registered,
      0
    );
    const totalUnregistered = facultyData.reduce(
      (sum, f) => sum + f.unregistered,
      0
    );

    // Apply userFilter to calculate final values
    let total = students + staff;           // Total eligible
    let registered = totalRegistered;        // Total registered
    let unregistered = totalUnregistered;    // Total unregistered

    // Show only students or staff
    if (userFilter === "student") {
      total = students;
    } else if (userFilter === "staff") {
      total = staff;
    }

    const ratio = students / (students + staff || 1);
    registered = Math.round(totalRegistered * ratio);
    unregistered = Math.round(totalUnregistered * ratio);

    return {
      timeId: timeItem.timeId,
      time: timeItem.time,
      students,        // Always actual student count
      staff,           // Always actual staff count
      total,           // Eligible (filtered by userFilter)
      registered,      // Registered (filtered by userFilter estimate)
      unregistered,    // Unregistered (filtered by userFilter estimate)
    };
  });
}

/**
 * Calculate summary statistics from filtered faculty data
 * totalAttendees = Registered participants (actual attendance)
 * studentCount/staffCount = Eligible participants (based on userFilter)
 */
export function calculateInsightSummaryStats(
  filteredFacultyData: FilteredFacultyItem[],
  userFilter: UserFilter
): SummaryStatsResult {
  const totalStudents = filteredFacultyData.reduce(
    (sum, f) => sum + f.students,
    0
  );
  const totalStaff = filteredFacultyData.reduce((sum, f) => sum + f.staff, 0);
  const totalRegistered = filteredFacultyData.reduce(
    (sum, f) => sum + f.registered,
    0
  );

  // Total Attendees = Registered (actual participants)
  const totalAttendees = totalRegistered;
  
  // Student/Staff  counts (eligible totals, filtered by userFilter)
  let studentCount = totalStudents;
  let staffCount = totalStaff;

  if (userFilter === "student") {
    studentCount = totalStudents;
    staffCount = 0;
  } else if (userFilter === "staff") {
    studentCount = 0;
    staffCount = totalStaff;
  }

  return {
    totalAttendees,  // Registered participants
    studentCount,    // Eligible students (filtered by userFilter)
    staffCount,      // Eligible staff (filtered by userFilter)
  };
}

/**
 * Calculate registration statistics from filtered faculty data
 */
export function calculateRegistrationStats(
  filteredFacultyData: FilteredFacultyItem[]
): RegistrationStatsResult {
  const totalRegistered = filteredFacultyData.reduce(
    (sum, f) => sum + f.registered,
    0
  );
  const totalUnregistered = filteredFacultyData.reduce(
    (sum, f) => sum + f.unregistered,
    0
  );
  const totalStudents = filteredFacultyData.reduce(
    (sum, f) => sum + f.students,
    0
  );
  const totalStaff = filteredFacultyData.reduce((sum, f) => sum + f.staff, 0);

  return {
    registered: totalRegistered,
    unregistered: totalUnregistered,
    students: totalStudents,
    staff: totalStaff,
  };
}


