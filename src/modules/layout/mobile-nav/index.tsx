"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@i18n/navigation";
import IonIcon from "@shared/IonIcon";
import SidebarNavigation from "@modules/layout/sidebar/components/sidebar-navigation";

const NAV_ITEM_CLASS =
  "flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1";
const NAV_LABEL_CLASS = "label-small-primary w-full truncate text-center";

const MobileNav = () => {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();

  const isActivePath = (href: string) => pathname === href;

  return (
    <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center border-t border-neutral-200 bg-neutral-white px-2 py-2 lg:hidden">
      <SidebarNavigation href="/events" className={NAV_ITEM_CLASS}>
        <IonIcon
          name={isActivePath("/events") ? "Home" : "HomeOutline"}
          size="24px"
          className={
            isActivePath("/events") ? "text-primary" : "text-primary/70"
          }
        />
        <p className={NAV_LABEL_CLASS}>{t("activities")}</p>
      </SidebarNavigation>

      <SidebarNavigation href="/scan" className={NAV_ITEM_CLASS}>
        <IonIcon
          name={isActivePath("/scan") ? "Scan" : "ScanOutline"}
          size="24px"
          className={isActivePath("/scan") ? "text-primary" : "text-primary/70"}
        />
        <p className={NAV_LABEL_CLASS}>{t("scan")}</p>
      </SidebarNavigation>

      <SidebarNavigation href="/events/create" className={NAV_ITEM_CLASS}>
        <IonIcon
          name={isActivePath("/events/create") ? "Add" : "AddOutline"}
          size="24px"
          className={
            isActivePath("/events/create") ? "text-primary" : "text-primary/70"
          }
        />
        <p className={NAV_LABEL_CLASS}>{t("addevent")}</p>
      </SidebarNavigation>

      <SidebarNavigation href="/search" className={NAV_ITEM_CLASS}>
        <IonIcon
          name={isActivePath("/search") ? "Search" : "SearchOutline"}
          size="24px"
          className={
            isActivePath("/search") ? "text-primary" : "text-primary/70"
          }
        />
        <p className={NAV_LABEL_CLASS}>{t("search")}</p>
      </SidebarNavigation>
    </nav>
  );
};

export default MobileNav;
