// components/TextField.tsx

"use client";

import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import * as React from "react";

type TextFieldProps = React.ComponentProps<"input"> & {
  supportingText?: string | React.ReactNode;
  endIcon?: React.ReactNode;
  endIconWrapperClassName?: string;
  error?: boolean;
  inputClassName?: string;
  showSeparator?: boolean;
};

const TextField: StyleableFC<TextFieldProps> = React.forwardRef<
  HTMLInputElement,
  TextFieldProps
>(
  (
    {
      className,
      inputClassName,
      supportingText,
      endIcon,
      endIconWrapperClassName,
      error,
      showSeparator = false,
      type = "text",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("flex w-full flex-col", className)}>
        <div
          className={cn(
            "flex w-full items-stretch rounded-lg border overflow-hidden",
            error ? "border-red-500" : "border-neutral-400",
            "gap-0 bg-white",
          )}
        >
          <input
            type={type}
            ref={ref}
            className={cn(
              "flex-1 py-3 px-4",
              "bg-transparent border-none outline-none",
              "placeholder:text-neutral-400",
              // focus styles
              "focus:ring-0",
              error && "text-red-500",
              inputClassName,
            )}
            {...props}
          />

          {/* separator line if needed */}
          {endIcon && showSeparator && (
            <div className="w-px bg-neutral-200" />
          )}

          {/* if there is an end icon */}
          {endIcon && (
            <div
              className={cn(
                "flex items-center justify-center px-4",
                endIconWrapperClassName,
              )}
            >
              {endIcon}
            </div>
          )}
        </div>

        {/* if there is supporting text */}
        {supportingText && (
          <p
            className={cn(
              "text-sm mx-4 my-1",
              error ? "text-red-500" : "text-neutral-600",
            )}
          >
            {supportingText}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export default TextField;
