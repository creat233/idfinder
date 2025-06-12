
import { useState, useMemo } from "react";

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
  },
  {
    service: "Commissariat Central Dakar",
    number: "33 823 25 29",
    category: "police",
    description: "Commissariat central de Dakar"
  },
  {
    service: "Hôpital Principal de Dakar",
    number: "33 839 50 50",
    category: "medical",
    description: "Hôpital principal de Dakar - Urgences"
  },
  {
    service: "Croix-Rouge Sénégalaise",
    number: "33 823 39 92",
    category: "other",
    description: "Organisation humanitaire d'urgence"
  }
];

export const useEmergencyNumbers = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);

  const filteredNumbers = useMemo(() => {
    let filtered = emergencyNumbers;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((item) => {
        const matchesSearch = 
          item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.number.includes(searchTerm) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
      });
    }

    // Filter by category if an active category is selected
    if (activeCategory) {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    return filtered;
  }, [searchTerm, activeCategory]);

  return {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    showMap,
    setShowMap,
    filteredNumbers,
    emergencyNumbers, // Export all numbers for debugging
  };
};
