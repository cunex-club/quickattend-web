"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { cn } from "@assets/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";
import IonIcon from "@shared/IonIcon";
import Icon from "@shared/Icon";

interface DockInputDatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  label?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DockInputDatePicker: React.FC<DockInputDatePickerProps> = ({
  value,
  onChange,
  label = "Date",
  helperText = "MM/DD/YYYY",
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value);
  const [tempDate, setTempDate] = useState<Date | undefined>(value);
  const [viewDate, setViewDate] = useState(value || new Date());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Format date for display
  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return "";
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Get calendar data
  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: startDay }, (_, i) => ({
      day: prevMonthLastDay - startDay + i + 1,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthLastDay - startDay + i + 1),
    }));

    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: true,
      date: new Date(year, month, i + 1),
    }));

    // Next month days
    const remainingDays = 42 - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = Array.from({ length: remainingDays }, (_, i) => ({
      day: i + 1,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i + 1),
    }));

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  }, [viewDate]);

  // Year options (10 years before and after current year)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }, []);

  const handleDateClick = (date: Date) => {
    setTempDate(date);
  };

  const handleConfirm = () => {
    setSelectedDate(tempDate);
    onChange?.(tempDate);
    setOpen(false);
  };

  const handleCancel = () => {
    setTempDate(selectedDate);
    setViewDate(selectedDate || new Date());
    setOpen(false);
  };

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleMonthSelect = (monthIndex: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), monthIndex, 1));
    setShowMonthDropdown(false);
  };

  const handleYearSelect = (year: number) => {
    setViewDate((prev) => new Date(year, prev.getMonth(), 1));
    setShowYearDropdown(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setTempDate(selectedDate);
      setViewDate(selectedDate || new Date());
    }
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
  };

  const isSameDay = (date1: Date | undefined, date2: Date) => {
    if (!date1) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <div className={cn("relative w-full", className)}>
        {/* Floating Label */}
        <label
          className={cn(
            "absolute -top-2.5 left-3 px-1 bg-white body-small-primary transition-colors z-10",
            open ? "text-[#6750A4]" : "text-neutral-500",
          )}
        >
          {label}
        </label>

        {/* Input Trigger */}
        <PopoverTrigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-between border-2 rounded-lg px-2 py-2 text-left transition-colors duration-200 bg-white",
              open ? "border-[#6750A4]" : "border-neutral-400",
              disabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <span
              className={cn(
                "body-large-primary",
                selectedDate ? "text-neutral-600" : "text-neutral-400",
              )}
            >
              {formatDisplayDate(selectedDate) || helperText}
            </span>
            <div className="rounded bg-neutral-100 p-1.5 flex items-center justify-center text-neutral-500">
              <Icon name="today" size={24} />
            </div>
          </button>
        </PopoverTrigger>

        {/* Helper Text */}
        <span className="block mt-1.5 body-small-primary text-neutral-400 px-1">
          {helperText}
        </span>
      </div>

      {/* Calendar Popover */}
      <PopoverContent
        className="w-auto p-0 border-0 shadow-elevation-3 rounded-2xl overflow-hidden bg-[#ECE6F0]"
        align="start"
        sideOffset={8}
      >
        <div className="p-4 min-w-[280px]">
          {/* Month/Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            {/* Left Navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500"
              >
                <IonIcon name="ChevronBackOutline" size="16px" />
              </button>

              {/* Month Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthDropdown(!showMonthDropdown);
                    setShowYearDropdown(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-100 transition-colors text-neutral-600 label-large-primary"
                >
                  {MONTHS[viewDate.getMonth()]}
                  <Icon
                    name="arrow_drop_down"
                    size={18}
                    className="-translate-y-0.75"
                  />
                </button>

                {showMonthDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-elevation-2 border border-neutral-200 py-1 z-20 max-h-48 overflow-y-auto">
                    {MONTHS.map((month, index) => (
                      <button
                        key={month}
                        type="button"
                        onClick={() => handleMonthSelect(index)}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 transition-colors",
                          viewDate.getMonth() === index &&
                            "bg-primary/10 text-primary",
                        )}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500"
              >
                <IonIcon name="ChevronForwardOutline" size="16px" />
              </button>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setViewDate(
                    (prev) =>
                      new Date(prev.getFullYear() - 1, prev.getMonth(), 1),
                  )
                }
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500"
              >
                <IonIcon name="ChevronBackOutline" size="16px" />
              </button>

              {/* Year Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowYearDropdown(!showYearDropdown);
                    setShowMonthDropdown(false);
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded hover:bg-neutral-100 transition-colors text-neutral-600 label-large-primary"
                >
                  {viewDate.getFullYear()}
                  <Icon
                    name="arrow_drop_down"
                    size={18}
                    className="-translate-y-0.75"
                  />
                </button>

                {showYearDropdown && (
                  <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-elevation-2 border border-neutral-200 py-1 z-20 max-h-48 overflow-y-auto">
                    {yearOptions.map((year) => (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleYearSelect(year)}
                        className={cn(
                          "w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 transition-colors",
                          viewDate.getFullYear() === year &&
                            "bg-primary/10 text-primary",
                        )}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setViewDate(
                    (prev) =>
                      new Date(prev.getFullYear() + 1, prev.getMonth(), 1),
                  )
                }
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-500"
              >
                <IonIcon name="ChevronForwardOutline" size="16px" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS_OF_WEEK.map((day, index) => (
              <div
                key={`${day}-${index}`}
                className="w-10 h-10 flex items-center justify-center body-large-primary text-neutral-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarData.map((item, index) => {
              const isSelected = isSameDay(tempDate, item.date);
              const isToday = isSameDay(new Date(), item.date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateClick(item.date)}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center body-large-primary rounded-full transition-all duration-150",
                    item.isCurrentMonth
                      ? "text-neutral-600"
                      : "text-neutral-300",
                    isSelected && "bg-[#6750A4] text-white",
                    !isSelected &&
                      isToday &&
                      "border-2 border-[#6750A4] text-[#6750A4]",
                    !isSelected && "hover:bg-neutral-100",
                  )}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 ">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 label-large-primary text-[#6750A4] hover:bg-[#6750A4]/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 label-large-primary text-[#6750A4] hover:bg-[#6750A4]/5 rounded-lg transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DockInputDatePicker;
