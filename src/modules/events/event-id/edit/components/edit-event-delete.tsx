import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@i18n/navigation";
import Button from "@shared/Button";
import { deleteEvent } from "@services/events.actions";

interface EditEventDeleteProps {
  eventId: string;
  setOpenDelete: (bool: boolean) => void;
}

const EditEventDelete = ({ eventId, setOpenDelete }: EditEventDeleteProps) => {
  const tEditEvent = useTranslations("EditEvent");
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    const result = await deleteEvent(eventId);

    if (!result.ok) {
      console.error(
        `Failed to delete event [${result.error.code}]: ${result.error.message}`,
      );
      setError(result.error.message || tEditEvent("deleteFailed"));
      setIsDeleting(false);
      return;
    }

    setOpenDelete(false);
    router.push("/events");
  };

  return (
    <div className="flex flex-col gap-8">
      <p className="title-medium-primary text-center">
        {tEditEvent("eventDeleteDescription")}
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-600 text-center">
          {error}
        </p>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          mode="outline"
          bordered="square"
          expanded={true}
          disabled={isDeleting}
          onClick={() => {
            setOpenDelete(false);
          }}
          className="h-12 px-1 pr-2 flex items-center cursor-pointer"
        >
          <p className="label-large-emphasized">{tEditEvent("cancelDelete")}</p>
        </Button>
        <Button
          mode="filled"
          bordered="square"
          expanded={true}
          disabled={isDeleting}
          onClick={handleDelete}
          className="h-12 px-1 pr-2 flex items-center cursor-pointer"
        >
          <p className="label-large-emphasized">
            {isDeleting ? tEditEvent("deleting") : tEditEvent("submitDelete")}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default EditEventDelete;
