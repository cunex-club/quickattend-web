import { EventFormInterface } from "../template";

interface CreateEventPreviewProps {
  eventForm: EventFormInterface;
}

const CreateEventPreview = ({ eventForm }: CreateEventPreviewProps) => {
  console.log(eventForm);
  return <div>This is Event Preview</div>;
};

export default CreateEventPreview;
