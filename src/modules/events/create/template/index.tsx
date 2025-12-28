"use client";

import { useEffect } from "react";
import { useSidebar } from "../../../../context/SidebarContext";
import { useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import { useRouter } from "next/navigation";

const EventCreateTemplate = () => {
  const { setShowSidebar } = useSidebar();
  const tCreateEvent = useTranslations("CreateEvent");
  const router = useRouter();

  useEffect(() => {
    setShowSidebar(false);
    return () => setShowSidebar(true);
  }, [setShowSidebar]);

  return (
    <>
      <header
        className="w-full h-16 bg-neutral-200 relative flex 
                    items-center justify-center shadow-elevation-3"
      >
        <IonIcon
          name="ChevronBack"
          size="16px"
          className="absolute left-4 top-6 text-primary font-semibold cursor-pointer"
          onClick={() => {
            router.back();
          }}
        />
        <p className="headline-small-primary font-bold">
          {tCreateEvent("createEvent")}
        </p>
      </header>
    </>
  );
};

export default EventCreateTemplate;
