"use client";

import React, { useState } from "react";
import TextField from "@shared/TextField";
import IonIcon from "@shared/IonIcon";

interface DatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

type InputWithPicker = HTMLInputElement & {
  showPicker?: () => void;
};

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

const DatePicker = ({
  value,
  onChange,
  placeholder = "วัน / เดือน / ปี",
  className = "",
}: DatePickerProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [selectedDate, setSelectedDate] = useState(value || "");

  // Format date from YYYY-MM-DD to "D / เดือนไทย / YYYY พ.ศ."
  const formatDateToThai = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Buddhist year

    return `${day} / ${month} / ${year}`;
  };

  const [displayValue, setDisplayValue] = useState(
    value ? formatDateToThai(value) : "",
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedDate(newValue);
    setDisplayValue(formatDateToThai(newValue));
    onChange?.(newValue);
  };

  const handleContainerClick = () => {
    const input = inputRef.current;
    if (!input) return;

    const pickerInput = input as InputWithPicker;
    if (typeof pickerInput.showPicker === "function") {
      pickerInput.showPicker();
    } else {
      input.click();
    }
  };

  return (
    <div
      className={`relative cursor-pointer ${className}`}
      onClick={handleContainerClick}
    >
      <input
        ref={inputRef}
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="absolute inset-0 w-full h-full opacity-0 -z-10 pointer-events-none"
        tabIndex={-1}
      />
      <div className="pointer-events-none">
        <TextField
          type="text"
          value={displayValue}
          placeholder={placeholder}
          className="bg-neutral-100"
          inputClassName="body-large-primary cursor-pointer"
          endIcon={<IonIcon name="Calendar" size="16px" />}
          endIconWrapperClassName="bg-primary text-white px-2"
          showSeparator={true}
          readOnly
        />
      </div>
    </div>
  );
};

export default DatePicker;
