"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import SidebarNavigation from "@modules/layout/sidebar/components/sidebar-navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@assets/components/ui/avatar";
import Button from "@shared/Button";
import IonIcon from "@shared/IonIcon";

const Sidebar = () => {
  const t = useTranslations("Sidebar");

  return (
    <div className="w-38.5 px-10 pt-8 pb-10 bg-neutral-100 h-screen justify-between flex flex-col">
      <div className="flex flex-col gap-y-6">
        <Image src="/logo/cu-nex.png" alt="Logo" width={90} height={90} />
        <SidebarNavigation
          href={`/events/create`}
          className="flex flex-col justify-center items-center gap-y-2"
        >
          <Button mode="Icon" bordered="round" expanded={false}>
            <IonIcon name="AddOutline" size="32px" className="text-white" />
          </Button>
          <p className="title-small-primary whitespace-nowrap">
            {t("addevent")}
          </p>
        </SidebarNavigation>
        <div className="flex flex-col space-y-2">
          <SidebarNavigation
            href={`/events`}
            className="flex flex-col justify-center items-center"
          >
            <IonIcon name="Home" size="32px" className="text-primary" />
            <p className="title-small-primary whitespace-nowrap">
              {t("activities")}
            </p>
          </SidebarNavigation>
          <SidebarNavigation
            href={`/scan`}
            className="flex flex-col justify-center items-center"
          >
            <IonIcon name="ScanOutline" size="32px" className="text-primary" />
            <p className="title-small-primary whitespace-nowrap">{t("scan")}</p>
          </SidebarNavigation>
          <SidebarNavigation
            href={`/search`}
            className="flex flex-col justify-center items-center"
          >
            <IonIcon
              name="SearchOutline"
              size="32px"
              className="text-primary"
            />
            <p className="title-small-primary whitespace-nowrap">
              {t("search")}
            </p>
          </SidebarNavigation>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <Avatar className="w-15 h-15">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default Sidebar;
