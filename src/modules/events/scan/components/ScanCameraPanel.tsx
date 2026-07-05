"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import { ZXingScanner } from "@utils/scanner";
import IonIcon from "@shared/IonIcon";

type ScanCameraPanelProps = {
  deviceId?: string;
  onScan?: (text: string) => void;
  paused?: boolean;
};

const ScanCameraPanel: StyleableFC<ScanCameraPanelProps> = ({
  deviceId,
  onScan,
  paused = false,
  className,
}) => {
  const t = useTranslations("Scan");
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScanRef = useRef(onScan);
  const lastScannedTextRef = useRef<string | null>(null);
  onScanRef.current = onScan;

  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || paused) return;

    const scanner = new ZXingScanner();
    scanner.start({
      videoElement: video,
      deviceId,
      onDecode: ({ text }) => {
        if (lastScannedTextRef.current === text) {
          return;
        }

        lastScannedTextRef.current = text;
        onScanRef.current?.(text);
      },
    });

    return () => scanner.stop();
  }, [deviceId, paused]);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
    } catch {
      // clipboard access not available — silently ignore
    }
  }, []);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[40px] bg-white",
        className,
      )}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
      />

      {/* Bottom action bar */}
      <div className="absolute bottom-5 right-5 flex items-center justify-end">
        {/* Copy link */}
        <button
          type="button"
          onClick={copyLink}
          className="flex h-10 items-center justify-center rounded-full bg-white/90 px-3 shadow-md"
          aria-label={t("cameraPanel.copyEventLink")}
        >
          <IonIcon
            name={linkCopied ? "Checkmark" : "LinkOutline"}
            size="20px"
            className="text-primary"
            noPadding
          />
        </button>
      </div>
    </div>
  );
};

export default ScanCameraPanel;
