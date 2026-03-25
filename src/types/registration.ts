import IonIcon from "@shared/IonIcon";

export type RegistrationStatus = "success" | "failed" | "warning";

export interface RegistrationItem {
  id: string;
  name: string;
  avatar?: string;
  type: string;
  faculty: string;
  time: string;
  status: RegistrationStatus;
  remark: string;
}

export type IonIconName = React.ComponentProps<typeof IonIcon>["name"];

export interface TableFilterPopoverProps {
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  displayLabelMap?: Record<string, string>;
  className?: string;
  children: React.ReactNode;
}