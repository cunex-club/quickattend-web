"use client";

import { useState } from "react";
import { cn } from "@assets/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@assets/components/ui/dialog";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";
import TextField from "@shared/TextField";

export type ScanResultStatus = "success" | "duplicate" | "failed";

export type ScanResultModalData = {
  status: ScanResultStatus;
  participantName?: string;
  refId?: string;
  organization?: string;
  checkInTime?: string;
  message?: string;
};

const SCAN_RESULT_THEME = {
  success: {
    title: "ลงทะเบียนสำเร็จ",
    headerClass: "bg-success",
    iconName: "CheckmarkCircleOutline",
    iconClass: "text-neutral-white",
  },
  duplicate: {
    title: "ลงทะเบียนไปแล้ว",
    headerClass: "bg-warning",
    iconName: "RefreshCircleOutline",
    iconClass: "text-neutral-white",
  },
  failed: {
    title: "ลงทะเบียนไม่สำเร็จ",
    headerClass: "bg-error",
    iconName: "CloseCircleOutline",
    iconClass: "text-neutral-white",
  },
} as const;

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

  const resultTheme = SCAN_RESULT_THEME[result?.status ?? "success"];
  const isFailed = result?.status === "failed";
  const message =
    result?.message || "ไม่อยู่ในรายชื่อผู้มีสิทธิ์ลงทะเบียนเข้าร่วมกิจกรรม";

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

        <div
          className={cn(
            resultTheme.headerClass,
            "px-5 py-4 text-neutral-white",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-white">
              <IonIcon
                name={resultTheme.iconName}
                size="16px"
                className={resultTheme.iconClass}
                noPadding
              />
            </span>
            <span className="headline-small-emphasized">
              {resultTheme.title}
            </span>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          {isFailed ? (
            <div className="rounded-[22px] bg-white px-4 py-5 text-center shadow-sm">
              <p className="headline-small-emphasized text-neutral-700">
                {message}
              </p>
            </div>
          ) : (
            <>
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-neutral-200">
                <IonIcon
                  name="PersonOutline"
                  size="40px"
                  className="text-neutral-400"
                />
              </div>

              <div className="space-y-2">
                <p className="title-small-emphasized text-neutral-700">
                  รายละเอียดผู้เข้าร่วมกิจกรรม
                </p>
                <div className="space-y-1.5 text-neutral-700">
                  <p className="body-small-primary">
                    ชื่อ: {result?.participantName || "-"}
                  </p>
                  <p className="body-small-primary">
                    รหัสนิสิต: {result?.refId || "-"}
                  </p>
                  <p className="body-small-primary">
                    คณะ / หน่วยงาน: {result?.organization || "-"}
                  </p>
                  <p className="body-small-primary">
                    เวลาที่ลงทะเบียน: {result?.checkInTime || "-"}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <p className="title-small-emphasized text-neutral-700">หมายเหตุ</p>
            <TextField
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="กรอกหมายเหตุ (ถ้ามี)"
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
