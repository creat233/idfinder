
import { Badge } from "@/components/ui/badge";

interface MapCategoryBadgesProps {
  selectedCategory: string | null;
  map: React.MutableRefObject<mapboxgl.Map | null>;
}

export const MapCategoryBadges = ({ selectedCategory, map }: MapCategoryBadgesProps) => {
  return (
    <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1.5 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
      <Badge 
        className={`cursor-pointer hover:bg-blue-600 transition-colors ${selectedCategory === "police" ? "bg-blue-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
        onClick={() => map.current?.flyTo({ center: [-17.4676, 14.6937], zoom: 14 })}
      >
        Police
      </Badge>
      <Badge 
        className={`cursor-pointer hover:bg-red-600 transition-colors ${selectedCategory === "medical" ? "bg-red-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
        onClick={() => map.current?.flyTo({ center: [-17.4376, 14.6737], zoom: 14 })}
      >
        Médical
      </Badge>
      <Badge 
        className={`cursor-pointer hover:bg-orange-600 transition-colors ${selectedCategory === "fire" ? "bg-orange-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
        onClick={() => map.current?.flyTo({ center: [-17.4376, 14.6837], zoom: 14 })}
      >
        Pompiers
      </Badge>
    </div>
  );
};
