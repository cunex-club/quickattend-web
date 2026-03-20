"use client";

import React from "react";
import Link from "next/link";

import IonIcon from "@shared/IonIcon";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@assets/components/ui/popover";

const handleLogOut = () => {
  alert("Logging out...");
};

export function DashboardSidebar() {
  return (
    <>
      {/* Mobile: Horizontal nav at top */}
      <nav className="lg:hidden w-full bg-neutral-100 px-4 py-3 flex flex-row justify-between">
        <p className="headline-small-emphasized my-auto">สถิติการลงทะเบียน</p>
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="flex items-center rounded-lg whitespace-nowrap"
          >
            <IonIcon name="HomeOutline" className="text-primary" size="32px" />
          </Link>
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded-full overflow-hidden border-2 border-primary hover:border-secondary transition-colors cursor-pointer">
                <Image
                  src="/logo/cu-nex.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-72 rounded-3xl p-6"
              align="end"
              side="right"
            >
              <div className="flex flex-col space-y-6">
                <section className="flex flex-row justify-between items-center">
                  <Image
                    src="/logo/cu-nex.png"
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover border-2 border-neutral-300"
                  />
                  <button onClick={handleLogOut}>
                    <IonIcon
                      name="LogOutOutline"
                      size="24px"
                      className="text-primary"
                    />
                  </button>
                </section>
                <section className="flex flex-col space-y-3">
                  <p className="title-medium-emphasized">นายคหฤทธิ์ ครเนือง</p>
                  <p className="title-medium-primary">6521008721</p>
                  <p className="title-medium-primary">คณะวิศวกรรมศาสตร์</p>
                </section>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </nav>

      {/* Desktop: Vertical sidebar on left */}
      <aside className="hidden bg-neutral-100 lg:flex lg:flex-col lg:justify-between min-h-screen pt-4 px-2 pb-10">
        <section className="flex flex-col space-y-6">
          <Image
            src="/logo/cu-nex.png"
            alt="Logo"
            width={90}
            height={90}
            className="mx-auto"
          />

          <div className="px-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/dashboard/insights"
                className="flex flex-col items-center px-4 py-2 rounded-lg"
              >
                <IonIcon
                  name="TrendingUpOutline"
                  className="text-primary"
                  size="32px"
                />
                <span className="title-small-primary">สถิติ</span>
              </Link>
              <Link
                href="/dashboard-compare"
                className="flex flex-col items-center px-4 py-2 rounded-lg"
              >
                <IonIcon
                  name="HomeOutline"
                  className="text-primary"
                  size="32px"
                />
                <span className="title-small-primary">กิจกรรม</span>
              </Link>
            </nav>
          </div>
        </section>

        <section className="flex flex-col justify-center items-center">
          <Popover>
            <PopoverTrigger asChild>
              <button className="rounded-full overflow-hidden border-2 border-primary hover:border-secondary transition-colors cursor-pointer">
                <Image
                  src="/logo/cu-nex.png"
                  alt="Profile"
                  width={60}
                  height={60}
                  className="object-cover"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-72 rounded-3xl p-6"
              align="end"
              side="right"
            >
              <div className="flex flex-col space-y-6">
                <section className="flex flex-row justify-between items-center">
                  <Image
                    src="/logo/cu-nex.png"
                    alt="Profile"
                    width={60}
                    height={60}
                    className="rounded-full object-cover border-2 border-neutral-300"
                  />
                  <button onClick={handleLogOut}>
                    <IonIcon
                      name="LogOutOutline"
                      size="32px"
                      className="text-primary"
                    />
                  </button>
                </section>
                <section className="flex flex-col space-y-3">
                  <p className="title-medium-emphasized">นายคหฤทธิ์ ครเนือง</p>
                  <p className="title-medium-primary">6521008721</p>
                  <p className="title-medium-primary">คณะวิศวกรรมศาสตร์</p>
                </section>
              </div>
            </PopoverContent>
          </Popover>
        </section>
      </aside>
    </>
  );
}
