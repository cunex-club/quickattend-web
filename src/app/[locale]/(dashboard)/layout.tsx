import { RoleProvider } from "@context/RoleContext";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <div className="w-full min-h-screen">{children}</div>
    </RoleProvider>
  );
}
