"use client";
import Button from "@components/Button";
import IonIcon from "@components/IonIcon";
import StatCard from "@components/StatCard";

interface FullscreenContentProps {
  onExit: () => void;
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
  onExit,
  data,
  translations,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-neutral-white relative overflow-auto">
      <Button
        mode="outline"
        bordered="round"
        expanded={false}
        onClick={onExit}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 border-primary p-1"
      >
        <IonIcon name="Close" size="16px" className="text-primary" />
      </Button>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 md:p-16 lg:p-20">
        <div className="w-full max-w-6xl">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex flex-col space-y-6 sm:space-y-8">
              <div>
                <p className="headline-large-emphasized sm:display-small-emphasized">
                  {data.title}
                </p>
              </div>

              {/* event information */}
              <div className="flex flex-col space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3 body-medium-primary sm:body-large-primary">
                  <span className="flex flex-row space-x-3 items-center">
                    <IonIcon
                      name="Calendar"
                      size="24px"
                      className="text-primary flex-shrink-0"
                    />
                    <p>{data.date}</p>
                  </span>
                  <span className="flex flex-row space-x-3 items-center">
                    <IonIcon
                      name="Time"
                      size="24px"
                      className="text-secondary flex-shrink-0"
                    />
                    <p>{data.time}</p>
                  </span>
                  <span className="flex flex-row space-x-3 items-center">
                    <IonIcon
                      name="Location"
                      size="24px"
                      className="text-primary flex-shrink-0"
                    />
                    <p>{data.location}</p>
                  </span>
                </div>

                <div className="flex flex-col space-y-2 pt-2">
                  <p className="headline-small-emphasized sm:headline-medium-emphasized">
                    {translations.eventDetails}
                  </p>
                  <p className="body-medium-primary sm:body-large-primary">
                    {data.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Stat card - right side */}
            <div className="w-full">
              <div className="aspect-[4/3] sm:aspect-[3/2] lg:aspect-square max-h-[50vh] lg:max-h-none">
                <StatCard
                  title={translations.totalAttendees}
                  value={data.totalAttendees}
                  unit={translations.unit}
                  variant="filled"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FullscreenContent;
