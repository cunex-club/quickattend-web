// use to get selected ids from filter state
export function getSelectedIds(
  appliedFilters: Record<string, boolean>,
  excludeId: string = "f-0"
): string[] {
  return Object.keys(appliedFilters).filter(
    (key) => appliedFilters[key] && key !== excludeId
  );
}

// use to check if any filters are active
export function hasActiveFilters(
  appliedFaculties: Record<string, boolean>,
  appliedTimes: Record<string, boolean>
): boolean {
  const hasFacultyFilter =
    Object.keys(appliedFaculties).filter((key) => appliedFaculties[key])
      .length > 0;
  const hasTimeFilter =
    Object.keys(appliedTimes).filter((key) => appliedTimes[key]).length > 0;
  return hasFacultyFilter || hasTimeFilter;
}
