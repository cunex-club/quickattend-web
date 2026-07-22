"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@assets/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";
import IonIcon from "@shared/IonIcon";
import { usePathname, useRouter } from "@i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { CurrentUser } from "@customTypes/auth";
import { formatFullName, getAvatarFallback } from "@modules/layout/utils";
import { logout } from "@services/auth.actions";

const PAGE_TITLES: Record<string, string> = {
  "/scan": "Events.EventCard.scanParticipant",
};

const handleLogOut = () => {
  logout();
};

type HeaderProps = {
  currentUser?: CurrentUser | null;
};

const Header = ({ currentUser = null }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  // strip locale prefix if present — usePathname from next-intl already strips it
  const titleKey = PAGE_TITLES[pathname];
  const isSubPage = Boolean(titleKey);
  const displayName = formatFullName(currentUser, locale);
  const avatarFallback = getAvatarFallback(currentUser);
  const avatarSrc = "/logo/cu-nex.png";

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
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="rounded-full overflow-hidden border-2 border-primary hover:border-secondary transition-colors cursor-pointer"
            aria-label="Open profile menu"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback className="text-primary">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-72 rounded-3xl p-6" align="end">
          <div className="flex flex-col space-y-6">
            <section className="flex flex-row justify-between items-center">
              <Avatar className="w-15 h-15 border-2 border-neutral-300">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback className="text-primary">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
              <button onClick={handleLogOut} aria-label="Log out">
                <IonIcon
                  name="LogOutOutline"
                  size="24px"
                  className="text-primary"
                />
              </button>
            </section>
            <section className="flex flex-col space-y-3">
              <p className="title-medium-emphasized">{displayName}</p>
              <p className="title-medium-primary">
                {currentUser?.ref_id ?? "-"}
              </p>
            </section>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Header;
