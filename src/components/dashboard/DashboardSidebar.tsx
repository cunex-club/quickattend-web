"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import IonIcon from "@shared/IonIcon";
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

const handleLogOut = () => {
  window.location.href = "/api/auth/logout";
};

const NAV_ITEM_CLASS =
  "flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 py-1";
const NAV_LABEL_CLASS = "label-small-primary w-full truncate text-center";

type DashboardSidebarProps = {
  currentUser?: CurrentUser | null;
};

export function DashboardSidebar({
  currentUser = null,
}: DashboardSidebarProps) {
  const t = useTranslations("Dashboard.sidebar");
  const tSidebar = useTranslations("Sidebar");
  const pathname = usePathname();

  const displayName = formatFullName(currentUser);
  const avatarFallback = getAvatarFallback(currentUser);

  const isActivePath = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile: Horizontal nav at top */}
      <nav className="lg:hidden w-full bg-neutral-100 px-4 py-3 flex flex-row justify-between">
        <p className="headline-small-emphasized my-auto">สถิติการลงทะเบียน</p>
        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="rounded-full overflow-hidden border-2 border-primary hover:border-secondary transition-colors cursor-pointer"
                aria-label="Open profile menu"
              >
                <Avatar className="w-10 h-10">
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
                  <Avatar className="w-10 h-10 border-2 border-neutral-300">
                    <AvatarImage src="/logo/cu-nex.png" alt={displayName} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
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
      </nav>

      {/* Mobile: Bottom footer nav */}
      <nav className="fixed bottom-0 left-0 z-40 flex w-full items-center border-t border-neutral-200 bg-neutral-white px-2 py-2 lg:hidden">
        <Link href="/events" className={NAV_ITEM_CLASS}>
          <IonIcon
            name={isActivePath("/events") ? "Home" : "HomeOutline"}
            size="24px"
            className={
              isActivePath("/events") ? "text-primary" : "text-primary/70"
            }
          />
          <p className={NAV_LABEL_CLASS}>{tSidebar("activities")}</p>
        </Link>

        <Link href="/dashboard-compare" className={NAV_ITEM_CLASS}>
          <IonIcon
            name="StatsChartOutline"
            size="24px"
            className={
              isActivePath("/dashboard-compare")
                ? "text-primary"
                : "text-primary/70"
            }
          />
          <p className={NAV_LABEL_CLASS}>{t("compare")}</p>
        </Link>
      </nav>

      {/* Desktop: Vertical sidebar on left */}
      <aside className="hidden bg-neutral-100 lg:flex lg:flex-col lg:justify-between min-h-screen pt-4 px-2 pb-10">
        <section className="flex flex-col space-y-6">
          <Link href="/events" className="mx-auto">
            <img
              src="/logo/cu-nex.png"
              alt="Logo"
              width={90}
              height={90}
              className="mx-auto"
            />
          </Link>

          <div className="px-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/events"
                className="flex flex-col items-center px-4 py-2 rounded-lg"
              >
                <IonIcon
                  name="HomeOutline"
                  className="text-primary"
                  size="32px"
                />
                <span className="title-small-primary">
                  {tSidebar("activities")}
                </span>
              </Link>
              <Link
                href="/dashboard-compare"
                className="flex flex-col items-center px-4 py-2 rounded-lg"
              >
                <IonIcon
                  name="StatsChartOutline"
                  className="text-primary"
                  size="32px"
                />
                <span className="title-small-primary">{t("compare")}</span>
              </Link>
            </nav>
          </div>
        </section>

        <section className="flex flex-col justify-center items-center">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="rounded-full overflow-hidden border-2 border-primary hover:border-secondary transition-colors cursor-pointer"
                aria-label="Open profile menu"
              >
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
                  <button onClick={handleLogOut} aria-label="Log out">
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
        </section>
      </aside>
    </>
  );
}
