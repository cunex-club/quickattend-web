"use client";
import { useState, useEffect } from "react";
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

const FilterMenu = ({ onFilterChange, menuId }: FilterMenuProps) => {
  const [accessOptions, setAccessOptions] = useState<FilterOption[]>([
    { id: "owner", label: "เจ้าของกิจกรรม", checked: true },
    { id: "manager", label: "ผู้จัดการกิจกรรม", checked: false },
    { id: "staff", label: "ผู้ดูแลงาน", checked: false },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2025, 7, 17),
  );

  const handleCheckboxChange = (id: string) => {
    setAccessOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, checked: !option.checked } : option,
      ),
    );
  };

  // Emit filter values when they change
  useEffect(() => {
    const selectedRights = accessOptions
      .filter((opt) => opt.checked)
      .map((opt) => opt.id);

    onFilterChange?.({
      accessRights: selectedRights,
      date: selectedDate,
    });
  }, [accessOptions, selectedDate, onFilterChange]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          id={menuId ? `${menuId}-trigger` : undefined}
          aria-label="Open filter menu"
          className="rounded-full p-1 hover:bg-muted/40 transition-colors duration-200 [&>div]:!p-0"
        >
          <IonIcon
            name="FunnelOutline"
            className="text-primary cursor-pointer w-6 h-6 lg:w-8 lg:h-8"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        id={menuId ? `${menuId}-content` : undefined}
        sideOffset={8}
        align="end"
        className="w-80 p-0 rounded-2xl shadow-elevation-3 border-0 bg-neutral-white overflow-hidden"
      >
        {/* Access Rights Section */}
        <div className="p-4 pb-2">
          <DropdownMenuLabel className="px-0 py-0 mb-4 title-medium-emphasized text-neutral-600">
            สิทธิ์การเข้าถึง
          </DropdownMenuLabel>

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
