"use client";

import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import type { MouseEvent } from "react";

type mode = "filled" | "outline" | "text" | "Icon";
type bordered = "square" | "round";

const getPropsByMode: Record<mode, string> = {
  filled:
    "bg-primary border border-primary text-neutral-white hover:brightness-90 hover:scale-105 active:scale-95 active:brightness-75 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:scale-100",
  outline:
    "bg-transparent border border-primary text-neutral-black hover:bg-primary hover:scale-105 hover:text-neutral-white active:scale-95 active:brightness-90 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-black disabled:active:scale-100",
  text: "bg-transparent border-none text-primary hover:bg-primary/10 active:bg-primary/20 active:scale-95 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:active:scale-100",
  Icon: "bg-primary border-none p-0 text-primary hover:scale-105 active:scale-90 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100",
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
  disabled?: boolean;
};

const Button: StyleableFC<ButtonProps> = ({
  mode,
  bordered,
  expanded,
  className,
  onClick,
  children,
  style,
  disabled,
  ...props
}) => {
  return (
    <button
      className={cn(
        "relative justify-center items-center px-4 py-2.5 cursor-pointer",
        getPropsByBordered[bordered],
        getPropsByMode[mode],
        getPropsByExpanded(expanded),
        className
      )}
      onClick={onClick}
      style={style}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
