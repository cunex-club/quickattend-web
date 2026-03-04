"use client";

import { ReactNode } from "react";
import IonIcon from "@shared/IonIcon";

type EventEmptyStateProps = {
  iconName: React.ComponentProps<typeof IonIcon>["name"];
  title: string;
  description: ReactNode;
};

const EventEmptyState = ({
  iconName,
  title,
  description,
}: EventEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <IonIcon name={iconName} size="72px" className="text-primary" />
      <h3 className="mt-4 display-small-emphasized text-neutral-600">
        {title}
      </h3>
      <p className="mt-1 title-large-primary text-neutral-600">{description}</p>
    </div>
  );
};

export default EventEmptyState;
