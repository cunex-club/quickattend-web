"use client";

import { StyleableFC } from "@utils/misc";
import Button from "@components/Button";
import Icon from "@components/Icon";

type EventNameScanProps = {
  label: string;
  link: string;
};

const EventNameScan: StyleableFC<EventNameScanProps> = ({ label, link }) => {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      // Optional: Show success notification
      alert("Link copied to clipboard!"); // still not have toatst system 
      //TODO: Replace alert with toast notification system
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }; // mock

  return (
    <Button
      mode="outline"
      bordered="round"
      expanded={false}
      onClick={handleCopyLink}
    >
      <div className="flex gap-x-2">
        <span className="w-30 flex justify-start items-center title-small-emphasized">
          {label}
        </span>
        <Icon name="link" size={24} className="text-primary" />
      </div>
    </Button>
  );
};

export default EventNameScan;
