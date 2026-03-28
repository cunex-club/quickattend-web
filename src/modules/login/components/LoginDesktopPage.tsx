"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@i18n/navigation";
import LoginLogo from "@assets/images/logo/login-logo.png";
import CunexLogo from "@assets/images/logo/cu-nex-mini.png";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";

type LoginDesktopPageProps = {
  authUrl: string;
};

const LoginDesktopPage = ({ authUrl }: LoginDesktopPageProps) => {
  const locale = useLocale();

  return (
    <div className="hidden min-h-screen w-full overflow-hidden bg-neutral-200 lg:flex">
      <div className="flex flex-[1.2] items-end justify-center px-10 py-10">
        <Image
          src={LoginLogo}
          alt="QuickAttend illustration"
          className="h-[78vh] w-full max-w-[720px] object-contain object-bottom"
          priority
        />
      </div>

      <div className="flex flex-[0.8] items-center justify-start px-8 py-10">
        <div className="w-full max-w-[460px] rounded-[2rem] bg-white px-8 py-8 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
          <div className="space-y-2">
            <Image src={CunexLogo} alt="CU NEX logo" className="h-8 w-auto" />
            <div className="display-large-primary">QuickAttend</div>
          </div>

          <div className="mt-8 space-y-3 text-neutral-700">
            <div className="flex items-start gap-3">
              <IonIcon
                name="PeopleOutline"
                className="mt-0.5 text-primary"
                size="18px"
                noPadding
              />
              <div className="body-medium-primary">
                สร้างกิจกรรมสำหรับแอพ CU NEX
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IonIcon
                name="BarcodeOutline"
                className="mt-0.5 text-primary"
                size="18px"
                noPadding
              />
              <div className="body-medium-primary">
                สแกนเข้าร่วมกิจกรรมด้วย Digital ID
              </div>
            </div>
            <div className="flex items-start gap-3">
              <IonIcon
                name="LinkOutline"
                className="mt-0.5 text-primary"
                size="18px"
                noPadding
              />
              <div className="body-medium-primary">
                แชร์ลิงก์ให้คนอื่นมาช่วยได้ง่ายๆ
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Button
              mode="filled"
              bordered="round"
              expanded={true}
              className="min-h-12 gap-2 px-5"
              onClick={() => {
                window.location.href = authUrl;
              }}
            >
              <IonIcon
                name="LogInOutline"
                size="18px"
                className="text-neutral-white"
                noPadding
              />
              <div className="title-medium-primary whitespace-nowrap text-neutral-white">
                ดำเนินการต่อด้วย CU NEX
              </div>
            </Button>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <Link
              href="/login"
              locale="th"
              className={
                locale === "th"
                  ? "font-medium text-neutral-black"
                  : "text-primary transition hover:text-neutral-black"
              }
            >
              ภาษาไทย
            </Link>
            <span className="text-neutral-300">|</span>
            <Link
              href="/login"
              locale="en"
              className={
                locale === "en"
                  ? "font-medium text-neutral-black"
                  : "text-primary transition hover:text-neutral-black"
              }
            >
              English
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginDesktopPage;
