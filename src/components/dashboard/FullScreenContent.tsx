"use client";
import Button from "@components/Button";
import StatCard from "@components/StatCard";

interface FullscreenContentProps {
  onExit: () => void;
  data: {
    title: string;
    date: string;
    time: string;
    location: string;
    description: string;
  };
}

const FullscreenContent: React.FC<FullscreenContentProps> = ({
  onExit,
  data,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center border border-red-500 relative bg-neutral-white p-8 sm:p-12 md:p-16 lg:p-24">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <div className="flex flex-col space-y-8">
          <div className="flex justify-between">
            <p className="headline-large-emphasized">{data.title}</p>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="px-4 space-y-2 body-medium-primary">
              <span className="flex flex-row space-x-2">
                <div className="w-5 h-5 bg-primary rounded-full"></div>
                <p>{data.date}</p>
              </span>
              <span className="flex flex-row space-x-2">
                <div className="w-5 h-5 bg-primary rounded-full"></div>
                <p>{data.time}</p>
              </span>
              <span className="flex flex-row space-x-2">
                <div className="w-5 h-5 bg-primary rounded-full"></div>
                <p>{data.location}</p>
              </span>
            </div>
            <div className="flex flex-col space-y-2 px-4 ">
              <p className="headline-small-emphasized">รายละเอียดกิจกรรม</p>
              <p className="body-large-primary">{data.description}</p>
            </div>
          </div>

          {/* <div>
            <Button
              mode="filled"
              bordered="square"
              expanded={false}
              onClick={handleToggleFullscreen}
            >
              <p className="label-large-emphasized translate-y-1">
                ดูเต็มหน้าจอ
              </p>
            </Button>
          </div> */}
        </div>
        <div className="h-full w-full">
          <StatCard
            title="จำนวนผู้เข้าร่วมกิจกรรมทั้งหมด"
            value={1096}
            unit="คน"
            variant="primary"
          />
        </div>
      </section>

      <Button
        mode="outline"
        bordered="round"
        expanded={false}
        onClick={onExit}
        className="mt-2 absolute top-2 right-2 block md:hidden border-none"
      >
        <p className="label-large-emphasized translate-y-1 text-primary">X</p>
      </Button>
    </div>
  );
};

export default FullscreenContent;
