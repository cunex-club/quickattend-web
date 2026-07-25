"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardNav from "@components/dashboard/DashboardNav";
import { RoleProvider, type UserRole } from "@context/RoleContext";
import { useTranslations } from "next-intl";
import { DashboardApolloProvider } from "@graphql/provider";
import { useRouter } from "@i18n/navigation";
import { fetchEventById } from "@services/events.actions";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Dashboard.navbar");
  const router = useRouter();
  const { locale, id } = useParams<{ locale: string; id: string }>();

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [eventRole, setEventRole] = useState<UserRole>("attendee");

  useEffect(() => {
    let cancelled = false;

    const checkEventStarted = async () => {
      setCheckingAccess(true);
      const result = await fetchEventById(id);
      if (!result.ok) {
        console.error(
          `Failed to verify event before showing dashboard [${result.error.code}]: ${result.error.message}`,
        );
        if (!cancelled) {
          setCheckingAccess(false);
        }
        return;
      }

      const eventData = result.data.data;
      const role = eventData.role?.toLowerCase();
      setEventRole(
        role === "owner" || role === "manager" || role === "staff"
          ? role
          : "attendee",
      );
      const hasStarted = new Date(eventData.start_time) <= new Date();
      if (!cancelled && !hasStarted) {
        router.replace(`/events/${id}`);
        return;
      }
      if (!cancelled) {
        setCheckingAccess(false);
      }
    };

    checkEventStarted();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  const tabs = [
    { id: "overview", label: t("overview"), href: `/dashboard/${id}` },
    {
      id: "compare",
      label: t("compare"),
      href: `/dashboard/${id}/compare`,
    },
  ];

  if (checkingAccess) {
    return null;
  }

  return (
    <RoleProvider initialRole={eventRole}>
      <DashboardApolloProvider>
        <div className="flex flex-col items-center w-full min-h-screen pt-10 pb-6 px-6 lg:px-16 bg-neutral-white">
          <div className="container space-y-6 h-full flex flex-col">
            <DashboardNav locale={locale} role={eventRole} tabs={tabs} />
            <main className="w-full flex-1">{children}</main>
          </div>
        </div>
      </DashboardApolloProvider>
    </RoleProvider>
  );
}
