"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@assets/components/ui/dialog";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";
import TextField from "@shared/TextField";

export type ScanResultModalData = {
  participantName: string;
  refId: string;
  organization: string;
  checkInTime: string;
  status: string;
};

type ScanResultModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ScanResultModalData | null;
};

const ScanResultModal = ({
  open,
  onOpenChange,
  result,
}: ScanResultModalProps) => {
  const [note, setNote] = useState("");

  const title =
    result?.status === "duplicate" ? "Already checked in" : "Check-in success";

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) setNote("");
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="w-[min(92vw,360px)] p-0 overflow-hidden rounded-[28px] border-0 bg-neutral-100"
      >
        <DialogTitle className="sr-only">Scan result</DialogTitle>

        <div className="bg-green-700 px-5 py-4 text-neutral-white">
          <div className="flex items-center justify-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-white text-green-700">
              <IonIcon name="Checkmark" size="16px" noPadding />
            </span>
            <span className="headline-small-emphasized">{title}</span>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-neutral-200">
            <IonIcon
              name="PersonOutline"
              size="40px"
              className="text-neutral-400"
            />
          </div>

          <div className="space-y-2">
            <p className="title-small-emphasized text-neutral-700">
              Participant details
            </p>
            <div className="space-y-1.5 text-neutral-700">
              <p className="body-small-primary">
                Name: {result?.participantName || "-"}
              </p>
              <p className="body-small-primary">
                Ref ID: {result?.refId || "-"}
              </p>
              <p className="body-small-primary">
                Faculty / Org: {result?.organization || "-"}
              </p>
              <p className="body-small-primary">
                Checked in at: {result?.checkInTime || "-"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="title-small-emphasized text-neutral-700">Note</p>
            <TextField
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add note (optional)"
              inputClassName="body-small-primary"
            />
          </div>

          <Button
            mode="filled"
            bordered="round"
            expanded
            onClick={() => onOpenChange(false)}
            className="title-medium-emphasized"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanResultModal;
