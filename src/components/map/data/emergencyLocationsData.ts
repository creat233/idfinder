
import { EmergencyLocation } from "../types/EmergencyMapTypes";

export const emergencyLocations: EmergencyLocation[] = [
  // Dakar
  {
    name: "Police Nationale - Dakar",
    coordinates: [-17.4443, 14.6928],
    category: "police",
    address: "Avenue Malick Sy, Dakar",
    phone: "17"
  },
  {
    name: "Sapeurs-Pompiers - Dakar",
    coordinates: [-17.4376, 14.6837],
    category: "fire",
    address: "Rue 10, Dakar",
    phone: "18"
  },
  {
    name: "Hôpital Principal de Dakar",
    coordinates: [-17.4376, 14.6737],
    category: "medical",
    address: "1, Avenue Nelson Mandela, Dakar",
    phone: "33 839 50 50"
  },
  {
    name: "Centre Anti-Poison",
    coordinates: [-17.4576, 14.7037],
    category: "medical",
    address: "CHU de Fann, Avenue Cheikh Anta Diop, Dakar",
    phone: "818 00 15 15"
  },
  {
    name: "Gendarmerie Nationale - Dakar",
    coordinates: [-17.4876, 14.7137],
    category: "police",
    address: "Avenue Cheikh Anta Diop, Dakar",
    phone: "800 00 20 20"
  },
  // Saint-Louis
  {
    name: "Commissariat Central - Saint-Louis",
    coordinates: [-16.4901, 16.0326],
    category: "police",
    address: "Saint-Louis, Sénégal",
    phone: "17"
  },
  {
    name: "Hôpital Régional - Saint-Louis",
    coordinates: [-16.4887, 16.0310],
    category: "medical",
    address: "Saint-Louis, Sénégal",
    phone: "33 961 10 03"
  },
  // Thiès
  {
    name: "Commissariat Central - Thiès",
    coordinates: [-16.9244, 14.7944],
    category: "police",
    address: "Thiès, Sénégal",
    phone: "17"
  },
  {
    name: "Hôpital Régional - Thiès",
    coordinates: [-16.9255, 14.7932],
    category: "medical",
    address: "Thiès, Sénégal",
    phone: "33 951 12 08"
  },
  // Ziguinchor
  {
    name: "Commissariat Central - Ziguinchor",
    coordinates: [-16.2730, 12.5655],
    category: "police",
    address: "Ziguinchor, Sénégal",
    phone: "17"
  },
  {
    name: "Hôpital Régional - Ziguinchor",
    coordinates: [-16.2710, 12.5642],
    category: "medical",
    address: "Ziguinchor, Sénégal",
    phone: "33 991 11 54"
  },
  // Touba
  {
    name: "Gendarmerie - Touba",
    coordinates: [-15.8833, 14.8667],
    category: "police",
    address: "Touba, Sénégal",
    phone: "800 00 20 20"
  },
  // Divers
  {
    name: "Croix-Rouge Sénégalaise",
    coordinates: [-17.4176, 14.6637],
    category: "other",
    address: "Boulevard du Sud, Point E, Dakar",
    phone: "33 823 39 92"
  },
  {
    name: "Clinique Medic'Kane",
    coordinates: [-17.4526, 14.6837],
    category: "medical",
    address: "Sacré-Cœur 3, Dakar",
    phone: "33 867 46 77"
  }
];
