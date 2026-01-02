import { EventFormInterface } from "@modules/events/create/template";
import { useTranslations } from "next-intl";

interface EditEventSection1Props {
  eventForm: EventFormInterface;
  setEventForm: (formdata: EventFormInterface) => void;
}

const EditEventSection3 = ({
  eventForm,
  setEventForm,
}: EditEventSection1Props) => {
  const tEditEvent = useTranslations("EditEvent");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="title-large-emphasized text-primary mb-4">
        This is Edit Event Section 3
      </h1>
    </div>
  );
};

export default EditEventSection3;
