import { useState, useMemo, useCallback } from "react";

export interface UseFilterLogicConfig {
  maxSelectionLimit?: number;
  warnOnEmptyApply?: boolean;
  t?: (key: string) => string;
}

export interface FilterHandlers {
  selectedFaculties: Record<string, boolean>;
  selectedTimes: Record<string, boolean>;
  appliedFaculties: Record<string, boolean>;
  appliedTimes: Record<string, boolean>;
  handleFacultyChange: (itemId: string, checked: boolean) => void;
  handleTimeChange: (itemId: string, checked: boolean) => void;
  handleClearFilters: () => void;
  handleApplyFilters: () => void;
  hasActiveFilters: boolean;
  selectedFacultyIds: string[];
  selectedTimeIds: string[];
}

export function useFilterLogic(config: UseFilterLogicConfig = {}): FilterHandlers {
  const { maxSelectionLimit, warnOnEmptyApply = false, t } = config;

  // Selected filters - updated when user clicks on filter items
  const [selectedFaculties, setSelectedFaculties] = useState<Record<string, boolean>>({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>({});

  // Applied filters - only updated when user clicks "Apply Filter" or "Compare Data"
  const [appliedFaculties, setAppliedFaculties] = useState<Record<string, boolean>>({});
  const [appliedTimes, setAppliedTimes] = useState<Record<string, boolean>>({});

  const createSelectionHandler = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
      allItemId?: string
    ) =>
      (itemId: string, checked: boolean) => {
        setter((prevSelected) => {
          const newSelected = { ...prevSelected };

          if (checked) {
            if (allItemId && itemId === allItemId) {
              return { [allItemId]: true };
            }
            if (allItemId) {
              delete newSelected[allItemId];
            }
            if (maxSelectionLimit && !prevSelected[itemId]) {
              const selectedCount = Object.values(newSelected).filter(Boolean).length;
              if (selectedCount >= maxSelectionLimit) {
                return prevSelected;
              }
            }

            newSelected[itemId] = true;
          } else {
            delete newSelected[itemId];
          }

          return newSelected;
        });
      },
    [maxSelectionLimit]
  );

  // Handler for faculty filter changes
  const handleFacultyChange = useMemo(
    () => createSelectionHandler(setSelectedFaculties, maxSelectionLimit ? "f-0" : undefined),
    [createSelectionHandler, maxSelectionLimit]
  );

  // Handler for time filter changes
  const handleTimeChange = useMemo(
    () => createSelectionHandler(setSelectedTimes, maxSelectionLimit ? "t-0" : undefined),
    [createSelectionHandler, maxSelectionLimit]
  );

  const handleClearFilters = useCallback(() => {
    setSelectedFaculties({});
    setSelectedTimes({});
    setAppliedFaculties({});
    setAppliedTimes({});
  }, []);

  const handleApplyFilters = useCallback(() => {
    if (warnOnEmptyApply) {
      if (
        Object.keys(selectedFaculties).length === 0 &&
        Object.keys(selectedTimes).length === 0
      ) {
        if (t) {
        }
        return;
      }
    }
    setAppliedFaculties(selectedFaculties);
    setAppliedTimes(selectedTimes);
  }, [selectedFaculties, selectedTimes, warnOnEmptyApply, t]);



  const hasActiveFilters = useMemo(() => {
    const hasFacultyFilter =
      Object.keys(appliedFaculties).filter((key) => appliedFaculties[key]).length > 0;
    const hasTimeFilter =
      Object.keys(appliedTimes).filter((key) => appliedTimes[key]).length > 0;
    return hasFacultyFilter || hasTimeFilter;
  }, [appliedFaculties, appliedTimes]);

  const selectedFacultyIds = useMemo(
    () => Object.keys(appliedFaculties).filter(
      (key) => appliedFaculties[key] && key !== "f-0"
    ),
    [appliedFaculties]
  );

  const selectedTimeIds = useMemo(
    () => Object.keys(appliedTimes).filter(
      (key) => appliedTimes[key] && key !== "t-0"
    ),
    [appliedTimes]
  );

  return {
    selectedFaculties,
    selectedTimes,
    appliedFaculties,
    appliedTimes,
    handleFacultyChange,
    handleTimeChange,
    handleClearFilters,
    handleApplyFilters,
    hasActiveFilters,
    selectedFacultyIds,
    selectedTimeIds,
  };
}
