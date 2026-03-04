import React from "react";
import { cn } from "@assets/lib/utils";

type StatCardVariant = "filled" | "outline";

interface StatCardProps {
  title: string;
  value: number | string;
  unit: string;
  variant?: StatCardVariant;
  switchNumberPosition?: boolean;
  mobileLeftAlign?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const StatCard = ({
  title,
  value,
  unit,
  variant = "filled",
  switchNumberPosition = false,
  mobileLeftAlign = false,
  className,
  children,
}: StatCardProps) => {
  const variantClasses = {
    filled: "bg-primary",
    outline: "border border-primary",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center lg:items-center justify-center h-full w-full rounded-[28px] py-6 px-8 lg:py-8 lg:px-8 space-y-4 lg:space-y-2 border",
        variantClasses[variant],
        mobileLeftAlign && "items-start",
        className,
      )}
    >
      <div className="flex flex-col gap-y-4 lg:gap-y-8 xl:gap-y-4">
        <div
          className={cn(
            "flex justify-center items-baseline space-x-2 md:space-x-4 lg:space-x-4 xl:space-x-8",
            switchNumberPosition &&
              "order-2 lg:order-1 justify-start lg:justify-center",
          )}
        >
          <p
            className={cn(
              // Base Styles (Font Family, Weight, Align)
              "font-bold text-center",

              // Mobile (md)
              "text-[72px] leading-[64px] tracking-[-0.25px]",

              // Tablet (md)
              "md:text-[96px] md:leading-[64px] md:tracking-[-0.25px]",

              // Tablet (lg)
              "lg:text-[115px] lg:leading-[64px] lg:tracking-[-0.25px]",

              // Desktop (xl)
              "xl:text-[128px] xl:leading-[100%] xl:tracking-[-1.408px]",

              // Color Logic (Variants)
              variant === "filled" ? "text-neutral-white" : "text-primary",
            )}
          >
            {/*คน/people*/}
            {value.toLocaleString("en-US")}
          </p>
          <p
            className={cn(
              // Base Styles (Font Family, Weight, Align)
              "font-bold text-center",

              // Mobile (base)
              "text-[24px] leading-[32px]",

              // Tablet (md)
              "md:text-[28px] md:leading-[36px]",

              // Tablet (lg)
              "lg:text-[48px] lg:leading-[40px]",

              // Desktop (xl)
              "xl:text-[64px] xl:leading-[140%] xl:tracking-[-0.704px]",



              // Color Logic
              variant === "filled" ? "text-neutral-white" : "text-primary",
            )}
          >
            {unit}
          </p>
        </div>
        <div
          className={cn(
            "flex justify-center",
            switchNumberPosition && "order-1 lg:order-2",
            mobileLeftAlign && "justify-start lg:justify-center",
          )}
        >
          <p
            className={cn(
              "title-medium-primary lg:title-large-primary text-center",
              variant === "filled"
                ? "text-neutral-white"
                : "text-neutral-black",
              switchNumberPosition && "order-1 lg:order-2",
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
