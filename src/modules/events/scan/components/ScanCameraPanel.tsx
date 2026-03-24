"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import { ZXingScanner } from "@utils/scanner";
import IonIcon from "@shared/IonIcon";
import { useRouter } from "@i18n/navigation";

type ScanCameraPanelProps = {
  deviceId?: string;
  onScan?: (text: string) => void;
  onCopyLink?: () => void;
  paused?: boolean;
};

const ScanCameraPanel: StyleableFC<ScanCameraPanelProps> = ({
  deviceId,
  onScan,
  onCopyLink,
  paused = false,
  className,
}) => {
  const t = useTranslations("Scan");
  const videoRef = useRef<HTMLVideoElement>(null);
  const onScanRef = useRef(onScan);
  const lastScannedTextRef = useRef<string | null>(null);
  onScanRef.current = onScan;

  const router = useRouter();
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    if (paused) {
      lastScannedTextRef.current = null;
    }
  }, [paused]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || paused) return;

    const scanner = new ZXingScanner();
    let cancelled = false;

    void (async () => {
      try {
        await scanner.start({
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
      } catch (error) {
        console.error("Failed to start scanner", error);
      } finally {
        if (cancelled) {
          scanner.stop();
        }
      }
    })();

    return () => {
      cancelled = true;
      scanner.stop();
    };
  }, [deviceId, paused]);

  const toggleFlash = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    const track = (video.srcObject as MediaStream | null)
      ?.getVideoTracks()
      .at(0);
    if (!track) return;
    const next = !flashOn;
    try {
      await track.applyConstraints({
        advanced: [{ torch: next } as MediaTrackConstraintSet],
      });
      setFlashOn(next);
    } catch {
      // torch not supported on this device — silently ignore
    }
  }, [flashOn]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] bg-white",
        className,
      )}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
      />

      {/* Viewfinder brackets only */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-56 w-56">
          <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-lg border-l-[3px] border-t-[3px] border-primary" />
          <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-lg border-r-[3px] border-t-[3px] border-primary" />
          <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-lg border-b-[3px] border-l-[3px] border-primary" />
          <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-lg border-b-[3px] border-r-[3px] border-primary" />
        </div>
      </div>

      {/* Bottom action bar */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
        {/* Home + Copy link */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/events")}
            className="flex h-10 items-center justify-center rounded-full bg-white/90 px-3 shadow-md"
            aria-label={t("cameraPanel.goToEvents")}
          >
            <IonIcon
              name="HomeOutline"
              size="20px"
              className="text-primary"
              noPadding
            />
          </button>
          <button
            type="button"
            onClick={onCopyLink}
            className="flex h-10 items-center justify-center rounded-full bg-white/90 px-3 shadow-md"
            aria-label={t("cameraPanel.copyEventLink")}
          >
            <IonIcon
              name="LinkOutline"
              size="20px"
              className="text-primary"
              noPadding
            />
          </button>
        </div>

        {/* Flash toggle */}
        <button
          type="button"
          onClick={toggleFlash}
          className="flex h-10 items-center justify-center rounded-full bg-white/90 px-3 shadow-md"
          aria-label={
            flashOn
              ? t("cameraPanel.turnOffFlash")
              : t("cameraPanel.turnOnFlash")
          }
        >
          <IonIcon
            name={flashOn ? "Flash" : "FlashOffOutline"}
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
