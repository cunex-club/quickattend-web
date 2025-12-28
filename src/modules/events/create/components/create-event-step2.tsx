import { useTranslations } from "next-intl";
import { EventFormInterface } from "../template";

interface CreateEventStep2Props {
  eventForm: EventFormInterface;
  setEventForm: (formdata: EventFormInterface) => void;
}

const CreateEventStep2 = ({
  eventForm,
  setEventForm,
}: CreateEventStep2Props) => {
  const tCreateEvent = useTranslations("CreateEvent");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="title-large-emphasized mb-4 text-center">
        This is Step 2
      </h1>
    </div>
  );
};

export default CreateEventStep2;
