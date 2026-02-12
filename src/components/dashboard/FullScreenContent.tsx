"use client";
import IonIcon from "@shared/IonIcon";
import { cn } from "@assets/lib/utils";
import { useTranslations } from "next-intl";

interface FullscreenContentProps {
  data: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
    totalAttendees: number;
  };
  translations: {
    eventDetails: string;
    totalAttendees: string;
    unit: string;
  };
}

const FullscreenContent: React.FC<FullscreenContentProps> = ({
  data,
  translations,
}) => {
  const t = useTranslations("Dashboard.overview");

  const gradientStyle1: React.CSSProperties = {
    background:
      "linear-gradient(180deg, var(--Color-Pink-Primary, rgba(226, 99, 133, 0.50)) 0%, rgba(242, 242, 242, 0.50) 100%)",
    filter: "blur(100px)",
  };

  const gradientStyle2: React.CSSProperties = {
    background:
      "linear-gradient(180deg, rgba(227, 100, 135, 0.25) 0%, rgba(234, 135, 162, 0.10) 100%, rgba(255, 161, 186, 0.25) 100%)",
    filter: "blur(50px)",
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      {/* Header */}
      <nav className="w-full px-16 py-8 bg-primary flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 z-20 relative">
        <p className="text-white display-small-emphasized md:display-medium-emphasized mr-4">
          {data.title}
        </p>
        <div className="flex items-center">
          <span className="text-white body-medium-primary md:body-large-primary">
            {data.date}
          </span>
          <div className="mx-4 inline-block w-0.25 self-stretch bg-neutral-white"></div>
          <span className="text-white body-medium-primary md:body-large-primary">
            {data.time}
          </span>
        </div>
      </nav>

      <main className="w-full h-full flex flex-col justify-center items-center p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[429px] md:w-[645px] h-[444px] md:h-[666px] pointer-events-none -translate-x-1/4 -translate-y-1/4 mix-blend-multiply">
          <div
            className="absolute inset-0 rounded-full"
            style={gradientStyle1}
          ></div>
          {/* <div
            className="absolute inset-0 rounded-full scale-90"
            style={gradientStyle2}
          ></div> */}
        </div>

        <div className="absolute bottom-0 right-0 w-[358px] md:w-[538px] h-[457px] md:h-[666px] pointer-events-none translate-x-1/4 translate-y-1/4 mix-blend-multiply">
          {/* <div
            className="absolute inset-0 rounded-full"
            style={gradientStyle1}
          ></div> */}
          <div
            className="absolute inset-0 rounded-full scale-90"
            style={gradientStyle2}
          ></div>
        </div>
        <div className="flex flex-col items-center lg:items-center justify-center h-full w-full relative z-10">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-center items-baseline space-x-2 md:space-x-4 lg:space-x-6 xl:space-x-8 space-y-16">
              <p
                className={cn(
                  "font-bold text-center text-primary",
                  "text-[100px] leading-[48px] tracking-[-0.25px]",
                  "md:text-[156px] md:leading-[64px] md:tracking-[-0.25px]",
                  "lg:text-[256px] lg:leading-[100%] lg:tracking-[-1.408px]",
                )}
              >
                {data.totalAttendees}
              </p>
              <p
                className={cn(
                  "font-bold text-center text-primary",
                  "text-[24px] leading-[32px]",
                  "lg:text-[64px] lg:leading-[140%] lg:tracking-[-0.704px]",
                )}
              >
                {t("unit")}
              </p>
            </div>
          </div>
          <div className="text-center max-w-3xl">
            <p className="title-large-primary md:headline-medium-primary lg:display-medium-primary text-neutral-800">
              {t("totalAttendees")}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="h-24 px-6 md:px-8 lg:px-12 xl:px-16 py-4 bg-neutral-white flex items-center z-20 relative"
        style={{
          background: "var(--Color-Neutral-White, #FFF)",
          boxShadow:
            "0 -1px 8px 0 rgba(226, 99, 133, 0.25), 2px -6px 8.9px 0 rgba(226, 99, 133, 0.05)",
        }}
      >
        <span className="flex flex-row space-x-4 items-center">
          <IonIcon name="Location" size="36px" className="text-primary" />
          <div className="w-full items-center">
            <span className="text-neutral-600 body-large-primary">
              {data?.location}
            </span>
          </div>
        </span>
        <div className="flex-grow"></div>
      </footer>
    </div>
  );
};

export default FullscreenContent;
