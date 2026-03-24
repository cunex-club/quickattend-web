"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import IonIcon from "@shared/IonIcon";
import TextField from "@shared/TextField";
import Button from "@shared/Button";
import scanResultMockupImage from "@assets/images/logo/scan-result-mockup-image.png";
import type { ScanResultModalData } from "@modules/events/scan/components/ScanResultModal";

const SCAN_RESULT_THEME = {
  success: {
    titleKey: "resultPanel.successTitle",
    headerClass: "bg-success",
    iconName: "CheckmarkCircle",
    iconClass: "text-neutral-white",
  },
  duplicate: {
    titleKey: "resultPanel.duplicateTitle",
    headerClass: "bg-warning",
    iconName: "RefreshCircle",
    iconClass: "text-neutral-white",
  },
  failed: {
    titleKey: "resultPanel.failedTitle",
    headerClass: "bg-error",
    iconName: "CloseCircle",
    iconClass: "text-neutral-white",
  },
} as const;

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
  const t = useTranslations("Scan");
  const [note, setNote] = useState("");

  useEffect(() => {
    setNote("");
  }, [result?.refId, result?.checkInTime]);

  const resultTheme = SCAN_RESULT_THEME[result?.status ?? "success"];
  const isFailed = result?.status === "failed";
  const message = result?.message || t("resultPanel.permissionError");

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col gap-4 rounded-[32px] p-4 md:p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 px-1">
        <div
          className={cn(
            "inline-flex items-center gap-3 rounded-full px-6 py-3 text-neutral-white",
            resultTheme.headerClass,
          )}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full text-neutral-white">
            <IonIcon
              name={resultTheme.iconName}
              size="52px"
              className={resultTheme.iconClass}
              noPadding
            />
          </span>
          <span className="headline-large-emphasized whitespace-nowrap">
            {t(resultTheme.titleKey)}
          </span>
        </div>
        <div className="flex justify-center items-center text-primary gap-1">
          <div className="display-medium-emphasized whitespace-nowrap text-primary">
            {totalCount}
          </div>
          <div className="headline-large-emphasized mt-2">
            {t("resultPanel.people")}
          </div>
        </div>
      </div>

      <div className="flex h-full flex-col rounded-[28px] bg-neutral-white px-6 py-6 md:px-8 md:py-8">
        {isFailed ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center text-neutral-700">
            <div className="rounded-[22px] bg-neutral-100 px-6 py-8 shadow-sm">
              <p className="headline-large-emphasized max-w-[280px]">
                {message}
              </p>
            </div>
          </div>
        ) : (
          <>
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
                {result?.participantName || t("resultPanel.unknownParticipant")}
              </p>
              <p className="headline-large-emphasized mt-2">
                {result?.refId || "-"}
              </p>
            </div>

            <div className="mt-8 space-y-2 text-neutral-700">
              <p className="title-large-primary">
                {result?.organization || "-"}
              </p>
              <div className="flex items-center gap-1">
                <IonIcon
                  name="Time"
                  size="14px"
                  className="text-primary"
                  noPadding
                />
                <p className="title-large-primary">
                  {t("resultPanel.registrationTime")}{" "}
                  {result?.checkInTime || "-"}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 space-y-2">
          <p className="title-small-emphasized text-neutral-600">
            {t("resultPanel.notes")}
          </p>
          <div className="flex items-center gap-3">
            <TextField
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("resultPanel.notesPlaceholder")}
              inputClassName="body-large-primary text-neutral-400 "
            />
            <Button
              mode="filled"
              bordered="round"
              expanded={false}
              className="title-large-primary whitespace-nowrap !px-4"
              onClick={onBackToScan}
            >
              {t("resultPanel.addNote")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScanResultPanel;
