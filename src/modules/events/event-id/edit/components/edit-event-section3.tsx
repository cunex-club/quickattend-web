import { Input } from "@assets/components/ui/input";
import { EventFormInterface } from "@modules/events/create/template";
import { useTranslations } from "next-intl";
import { isSafeExternalUrl } from "@utils/url";

interface EditEventSection1Props {
  eventForm: EventFormInterface;
  setEventForm: (formdata: EventFormInterface) => void;
}

const EditEventSection3 = ({
  eventForm,
  setEventForm,
}: EditEventSection1Props) => {
  const tEditEvent = useTranslations("EditEvent");
  const trimmed = eventForm.evaluation_form.trim();
  const isInvalid = !!trimmed && !isSafeExternalUrl(trimmed);

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
            {tEditEvent("evaluationFormLinkInvalid")}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditEventSection3;
