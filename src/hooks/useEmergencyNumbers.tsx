
import { useState, useMemo } from "react";
import { useTranslation } from "@/providers/TranslationProvider";

export type EmergencyNumberType = {
  service: string;
  number: string;
  description: string;
  category: "police" | "medical" | "fire" | "other";
};

const emergencyNumberKeys = [
  { serviceKey: "emergency_police_nationale_service", number: "17", category: "police" as const, descriptionKey: "emergency_police_nationale_desc" },
  { serviceKey: "emergency_pompiers_service", number: "18", category: "fire" as const, descriptionKey: "emergency_pompiers_desc" },
  { serviceKey: "emergency_samu_service", number: "15", category: "medical" as const, descriptionKey: "emergency_samu_desc" },
  { serviceKey: "emergency_european_service", number: "112", category: "other" as const, descriptionKey: "emergency_european_desc" },
  { serviceKey: "emergency_anti_poison_service", number: "818 00 15 15", category: "medical" as const, descriptionKey: "emergency_anti_poison_desc" },
  { serviceKey: "emergency_gendarmerie_service", number: "800 00 20 20", category: "police" as const, descriptionKey: "emergency_gendarmerie_desc" },
  { serviceKey: "emergency_medic_kane_service", number: "33 867 46 77", category: "medical" as const, descriptionKey: "emergency_medic_kane_desc" },
  { serviceKey: "emergency_commissariat_dakar_service", number: "33 823 25 29", category: "police" as const, descriptionKey: "emergency_commissariat_dakar_desc" },
  { serviceKey: "emergency_hopital_dakar_service", number: "33 839 50 50", category: "medical" as const, descriptionKey: "emergency_hopital_dakar_desc" },
  { serviceKey: "emergency_croix_rouge_service", number: "33 823 39 92", category: "other" as const, descriptionKey: "emergency_croix_rouge_desc" }
];

export const useEmergencyNumbers = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMap, setShowMap] = useState<boolean>(false);

  const emergencyNumbers: EmergencyNumberType[] = useMemo(() => 
    emergencyNumberKeys.map(item => ({
      service: t(item.serviceKey),
      number: item.number,
      description: t(item.descriptionKey),
      category: item.category,
    })), [t]);

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
  }, [searchTerm, activeCategory, emergencyNumbers]);

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
