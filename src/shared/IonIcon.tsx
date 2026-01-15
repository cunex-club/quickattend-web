"use client";
import React from "react";
import * as Ionicons from "react-ionicons";
import { StyleableFC } from "@utils/misc";

type IconName = keyof typeof Ionicons;

interface IconProps {
  name: IconName;
  size?: string;
  onClick?: () => void;
}

const IonIcon: StyleableFC<IconProps> = ({
  name,
  size = "24px",
  className,
  onClick,
}) => {
  const IconComponent = Ionicons[name] as React.ElementType;

  if (!IconComponent) return null;

  return (
    <div className="p-2">
      <IconComponent
        height={size}
        width={size}
        color="currentColor"
        cssColorProp
        className={className}
        onClick={onClick}
      />
    </div>
  );
};

export default IonIcon;
