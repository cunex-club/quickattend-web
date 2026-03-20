import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "@styles/globals.css";
import { getMessages } from "next-intl/server";
import { routing } from "@i18n/routing";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Quick Project",
  description: "",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <main className="w-full min-h-screen bg-neutral-white">
            {children}
          </main>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
