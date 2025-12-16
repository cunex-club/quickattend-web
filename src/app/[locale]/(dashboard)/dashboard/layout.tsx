"use client";

import React from "react";
import DashboardNav from "@components/dashboard/DashboardNav";
import { useRole } from "@context/RoleContext";

const tabs = [
  { id: "overview", label: "ภาพรวม", href: "/dashboard" },
  { id: "insights", label: "ข้อมูลเชิงลึก", href: "/dashboard/insights" },
];

interface DashboardGroupLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function DashboardGroupLayout({
  children,
  params,
}: DashboardGroupLayoutProps) {
  const { role } = useRole();
  const [locale, setLocale] = React.useState<string>("");

  React.useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  if (!locale) return null;

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 bg-neutral-white">
      <div className="container space-y-6 flex flex-col items-center">
        <DashboardNav locale={locale} role={role} tabs={tabs} />
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
