"use client";

import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import type { MouseEvent } from "react";

type mode = "filled" | "outline" | "text";
type bordered = "square" | "round";

const getPropsByMode: Record<mode, string> = {
  filled: "bg-primary border border-primary text-neutral-white",
  outline: "bg-transparent border border-primary text-neutral-black",
  text: "text-primary border-none bg-transparent text-primary",
};

const getPropsByBordered: Record<bordered, string> = {
  square: "rounded-lg",
  round: "rounded-full",
};

const getPropsByExpanded = (expanded: boolean) => (expanded ? "w-full" : "");

type ButtonProps = {
  mode: mode;
  bordered: bordered;
  expanded: boolean;
  onClick?: (event: MouseEvent) => void;
  children: React.ReactNode;
};

const Button: StyleableFC<ButtonProps> = ({
  mode,
  bordered,
  expanded,
  className,
  onClick,
  children,
  style,
  ...props
}) => {
  return (
    <button
      className={cn(
        "relative justify-center items-center px-4 py-2.5",
        getPropsByBordered[bordered],
        getPropsByMode[mode],
        getPropsByExpanded(expanded),
        className,
      )}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
