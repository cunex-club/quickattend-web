"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@assets/components/ui/avatar";
import IonIcon from "@shared/IonIcon";
import { usePathname, useRouter } from "@i18n/navigation";
import { useTranslations } from "next-intl";

const PAGE_TITLES: Record<string, string> = {
  "/scan": "Events.EventCard.scanParticipant",
};

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  // strip locale prefix if present — usePathname from next-intl already strips it
  const titleKey = PAGE_TITLES[pathname];
  const isSubPage = Boolean(titleKey);

  return (
    <div className="flex justify-between items-center bg-neutral-200 px-5 py-4 w-full">
      {isSubPage ? (
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1 text-neutral-600"
          aria-label="Go back"
        >
          <IonIcon
            name="ChevronBackOutline"
            size="20px"
            className="text-neutral-600"
            noPadding
          />
          <span className="headline-small-emphasized">{t(titleKey)}</span>
        </button>
      ) : (
        <div className="headline-small-emphasized text-neutral-600">
          QuickAttend
        </div>
      )}
      <Avatar className="w-10 h-10">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default Header;
