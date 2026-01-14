import { GoogleMap, Marker } from "@react-google-maps/api";
import { GoogleMapContainerStyle } from "./map-selection";

interface MapPreviewProps {
  lat: number;
  lng: number;
  isPreview?: boolean;
}

export default function MapPreview({
  lat,
  lng,
  isPreview = false,
}: MapPreviewProps) {
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
}
