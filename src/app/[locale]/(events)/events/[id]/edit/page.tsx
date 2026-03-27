import EventEditTemplate from "@modules/events/event-id/edit/template";
import GoogleMapsProvider from "../../../../../../providers/GoogleMapProvider";

const EventEditPage = () => {
  return (
    <GoogleMapsProvider>
      <EventEditTemplate />
    </GoogleMapsProvider>
  );
};
export default EventEditPage;
