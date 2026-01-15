import { useLocale, useTranslations } from "next-intl";
import { CardPreviewType, EventFormInterface } from "../template";
import IonIcon from "@shared/IonIcon";
import { format } from "date-fns";
import GoogleMapPreview from "./map-preview";

interface CreateEventPreviewProps {
  eventForm: EventFormInterface;
  cardMode: CardPreviewType;
}

const CreateEventPreview = ({
  eventForm,
  cardMode,
}: CreateEventPreviewProps) => {
  const tCreateEvent = useTranslations("CreateEvent");
  const locale = useLocale();

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  const formatTime = (date?: Date) => (date ? format(date, "HH:mm") : null);

  return (
    <div className="w-full h-fit flex flex-col">
      {/* Header */}
      <h1 className="headline-small-emphasized mb-2 ml-2 line-clamp-2">
        {eventForm.name || tCreateEvent("namePlaceholder")}
      </h1>

      {/* Information */}
      <div className="flex flex-col gap-1 mb-4">
        {/* Date */}
        <div className="flex gap-2">
          <IonIcon name="Calendar" size="16px" className="text-primary" />
          <p className="body-medium-primary text-neutral-600 translate-y-1">
            {eventForm.date
              ? formatDate(eventForm.date.toISOString())
              : tCreateEvent("datePlaceholder")}
          </p>
        </div>

        {/* Time */}
        <div className="flex gap-2">
          <IonIcon name="Time" size="16px" className="text-primary" />
          <p className="body-medium-primary text-neutral-600 translate-y-1">
            {eventForm.startTime
              ? formatTime(eventForm.startTime)
              : tCreateEvent("timePlaceholder")}{" "}
            -{" "}
            {eventForm.endTime
              ? formatTime(eventForm.endTime)
              : tCreateEvent("timePlaceholder")}
          </p>
        </div>

        {/* Location */}
        <div className="flex gap-2">
          <IonIcon name="Location" size="16px" className="text-primary" />
          <p className="body-medium-primary text-neutral-600 translate-y-1 line-clamp-2">
            {eventForm.location || tCreateEvent("locationPlaceholder")}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 mb-4 ml-2">
        <h2 className="title-medium-emphasized text-neutral-600">
          {tCreateEvent("descriptionPreview")}
        </h2>
        <p className="body-small-primary text-neutral-600 line-clamp-5 whitespace-pre-wrap">
          {eventForm.description || tCreateEvent("descriptionPlaceholder")}
        </p>
      </div>

      {cardMode === CardPreviewType.DETAIL_PREVIEW && (
        <div className="flex flex-col ml-2">
          {/* Agenda */}
          <div className="flex flex-col mb-4">
            <h2 className="title-medium-emphasized text-neutral-600 mb-2">
              {tCreateEvent("agenda")}
            </h2>

            {eventForm.agenda.length ? (
              eventForm.agenda.map((item) => {
                return (
                  <div
                    key={`Agenda-${item.id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex justify-between gap-2 body-small-primary">
                      <p className="max-w-[60%] break-all line-clamp-2">
                        {item.activity_name}
                      </p>
                      <p className="line-clamp-2 text-end">
                        {formatTime(item.startTime)}-{formatTime(item.endTime)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="body-small-primary">{tCreateEvent("agenda")}</p>
            )}
          </div>

          {/* Organizer */}
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="title-medium-emphasized text-neutral-600">
              {tCreateEvent("organizer")}
            </h2>
            <p className="body-small-primary text-neutral-600 line-clamp-1">
              {eventForm.organizer || tCreateEvent("organizer")}
            </p>
          </div>

          {/* Map */}
          <div className="flex flex-col gap-2 mb-4 ml-2">
            <h2 className="title-medium-emphasized text-neutral-600">
              {tCreateEvent("mapPreview")}
            </h2>
            <GoogleMapPreview
              lat={eventForm.lat}
              lng={eventForm.lng}
              isPreview={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateEventPreview;
