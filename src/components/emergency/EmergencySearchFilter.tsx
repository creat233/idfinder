
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, X } from "lucide-react";
import { MapCategoryBadges } from "@/components/map/MapCategoryBadges";

export interface EmergencySearchFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
}

export const EmergencySearchFilter = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  showMap,
  setShowMap
}: EmergencySearchFilterProps) => {
  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const handleMapToggle = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un numéro d'urgence..."
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <MapCategoryBadges 
          activeCategory={activeCategory} 
          onCategoryClick={handleCategoryClick}
        />
        
        <Button
          variant={showMap ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={handleMapToggle}
        >
          <MapPin className="h-4 w-4" />
          {showMap ? "Masquer la carte" : "Afficher la carte"}
        </Button>
      </div>
    </div>
  );
};
