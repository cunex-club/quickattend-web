import React from "react";
import { cn } from "@assets/lib/utils";

interface InfoCardProps {
  titleFull: string;
  titleShort: string;
  value: number | string;
  unit: string;
}

export const InfoCard = ({
  titleFull,
  titleShort,
  value,
  unit,
}: InfoCardProps) => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col items-center lg:items-center justify-center h-full w-full rounded-2xl p-8 space-y-4 lg:space-y-2 bg-neutral-100 lg:h-[320px] xl:h-[400px]">
        <div className="flex flex-col gap-y-0 md:gap-y-6 lg:gap-y-8">
          <div className="flex justify-center items-baseline space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8">
            <p
              className={cn(
                // Base styles
                "font-bold text-center text-primary",

                // Mobile (base)
                "text-[57px] leading-[64px] tracking-[-0.25px]",

                // Tablet (md)
                "md:text-[64px] md:leading-[40px] md:tracking-[0]",

                // Tablet (lg)
                "lg:text-[96px] lg:leading-[64px] lg:tracking-[-0.25px]",

                // Desktop (xl)
                "xl:text-[128px] xl:leading-[64px] xl:tracking-[-0.25px]",
              )}
            >
              {value.toLocaleString("en-US")}
            </p>
            <p
              className={cn(
                // Base styles
                "font-bold text-center text-primary",

                // Mobile (base)
                "text-[24px] leading-[32px] tracking-[0]",

                // Tablet (md)
                "md:text-[28px] md:leading-[36px] md:tracking-[0]",

                // Tablet (lg)
                "lg:text-[32px] lg:leading-[40px] lg:tracking-[0]",

                // Desktop (lg & xl)
                "lg:text-[45px] lg:leading-[52px] lg:tracking-[0]",
              )}
            >
              {unit}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="label-small-primary lg:title-large-primary text-center text-neutral-600 hidden lg:block">
              {titleFull}
            </p>
            <p className="label-small-primary lg:title-large-primary text-center text-neutral-600 block lg:hidden">
              {titleShort}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
