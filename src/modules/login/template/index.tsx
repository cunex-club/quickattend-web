"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@i18n/navigation";
import LoginLogo from "@assets/images/logo/login-logo.png";
import CunexLogo from "@assets/images/logo/cu-nex-mini.png";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";

const LoginTemplate = () => {
  const locale = useLocale();

  return (
    <div className="flex min-h-screen w-full gap-6 bg-neutral-200 overflow-hidden">
      <div className="flex flex-[2] items-end justify-center">
        <Image src={LoginLogo} alt="Login Logo" className="h-180 w-auto" />
      </div>
      <div className="flex flex-[1] items-center justify-start">
        <div className="w-full max-w-[420px] -translate-x-40 rounded-lg bg-white p-6 pr-12 shadow-md">
          <div className="space-y-1">
            <Image src={CunexLogo} alt="Cunex Logo" className="w-auto h-8" />
            <div className="display-large-primary">QuickAttendence</div>
          </div>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-2">
              <IonIcon
                name="PeopleOutline"
                className="text-primary"
                size="20px"
                noPadding
              />
              <div>สร้างกิจกรรมสำหรับแอพ CU NEX</div>
            </div>
            <div className="flex items-center gap-2">
              <IonIcon
                name="BarcodeOutline"
                className="text-primary"
                size="20px"
                noPadding
              />
              <div>สแกนเข้าร่วมกิจกรรมด้วย Digital ID</div>
            </div>
            <div className="flex items-center gap-2">
              <IonIcon
                name="LinkOutline"
                className="text-primary"
                size="20px"
                noPadding
              />
              <div>แชร์ลิงก์ให้คนอื่นมาช่วยได้ง่ายๆ</div>
            </div>
          </div>
          <div className="mt-32">
            <Button
              mode="filled"
              bordered="round"
              expanded={false}
              className="flex items-center gap-2"
            >
              <IonIcon
                name="LogInOutline"
                size="20px"
                className="text-neutral-white"
                noPadding
              />
              <div className="title-large-primary">ดำเนินการต่อด้วย CU NEX</div>
            </Button>
          </div>
          <div className="mt-13 flex items-center gap-2 text-sm">
            <IonIcon
              name="GlobeOutline"
              size="20px"
              className="text-primary"
              noPadding
            />
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

export default LoginTemplate;
