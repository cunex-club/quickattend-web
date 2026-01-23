import { GoogleMap, Marker } from "@react-google-maps/api";
import { GoogleMapContainerStyle } from "./map-selection";
import GoogleMapsProvider from "../../../../providers/GoogleMapProvider";

interface MapPreviewProps {
  lat: number;
  lng: number;
  isPreview?: boolean;
  onChangeLocation?: (lat: number, lng: number) => void;
}

export const MapPreviewComponent = ({
  lat,
  lng,
  isPreview = false,
  onChangeLocation,
}: MapPreviewProps) => {
  return (
    <GoogleMap
      mapContainerStyle={GoogleMapContainerStyle}
      center={{ lat, lng }}
      zoom={15}
      onClick={
        !isPreview
          ? (e) => {
              if (!e.latLng || !onChangeLocation) return;
              onChangeLocation(e.latLng.lat(), e.latLng.lng());
            }
          : undefined
      }
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
      <Marker
        position={{ lat, lng }}
        draggable={!isPreview}
        onDragEnd={
          !isPreview
            ? (e) => {
                if (!e.latLng || !onChangeLocation) return;
                onChangeLocation(e.latLng.lat(), e.latLng.lng());
              }
            : undefined
        }
      />
    </GoogleMap>
  );
};

const GoogleMapPreview = ({
  lat,
  lng,
  isPreview = false,
  onChangeLocation,
}: MapPreviewProps) => {
  return (
    <GoogleMapsProvider>
      <MapPreviewComponent
        lat={lat}
        lng={lng}
        isPreview={isPreview}
        onChangeLocation={onChangeLocation}
      />
    </GoogleMapsProvider>
  );
};

export default GoogleMapPreview;
