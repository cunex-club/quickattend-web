import { RoleProvider } from "@context/RoleContext";
import { getUserRole } from "@lib/auth";
import React from "react";
import { DashboardSidebar } from "@components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  return (
    <RoleProvider initialRole={role}>
      <div className="flex flex-col lg:flex-row w-full min-h-screen">
        <DashboardSidebar />
        <main className="flex-1 w-full">{children}</main>
      </div>
    </RoleProvider>
  );
}
