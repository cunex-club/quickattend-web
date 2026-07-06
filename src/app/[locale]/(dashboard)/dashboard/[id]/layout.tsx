"use client";

import { useParams } from "next/navigation";
import DashboardNav from "@components/dashboard/DashboardNav";
import { useRole } from "@context/RoleContext";
import { useTranslations } from "next-intl";
import { DashboardApolloProvider } from "@graphql/provider";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = useRole();
  const t = useTranslations("Dashboard.navbar");
  const { locale, id } = useParams<{ locale: string; id: string }>();

  const tabs = [
    { id: "overview", label: t("overview"), href: `/dashboard/${id}` },
    {
      id: "insights",
      label: t("insights"),
      href: `/dashboard/${id}/insights`,
    },
  ];

  return (
    <DashboardApolloProvider>
      <div className="flex flex-col items-center w-full min-h-screen py-6 px-5 bg-neutral-white">
        <div className="container space-y-6 h-full flex flex-col">
          <DashboardNav locale={locale} role={role} tabs={tabs} />
          <main className="w-full flex-1">{children}</main>
        </div>
      </div>
    </DashboardApolloProvider>
  );
}
