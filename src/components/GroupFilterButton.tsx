"use client";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import * as React from "react";

import Button from "./Button";

type Option = {
  value: string;
  label: React.ReactNode;
};

type GroupFilterButtonProps = {
  options: [Option, Option];
  value: string;
   // TODO: Add onChange prop when implementing value change functionality
};

const GroupFilterButton: StyleableFC<GroupFilterButtonProps> = ({
  className,
  options,
  value,
  ...props
}) => {
  const [leftOption, rightOption] = options;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-xl bg-neutral-100 p-1",
        className,
      )}
      {...props}
    >
      <Button
        mode={value === leftOption.value ? "filled" : "outline"}
        bordered="square"
        expanded={false}
      >
        {leftOption.label}
      </Button>
      <Button
        mode={value === rightOption.value ? "filled" : "outline"}
        bordered="square"
        expanded={false}
      >
        {rightOption.label}
      </Button>
    </div>
  );
};

export default GroupFilterButton;
