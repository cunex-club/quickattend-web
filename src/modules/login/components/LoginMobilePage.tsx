"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@i18n/navigation";
import LoginLogo from "@assets/images/logo/login-logo.png";
import CunexLogo from "@assets/images/logo/cu-nex-mini.png";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";

type LoginMobilePageProps = {
  authUrl: string;
};

const LoginMobilePage = ({ authUrl }: LoginMobilePageProps) => {
  const locale = useLocale();

  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden bg-neutral-200">
      <div className="relative flex flex-[1.25] items-end justify-center px-4 pt-5">
        <div className="absolute inset-x-6 top-8 h-56 rounded-full bg-primary/10 blur-3xl" />
        <Image
          src={LoginLogo}
          alt="QuickAttend illustration"
          className="relative h-full w-full max-h-[52vh] max-w-[420px] object-contain object-bottom"
          priority
        />
      </div>

      <div className="relative -mt-8 flex flex-1 flex-col rounded-t-[2rem] bg-white px-6 pb-7 pt-6 shadow-[0_-18px_45px_rgba(0,0,0,0.06)]">
        <div className="space-y-2">
          <Image src={CunexLogo} alt="CU NEX logo" className="h-8 w-auto" />
          <div className="display-large-primary">QuickAttend</div>
        </div>

        <div className="mt-6 space-y-3 text-neutral-700">
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

        <div className="mt-8">
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
  );
};

export default LoginMobilePage;
