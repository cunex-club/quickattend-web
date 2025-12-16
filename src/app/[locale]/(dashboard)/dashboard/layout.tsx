import React from "react";
import DashboardNav from "@components/dashboard/DashboardNav";
import { getUserRole } from "@lib/auth";

const tabs = [
  { id: "overview", label: "ภาพรวม", href: "/dashboard" },
  { id: "insights", label: "ข้อมูลเชิงลึก", href: "/dashboard/insights" },
];

export default async function DashboardGroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const role = await getUserRole();
  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 bg-neutral-white">
      <div className="container space-y-6 flex flex-col items-center">
        <DashboardNav locale={locale} role={role} tabs={tabs} />
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
