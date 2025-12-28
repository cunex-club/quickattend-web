import { useTranslations } from "next-intl";
import { EventFormInterface } from "../template";

interface CreateEventStep3Props {
  eventForm: EventFormInterface;
  setEventForm: (formdata: EventFormInterface) => void;
}

const CreateEventStep3 = ({
  eventForm,
  setEventForm,
}: CreateEventStep3Props) => {
  const tCreateEvent = useTranslations("CreateEvent");
  return (
    <div className="flex flex-col gap-4">
      <h1 className="title-large-emphasized mb-4 text-center">
        This is Step 3
      </h1>
    </div>
  );
};

export default CreateEventStep3;
