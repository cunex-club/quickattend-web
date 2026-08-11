import { useTranslations } from "next-intl";
import { EventFormInterface } from "../template";
import { Input } from "@assets/components/ui/input";
import { isSafeExternalUrl } from "@utils/url";

interface CreateEventStep3Props {
  eventForm: EventFormInterface;
  setEventForm: (formdata: EventFormInterface) => void;
}

const CreateEventStep3 = ({
  eventForm,
  setEventForm,
}: CreateEventStep3Props) => {
  const tCreateEvent = useTranslations("CreateEvent");
  const trimmed = eventForm.evaluation_form.trim();
  const isInvalid = !!trimmed && !isSafeExternalUrl(trimmed);

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
          className={`body-large-primary focus-visible:ring-0 ${
            isInvalid
              ? "border-destructive focus:border-destructive"
              : "focus:border-primary"
          }`}
          onChange={(e) => {
            setEventForm({
              ...eventForm,
              evaluation_form: e.target.value,
            });
          }}
        />
        {isInvalid && (
          <p className="body-small-primary text-destructive">
            {tCreateEvent("evaluationFormLinkInvalid")}
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateEventStep3;
