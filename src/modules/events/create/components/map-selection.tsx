import { EventFormInterface } from "../template";
import { Input } from "@assets/components/ui/input";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

export const DEFAULT_CENTER = { lat: 13.738817, lng: 100.532215 };

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

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={eventForm.location}
        placeholder={tCreateEvent("locationPlaceholder")}
        onChange={(e) =>
          setEventForm({ ...eventForm, location: e.target.value })
        }
      />

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
