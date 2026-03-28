import Header from "@modules/layout/header";
import Sidebar from "@modules/layout/sidebar";
import EventsLayoutClient from "@app/[locale]/(events)/layout-client";
import { getCurrentUser } from "@services/auth";
import { redirect } from "next/navigation";

export default async function EventsGroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect(`/${locale}/login`);
  }

  return (
    <EventsLayoutClient
      sidebar={<Sidebar currentUser={currentUser} />}
      header={<Header />}
    >
      {children}
    </EventsLayoutClient>
  );
}
