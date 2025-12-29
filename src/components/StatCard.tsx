import React from "react";
import { cn } from "@assets/lib/utils";

type StatCardVariant = "primary-filled" | "primary-outline" | "secondary";

interface StatCardProps {
  title: string;
  value: number | string;
  unit: string;
  variant?: StatCardVariant;
  className?: string;
  children?: React.ReactNode;
}

export const StatCard = ({
  title,
  value,
  unit,
  variant = "primary-filled",
  className,
  children,
}: StatCardProps) => {
  const variantClasses = {
    "primary-filled": "bg-primary",
    "primary-outline": "border border-primary",
    secondary: "bg-neutral-200",
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center h-full w-full rounded-[28px] p-12 md:p-8 space-y-8",
        variantClasses[variant],
        className
      )}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center items-end space-x-4">
          <p
            className={cn(
              "font-bold text-7xl sm:text-[56px] md:text-[70px] lg:text-[128px] translate-y-3 md:translate-y-4 lg:translate-y-8",
              variant === "primary-filled"
                ? "text-neutral-white"
                : "text-neutral-black",
              variant === "primary-outline" ? "text-primary" : "",
              variant === "secondary" ? "text-primary" : ""
            )}
          >
            {value}
          </p>
          <p
            className={cn(
              "display-medium-emphasized",
              variant === "primary-filled"
                ? "text-neutral-white"
                : "text-neutral-black",
              variant === "primary-outline" ? "text-primary" : "",
              variant === "secondary" ? "text-primary" : ""
            )}
          >
            {unit}
          </p>
        </div>
        <div className="flex flex-col items-center">
          <p
            className={cn(
              "title-medium-primary lg:title-large-primary text-center",
              variant === "primary-filled"
                ? "text-neutral-white"
                : "text-neutral-black",
              variant === "primary-outline" ? "text-neutral-black" : "",
              variant === "secondary" ? "text-neutral-black" : ""
            )}
          >
            {title}
          </p>
        </div>
      </div>

      {children && <div>{children}</div>}
    </div>
  );
};

export default StatCard;
