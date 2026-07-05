"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@assets/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@assets/components/ui/dialog";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";
import TextField from "@shared/TextField";
import scanResultMockupImage from "@assets/images/logo/scan-result-mockup-image.png";

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
  const t = useTranslations("Scan");
  const [note, setNote] = useState("");

  const resultTheme = SCAN_RESULT_THEME[result?.status ?? "success"];
  const isFailed = result?.status === "failed";
  const message = result?.message || t("resultModal.permissionError");

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
        <DialogTitle className="sr-only">{t("resultModal.title")}</DialogTitle>

        <div
          className={cn(
            resultTheme.headerClass,
            "px-5 py-4 text-neutral-white",
          )}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full">
              <IonIcon
                name={resultTheme.iconName}
                size="32.5px"
                className={resultTheme.iconClass}
                noPadding
              />
            </span>
            <span className="headline-large-emphasized">
              {t(resultTheme.titleKey)}
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
            <div className="space-y-8">
              <div className="mx-auto h-[120px] w-[120px] overflow-hidden rounded-2xl bg-neutral-200 md:h-[128px] md:w-[128px]">
                <Image
                  src={scanResultMockupImage}
                  alt="Scan result participant"
                  className="h-full w-full object-cover"
                  priority
                />
              </div>

              <div className="space-y-2">
                <p className="title-medium-emphasized text-neutral-600">
                  {t("resultModal.resultDetails")}
                </p>
                <div className="space-y-3 text-neutral-700">
                  <div className="flex items-center gap-2">
                    <IonIcon
                      name="Person"
                      size="16px"
                      className="shrink-0 text-primary"
                      noPadding
                    />
                    <div>
                      <p className="body-medium-primary">
                        {result?.participantName ||
                          t("resultPanel.unknownParticipant")}
                      </p>
                      <p className="body-medium-primary">
                        {t("resultModal.refId")} {result?.refId || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <IonIcon
                      name="Business"
                      size="16px"
                      className="shrink-0 text-primary"
                      noPadding
                    />
                    <div className="space-y-0.5">
                      <p className="body-medium-primary">
                        {t("resultModal.organization")}
                      </p>
                      <p className="body-medium-primary">
                        {result?.organization || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <IonIcon
                      name="Time"
                      size="16px"
                      className="shrink-0 text-primary"
                      noPadding
                    />
                    <p className="body-medium-primary">
                      {t("resultModal.registeredAt")}{" "}
                      {result?.checkInTime || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="title-small-emphasized text-neutral-700">
              {t("resultModal.notes")}
            </p>
            <TextField
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={t("resultModal.notesPlaceholder")}
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
            {t("resultModal.done")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScanResultModal;
