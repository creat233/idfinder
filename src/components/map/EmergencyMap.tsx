
import { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapCategoryBadges } from "./MapCategoryBadges";
import { EmergencyMapProps } from "./types/EmergencyMapTypes";

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

  // Formater le paramètre de recherche selon la catégorie
  const getGoogleMapsSearchParam = () => {
    if (!activeCategory) return "senegal";
    
    switch (activeCategory) {
      case "police":
        return "commissariats+de+police+senegal";
      case "medical":
        return "hopitaux+senegal";
      case "fire":
        return "sapeurs+pompiers+senegal";
      default:
        return "senegal";
    }
  };

  const searchParam = getGoogleMapsSearchParam();
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/search?key=AIzaSyDmJ_ZIpYTZQ3OmBV7QkwwbUMJqGFVCmSQ&q=${searchParam}&center=14.4974,-14.4529&zoom=6`;

  return (
    <div className={`relative ${height} rounded-lg overflow-hidden border border-gray-200 shadow-md`}>
      <iframe 
        src={googleMapsUrl}
        className="absolute inset-0 w-full h-full" 
        style={{ border: 0 }} 
        allowFullScreen={false} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Maps Sénégal"
      ></iframe>
      
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
