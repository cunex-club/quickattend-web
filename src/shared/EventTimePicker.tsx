"use client";

import React, { useState } from "react";
import TextField from "@shared/TextField";
import IonIcon from "@shared/IonIcon";

interface EventTimePickerProps {
  startTime?: string;
  endTime?: string;
  onStartTimeChange?: (value: string) => void;
  onEndTimeChange?: (value: string) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  className?: string;
}

const EventTimePicker = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  startPlaceholder = "16.00 น.",
  endPlaceholder = "20.00 น.",
  className = "",
}: EventTimePickerProps) => {
  const [startTimeInput, setStartTimeInput] = useState(startTime || "");
  const [endTimeInput, setEndTimeInput] = useState(endTime || "");

  // Format time from HH:mm to HH.mm น.
  const formatTimeDisplay = (time: string) => {
    if (!time) return "";
    return time.replace(":", ".") + " น.";
  };

  const handleTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    onChange?: (value: string) => void,
  ) => {
    // Remove non-numeric characters
    const numbers = e.target.value.replace(/\D/g, "");

    // Limit to 4 digits
    const truncated = numbers.slice(0, 4);

    // Format as HH:mm
    let formatted = truncated;
    if (truncated.length >= 3) {
      formatted = `${truncated.slice(0, 2)}:${truncated.slice(2)}`;
    }

    setInput(formatted);
    onChange?.(formatted);
  };

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <TextField
        type="text"
        maxLength={5}
        value={startTimeInput}
        onChange={(e) =>
          handleTimeChange(e, setStartTimeInput, onStartTimeChange)
        }
        placeholder={startPlaceholder}
        inputClassName="body-large-primary"
        endIcon={<IonIcon name="Time" size="20px" className="text-primary" />}
        supportingText="เวลาเริ่มกิจกรรม"
      />
      <TextField
        type="text"
        maxLength={5}
        value={endTimeInput}
        onChange={(e) => handleTimeChange(e, setEndTimeInput, onEndTimeChange)}
        placeholder={endPlaceholder}
        inputClassName="body-large-primary"
        endIcon={<IonIcon name="Time" size="20px" className="text-primary" />}
        supportingText="เวลาสิ้นสุดกิจกรรม"
      />
    </div>
  );
};

export default EventTimePicker;