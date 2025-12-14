"use client";

import { usePathname, redirect } from "next/navigation";
import Link from "next/link";
import { cn } from "@assets/lib/utils";
import React from "react";

type UserRole = "attendee" | "staff" | "manager" | "owner";
const useAuth = () => ({
  role: "owner" as UserRole, // change this to test different roles
});

const canViewInsights = (role: UserRole) => {
  return role === "manager" || role === "owner";
};

const tabs = [
  { id: "overview", label: "ภาพรวม", href: "/dashboard" },
  { id: "insights", label: "ข้อมูลเชิงลึก", href: "/dashboard/insights" },
];

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role } = useAuth();

  if (pathname === "/dashboard/insights" && !canViewInsights(role)) {
    redirect("/dashboard");
  }
  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 md:p-8 bg-neutral-white">
      <div className="container max-w-[1440px] space-y-6 flex flex-col items-center bg-neutral-white w-full">
        <nav className="flex justify-center w-auto">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const isTabDisabled =
              tab.id === "insights" && !canViewInsights(role);

            return (
              <Link
                key={tab.id}
                href={isTabDisabled ? "#" : tab.href} 
                aria-disabled={isTabDisabled}
                className={cn(
                  "px-4 md:px-16 py-2 transition-colors duration-200 border-b-2",
                  isActive
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-600 hover:text-primary",
                  isTabDisabled &&
                    "border-transparent text-neutral-400 opacity-50"
                )}
              >
                <span className="headline-large-emphasized">{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
