"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
// import { CheckIcon } from "lucide-react"

import { cn } from "@assets/lib/utils";
import IonIcon from "@shared/IonIcon";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-gray-500 rounded-[2px] border-2 size-[20px] dark:bg-input/30 dark:data-[state=checked]:bg-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-neutral-white data-[state=checked]:text-primary data-[state=checked]:border-primary",
        "transition-all duration-200 ease-in-out",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current translate-y-[-11px] data-[state=checked]:scale-100 data-[state=unchecked]:scale-0 transition-transform duration-150 ease-in-out"
      >
        <IonIcon
          name="CheckboxSharp"
          size="22px"
          className="text-primary w-full"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
