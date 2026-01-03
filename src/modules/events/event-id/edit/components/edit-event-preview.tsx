import { useLocale, useTranslations } from "next-intl";
import IonIcon from "@shared/IonIcon";
import { format } from "date-fns";
import {
  CardPreviewType,
  EventFormInterface,
} from "@modules/events/create/template";

interface EditEventPreviewProps {
  eventForm: EventFormInterface;
  cardMode: CardPreviewType;
}

const EditEventPreview = ({ eventForm, cardMode }: EditEventPreviewProps) => {
  const tEditEvent = useTranslations("EditEvent");
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
      <h1 className="headline-small-emphasized mb-2 ml-2">
        {eventForm.name || tEditEvent("namePlaceholder")}
      </h1>

      {/* Information */}
      <div className="flex flex-col gap-1 mb-4">
        {/* Date */}
        <div className="flex gap-2">
          <IonIcon name="Calendar" size="16px" className="text-primary" />
          <p className="body-medium-primary text-neutral-600 translate-y-1">
            {eventForm.date
              ? formatDate(eventForm.date.toISOString())
              : tEditEvent("datePlaceholder")}
          </p>
        </div>

        {/* Time */}
        <div className="flex gap-2">
          <IonIcon name="Time" size="16px" className="text-primary" />
          <p className="body-medium-primary text-neutral-600 translate-y-1">
            {eventForm.startTime
              ? formatTime(eventForm.startTime)
              : tEditEvent("timePlaceholder")}{" "}
            -{" "}
            {eventForm.endTime
              ? formatTime(eventForm.endTime)
              : tEditEvent("timePlaceholder")}
          </p>
        </div>

        {/* Location */}
        <div className="flex gap-2">
          <IonIcon name="Location" size="16px" className="text-primary" />
          <p className="body-medium-primary text-neutral-600 translate-y-1">
            {eventForm.location || tEditEvent("locationPlaceholder")}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 mb-4 ml-2">
        <h2 className="title-medium-emphasized text-neutral-600">
          {tEditEvent("description")}
        </h2>
        <p className="body-small-primary text-neutral-600">
          {eventForm.description || tEditEvent("descriptionPlaceholder")}
        </p>
      </div>

      {cardMode === CardPreviewType.DETAIL_PREVIEW && (
        <div className="flex flex-col ml-2">
          {/* Agenda */}
          <div className="flex flex-col mb-4">
            <h2 className="title-medium-emphasized text-neutral-600 mb-2">
              {tEditEvent("agenda")}
            </h2>

            {eventForm.agenda.length ? (
              eventForm.agenda.map((item) => {
                return (
                  <div
                    key={`Agenda-${item.id}`}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex justify-between gap-2 body-small-primary">
                      <p className="max-w-[80%] break-all">
                        {item.activity_name}
                      </p>
                      <p>
                        {formatTime(item.startTime)}-{formatTime(item.endTime)}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="body-small-primary">{tEditEvent("agenda")}</p>
            )}
          </div>

          {/* Organizer */}
          <div className="flex flex-col gap-2 mb-4">
            <h2 className="title-medium-emphasized text-neutral-600">
              {tEditEvent("organizer")}
            </h2>
            <p className="body-small-primary text-neutral-600">
              {eventForm.organizer || tEditEvent("organizer")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditEventPreview;
