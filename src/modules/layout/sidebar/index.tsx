"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import SidebarNavigation from "@modules/layout/sidebar/components/sidebar-navigation";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@assets/components/ui/avatar";
import Icon from "@shared/Icon";
import CuNexLogo from "@assets/images/logo/cu-nex.png";

const Sidebar = () => {
  const t = useTranslations("Sidebar");
  return (
    <div className="w-70 px-10 pt-15 pb-40 bg-neutral-200 h-screen justify-between flex flex-col">
      <div>
        <Image src={CuNexLogo} alt="Logo" width={160} height={160} />
        <div className="flex flex-col p-2.5 space-y-6.5">
          <SidebarNavigation path={t("event")} pathname="/events" />
          <SidebarNavigation path={t("stats")} pathname="/statistic" />
          <SidebarNavigation
            path={t("registration")}
            pathname="/registration"
          />
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Avatar className="w-15 h-15">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="p-2.5">
            <Icon name="Logout" size={32} className="text-primary" />{" "}
            {/* will change to ion icon later*/}
          </div>
        </div>
        <div className="space-y-2.5">
          <p className="title-medium-emphasized">นายคหฤทธิ์ ครเนือง</p>
          <p className="title-medium">6521008721</p>
          <p className="title-medium">คณะวิศวกรรมศาสตร์</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
