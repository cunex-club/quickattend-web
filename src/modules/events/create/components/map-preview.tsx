import { Map, MapMarker, MarkerContent } from "@assets/components/ui/map";
import { MapPin } from "lucide-react";

interface MapPreviewProps {
  lat: number;
  lng: number;
  isPreview?: boolean;
  onChangeLocation?: (lat: number, lng: number) => void;
}

const MapPreviewComponent = ({
  lat,
  lng,
  isPreview = false,
  onChangeLocation,
}: MapPreviewProps) => {
  return (
    <div className="h-[180px] w-full overflow-hidden rounded-md">
      <Map center={[lng, lat]} zoom={15} interactive={!isPreview}>
        <MapMarker
          longitude={lng}
          latitude={lat}
          draggable={!isPreview}
          onDragEnd={
            !isPreview
              ? (lngLat) => onChangeLocation?.(lngLat.lat, lngLat.lng)
              : undefined
          }
        >
          <MarkerContent>
            <MapPin
              className={
                isPreview
                  ? "fill-primary stroke-white"
                  : "fill-primary cursor-move stroke-white"
              }
              size={28}
            />
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
};

export default MapPreviewComponent;
