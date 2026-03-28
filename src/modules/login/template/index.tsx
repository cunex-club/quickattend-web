"use client";

import LoginDesktopPage from "@modules/login/components/LoginDesktopPage";
import LoginMobilePage from "@modules/login/components/LoginMobilePage";
import LoginTabletPage from "@modules/login/components/LoginTabletPage";

const LoginTemplate = () => {
  const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;

  if (!authUrl) {
    throw new Error("NEXT_PUBLIC_AUTH_URL is not defined");
  }

  return (
    <>
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
