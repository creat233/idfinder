
import { useState, useEffect } from "react";
import { Navigation } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapCategoryBadges } from "./MapCategoryBadges";
import { EmergencyMapProps } from "./types/EmergencyMapTypes";
import { ExternalLink } from "@/components/ui/external-link";

export const EmergencyMap = ({ height = "h-80", selectedCategory }: EmergencyMapProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory);
  const isMobile = useIsMobile();

  useEffect(() => {
    setActiveCategory(selectedCategory);
  }, [selectedCategory]);

  // Handle category click in the map view
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
  };

  // Get appropriate Google Maps URL based on category
  const getGoogleMapsUrl = () => {
    if (!activeCategory) return "https://www.google.com/maps/place/Senegal";
    
    switch (activeCategory) {
      case "police":
        return "https://www.google.com/maps/search/commissariats+de+police+senegal";
      case "medical":
        return "https://www.google.com/maps/search/hopitaux+senegal";
      case "fire":
        return "https://www.google.com/maps/search/sapeurs+pompiers+senegal";
      default:
        return "https://www.google.com/maps/place/Senegal";
    }
  };

  return (
    <div className={`relative ${height} rounded-lg overflow-hidden border border-gray-200 shadow-md`}>
      <ExternalLink 
        href={getGoogleMapsUrl()} 
        className="absolute inset-0 block"
        showIcon={false}
        useInAppBrowser={true}
        title="Google Maps"
      >
        <div 
          className="absolute inset-0 bg-black cursor-pointer"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Navigation className="w-16 h-16 text-white mb-4" stroke="white" strokeWidth={1.5} />
            <p className="text-white font-semibold text-2xl">Voir sur Google Maps</p>
            {activeCategory && (
              <span className="mt-4 bg-primary/80 text-white px-4 py-1.5 rounded-full text-lg">
                {activeCategory === "police" ? "Commissariats" : 
                 activeCategory === "medical" ? "Hôpitaux" : 
                 activeCategory === "fire" ? "Sapeurs Pompiers" : ""}
              </span>
            )}
          </div>
        </div>
      </ExternalLink>
      
      {!isMobile && (
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
          <MapCategoryBadges 
            activeCategory={activeCategory} 
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      )}
    </div>
  );
};
