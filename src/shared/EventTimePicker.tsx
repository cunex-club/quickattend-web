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

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartTimeInput(value);
    onStartTimeChange?.(value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEndTimeInput(value);
    onEndTimeChange?.(value);
  };

  return (
    <div className={`grid grid-cols-2 gap-2 ${className}`}>
      <TextField
        type="time"
        value={startTimeInput}
        onChange={handleStartTimeChange}
        placeholder={startPlaceholder}
        className="bg-neutral-100"
        inputClassName="body-large-primary"
        endIcon={<IonIcon name="Time" size="20px" className="text-primary" />}
        supportingText="เวลาเริ่มกิจกรรม"
      />
      <TextField
        type="time"
        value={endTimeInput}
        onChange={handleEndTimeChange}
        placeholder={endPlaceholder}
        className="bg-neutral-100"
        inputClassName="body-large-primary"
        endIcon={<IonIcon name="Time" size="20px" className="text-primary" />}
        supportingText="เวลาสิ้นสุดกิจกรรม"
      />
    </div>
  );
};

export default EventTimePicker;