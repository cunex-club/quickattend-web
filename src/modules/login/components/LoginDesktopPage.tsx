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
    <div className="hidden min-h-screen w-full overflow-hidden bg-neutral-200 md:flex">
      <div className="flex flex-[1.2] items-end justify-center">
        <Image
          src={LoginLogo}
          alt="QuickAttend illustration"
          className="h-auto w-full max-w-[468px] object-contain object-bottom"
          priority
        />
      </div>

      <div className="flex flex-[0.8] items-center justify-start px-8 py-10">
        <div className="w-full max-w-[460px] rounded-[2rem] bg-white p-6 pr-12 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
          <div className="space-y-2">
            <Image src={CunexLogo} alt="CU NEX logo" className="h-8 w-auto" />
            <div className="display-large-primary">QuickAttend</div>
          </div>

          <div className="mt-8 space-y-3 text-neutral-700">
            <div className="flex items-center gap-2">
              <div className="py-0.5">
                <IonIcon
                  name="PeopleOutline"
                  className="text-primary"
                  size="20px"
                  noPadding
                />
              </div>
              <div className="body-medium-primary">
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
              <div className="body-medium-primary">
                สแกนเข้าร่วมกิจกรรมด้วย Digital ID
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="pt-0.5">
                <IonIcon
                  name="LinkOutline"
                  className="text-primary"
                  size="20px"
                  noPadding
                />
              </div>
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
              className="gap-2 pl-2 pr-3 py-2 flex items-center"
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
              <div className="title-large-emphasis whitespace-nowrap text-neutral-white">
                ดำเนินการต่อด้วย CU NEX
              </div>
            </Button>
          </div>

          <div className="mt-6 flex items-center gap-2">
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
    </div>
  );
};

export default LoginDesktopPage;
