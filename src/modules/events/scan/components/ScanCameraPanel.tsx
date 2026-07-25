"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import { ZXingScanner } from "@utils/scanner";
import IonIcon from "@shared/IonIcon";
import { toast } from "sonner";

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
  const pausedRef = useRef(paused);
  onScanRef.current = onScan;

  const [linkCopied, setLinkCopied] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(-1);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const activeDeviceId =
    deviceId ??
    (selectedDeviceIndex >= 0
      ? devices[selectedDeviceIndex]?.deviceId
      : undefined);

  const handleSwitchCamera = useCallback(() => {
    if (devices.length < 2) return;
    setSelectedDeviceIndex((prev) => (prev + 1) % devices.length);
  }, [devices.length]);

  // `paused` toggles on every scan (submitting -> cooldown -> ready again).
  // It intentionally is NOT a dependency of the effect below: that effect
  // tears down and re-acquires the camera stream, and doing that every scan
  // cycle both flickers the video and — critically — used to reset
  // lastScannedTextRef, wiping the only guard against re-submitting the same
  // QR on consecutive frames. On screens where the camera stays mounted
  // behind the result panel (2xl layout), a badge left in frame during the
  // ~1.2s cooldown would get re-decoded and re-submitted in a loop. Instead,
  // `pausedRef` gates decoding without touching the stream, and the dedupe
  // guard only resets when scanning genuinely resumes after a pause.
  useEffect(() => {
    const wasPaused = pausedRef.current;
    pausedRef.current = paused;
    if (wasPaused && !paused) {
      lastScannedTextRef.current = null;
    }
  }, [paused]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    setCameraError(null);
    lastScannedTextRef.current = null;

    const scanner = new ZXingScanner();
    scanner
      .start({
        videoElement: video,
        deviceId: activeDeviceId,
        onDecode: ({ text }) => {
          if (pausedRef.current) {
            return;
          }
          if (lastScannedTextRef.current === text) {
            return;
          }

          lastScannedTextRef.current = text;
          onScanRef.current?.(text);
        },
        onError: (error) => {
          console.error("[camera:scan]", error.name, error.message);
        },
      })
      .then(() => {
        if (deviceId || cancelled) return;
        return ZXingScanner.listVideoInputDevices().then((list) => {
          if (!cancelled) setDevices(list);
        });
      })
      .catch((error) => {
        console.error("[camera:start]", error?.name, error?.message);
        if (!cancelled) {
          setDevices([]);
          setCameraError(error?.name ?? "UnknownError");
        }
      });

    return () => {
      cancelled = true;
      scanner.stop();
    };
  }, [activeDeviceId, deviceId, retryCount]);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1500);
      toast.success(
        <p className="title-medium-primary text-neutral-white">
          {t("cameraPanel.linkCopied")}
        </p>,
        {
          style: {
            background: "var(--success)",
            color: "var(--neutral-white)",
          },
          duration: 1500,
        },
      );
    } catch {
      toast.error(
        <p className="title-medium-primary text-neutral-white">
          {t("cameraPanel.linkCopyFailed")}
        </p>,
        {
          style: {
            background: "var(--error)",
            color: "var(--neutral-white)",
          },
          duration: 1500,
        },
      );
    }
  }, [t]);

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

      {cameraError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white p-6 text-center">
          <p className="title-medium-primary text-neutral-black">
            {cameraError === "NotAllowedError"
              ? t("cameraPanel.permissionDeniedError")
              : cameraError === "NotReadableError"
                ? t("cameraPanel.cameraInUseError")
                : cameraError === "NotFoundError"
                  ? t("cameraPanel.cameraNotFoundError")
                  : cameraError === "OverconstrainedError"
                    ? t("cameraPanel.cameraConstraintError")
                    : t("cameraPanel.genericError")}
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-full bg-primary px-4 py-2 text-neutral-white"
          >
            {t("cameraPanel.retry")}
          </button>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="absolute bottom-5 right-5 flex items-center justify-end gap-2">
        {!deviceId && devices.length > 1 && (
          <button
            type="button"
            onClick={handleSwitchCamera}
            className="flex h-10 items-center justify-center rounded-full bg-white/90 px-3 shadow-md"
            aria-label={t("cameraPanel.switchCamera")}
          >
            <IonIcon
              name="CameraReverseOutline"
              size="20px"
              className="text-primary"
              noPadding
            />
          </button>
        )}

        {/* Copy link */}
        <button
          type="button"
          onClick={copyLink}
          className="flex h-10 items-center justify-center rounded-full bg-white/90 px-3 shadow-md"
          aria-label={t("cameraPanel.copyLink")}
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
