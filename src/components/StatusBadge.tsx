import IonIcon from "@shared/IonIcon";
import { cn } from "@assets/lib/utils";
import { RegistrationStatus, IonIconName } from "../types/registration";

export const STATUS_LABEL_MAP: Record<string, string> = {
  success: "ลงทะเบียนสำเร็จ",
  failed: "ลงทะเบียนไม่สำเร็จ",
  warning: "ลงทะเบียนแล้ว",
};

const STATUS_STYLE_MAP: Record<RegistrationStatus, { label: string; icon: IonIconName; className: string }> = {
  success: { label: "ลงทะเบียนสำเร็จ", icon: "CheckmarkCircle", className: "bg-success" },
  failed: { label: "ลงทะเบียนไม่สำเร็จ", icon: "CloseCircle", className: "bg-error" },
  warning: { label: "ลงทะเบียนแล้ว", icon: "RefreshCircle", className: "bg-warning" },
};

export const StatusBadge = ({ status }: { status: RegistrationStatus }) => {
  const statusStyle = STATUS_STYLE_MAP[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 pl-1 pr-4 py-1 text-white rounded-full label-medium-emphasized whitespace-nowrap",
        statusStyle.className
      )}
    >
      <IonIcon name={statusStyle.icon} size="16px" />
      {statusStyle.label}
    </span>
  );
};