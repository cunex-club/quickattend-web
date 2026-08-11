import { format } from "date-fns";
import IonIcon from "@shared/IonIcon";

interface EditableTimeProps {
  value?: Date;
  min?: Date;
  max?: Date;
  onChange: (time: string) => void;
  disabled?: boolean;
}

const formatTime = (date?: Date) => (date ? format(date, "HH:mm") : "");

const EditableTime = ({
  value,
  min,
  max,
  onChange,
  disabled = false,
}: EditableTimeProps) => {
  return (
    <label className="relative flex w-full flex-1">
      <input
        type="time"
        step="60"
        value={formatTime(value)}
        min={formatTime(min) || undefined}
        max={formatTime(max) || undefined}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 border rounded-md pl-3 pr-6 body-large-primary disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-calendar-picker-indicator]:opacity-0"
      />
      <IonIcon
        name="Time"
        size="16px"
        noPadding
        className="text-primary pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
      />
    </label>
  );
};

export default EditableTime;
