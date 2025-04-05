
import { Badge } from "@/components/ui/badge";

interface MapCategoryBadgesProps {
  selectedCategory: string | null;
  map: React.MutableRefObject<mapboxgl.Map | null>;
}

export const MapCategoryBadges = ({ selectedCategory, map }: MapCategoryBadgesProps) => {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
      <Badge 
        className={`cursor-pointer ${selectedCategory === "police" ? "bg-blue-500" : "bg-gray-100 text-gray-700"}`}
        onClick={() => map.current?.flyTo({ center: [-17.4676, 14.6937], zoom: 14 })}
      >
        Police
      </Badge>
      <Badge 
        className={`cursor-pointer ${selectedCategory === "medical" ? "bg-red-500" : "bg-gray-100 text-gray-700"}`}
        onClick={() => map.current?.flyTo({ center: [-17.4376, 14.6737], zoom: 14 })}
      >
        Médical
      </Badge>
      <Badge 
        className={`cursor-pointer ${selectedCategory === "fire" ? "bg-orange-500" : "bg-gray-100 text-gray-700"}`}
        onClick={() => map.current?.flyTo({ center: [-17.4376, 14.6837], zoom: 14 })}
      >
        Pompiers
      </Badge>
    </div>
  );
};
