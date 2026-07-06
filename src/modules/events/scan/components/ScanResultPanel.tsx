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
  onBackToScan: () => void;
};

const ScanResultPanel: StyleableFC<ScanResultPanelProps> = ({
  result,
  onBackToScan,
  className,
}) => {
  const t = useTranslations("Scan");
  const [note, setNote] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setNote("");
    setImageError(false);
  }, [result?.refId, result?.checkInTime]);

  const resultTheme = SCAN_RESULT_THEME[result?.status ?? "success"];
  const isFailed = result?.status === "failed";
  const message = result?.message || t("resultPanel.permissionError");
  const profileImageSrc =
    !imageError && result?.profileImageUrl
      ? result.profileImageUrl
      : scanResultMockupImage;

  return (
    <section
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-[32px] bg-neutral-white",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center gap-2 py-6 text-neutral-white",
          resultTheme.headerClass,
        )}
      >
        <IonIcon
          name={resultTheme.iconName}
          size="28px"
          className={resultTheme.iconClass}
          noPadding
        />
        <span className="headline-large-emphasized whitespace-nowrap">
          {t(resultTheme.titleKey)}
        </span>
      </div>

      <div className="flex h-full flex-col px-6 py-6 md:px-8 md:py-8">
        {isFailed ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-neutral-700">
            <p className="headline-large-emphasized max-w-[280px]">{message}</p>
          </div>
        ) : (
          <div className="flex flex-1 items-stretch gap-6">
            <div className="relative w-2/5 shrink-0 overflow-hidden rounded-2xl bg-neutral-200">
              <Image
                src={profileImageSrc}
                alt="Scan result participant"
                fill
                unoptimized={!imageError && !!result?.profileImageUrl}
                className="object-cover"
                priority
                onError={() => setImageError(true)}
              />
            </div>

            <div className="flex flex-col justify-center space-y-2 text-neutral-700">
              <p className="headline-large-emphasized">
                {result?.participantName || t("resultPanel.unknownParticipant")}
              </p>
              <p className="title-large-primary">{result?.refId || "-"}</p>
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
          </div>
        )}

        <div className="mt-8 space-y-2">
          <p className="title-small-emphasized text-neutral-600">
            {t("resultPanel.notes")}
          </p>
          <TextField
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t("resultPanel.notesPlaceholder")}
            inputClassName="body-large-primary text-neutral-400"
          />
          <Button
            mode="filled"
            bordered="round"
            expanded
            className="title-large-primary mt-2"
            onClick={onBackToScan}
          >
            {t("resultPanel.save")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ScanResultPanel;
