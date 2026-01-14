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
        className
      )}
    >
      <div className="flex flex-col gap-y-4">
        <div
          className={cn(
            "flex justify-center items-baseline space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8",
            switchNumberPosition &&
              "order-2 lg:order-1 justify-start lg:justify-center"
          )}
        >
          <p
            className={cn(
              // 1. Base Styles (Font Family, Weight, Align)
              "font-bold text-center",

              // 2. Mobile & Tablet (md)
              "text-[72px] leading-[64px] tracking-[-0.25px]",

              // 3. Desktop (lg & xl)
              "lg:text-[128px] lg:leading-[100%] lg:tracking-[-1.408px]",

              // 4. Color Logic (Variants)
              variant === "filled" ? "text-neutral-white" : "text-primary"
            )}
          >
            {value}
          </p>
          <p
            className={cn(
              // 1. Base Styles (Font Family, Weight, Align)
              "font-bold text-center",

              // 2. Mobile & Tablet (md ลงมา) -> Specs: 24px / 32px / 0
              "text-[24px] leading-[32px]",

              // 3. Desktop (lg ขึ้นไป) -> Specs: 64px / 140% / -0.704px
              "lg:text-[64px] lg:leading-[140%] lg:tracking-[-0.704px]",

              // 4. Color Logic
              variant === "filled" ? "text-neutral-white" : "text-primary"
            )}
          >
            {unit}
          </p>
        </div>
        <div
          className={cn(
            "flex justify-center",
            switchNumberPosition && "order-1 lg:order-2",
            mobileLeftAlign && "justify-start lg:justify-center"
          )}
        >
          <p
            className={cn(
              "title-medium-primary lg:title-large-primary text-center",
              variant === "filled"
                ? "text-neutral-white"
                : "text-neutral-black",
              switchNumberPosition && "order-1 lg:order-2"
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
