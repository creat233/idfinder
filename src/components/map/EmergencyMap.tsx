import { useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapTokenInput } from "./MapTokenInput";
import { useMapSetup } from "./hooks/useMapSetup";
import { useMapMarkers } from "./hooks/useMapMarkers";
import { MapCategoryBadges } from "./MapCategoryBadges";
import { emergencyLocations } from "./data/emergencyLocationsData";
import { EmergencyMapProps } from "./types/EmergencyMapTypes";

export const EmergencyMap = ({ height = "h-80", selectedCategory }: EmergencyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const isMobile = useIsMobile();

  // Initialize map when token is provided
  useEffect(() => {
    if (!mapboxToken && !showTokenInput) {
      setShowTokenInput(true);
    }
  }, [mapboxToken, showTokenInput]);

  const { map, mapLoaded } = useMapSetup(mapboxToken, mapContainer);
  
  // Handle markers on the map
  useMapMarkers(mapLoaded, map, emergencyLocations, selectedCategory);
  
  // Show token input if no token is provided
  if (showTokenInput && !mapboxToken) {
    return <MapTokenInput setMapboxToken={(token) => {
      setMapboxToken(token);
      setShowTokenInput(false);
    }} height={height} />;
  }

  return (
    <div className={`relative ${height} rounded-lg overflow-hidden border border-gray-200`}>
      <div ref={mapContainer} className="absolute inset-0" />
      {!isMobile && mapLoaded && <MapCategoryBadges selectedCategory={selectedCategory} map={map} />}
    </div>
  );
};
