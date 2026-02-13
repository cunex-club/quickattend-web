"use client";

import { useState, useEffect } from "react";
import DashboardNav from "@components/dashboard/DashboardNav";
import { useRole } from "@context/RoleContext";
import { useTranslations } from "next-intl";
import { DashboardApolloProvider } from "@graphql/provider";
interface DashboardGroupLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default function DashboardGroupLayout({
  children,
  params,
}: DashboardGroupLayoutProps) {
  const { role } = useRole();
  const t = useTranslations("Dashboard.navbar");
  const [locale, setLocale] = useState<string>("");

  useEffect(() => {
    params.then(({ locale }) => setLocale(locale));
  }, [params]);

  if (!locale) return null;

  const tabs = [
    { id: "overview", label: t("overview"), href: "/dashboard" },
    { id: "insights", label: t("insights"), href: "/dashboard/insights" },
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
