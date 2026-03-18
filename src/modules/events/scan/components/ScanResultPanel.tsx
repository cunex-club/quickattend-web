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
        "flex h-full min-h-0 flex-col gap-4 rounded-[32px] bg-neutral-100 p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-700 px-6 py-3 text-neutral-white">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-white text-green-700">
            <IonIcon name="Checkmark" size="16px" noPadding />
          </span>
          <span className="headline-small-emphasized whitespace-nowrap">
            {title}
          </span>
        </div>

        <div className="title-large-emphasized whitespace-nowrap text-primary">
          {totalCount} คน
        </div>
      </div>

      <div className="flex h-full flex-col rounded-[28px] bg-neutral-white p-6">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-neutral-200">
          <IonIcon
            name="PersonOutline"
            size="44px"
            className="text-neutral-400"
          />
        </div>

        <div className="mt-4 text-center text-neutral-700">
          <p className="headline-small-emphasized">
            {result?.participantName || "-"}
          </p>
          <p className="title-medium-emphasized mt-1">{result?.refId || "-"}</p>
        </div>

        <div className="mt-6 space-y-2 text-neutral-700">
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

        <div className="mt-6 space-y-2">
          <p className="title-small-emphasized text-neutral-700">หมายเหตุ</p>
          <TextField
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="กรอกหมายเหตุ (ถ้ามี)"
            inputClassName="body-small-primary"
          />
        </div>

        <div className="mt-auto pt-6">
          <Button
            mode="filled"
            bordered="round"
            expanded
            className="title-medium-emphasized"
            onClick={onBackToScan}
          >
            สแกนต่อ
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ScanResultPanel;
