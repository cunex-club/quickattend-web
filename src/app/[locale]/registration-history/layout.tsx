import { RoleProvider } from "@context/RoleContext";
import { getUserRole } from "@lib/auth";
import React from "react";

export default async function DashboardRegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  return (
    <RoleProvider initialRole={role}>
      <div className="w-full min-h-screen">
        {children}
      </div>
    </RoleProvider>
  );
}
