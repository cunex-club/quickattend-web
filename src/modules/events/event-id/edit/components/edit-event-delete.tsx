import { useTranslations } from "next-intl";
import { SideTabType } from "../template";
import Button from "@shared/Button";

interface EditEventDeleteProps {
  setOpenDelete: (bool: boolean) => void;
}

const EditEventDelete = ({ setOpenDelete }: EditEventDeleteProps) => {
  const tEditEvent = useTranslations("EditEvent");
  return (
    <div className="flex flex-col gap-8">
      <p className="title-medium-primary text-center">
        {tEditEvent("eventDeleteDescription")}
      </p>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          mode="outline"
          bordered="square"
          expanded={true}
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
          onClick={() => {
            window.location.href = "/events";
            setOpenDelete(false);
          }}
          className="h-12 px-1 pr-2 flex items-center cursor-pointer"
        >
          <p className="label-large-emphasized">{tEditEvent("submitDelete")}</p>
        </Button>
      </div>
    </div>
  );
};

export default EditEventDelete;
