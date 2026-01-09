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
  const [selectedDate, setSelectedDate] = useState(value || "");
  const [displayValue, setDisplayValue] = useState("");

  // Format date from YYYY-MM-DD to "D / เดือนไทย / YYYY พ.ศ."
  const formatDateToThai = (dateString: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const day = date.getDate();
    const month = THAI_MONTHS[date.getMonth()];
    const year = date.getFullYear() + 543; // Convert to Buddhist year
    
    return `${day} / ${month} / ${year}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSelectedDate(newValue);
    setDisplayValue(formatDateToThai(newValue));
    onChange?.(newValue);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <TextField
        type="text"
        value={displayValue}
        placeholder={placeholder}
        className="bg-neutral-100"
        inputClassName="body-large-primary cursor-pointer"
        endIcon={<IonIcon name="Calendar" size="24px" />}
        endIconWrapperClassName="bg-primary text-white"
        showSeparator={true}
        readOnly
      />
    </div>
  );
};

export default DatePicker;

