
export interface EmergencyLocation {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  category: "police" | "medical" | "fire" | "other";
  address?: string;
  phone?: string;
}

export interface EmergencyMapProps {
  height?: string;
  selectedCategory?: string | null;
}
