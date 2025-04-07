
import { useState, useMemo } from "react";
import { emergencyLocations } from "@/components/map/data/emergencyLocationsData";

export type EmergencyNumberType = {
  name: string;
  number: string;
  category: string;
  description?: string;
};

const emergencyNumbers: EmergencyNumberType[] = [
  {
    name: "Police Nationale",
    number: "17",
    category: "police",
    description: "Urgences police et sécurité"
  },
  {
    name: "Pompiers",
    number: "18",
    category: "fire",
    description: "Incendies, accidents et secours"
  },
  {
    name: "SAMU",
    number: "15",
    category: "medical",
    description: "Urgences médicales"
  },
  {
    name: "Numéro d'urgence européen",
    number: "112",
    category: "other",
    description: "Toutes urgences (valable dans toute l'Union Européenne)"
  },
  {
    name: "Centre Anti-Poison",
    number: "818 00 15 15",
    category: "medical",
    description: "Intoxications et expositions à des substances toxiques"
  },
  {
    name: "Gendarmerie Nationale",
    number: "800 00 20 20",
    category: "police",
    description: "Sécurité en zones rurales et périurbaines"
  }
];

export const useEmergencyNumbers = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);

  const filteredNumbers = useMemo(() => {
    return emergencyNumbers.filter((item) => {
      // Filter by search term
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.number.includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filter by category if an active category is selected
      const matchesCategory = activeCategory ? item.category === activeCategory : true;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    showMap,
    setShowMap,
    filteredNumbers,
  };
};
