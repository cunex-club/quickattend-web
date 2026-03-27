import { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { EventFormInterface } from "../template";
import { Input } from "@assets/components/ui/input";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

export const DEFAULT_CENTER = { lat: 13.7386, lng: 100.5321 };
export const GoogleMapContainerStyle = { width: "100%", height: "180px" };

const MapPreview = dynamic(() => import("./map-preview"), {
  ssr: false,
});

interface MapSelectionProps {
  eventForm: EventFormInterface;
  setEventForm: (data: EventFormInterface) => void;
  isPreview: boolean;
}

const MapSelectionComponent = ({
  eventForm,
  setEventForm,
  isPreview = false,
}: MapSelectionProps) => {
  const tCreateEvent = useTranslations("CreateEvent");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    setEventForm({
      ...eventForm,
      location: place.formatted_address || "",
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Autocomplete
        onLoad={(auto) => (autocompleteRef.current = auto)}
        onPlaceChanged={onPlaceChanged}
        options={{
          fields: ["formatted_address", "geometry"],
          componentRestrictions: { country: "th" },
        }}
      >
        <Input
          value={eventForm.location.trim()}
          placeholder={tCreateEvent("locationPlaceholder")}
          onChange={(e) =>
            setEventForm({ ...eventForm, location: e.target.value.trim() })
          }
        />
      </Autocomplete>

      {eventForm.lat && eventForm.lng && (
        <MapPreview
          lat={eventForm.lat}
          lng={eventForm.lng}
          isPreview={isPreview}
          onChangeLocation={(lat, lng) =>
            setEventForm({
              ...eventForm,
              lat,
              lng,
            })
          }
        />
      )}
    </div>
  );
};

export default MapSelectionComponent;
