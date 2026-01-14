"use client";

import Sidebar from "@modules/layout/sidebar";
import { SidebarProvider, useSidebar } from "../../../context/SidebarContext";

function EventsLayoutContent({ children }: { children: React.ReactNode }) {
  const { showSidebar } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden">
      {showSidebar && <Sidebar />}
      <main className="flex-1 overflow-y-auto bg-white">{children}</main>
    </div>
  );
}

export default function EventsGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <EventsLayoutContent>{children}</EventsLayoutContent>
    </SidebarProvider>
  );
}
