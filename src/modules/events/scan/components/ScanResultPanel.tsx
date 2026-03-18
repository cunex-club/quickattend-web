"use client";

import { useEffect, useState } from "react";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import IonIcon from "@shared/IonIcon";
import TextField from "@shared/TextField";
import Button from "@shared/Button";
import type { ScanResultModalData } from "./ScanResultModal";

type ScanResultPanelProps = {
  result: ScanResultModalData | null;
  totalCount: number;
  onBackToScan: () => void;
};

const ScanResultPanel: StyleableFC<ScanResultPanelProps> = ({
  result,
  totalCount,
  onBackToScan,
  className,
}) => {
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote("");
  }, [result?.refId, result?.checkInTime]);

  const title =
    result?.status === "duplicate" ? "ลงทะเบียนซ้ำ" : "ลงทะเบียนสำเร็จ";

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col gap-4 rounded-[32px] bg-neutral-100 p-4 md:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="inline-flex items-center gap-3 rounded-full bg-green-700 px-6 py-3 text-neutral-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-white text-green-700">
            <IonIcon name="Checkmark" size="16px" noPadding />
          </span>
          <span className="headline-small-emphasized whitespace-nowrap">
            {title}
          </span>
        </div>

        <div className="display-small-emphasized whitespace-nowrap text-primary">
          {totalCount} คน
        </div>
      </div>

      <div className="flex h-full flex-col rounded-[28px] bg-neutral-white px-6 py-6 md:px-8 md:py-8">
        <div className="mx-auto flex h-[184px] w-[152px] items-center justify-center rounded-2xl bg-neutral-200">
          <IonIcon
            name="PersonOutline"
            size="64px"
            className="text-neutral-400"
          />
        </div>

        <div className="mt-6 text-center text-neutral-700">
          <p className="headline-medium-emphasized">
            {result?.participantName || "-"}
          </p>
          <p className="display-small-emphasized mt-1">
            {result?.refId || "-"}
          </p>
        </div>

        <div className="mt-8 space-y-2 text-neutral-700">
          <p className="body-large-primary">{result?.organization || "-"}</p>
          <div className="flex items-center gap-1">
            <IonIcon
              name="Time"
              size="14px"
              className="text-primary"
              noPadding
            />
            <p className="body-large-primary">
              ลงทะเบียนแล้วที่: {result?.checkInTime || "-"}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="title-small-emphasized text-neutral-700">หมายเหตุ</p>
          <div className="flex items-center gap-3">
            <TextField
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="กรอกหมายเหตุ (ถ้ามี)"
              inputClassName="body-small-primary"
            />
            <Button
              mode="filled"
              bordered="round"
              expanded={false}
              className="title-medium-emphasized whitespace-nowrap px-4"
              onClick={onBackToScan}
            >
              เพิ่มหมายเหตุ
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScanResultPanel;
