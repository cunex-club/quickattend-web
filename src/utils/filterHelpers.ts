// Filter helper utilities for dashboard data

export type UserType = "student" | "staff" | null;

export interface FacultyDataItem {
  facultyId: string;
  faculty: string;
  students: number;
  staff: number;
  total: number;
}

export interface TimeDataItem {
  timeId: string;
  time: string;
  students: number;
  staff: number;
  total: number;
}

export interface RegisteredDataItem {
  facultyId: string;
  faculty: string;
  unregistered: number;
  registered: number;
  total: number;
  students: number;
  staff: number;
  studentsRegistered: number;
  studentsUnregistered: number;
  staffRegistered: number;
  staffUnregistered: number;
}

/**
 * Filter faculty data by selected faculties
 */
export function filterByFaculty<T extends { facultyId: string }>(
  data: T[],
  selectedFaculties: Record<string, boolean>
): T[] {
  const selectedIds = Object.keys(selectedFaculties).filter(
    (key) => selectedFaculties[key] && key !== "f-0"
  );

  // If "all" is selected or no faculties selected, return all data
  if (selectedFaculties["f-0"] || selectedIds.length === 0) {
    return data;
  }

  return data.filter((item) => selectedIds.includes(item.facultyId));
}

/**
 * Filter time data by selected time periods
 */
export function filterByTime<T extends { timeId: string }>(
  data: T[],
  selectedTimes: Record<string, boolean>
): T[] {
  const selectedIds = Object.keys(selectedTimes).filter(
    (key) => selectedTimes[key] && key !== "t-0"
  );

  // If "all" is selected or no times selected, return all data
  if (selectedTimes["t-0"] || selectedIds.length === 0) {
    return data;
  }

  return data.filter((item) => selectedIds.includes(item.timeId));
}

/**
 * Filter data by user type (student or staff)
 */
export function filterByUserType(
  data: { students: number; staff: number }[],
  userType: UserType
) {
  if (!userType) {
    return data; // Return all data if no filter
  }

  return data.map((item) => ({
    ...item,
    total: userType === "student" ? item.students : item.staff,
  }));
}

/**
 * Calculate summary statistics from filtered data
 */
export function calculateSummaryStats(
  facultyData: { students: number; staff: number }[],
  userType: UserType
): {
  totalAttendees: number;
  studentCount: number;
  staffCount: number;
} {
  const totalStudents = facultyData.reduce(
    (sum, item) => sum + item.students,
    0
  );
  const totalStaff = facultyData.reduce((sum, item) => sum + item.staff, 0);

  if (userType === "student") {
    return {
      totalAttendees: totalStudents,
      studentCount: totalStudents,
      staffCount: 0,
    };
  } else if (userType === "staff") {
    return {
      totalAttendees: totalStaff,
      studentCount: 0,
      staffCount: totalStaff,
    };
  } else {
    return {
      totalAttendees: totalStudents + totalStaff,
      studentCount: totalStudents,
      staffCount: totalStaff,
    };
  }
}

/**
 * Apply all filters to faculty data
 */
export function applyFacultyFilters(
  data: FacultyDataItem[],
  filters: {
    selectedFaculties: Record<string, boolean>;
    userType: UserType;
  }
): FacultyDataItem[] {
  let filtered = filterByFaculty(data, filters.selectedFaculties);
  
  // Apply user type filter to adjust total
  if (filters.userType === "student") {
    filtered = filtered.map((item) => ({
      ...item,
      total: item.students,
    }));
  } else if (filters.userType === "staff") {
    filtered = filtered.map((item) => ({
      ...item,
      total: item.staff,
    }));
  }
  
  return filtered;
}

/**
 * Apply all filters to time data
 */
export function applyTimeFilters(
  data: TimeDataItem[],
  filters: {
    selectedTimes: Record<string, boolean>;
    userType: UserType;
  }
): TimeDataItem[] {
  let filtered = filterByTime(data, filters.selectedTimes);
  
  // Apply user type filter to adjust total
  if (filters.userType === "student") {
    filtered = filtered.map((item) => ({
      ...item,
      total: item.students,
    }));
  } else if (filters.userType === "staff") {
    filtered = filtered.map((item) => ({
      ...item,
      total: item.staff,
    }));
  }
  
  return filtered;
}

/**
 * Apply all filters to registered data (for whitelist view)
 */
export function applyRegisteredDataFilters(
  data: RegisteredDataItem[],
  filters: {
    selectedFaculties: Record<string, boolean>;
    userType: UserType;
  }
) {
  let filtered = filterByFaculty(data, filters.selectedFaculties);

  // Apply user type filter
  if (filters.userType === "student") {
    filtered = filtered.map((item) => ({
      ...item,
      total: item.students,
      registered: item.studentsRegistered,
      unregistered: item.studentsUnregistered,
    }));
  } else if (filters.userType === "staff") {
    filtered = filtered.map((item) => ({
      ...item,
      total: item.staff,
      registered: item.staffRegistered,
      unregistered: item.staffUnregistered,
    }));
  }

  return filtered;
}

/**
 * Calculate registration status totals from filtered data
 */
export function calculateRegistrationStats(
  data: RegisteredDataItem[],
  userType: UserType
): { registered: number; unregistered: number; students: number; staff: number } {
  if (userType === "student") {
    const registered = data.reduce(
      (sum, item) => sum + item.studentsRegistered,
      0
    );
    const unregistered = data.reduce(
      (sum, item) => sum + item.studentsUnregistered,
      0
    );
    const students = registered + unregistered;
    return { registered, unregistered, students, staff: 0 };
  } else if (userType === "staff") {
    const registered = data.reduce(
      (sum, item) => sum + item.staffRegistered,
      0
    );
    const unregistered = data.reduce(
      (sum, item) => sum + item.staffUnregistered,
      0
    );
    const staff = registered + unregistered;
    return { registered, unregistered, students: 0, staff };
  } else {
    // All users
    const studentsRegistered = data.reduce(
      (sum, item) => sum + item.studentsRegistered,
      0
    );
    const studentsUnregistered = data.reduce(
      (sum, item) => sum + item.studentsUnregistered,
      0
    );
    const staffRegistered = data.reduce(
      (sum, item) => sum + item.staffRegistered,
      0
    );
    const staffUnregistered = data.reduce(
      (sum, item) => sum + item.staffUnregistered,
      0
    );
    return {
      registered: studentsRegistered + staffRegistered,
      unregistered: studentsUnregistered + staffUnregistered,
      students: studentsRegistered + studentsUnregistered,
      staff: staffRegistered + staffUnregistered,
    };
  }
}
