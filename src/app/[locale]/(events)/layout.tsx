"use client";

import Sidebar from "@modules/layout/sidebar";
import { SidebarProvider, useSidebar } from "../../../context/SidebarContext";

import Header from "@modules/layout/header";

function EventsLayoutContent({ children }: { children: React.ReactNode }) {
  const { showSidebar } = useSidebar();

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {showSidebar && (
        <>
          <div className="hidden lg:block">
            <Sidebar />
          </div>
          <div className="block lg:hidden">
            <Header />
          </div>
        </>
      )}
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
