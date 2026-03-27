"use client";

import { useState, useEffect, useRef } from "react";
import IonIcon from "@shared/IonIcon";
import { cn } from "@assets/lib/utils";
import TextField from "@shared/TextField";

interface EventTimePickerProps {
  startTime?: string;
  endTime?: string;
  onStartTimeChange?: (value: string) => void;
  onEndTimeChange?: (value: string) => void;
  startPlaceholder?: string;
  endPlaceholder?: string;
  className?: string;
  layout?: "row" | "col";
  disabled?: boolean;
}

type InputWithPicker = HTMLInputElement & {
  showPicker?: () => void;
};

const EventTimePicker = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  startPlaceholder = "00:00",
  endPlaceholder = "00:00",
  className = "",
  layout = "row",
  disabled = false,
}: EventTimePickerProps) => {
  const [startTimeInput, setStartTimeInput] = useState(startTime || "");
  const [endTimeInput, setEndTimeInput] = useState(endTime || "");
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  // Sync with external props
  useEffect(() => {
    if (startTime !== undefined) setStartTimeInput(startTime);
  }, [startTime]);

  useEffect(() => {
    if (endTime !== undefined) setEndTimeInput(endTime);
  }, [endTime]);

  const handleStartTimeChange = (value: string) => {
    setStartTimeInput(value);
    onStartTimeChange?.(value);

    // If end time is before start time, adjust it
    if (endTimeInput && value > endTimeInput) {
      setEndTimeInput(value);
      onEndTimeChange?.(value);
    }
  };

  const handleEndTimeChange = (value: string) => {
    // Don't allow end time before start time
    if (startTimeInput && value < startTimeInput) {
      return;
    }
    setEndTimeInput(value);
    onEndTimeChange?.(value);
  };

  const triggerPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (!ref.current) return;
    const pickerInput = ref.current as InputWithPicker;
    if (typeof pickerInput.showPicker === "function") {
      pickerInput.showPicker();
    } else {
      ref.current.click();
    }
  };

  return (
    <div
      className={cn(
        "grid gap-2",
        layout === "row" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {/* Start Time */}
      <div className="flex flex-col gap-1">
        <label
          className="relative cursor-pointer"
          onClick={() => triggerPicker(startInputRef)}
        >
          <input
            ref={startInputRef}
            type="time"
            step="60"
            disabled={disabled}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            value={startTimeInput}
            onChange={(e) => handleStartTimeChange(e.target.value)}
          />

          <div className="pointer-events-none">
            <TextField
              type="text"
              value={startTimeInput}
              placeholder={startPlaceholder}
              inputClassName={cn(
                "body-medium-primary",
                !startTimeInput && "text-neutral-400",
              )}
              endIcon={<IonIcon name="Time" size="18px" />}
              endIconWrapperClassName="text-primary px-2"
              showSeparator
              readOnly
              className={disabled ? "opacity-50" : ""}
            />
          </div>
        </label>

        <p className="body-small-primary mx-4 my-1 text-neutral-500">
          เวลาเริ่มกิจกรรม
        </p>
      </div>

      {/* End Time */}
      <div className="flex flex-col gap-1">
        <label
          className="relative cursor-pointer"
          onClick={() => triggerPicker(endInputRef)}
        >
          <input
            ref={endInputRef}
            type="time"
            step="60"
            disabled={disabled}
            min={startTimeInput || undefined}
            className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
            value={endTimeInput}
            onChange={(e) => handleEndTimeChange(e.target.value)}
          />

          <div className="pointer-events-none">
            <TextField
              type="text"
              value={endTimeInput}
              placeholder={endPlaceholder}
              inputClassName={cn(
                "body-medium-primary",
                !endTimeInput && "text-neutral-400",
              )}
              endIcon={<IonIcon name="Time" size="18px" />}
              endIconWrapperClassName="text-primary px-2"
              showSeparator
              readOnly
              className={disabled ? "opacity-50" : ""}
            />
          </div>
        </label>

        <p className="body-small-primary mx-4 my-1 text-neutral-500">
          เวลาสิ้นสุดกิจกรรม
        </p>
      </div>
    </div>
  );
};

export default EventTimePicker;
