import { Input } from "@assets/components/ui/input";
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
        {tEditEvent("evaluationForm")}
      </h1>

      {/* Evaluation Form */}
      <div className="flex flex-col gap-2">
        <p className="title-medium-emphasized">
          {tEditEvent("evaluationFormLink")}
        </p>
        <Input
          type="url"
          value={eventForm.evaluation_form}
          placeholder={tEditEvent("evaluationFormLinkPlaceholder")}
          className="body-large-primary focus:border-primary focus-visible:ring-0"
          onChange={(e) => {
            setEventForm({
              ...eventForm,
              evaluation_form: e.target.value,
            });
          }}
        />
      </div>
    </div>
  );
};

export default EditEventSection3;
