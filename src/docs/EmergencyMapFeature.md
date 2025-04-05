# Emergency Map Feature Documentation

## Overview

The Emergency Map feature provides an interactive map showing emergency services locations in Senegal. This documentation explains how the feature works, its components, and how developers can extend it.

![Emergency Map Screenshot]

## Table of Contents

1. [Features](#features)
2. [User Guide](#user-guide)
3. [Technical Implementation](#technical-implementation)
4. [Development Guide](#development-guide)
5. [Troubleshooting](#troubleshooting)

## Features

- **Interactive Map**: Visualize emergency service locations across Senegal
- **Category Filtering**: Filter services by type (Police, Medical, Fire, Other)
- **Location Details**: View name, address, and contact information for each service
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Animated UI**: Smooth transitions and intuitive interface

## User Guide

### Accessing the Map

1. Navigate to the "Numéros d'Urgence" page
2. Click on "Afficher la carte" button to show the map
3. On mobile devices, tap "Voir la carte" to open the map in a drawer

### Using the Map

- **Filtering Services**: Click on category badges (Police, Médical, Pompiers) to filter locations
- **Viewing Details**: Click on any marker to see service information
- **Navigation**: Use the zoom and pan controls to navigate the map
- **Reset View**: Click the category badges to center the map on specific service types

### First-Time Setup

When accessing the map for the first time, you'll need to provide a Mapbox token:

1. Create an account on [Mapbox](https://www.mapbox.com/)
2. Copy your public token from your account dashboard
3. Enter it in the provided input field
4. Click "Afficher la carte" to load the map

## Technical Implementation

### Component Architecture

The feature is built using several focused components:

- `EmergencyMap`: Main container component
- `MapCategoryBadges`: Category filter UI
- `MapTokenInput`: Token input form
- `useMapSetup`: Map initialization hook
- `useMapMarkers`: Marker management hook
- `EmergencyMapDisplay`: Animation wrapper

### Key Files

- `src/components/map/EmergencyMap.tsx`: Main map component
- `src/components/map/MapCategoryBadges.tsx`: Category filters
- `src/components/map/hooks/useMapSetup.ts`: Map initialization
- `src/components/map/hooks/useMapMarkers.ts`: Marker management
- `src/components/map/data/emergencyLocationsData.ts`: Location data
- `src/components/map/types/EmergencyMapTypes.ts`: Type definitions

### Data Flow

1. User selects a category or searches for a service
2. `useEmergencyNumbers` hook filters the emergency services data
3. `EmergencyMap` receives the selected category as a prop
4. `useMapMarkers` creates and manages markers based on the selected category
5. Map adjusts view to show relevant markers

## Development Guide

### Adding New Locations

Edit the `emergencyLocationsData.ts` file to add new emergency service locations:

```typescript
export const emergencyLocations: EmergencyLocation[] = [
  // Existing locations...
  {
    name: "New Service Name",
    coordinates: [-17.4000, 14.7000], // [longitude, latitude]
    category: "police", // or "medical", "fire", "other"
    address: "Service address",
    phone: "Service phone"
  }
];
```

### Customizing Marker Styles

Marker styles are defined in the `useMapMarkers.ts` hook. To modify:

1. Locate the marker creation code in `useMapMarkers.ts`
2. Update the style properties for the desired category
3. Test to ensure changes appear correctly

### Adding Map Features

To add new features to the map:

1. Modify the `useMapSetup.ts` hook to include new Mapbox features
2. Update the EmergencyMap component to expose new controls if needed
3. Add any new types to EmergencyMapTypes.ts

## Troubleshooting

### Common Issues

1. **Map Not Loading**
   - Check if a valid Mapbox token is provided
   - Verify console for any JavaScript errors
   - Ensure the map container has a defined height

2. **Missing Markers**
   - Check that the emergencyLocationsData.ts contains valid coordinates
   - Verify the selected category matches location categories
   - Check console logs for any data-related errors

3. **Performance Issues**
   - Large numbers of markers can impact performance
   - Consider using map clustering for many locations
   - Optimize marker creation/destruction in useMapMarkers

### Support

For additional help or to report issues:
- Create an issue in the project repository
- Contact the development team through the support section
