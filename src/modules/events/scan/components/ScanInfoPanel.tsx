"use client";

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
  /** Mobile compact mode: hides the barcode image and description text */
  compact?: boolean;
};

const ScanInfoPanel: StyleableFC<ScanInfoPanelProps> = ({
  events,
  selectedEvent,
  onEventChange,
  compact = false,
  className,
}) => {
  const t = useTranslations("Scan");

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label={t("infoPanel.selectEvent")}
              >
                <span className="display-medium-emphasized md:display-large-emphasized">
                  {selectedEvent.name}
                </span>
                <IonIcon
                  name="ChevronDownOutline"
                  size="24px"
                  className="text-primary"
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="min-w-65">
              {events.map((event) => (
                <DropdownMenuItem
                  key={event.id}
                  onClick={() => onEventChange(event.id)}
                >
                  <span className="title-medium-primary text-neutral-600">
                    {event.name}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <p className="title-large-primary mt-1 text-neutral-600">
            {selectedEvent.startTime} –{selectedEvent.endTime}{" "}
            {t("infoPanel.timeSuffix")}
          </p>
        </div>

        {!compact && (
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
        )}

        {/* Admin row — only shown in full (desktop) mode */}
        {!compact && (
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 text-neutral-600">
              <IonIcon
                name="PersonOutline"
                size="16px"
                className="text-primary"
              />
              <span className="title-medium-emphasized">
                {t("infoPanel.adminLabel")}
              </span>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 shadow-elevation-1"
              aria-label={t("cameraPanel.copyEventLink")}
            >
              <IonIcon
                name="LinkOutline"
                size="16px"
                className="text-primary"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ScanInfoPanel;
