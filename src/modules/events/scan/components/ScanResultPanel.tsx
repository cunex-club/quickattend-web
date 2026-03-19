"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import IonIcon from "@shared/IonIcon";
import TextField from "@shared/TextField";
import Button from "@shared/Button";
import scanResultMockupImage from "@assets/images/logo/scan-result-mockup-image.png";
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
        "flex h-full min-h-0 flex-col gap-4 rounded-[32px] p-4 md:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="inline-flex items-center gap-3 rounded-full bg-success px-6 py-3 text-neutral-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-white text-green-700">
            <IonIcon name="Checkmark" size="48px" noPadding />
          </span>
          <span className="headline-large-emphasized whitespace-nowrap">
            {title}
          </span>
        </div>
        <div className="flex justify-center items-center text-primary gap-1">
          <div className="display-medium-emphasized whitespace-nowrap text-primary">
            {totalCount}
          </div>
          <div className="headline-large-emphasized mt-2">คน</div>
        </div>
      </div>

      <div className="flex h-full flex-col rounded-[28px] bg-neutral-white px-6 py-6 md:px-8 md:py-8">
        <div className="mx-auto h-[184px] w-[152px] overflow-hidden rounded-2xl bg-neutral-200">
          <Image
            src={scanResultMockupImage}
            alt="Scan result participant"
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="mt-6 text-center text-neutral-700">
          <p className="headline-large-emphasized">
            {result?.participantName || "-"}
          </p>
          <p className="headline-large-emphasized mt-2">
            {result?.refId || "-"}
          </p>
        </div>

        <div className="mt-8 space-y-2 text-neutral-700">
          <p className="title-large-primary">{result?.organization || "-"}</p>
          <div className="flex items-center gap-1">
            <IonIcon
              name="Time"
              size="14px"
              className="text-primary"
              noPadding
            />
            <p className="title-large-primary">
              ลงทะเบียนสำเร็จ : {result?.checkInTime || "-"}
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="title-small-emphasized text-neutral-600">หมายเหตุ</p>
          <div className="flex items-center gap-3">
            <TextField
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="กรอกหมายเหตุ (ถ้ามี)"
              inputClassName="body-large-primary color-neutral-400 "
            />
            <Button
              mode="filled"
              bordered="round"
              expanded={false}
              className="title-large-primary whitespace-nowrap !px-4"
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
