
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
          className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-700 cursor-pointer"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-white/20 rounded-full p-4 mb-5">
              <Navigation className="w-16 h-16 text-white" stroke="white" strokeWidth={1.5} />
            </div>
            <p className="text-white font-bold text-2xl mb-2">Voir sur Google Maps</p>
            {activeCategory && (
              <span className="mt-3 bg-white/90 text-blue-800 px-5 py-2 rounded-full text-lg font-medium">
                {activeCategory === "police" ? "Commissariats" : 
                 activeCategory === "medical" ? "Hôpitaux" : 
                 activeCategory === "fire" ? "Sapeurs Pompiers" : ""}
              </span>
            )}
          </div>
          
          {/* Background pattern overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              backgroundSize: "24px 24px"
            }} />
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
