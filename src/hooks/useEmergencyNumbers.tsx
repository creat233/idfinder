
import { useState, useMemo } from "react";
import { emergencyLocations } from "@/components/map/data/emergencyLocationsData";

export type EmergencyNumberType = {
  service: string;
  number: string;
  description: string;
  category: "police" | "medical" | "fire" | "other";
};

const emergencyNumbers: EmergencyNumberType[] = [
  {
    service: "Police Nationale",
    number: "17",
    category: "police",
    description: "Urgences police et sécurité"
  },
  {
    service: "Pompiers",
    number: "18",
    category: "fire",
    description: "Incendies, accidents et secours"
  },
  {
    service: "SAMU",
    number: "15",
    category: "medical",
    description: "Urgences médicales"
  },
  {
    service: "Numéro d'urgence européen",
    number: "112",
    category: "other",
    description: "Toutes urgences (valable dans toute l'Union Européenne)"
  },
  {
    service: "Centre Anti-Poison",
    number: "818 00 15 15",
    category: "medical",
    description: "Intoxications et expositions à des substances toxiques"
  },
  {
    service: "Gendarmerie Nationale",
    number: "800 00 20 20",
    category: "police",
    description: "Sécurité en zones rurales et périurbaines"
  },
  {
    service: "Clinique Medic'Kane",
    number: "33 867 46 77",
    category: "medical",
    description: "Clinique médicale privée avec services d'urgence"
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
        item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
