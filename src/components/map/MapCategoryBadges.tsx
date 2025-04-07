
import { Badge } from "@/components/ui/badge";

interface MapCategoryBadgesProps {
  activeCategory: string | null;
  selectedCategory?: string | null; // Add this as an alias for activeCategory
  onCategoryClick: (category: string) => void;
  map?: React.MutableRefObject<mapboxgl.Map | null>;
}

export const MapCategoryBadges = ({ activeCategory, selectedCategory, onCategoryClick, map }: MapCategoryBadgesProps) => {
  // Use selectedCategory if provided, otherwise fallback to activeCategory
  const currentCategory = selectedCategory !== undefined ? selectedCategory : activeCategory;
  
  const handleCategoryClick = (category: string) => {
    onCategoryClick(category);
    
    // If map is provided, fly to the location
    if (map?.current) {
      switch(category) {
        case "police":
          map.current.flyTo({ center: [-17.4676, 14.6937], zoom: 14 });
          break;
        case "medical":
          map.current.flyTo({ center: [-17.4376, 14.6737], zoom: 14 });
          break;
        case "fire":
          map.current.flyTo({ center: [-17.4376, 14.6837], zoom: 14 });
          break;
      }
    }
  };

  // For map display version
  if (map) {
    return (
      <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1.5 p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
        <Badge 
          className={`cursor-pointer hover:bg-blue-600 transition-colors ${currentCategory === "police" ? "bg-blue-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
          onClick={() => handleCategoryClick("police")}
        >
          Police
        </Badge>
        <Badge 
          className={`cursor-pointer hover:bg-red-600 transition-colors ${currentCategory === "medical" ? "bg-red-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
          onClick={() => handleCategoryClick("medical")}
        >
          Médical
        </Badge>
        <Badge 
          className={`cursor-pointer hover:bg-orange-600 transition-colors ${currentCategory === "fire" ? "bg-orange-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
          onClick={() => handleCategoryClick("fire")}
        >
          Pompiers
        </Badge>
      </div>
    );
  }

  // For filter version
  return (
    <>
      <Badge 
        className={`cursor-pointer hover:bg-blue-600 transition-colors ${currentCategory === "police" ? "bg-blue-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
        onClick={() => handleCategoryClick("police")}
      >
        Police
      </Badge>
      <Badge 
        className={`cursor-pointer hover:bg-red-600 transition-colors ${currentCategory === "medical" ? "bg-red-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
        onClick={() => handleCategoryClick("medical")}
      >
        Médical
      </Badge>
      <Badge 
        className={`cursor-pointer hover:bg-orange-600 transition-colors ${currentCategory === "fire" ? "bg-orange-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
        onClick={() => handleCategoryClick("fire")}
      >
        Pompiers
      </Badge>
      <Badge 
        className={`cursor-pointer hover:bg-purple-600 transition-colors ${currentCategory === "other" ? "bg-purple-500 shadow-md" : "bg-gray-100 text-gray-700 hover:text-white"}`}
        onClick={() => handleCategoryClick("other")}
      >
        Autres
      </Badge>
    </>
  );
};
