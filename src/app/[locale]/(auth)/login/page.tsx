import { Suspense } from "react";
import LoginTemplate from "@modules/login/template";

const LoginPage = () => {
  return (
    <Suspense>
      <LoginTemplate />
    </Suspense>
  );
};

export default LoginPage;
