"use client";
import { useState, useEffect, useRef } from "react";
import IonIcon from "@shared/IonIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@assets/components/ui/dropdown-menu";
import { Checkbox } from "@assets/components/ui/checkbox";
import DockInputDatePicker from "@shared/DockedInputDatePicker";

interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

export interface FilterValues {
  accessRights: string[];
  date: Date | undefined;
}

interface FilterMenuProps {
  onFilterChange?: (values: FilterValues) => void;
  menuId?: string;
}

const DEFAULT_ACCESS_OPTIONS: FilterOption[] = [
  { id: "owner", label: "เจ้าของกิจกรรม", checked: true },
  { id: "manager", label: "ผู้จัดการกิจกรรม", checked: true },
  { id: "staff", label: "ผู้ดูแลงาน", checked: true },
];

const FilterMenu = ({ onFilterChange, menuId }: FilterMenuProps) => {
  const [accessOptions, setAccessOptions] = useState<FilterOption[]>(
    DEFAULT_ACCESS_OPTIONS,
  );
  const [datePickerKey, setDatePickerKey] = useState(0);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const isFilterActive =
    accessOptions.some((option) => !option.checked) ||
    selectedDate !== undefined;

  const handleCheckboxChange = (id: string) => {
    setAccessOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, checked: !option.checked } : option,
      ),
    );
  };

  const handleClearFilter = () => {
    setAccessOptions(DEFAULT_ACCESS_OPTIONS);
    setSelectedDate(undefined);
    setDatePickerKey((k) => k + 1);
  };

  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  });

  useEffect(() => {
    const selectedRights = accessOptions
      .filter((opt) => opt.checked)
      .map((opt) => opt.id);

    onFilterChangeRef.current?.({
      accessRights: selectedRights,
      date: selectedDate,
    });
  }, [accessOptions, selectedDate]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={menuId ? `${menuId}-trigger` : undefined}
          aria-label="Open filter menu"
          className="relative rounded-full p-1 hover:bg-muted/40 transition-colors duration-200 [&>div]:!p-0"
        >
          <IonIcon
            name="FunnelOutline"
            className="text-primary cursor-pointer w-6 h-6 lg:w-8 lg:h-8"
          />
          {isFilterActive && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-primary border-2 border-neutral-white" />
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        id={menuId ? `${menuId}-content` : undefined}
        sideOffset={8}
        align="end"
        className="w-80 p-0 rounded-2xl shadow-elevation-3 border-0 bg-neutral-white overflow-hidden"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("[data-radix-popper-content-wrapper]")) {
            e.preventDefault();
          }
        }}
      >
        {/* Access Rights Section */}
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <DropdownMenuLabel className="px-0 py-0 title-medium-emphasized text-neutral-600">
              สิทธิ์การเข้าถึง
            </DropdownMenuLabel>
            {isFilterActive && (
              <button
                type="button"
                onClick={handleClearFilter}
                className="label-large-primary text-primary hover:underline"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>

          <div className="space-y-1">
            {accessOptions.map((option, index) => (
              <div key={option.id}>
                <label className="flex items-center gap-4 py-3 px-2 cursor-pointer rounded-lg hover:bg-neutral-100 transition-colors duration-150">
                  {/* Shadcn Checkbox */}
                  <Checkbox
                    id={option.id}
                    checked={option.checked}
                    onCheckedChange={() => handleCheckboxChange(option.id)}
                    className="h-6 w-6 rounded-md border-2 border-neutral-400 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-neutral-600 body-medium-primary select-none">
                    {option.label}
                  </span>
                </label>
                {index < accessOptions.length - 1 && (
                  <div className="h-px bg-neutral-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator className="bg-neutral-200 h-px mx-4 -my-2" />

        {/* Date Section */}
        <div className="p-4 pt-4">
          <DropdownMenuLabel className="px-0 py-0 mb-2 title-medium-emphasized text-neutral-600">
            วัน เดือน ปี
          </DropdownMenuLabel>

          <DockInputDatePicker
            key={datePickerKey}
            value={selectedDate}
            onChange={setSelectedDate}
            label="Date"
            helperText="MM/DD/YYYY"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
