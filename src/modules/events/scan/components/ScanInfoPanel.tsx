"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@assets/components/ui/dropdown-menu";
import barcodeReaderIcon from "@assets/images/logo/smartphone-payment-barcode-reader_svgrepo.com.png";
import { cn } from "@assets/lib/utils";
import { StyleableFC } from "@utils/misc";
import type { ScanEvent } from "@modules/events/scan/constants";

type ScanInfoPanelProps = {
  events: ScanEvent[];
  selectedEvent: ScanEvent;
  onEventChange: (id: string) => void;
  /** Mobile compact mode: hides the barcode image/camera and description text */
  compact?: boolean;
  /** When provided, renders in place of the static barcode illustration (e.g. a live camera feed) */
  cameraSlot?: ReactNode;
};

const ScanInfoPanel: StyleableFC<ScanInfoPanelProps> = ({
  events,
  selectedEvent,
  onEventChange,
  compact = false,
  cameraSlot,
  className,
}) => {
  const t = useTranslations("Scan");
  const tRole = useTranslations("EventDetail");
  const hasEvents = events.length > 0;

  const roleLabel =
    selectedEvent.role === "OWNER"
      ? tRole("owner")
      : selectedEvent.role === "MANAGER"
        ? tRole("manager")
        : selectedEvent.role === "STAFF"
          ? tRole("staff")
          : null;

  return (
    <section
      className={cn(
        "flex flex-col items-center justify-center rounded-[32px] p-8",
        !compact && "min-h-[720px] lg:h-full lg:min-h-0",
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-col items-center">
          {hasEvents ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex max-w-full items-start gap-1 rounded text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  aria-label={t("infoPanel.selectEvent")}
                  title={selectedEvent.name}
                >
                  <span className="display-medium-emphasized md:display-large-emphasized line-clamp-2 max-w-[280px] break-words md:max-w-[420px]">
                    {selectedEvent.name}
                  </span>
                  <IonIcon
                    name="ChevronDownOutline"
                    size="24px"
                    className="shrink-0 text-primary"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="min-w-65 max-h-[9.25rem] overflow-y-auto"
              >
                {events.map((event) => (
                  <DropdownMenuItem
                    key={event.id}
                    onClick={() => onEventChange(event.id)}
                    className={cn(
                      event.id === selectedEvent.id &&
                        "bg-primary/10 focus:bg-primary/15",
                    )}
                  >
                    <span
                      className={cn(
                        "title-medium-primary text-neutral-600",
                        event.id === selectedEvent.id &&
                          "text-primary font-semibold",
                      )}
                    >
                      {event.name}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="display-medium-emphasized md:display-large-emphasized line-clamp-2 max-w-[280px] break-words text-center text-neutral-600 md:max-w-[420px]">
              {selectedEvent.name}
            </span>
          )}

          {hasEvents && (
            <p className="title-large-primary mt-1 text-neutral-600">
              {selectedEvent.startTime} – {selectedEvent.endTime}
            </p>
          )}
        </div>

        {!compact &&
          (cameraSlot ?? (
            <>
              <Image
                src={barcodeReaderIcon}
                alt={t("infoPanel.barcodeAlt")}
                width={150}
                height={210}
                className="h-auto w-[130px] md:w-[150px]"
                priority
              />

              <p className="headline-medium-emphasized text-center">
                {t("infoPanel.description")}
              </p>
            </>
          ))}

        {/* Admin row — only shown in full (desktop) mode, and only if there's a real role to show */}
        {!compact && hasEvents && roleLabel && (
          <div className="flex items-center justify-center gap-1 text-neutral-600">
            <IonIcon
              name="PersonOutline"
              size="16px"
              className="text-primary"
            />
            <span className="title-medium-emphasized">{roleLabel}</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScanInfoPanel;
