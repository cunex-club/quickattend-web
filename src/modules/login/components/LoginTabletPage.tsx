"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@i18n/navigation";
import LoginLogo from "@assets/images/logo/login-logo.png";
import CunexLogo from "@assets/images/logo/cu-nex-mini.png";
import IonIcon from "@shared/IonIcon";
import Button from "@shared/Button";

type LoginTabletPageProps = {
  authUrl: string;
};

const LoginTabletPage = ({ authUrl }: LoginTabletPageProps) => {
  const locale = useLocale();

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-hidden bg-neutral-200 md:flex lg:hidden">
      <div className="relative flex h-[54dvh] items-end justify-center px-6 pt-6">
        <div className="pointer-events-none absolute inset-x-10 top-8 h-64 rounded-full bg-primary/10 blur-3xl" />
        <Image
          src={LoginLogo}
          alt="QuickAttend illustration"
          className="relative h-full w-full max-w-[560px] object-contain object-bottom"
          priority
        />
      </div>

      <div className="relative z-10 mt-auto flex flex-col rounded-t-[2.25rem] bg-white px-10 pb-10 pt-8 shadow-[0_-18px_45px_rgba(0,0,0,0.06)]">
        <div>
          <Image src={CunexLogo} alt="CU NEX logo" className="h-7 w-auto" />
          <div className="display-large-primary">QuickAttend</div>
        </div>

        <div className="mt-8 space-y-2 text-neutral-black">
          <div className="flex items-center gap-2">
            <div className="py-0.5">
              <IonIcon
                name="PeopleOutline"
                className="text-primary"
                size="20px"
                noPadding
              />
            </div>
            <div className="title-large-primary">
              สร้างกิจกรรมสำหรับแอพ CU NEX
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="py-0.5">
              <IonIcon
                name="BarcodeOutline"
                className="text-primary"
                size="20px"
                noPadding
              />
            </div>
            <div className="title-large-primary">
              สแกนเข้าร่วมกิจกรรมด้วย Digital ID
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="py-0.5">
              <IonIcon
                name="LinkOutline"
                className="text-primary"
                size="20px"
                noPadding
              />
            </div>
            <div className="title-large-primary">
              แชร์ลิงก์ให้คนอื่นมาช่วยได้ง่ายๆ
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Button
            mode="filled"
            bordered="round"
            expanded={true}
            className="gap-2 pl-2 pr-3 py-2"
            onClick={() => {
              window.location.href = authUrl;
            }}
          >
            <IonIcon
              name="LogInOutline"
              size="20px"
              className="text-neutral-white"
              noPadding
            />
            <div className="title-medium-emphasized whitespace-nowrap text-neutral-white">
              ดำเนินการต่อด้วย CU NEX
            </div>
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-2">
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
                ? "label-large-emphasized text-neutral-black"
                : "label-large-primary text-primary transition hover:text-neutral-black"
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
                ? "label-large-emphasized text-neutral-black"
                : "label-large-primary text-primary transition hover:text-neutral-black"
            }
          >
            English
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginTabletPage;
