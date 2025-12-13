import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Sidebar from "@modules/layout/sidebar";
import type { Metadata } from "next";
import "@styles/globals.css";
import localFont from "next/font/local";
import { getMessages } from "next-intl/server";
import { routing } from "@i18n/routing";

const chulaBoldFont = localFont({
  src: "../../../public/font/CHULALONGKORNBold.otf",
  variable: "--font-chula-bold",
  weight: "700",
});
const chulaRegularFont = localFont({
  src: "../../../public/font/CHULALONGKORNReg.otf",
  variable: "--font-chula-regular",
  weight: "400",
});

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
      <body
        className={`${chulaRegularFont.variable} ${chulaBoldFont.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-white">{children}</main>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
