"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@assets/lib/utils";
import type { UserRole } from "@context/RoleContext";

export default function DashboardNav({ locale, role, tabs }: { locale: string; role: UserRole, tabs: { id: string; label: string; href: string }[] }) {
  const pathname = usePathname();
  const canViewInsights = (role: UserRole) => {
    return role === "manager" || role === "owner";
  };
  return (
    <nav className="flex justify-center w-auto">
      {tabs.map((tab) => {
        const normalizedPathname = pathname.replace(`/${locale}`, "");
        const isActive = 
          normalizedPathname === tab.href || 
          (tab.href === "/dashboard" && normalizedPathname === "/dashboard");
        const isTabDisabled =
          tab.id === "insights" && !canViewInsights(role);

        return (
          <Link
            key={tab.id}
            href={isTabDisabled ? "#" : `/${locale}${tab.href}`} 
            aria-disabled={isTabDisabled}
            className={cn(
              "px-4 md:px-16 py-2 transition-colors duration-200 border-b-2",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-neutral-600 hover:text-primary",
              isTabDisabled 
                ? "border-transparent text-neutral-400 opacity-50 cursor-not-allowed"
                : ""
            )}
          >
            <span className="headline-small-emphasized md:headline-medium-emphasized lg:headline-large-emphasized">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}