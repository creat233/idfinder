
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { EmergencyLocation } from "../types/EmergencyMapTypes";

export const useMapMarkers = (
  mapLoaded: boolean, 
  map: React.MutableRefObject<mapboxgl.Map | null>,
  locations: EmergencyLocation[],
  selectedCategory: string | null
) => {
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Filter locations by category if a category is selected
    const filteredLocations = selectedCategory 
      ? locations.filter(loc => loc.category === selectedCategory)
      : locations;

    // Add markers for each location
    filteredLocations.forEach(location => {
      // Create a div element for the custom marker
      const markerElement = document.createElement('div');
      markerElement.className = `marker-${location.category}`;
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      markerElement.style.borderRadius = '50%';
      markerElement.style.display = 'flex';
      markerElement.style.alignItems = 'center';
      markerElement.style.justifyContent = 'center';
      markerElement.style.cursor = 'pointer';
      markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.25)';
      markerElement.style.border = '2px solid white';
      markerElement.style.transition = 'transform 0.2s ease';
      
      // Set hover effect
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.1)';
      });
      
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
      });
      
      // Set marker color based on category
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

      // Add icon or text to the marker
      const innerText = document.createElement('span');
      innerText.style.color = 'white';
      innerText.style.fontWeight = 'bold';
      innerText.style.fontSize = '15px';
      innerText.style.textShadow = '0 1px 2px rgba(0,0,0,0.3)';
      
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

      // Create popup with emergency service information
      const popup = new mapboxgl.Popup({ 
        offset: 25,
        closeButton: false,
        className: 'custom-popup'
      }).setHTML(`
        <div style="font-family: sans-serif; padding: 10px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1a1a1a;">${location.name}</h3>
          ${location.address ? `<p style="margin: 0 0 6px 0; font-size: 13px; color: #4b5563;"><strong>Adresse:</strong> ${location.address}</p>` : ''}
          ${location.phone ? `<p style="margin: 0; font-size: 13px; color: #4b5563;"><strong>Téléphone:</strong> <span style="color: #3b82f6; font-weight: 500;">${location.phone}</span></p>` : ''}
        </div>
      `);

      // Create and add marker to map
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat(location.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
      
      markers.current.push(marker);
    });

    // Adjust view to include all markers if needed
    if (filteredLocations.length > 0 && filteredLocations.length < locations.length) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredLocations.forEach(location => {
        bounds.extend(location.coordinates as [number, number]);
      });
      map.current.fitBounds(bounds, { padding: 50, animate: true });
    } else if (filteredLocations.length === locations.length) {
      // If all locations are displayed, center on Dakar
      map.current.flyTo({
        center: [-17.4676, 14.6937],
        zoom: 12,
        essential: true,
        animate: true
      });
    }

    // Add CSS for custom popup
    if (!document.getElementById('custom-popup-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'custom-popup-styles';
      styleSheet.textContent = `
        .mapboxgl-popup-content {
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          border: 1px solid rgba(0,0,0,0.1);
        }
        .mapboxgl-popup-tip {
          border-top-color: white;
          border-bottom-color: white;
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, [mapLoaded, selectedCategory, locations, map]);

  return markers;
};
