import EventCreateTemplate from "@modules/events/create/template";
import GoogleMapsProvider from "../../../../../providers/GoogleMapProvider";

const EventCreatePage = () => {
  return (
    <GoogleMapsProvider>
      <EventCreateTemplate />
    </GoogleMapsProvider>
  );
};
export default EventCreatePage;
