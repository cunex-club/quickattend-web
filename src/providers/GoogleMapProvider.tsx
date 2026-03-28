"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import type { Libraries } from "@react-google-maps/api";

const GOOGLE_MAP_LIBRARIES: Libraries = ["places"];

export default function GoogleMapsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
    libraries: GOOGLE_MAP_LIBRARIES,
  });

  if (!isLoaded) return <div className="h-[300px]" />;

  return <>{children}</>;
}
