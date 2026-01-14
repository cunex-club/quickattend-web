import { GoogleMap, Marker } from "@react-google-maps/api";
import { GoogleMapContainerStyle } from "./map-selection";
import GoogleMapsProvider from "../../../../providers/GoogleMapProvider";

interface MapPreviewProps {
  lat: number;
  lng: number;
  isPreview?: boolean;
}

export const MapPreviewComponent = ({
  lat,
  lng,
  isPreview = false,
}: MapPreviewProps) => {
  return (
    <GoogleMap
      mapContainerStyle={GoogleMapContainerStyle}
      center={{ lat, lng }}
      zoom={15}
      options={
        isPreview
          ? {
              disableDefaultUI: true,
              draggable: false,
              scrollwheel: false,
              zoomControl: false,
              keyboardShortcuts: false,
              clickableIcons: false,
              gestureHandling: "none",
            }
          : undefined
      }
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
};

const GoogleMapPreview = ({ lat, lng, isPreview = false }: MapPreviewProps) => {
  return (
    <GoogleMapsProvider>
      <MapPreviewComponent lat={lat} lng={lng} isPreview={isPreview} />
    </GoogleMapsProvider>
  );
};

export default GoogleMapPreview;
