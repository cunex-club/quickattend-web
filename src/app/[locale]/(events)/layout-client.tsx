"use client";

import type { ReactNode } from "react";

import { SidebarProvider, useSidebar } from "@context/SidebarContext";

type EventsLayoutClientProps = {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
};

function EventsLayoutContent({
  children,
  sidebar,
  header,
}: EventsLayoutClientProps) {
  const { showSidebar } = useSidebar();

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      {showSidebar && (
        <>
          <div className="hidden lg:block">{sidebar}</div>
          <div className="block lg:hidden">{header}</div>
        </>
      )}
      <main className="flex-1 overflow-y-auto bg-white">{children}</main>
    </div>
  );
}

export default function EventsLayoutClient({
  children,
  sidebar,
  header,
}: EventsLayoutClientProps) {
  return (
    <SidebarProvider>
      <EventsLayoutContent sidebar={sidebar} header={header}>
        {children}
      </EventsLayoutContent>
    </SidebarProvider>
  );
}
