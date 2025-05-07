
import { useRef, useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";

export const useMapSetup = (mapboxToken: string, mapContainer: React.RefObject<HTMLDivElement>) => {
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;

    try {
      // Initialize the map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-14.4529, 14.4974], // Centre sur le Sénégal
        zoom: 6.5, // Vue d'ensemble du pays
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        "top-right"
      );

      map.current.on("load", () => {
        setMapLoaded(true);
      });

      // Cleanup
      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error("Erreur lors de l'initialisation de la carte:", error);
      return undefined;
    }
  }, [mapboxToken, mapContainer]);

  return { map, mapLoaded };
};
