
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { EmergencyMap } from "@/components/map/EmergencyMap";
import { useIsMobile } from "@/hooks/use-mobile";

interface EmergencySearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
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
  const isMobile = useIsMobile();

  const categories = [
    { id: "police", label: "Police", color: "bg-blue-500 hover:bg-blue-600" },
    { id: "medical", label: "Médical", color: "bg-red-500 hover:bg-red-600" },
    { id: "fire", label: "Incendie", color: "bg-orange-500 hover:bg-orange-600" },
    { id: "other", label: "Autres", color: "bg-purple-500 hover:bg-purple-600" }
  ];

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
          {categories.map(category => (
            <Badge 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 ${activeCategory === category.id ? category.color + ' text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
            >
              {category.label}
            </Badge>
          ))}
        </div>
        
        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 hover:bg-secondary hover:text-white transition-colors"
              >
                <MapPin className="h-4 w-4" />
                Voir la carte
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[85vh]">
              <div className="p-4 h-full">
                <h3 className="font-semibold text-lg mb-4">Carte des services d'urgence</h3>
                <EmergencyMap height="h-[70vh]" selectedCategory={activeCategory} />
              </div>
            </DrawerContent>
          </Drawer>
        ) : (
          <Button 
            variant="outline" 
            className={`flex items-center gap-2 transition-colors ${showMap ? 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white' : 'hover:bg-secondary hover:text-white'}`}
            onClick={() => setShowMap(!showMap)}
          >
            <MapPin className="h-4 w-4" />
            {showMap ? "Masquer la carte" : "Afficher la carte"}
          </Button>
        )}
      </div>
    </div>
  );
};
