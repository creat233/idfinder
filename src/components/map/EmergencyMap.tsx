
import { useState, useEffect } from "react";
import { Navigation } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MapCategoryBadges } from "./MapCategoryBadges";
import { EmergencyMapProps } from "./types/EmergencyMapTypes";
import { ExternalLink } from "@/components/ui/external-link";
import { useTranslation } from "@/hooks/useTranslation";

export const EmergencyMap = ({ height = "h-80", selectedCategory }: EmergencyMapProps) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(selectedCategory);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

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

  const getCategoryTranslation = () => {
    if (!activeCategory) return "";
    switch (activeCategory) {
      case "police":
        return t('map_category_police');
      case "medical":
        return t('map_category_medical');
      case "fire":
        return t('map_category_fire');
      default:
        return "";
    }
  };

  return (
    <div className={`relative h-64 sm:h-80 rounded-lg overflow-hidden border border-gray-200 shadow-md`}>
      <ExternalLink 
        href={getGoogleMapsUrl()} 
        className="absolute inset-0 block"
        showIcon={false}
        useInAppBrowser={false}
        title="Google Maps"
      >
        <div 
          className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-700 cursor-pointer"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-white/20 rounded-full p-3 sm:p-4 mb-4 sm:mb-5">
              <Navigation className="w-12 h-12 sm:w-16 sm:h-16 text-white" stroke="white" strokeWidth={1.5} />
            </div>
            <p className="text-white font-bold text-xl sm:text-2xl mb-2 text-center px-2">{t('view_on_google_maps')}</p>
            {activeCategory && (
              <span className="mt-3 bg-white/90 text-blue-800 px-4 py-1 sm:px-5 sm:py-2 rounded-full text-base sm:text-lg font-medium">
                {getCategoryTranslation()}
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
