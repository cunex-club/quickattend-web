"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@i18n/navigation";

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
import type { CurrentUser } from "@customTypes/auth";
import { formatFullName, getAvatarFallback } from "@modules/layout/utils";
import SidebarNavigation from "@modules/layout/sidebar/components/sidebar-navigation";
import Button from "@shared/Button";
import IonIcon from "@shared/IonIcon";

type SidebarClientProps = {
  currentUser: CurrentUser | null;
};

const handleLogOut = () => {
  window.location.href = "/api/auth/logout";
};

const SidebarClient = ({ currentUser }: SidebarClientProps) => {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const pathname = usePathname();

  const isActivePath = (href: string) => pathname === href;
  const displayName = formatFullName(currentUser, locale);
  const avatarFallback = getAvatarFallback(currentUser);

  return (
    <div className="w-38.5 px-10 pt-8 pb-10 bg-neutral-100 h-screen justify-between flex flex-col">
      <div className="flex flex-col gap-y-6">
        <Image src="/logo/cu-nex.png" alt="Logo" width={90} height={90} />
        <SidebarNavigation
          href={`/events/create`}
          className="flex flex-col justify-center items-center gap-y-2"
        >
          <Button mode="Icon" bordered="round" expanded={false}>
            <IonIcon
              name={isActivePath("/events/create") ? "Add" : "AddOutline"}
              size="32px"
              className={
                isActivePath("/events/create") ? "text-white" : "text-white/80"
              }
            />
          </Button>
          <p
            className={`title-small-primary whitespace-nowrap ${
              isActivePath("/events/create") ? "text-primary" : ""
            }`}
          >
            {t("addevent")}
          </p>
        </SidebarNavigation>
        <div className="flex flex-col space-y-2">
          <SidebarNavigation
            href={`/events`}
            className="flex flex-col justify-center items-center"
          >
            <IonIcon
              name={isActivePath("/events") ? "Home" : "HomeOutline"}
              size="32px"
              className={
                isActivePath("/events") ? "text-primary" : "text-primary/80"
              }
            />
            <p className="title-small-primary whitespace-nowrap">
              {t("activities")}
            </p>
          </SidebarNavigation>
          <SidebarNavigation
            href={`/scan`}
            className="flex flex-col justify-center items-center"
          >
            <IonIcon
              name={isActivePath("/scan") ? "Scan" : "ScanOutline"}
              size="32px"
              className={
                isActivePath("/scan") ? "text-primary" : "text-primary/80"
              }
            />
            <p className="title-small-primary whitespace-nowrap">{t("scan")}</p>
          </SidebarNavigation>
          <SidebarNavigation
            href={`/search`}
            className="flex flex-col justify-center items-center"
          >
            <IonIcon
              name={isActivePath("/search") ? "Search" : "SearchOutline"}
              size="32px"
              className={
                isActivePath("/search") ? "text-primary" : "text-primary/80"
              }
            />
            <p className="title-small-primary whitespace-nowrap">
              {t("search")}
            </p>
          </SidebarNavigation>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <button className="rounded-full overflow-hidden border-2 border-primary hover:border-secondary transition-colors cursor-pointer">
              <Avatar className="w-15 h-15">
                <AvatarImage src="/logo/cu-nex.png" alt={displayName} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-72 rounded-3xl p-6"
            align="end"
            side="right"
          >
            <div className="flex flex-col space-y-6">
              <section className="flex flex-row justify-between items-center">
                <Avatar className="w-15 h-15 border-2 border-neutral-300">
                  <AvatarImage src="/logo/cu-nex.png" alt={displayName} />
                  <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <button onClick={handleLogOut}>
                  <IonIcon
                    name="LogOutOutline"
                    size="32px"
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
    </div>
  );
};

export default SidebarClient;
