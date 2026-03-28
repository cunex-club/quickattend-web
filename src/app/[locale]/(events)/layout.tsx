import Header from "@modules/layout/header";
import Sidebar from "@modules/layout/sidebar";
import EventsLayoutClient from "@app/[locale]/(events)/layout-client";
import { getCurrentUser } from "@services/auth";

export default async function EventsGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <EventsLayoutClient
      sidebar={<Sidebar currentUser={currentUser} />}
      header={<Header />}
    >
      {children}
    </EventsLayoutClient>
  );
}
