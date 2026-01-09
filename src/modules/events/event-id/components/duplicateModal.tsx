"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@assets/components/ui/dialog";
import Button from "@shared/Button";
import DatePicker from "@shared/DatePicker";
import EventTimePicker from "@shared/EventTimePicker";
import { EventInfo } from "@customTypes/events";
import TextField from "@shared/TextField";

interface DuplicateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventData: EventInfo;
}

const DuplicateModal = ({
  open,
  onOpenChange,
  eventData,
}: DuplicateModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-2xl bg-neutral-white shadow-sm border border-neutral-200 p-10 rounded-xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="headline-large-emphasized text-primary">
            ทำซ้ำกิจกรรม
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 m-4 ">
          {/* Event Name */}
          <div className="headline-medium-emphasized">
            {eventData.name}
          </div>

          {/* Event Description */}
          <div className="space-y-2">
            <div className="headline-small-emphasized">รายละเอียดกิจกรรม</div>
            <div className="body-large-primary">
              {eventData.description}
            </div>
          </div>

          {/* Date and Time Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <label className="body-large-primary">
                วันที่ <span className="text-red-500">*</span>
              </label>
              <DatePicker placeholder="วัน / เดือน / ปี" />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="body-large-primary">
                เวลา <span className="text-red-500">*</span>
              </label>
              <EventTimePicker />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="body-large-primary">
              สถานที่ <span className="text-red-500">*</span>
            </label>
            <TextField
              type="text"
              placeholder="กรอกสถานที่จัดกิจกรรม"
              defaultValue={eventData.location}
              inputClassName="body-large-primary"
            />
          </div>

          {/* Organizer */}
          <div className="space-y-2">
            <div className="headline-small-emphasized">ผู้จัดกิจกรรม</div>
            <div className="body-large-primary">
              องค์กรบริหารสโมสรนิสิตจุฬาฯ (อบจ.)
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-2">
            <Button
              mode="filled"
              bordered="round"
              expanded={false}
              className="title-medium-primary px-12 py-6"
            >
              ต่อไป
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateModal;