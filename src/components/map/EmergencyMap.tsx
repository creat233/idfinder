
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

// Types pour les emplacements des services d'urgence
interface EmergencyLocation {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  category: "police" | "medical" | "fire" | "other";
  address?: string;
  phone?: string;
}

interface EmergencyMapProps {
  height?: string;
  selectedCategory?: string | null;
}

export const EmergencyMap = ({ height = "h-80", selectedCategory }: EmergencyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const isMobile = useIsMobile();

  // Exemple d'emplacements des services d'urgence au Sénégal
  const emergencyLocations: EmergencyLocation[] = [
    {
      name: "Police Nationale - Dakar",
      coordinates: [-17.4676, 14.6937],
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
    {
      name: "Croix-Rouge Sénégalaise",
      coordinates: [-17.4176, 14.6637],
      category: "other",
      address: "Boulevard du Sud, Point E, Dakar",
      phone: "33 823 39 92"
    }
  ];

  useEffect(() => {
    if (!mapboxToken && !showTokenInput) {
      // Utilisez un token par défaut (limité) ou demandez à l'utilisateur d'entrer le sien
      setShowTokenInput(true);
      return;
    }

    if (!mapContainer.current || !mapboxToken || map.current) return;

    // Initialiser la carte
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-17.4676, 14.6937], // Centre sur Dakar, Sénégal
        zoom: 12,
      });

      // Ajouter les contrôles de navigation
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        "top-right"
      );

      map.current.on("load", () => {
        setMapLoaded(true);
      });

      // Nettoyage
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
      setShowTokenInput(true);
    }
  }, [mapboxToken]);

  // Ajouter les marqueurs une fois que la carte est chargée
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Supprimer les marqueurs existants
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Filtrer les emplacements par catégorie si une catégorie est sélectionnée
    const filteredLocations = selectedCategory 
      ? emergencyLocations.filter(loc => loc.category === selectedCategory)
      : emergencyLocations;

    // Ajouter les nouveaux marqueurs
    filteredLocations.forEach(location => {
      // Créer un élément div pour le marqueur personnalisé
      const markerElement = document.createElement('div');
      markerElement.className = `marker-${location.category}`;
      markerElement.style.width = '25px';
      markerElement.style.height = '25px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.cursor = 'pointer';
      
      // Définir la couleur du marqueur en fonction de la catégorie
      switch (location.category) {
        case "police":
          markerElement.style.backgroundColor = '#3b82f6'; // blue-500
          break;
        case "medical":
          markerElement.style.backgroundColor = '#ef4444'; // red-500
          break;
        case "fire":
          markerElement.style.backgroundColor = '#f97316'; // orange-500
          break;
        case "other":
          markerElement.style.backgroundColor = '#8b5cf6'; // purple-500
          break;
      }

      // Ajouter une icône ou un texte au marqueur
      const innerText = document.createElement('span');
      innerText.style.color = 'white';
      innerText.style.fontWeight = 'bold';
      innerText.style.fontSize = '14px';
      
      switch (location.category) {
        case "police":
          innerText.textContent = "P";
          break;
        case "medical":
          innerText.textContent = "M";
          break;
        case "fire":
          innerText.textContent = "F";
          break;
        case "other":
          innerText.textContent = "O";
          break;
      }
      
      markerElement.appendChild(innerText);

      // Créer le popup avec les informations du service d'urgence
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="font-family: sans-serif; padding: 5px;">
          <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">${location.name}</h3>
          ${location.address ? `<p style="margin: 0 0 5px 0; font-size: 12px;"><strong>Adresse:</strong> ${location.address}</p>` : ''}
          ${location.phone ? `<p style="margin: 0; font-size: 12px;"><strong>Téléphone:</strong> ${location.phone}</p>` : ''}
        </div>
      `);

      // Créer et ajouter le marqueur à la carte
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
      
      markers.current.push(marker);
    });

    // Ajuster la vue pour inclure tous les marqueurs si nécessaire
    if (filteredLocations.length > 0 && filteredLocations.length < emergencyLocations.length) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredLocations.forEach(location => {
        bounds.extend(location.coordinates as [number, number]);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    } else if (filteredLocations.length === emergencyLocations.length) {
      // Si tous les emplacements sont affichés, centrer sur Dakar
      map.current.flyTo({
        center: [-17.4676, 14.6937],
        zoom: 12,
        essential: true
      });
    }
  }, [mapLoaded, selectedCategory]);

  // Si nous avons besoin que l'utilisateur entre son token Mapbox
  if (showTokenInput) {
    return (
      <div className={`${height} bg-gray-100 rounded-lg border border-gray-200 flex flex-col items-center justify-center p-4`}>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center mb-4 text-amber-500">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <h3 className="font-bold">Configuration requise</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Pour afficher la carte des services d'urgence, veuillez entrer votre clé d'API Mapbox.
            Vous pouvez en obtenir une gratuitement sur <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
          </p>
          <input
            type="text"
            placeholder="Entrez votre clé d'API Mapbox"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            onChange={(e) => setMapboxToken(e.target.value)}
          />
          <button
            className="w-full bg-primary text-white p-2 rounded hover:bg-primary/90"
            onClick={() => setShowTokenInput(false)}
          >
            Afficher la carte
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${height} rounded-lg overflow-hidden border border-gray-200`}>
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-2 left-2 z-10 flex flex-wrap gap-1">
        {!isMobile && mapLoaded && (
          <>
            <Badge 
              className={`cursor-pointer ${selectedCategory === "police" ? "bg-blue-500" : "bg-gray-100 text-gray-700"}`}
              onClick={() => map.current?.flyTo({ center: [-17.4676, 14.6937], zoom: 14 })}
            >
              Police
            </Badge>
            <Badge 
              className={`cursor-pointer ${selectedCategory === "medical" ? "bg-red-500" : "bg-gray-100 text-gray-700"}`}
              onClick={() => map.current?.flyTo({ center: [-17.4376, 14.6737], zoom: 14 })}
            >
              Médical
            </Badge>
            <Badge 
              className={`cursor-pointer ${selectedCategory === "fire" ? "bg-orange-500" : "bg-gray-100 text-gray-700"}`}
              onClick={() => map.current?.flyTo({ center: [-17.4376, 14.6837], zoom: 14 })}
            >
              Pompiers
            </Badge>
          </>
        )}
      </div>
    </div>
  );
};
