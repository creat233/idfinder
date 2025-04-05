
import { useState, useMemo } from "react";

export type EmergencyNumberType = {
  service: string;
  number: string;
  description: string;
  category: "police" | "medical" | "fire" | "other";
}

export const useEmergencyNumbers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const emergencyNumbers: EmergencyNumberType[] = [
    { 
      service: "Police Nationale", 
      number: "17", 
      description: "Pour signaler un crime, un délit ou une situation dangereuse",
      category: "police"
    },
    { 
      service: "Sapeurs-Pompiers", 
      number: "18", 
      description: "Pour les urgences médicales, les incendies et les secours",
      category: "fire" 
    },
    { 
      service: "SAMU (Service d'Aide Médicale Urgente)", 
      number: "1515", 
      description: "Pour les urgences médicales graves nécessitant une intervention médicale",
      category: "medical" 
    },
    { 
      service: "Gendarmerie", 
      number: "800 00 20 20", 
      description: "Numéro vert de la Gendarmerie Nationale",
      category: "police" 
    },
    { 
      service: "Centre Anti-Poison", 
      number: "818 00 15 15", 
      description: "Pour les cas d'empoisonnement ou d'intoxication",
      category: "medical" 
    },
    { 
      service: "SOS Médecin", 
      number: "33 889 15 15", 
      description: "Service de médecins à domicile disponible 24h/24",
      category: "medical" 
    },
    { 
      service: "Croix-Rouge Sénégalaise", 
      number: "33 823 39 92", 
      description: "Assistance humanitaire et premiers secours",
      category: "other" 
    },
    { 
      service: "Protection Civile", 
      number: "33 889 31 00", 
      description: "Pour les catastrophes naturelles et situations d'urgence collective",
      category: "other" 
    }
  ];

  const filteredNumbers = useMemo(() => {
    return emergencyNumbers.filter(item => {
      const matchesSearch = item.service.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory ? item.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory, emergencyNumbers]);

  return {
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    showMap,
    setShowMap,
    filteredNumbers
  };
};
