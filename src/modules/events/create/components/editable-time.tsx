import { format } from "date-fns";
import IonIcon from "@shared/IonIcon";
import { useTranslations } from "next-intl";

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
  const tCreateEvent = useTranslations("CreateEvent");
  return (
    <label className="flex relative w-full flex-1">
      <input
        type="time"
        step="60"
        value={formatTime(value)}
        min={formatTime(min) || undefined}
        max={formatTime(max) || undefined}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />

      <div
        className={`w-full h-10 flex items-center justify-between border rounded-md pl-3 body-large-primary
          ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        <span>{formatTime(value) || tCreateEvent("timePlaceholder")}</span>
        <IonIcon name="Time" size="16px" className="text-primary" />
      </div>
    </label>
  );
};

export default EditableTime;
