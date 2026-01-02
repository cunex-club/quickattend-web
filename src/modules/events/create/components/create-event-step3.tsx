import { useTranslations } from "next-intl";
import { EventFormInterface } from "../template";
import { Input } from "@assets/components/ui/input";

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
        {tCreateEvent("evaluationForm")}
      </h1>

      {/* Evaluation Form */}
      <div className="flex flex-col gap-2">
        <p className="title-medium-emphasized">
          {tCreateEvent("evaluationFormLink")}
        </p>
        <Input
          type="url"
          value={eventForm.evaluation_form}
          placeholder={tCreateEvent("evaluationFormLinkPlaceholder")}
          className="!body-large-primary focus:border-primary focus-visible:ring-0"
          onChange={(e) => {
            setEventForm({ ...eventForm, evaluation_form: e.target.value });
          }}
        />
      </div>
    </div>
  );
};

export default CreateEventStep3;
