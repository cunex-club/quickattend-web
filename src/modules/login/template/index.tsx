"use client";

import LoginDesktopPage from "@modules/login/components/LoginDesktopPage";
import LoginMobilePage from "@modules/login/components/LoginMobilePage";

const LoginTemplate = () => {
  const authUrl =
    "https://culab-authen.azurewebsites.net/?partnerid=9f2b4a1c8d3e0f7b2a6c9e4d1b0f3a2c";

  return (
    <>
      <div className="lg:hidden">
        <LoginMobilePage authUrl={authUrl} />
      </div>
      <LoginDesktopPage authUrl={authUrl} />
    </>
  );
};

export default LoginTemplate;
