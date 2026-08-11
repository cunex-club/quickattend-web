"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@i18n/navigation";
import LoginDesktopPage from "@modules/login/components/LoginDesktopPage";
import LoginMobilePage from "@modules/login/components/LoginMobilePage";
import LoginTabletPage from "@modules/login/components/LoginTabletPage";
import { hasActiveSession } from "@services/auth.actions";

const ERROR_MESSAGE_KEYS = {
  expired: "errorExpired",
  config: "errorConfig",
  unreachable: "errorUnreachable",
} as const;

const LoginTemplate = () => {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
  const t = useTranslations("Login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const errorMessageKey =
    errorParam && errorParam in ERROR_MESSAGE_KEYS
      ? ERROR_MESSAGE_KEYS[errorParam as keyof typeof ERROR_MESSAGE_KEYS]
      : null;

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      hasActiveSession().then((active) => {
        if (active) router.replace("/events");
      });
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [router]);

  if (!authUrl) {
    throw new Error("NEXT_PUBLIC_AUTH_URL is not defined");
  }

  return (
    <>
      {errorMessageKey && (
        <div
          role="alert"
          className="fixed inset-x-0 top-0 z-50 bg-red-50 px-4 py-3 text-center text-sm text-red-700 shadow-sm"
        >
          {t(errorMessageKey)}
        </div>
      )}
      <div className="md:hidden">
        <LoginMobilePage authUrl={authUrl} />
      </div>
      <div className="hidden md:flex lg:hidden">
        <LoginTabletPage authUrl={authUrl} />
      </div>
      <LoginDesktopPage authUrl={authUrl} />
    </>
  );
};

export default LoginTemplate;
