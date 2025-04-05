# Emergency Map Feature Documentation

This document provides comprehensive information about the Emergency Map feature in Sama Pièce application, including its architecture, components, and how to use and extend it.

## Overview

The Emergency Map feature displays emergency services locations in Senegal on an interactive map. Users can filter services by category (Police, Medical, Fire, Other), view service details, and get navigation assistance.

## Components Architecture

The Emergency Map feature follows a modular architecture with the following components:

### Main Components

1. **EmergencyMap** (`src/components/map/EmergencyMap.tsx`)
   - The main component that renders the map
   - Handles map initialization and configuration
   - Renders the map container and category filters

2. **MapCategoryBadges** (`src/components/map/MapCategoryBadges.tsx`)
   - Renders the category filter badges for desktop view
   - Handles category selection and map navigation

3. **MapTokenInput** (`src/components/map/MapTokenInput.tsx`)
   - Renders the input form for Mapbox token
   - Displayed when no token is provided

4. **EmergencyMapDisplay** (`src/components/emergency/EmergencyMapDisplay.tsx`)
   - Wrapper component that handles map display animation
   - Controls visibility based on the `showMap` state

### Custom Hooks

1. **useMapSetup** (`src/components/map/hooks/useMapSetup.ts`)
   - Initializes Mapbox map with configuration
   - Handles map cleanup on component unmount
   - Returns the map instance and loaded state

2. **useMapMarkers** (`src/components/map/hooks/useMapMarkers.ts`)
   - Manages markers on the map
   - Filters markers based on selected category
   - Creates custom styled markers with popups
   - Handles map bounds and navigation

3. **useEmergencyNumbers** (`src/hooks/useEmergencyNumbers.tsx`)
   - Provides emergency service data
   - Handles filtering by search term and category

### Types and Data

1. **EmergencyMapTypes** (`src/components/map/types/EmergencyMapTypes.ts`)
   - Type definitions for the map components
   - Defines `EmergencyLocation` and `EmergencyMapProps`

2. **emergencyLocationsData** (`src/components/map/data/emergencyLocationsData.ts`)
   - Contains location data for emergency services
   - Includes names, coordinates, categories, addresses, and phone numbers

## How to Use the Map

### Basic Usage

Import and use the `EmergencyMap` component:

```tsx
import { EmergencyMap } from "@/components/map/EmergencyMap";

const MyComponent = () => {
  return <EmergencyMap />;
};
```

### With Custom Height

```tsx
<EmergencyMap height="h-96" />
```

### With Selected Category

```tsx
<EmergencyMap selectedCategory="medical" />
```

### In Emergency Page

The map is integrated into the `NumeroUrgence` page with toggle functionality:

```tsx
<EmergencyMapDisplay showMap={showMap} activeCategory={activeCategory} />
```

## Mapbox API Token

The map requires a Mapbox API token to function. There are two ways to provide it:

1. **User Input**: Users can enter their Mapbox token directly into the input field if no token is provided.
2. **Environment Variable**: For production, it's recommended to store the token as an environment variable.

To get a Mapbox token:
1. Create an account on [Mapbox](https://www.mapbox.com/)
2. Navigate to your account dashboard
3. Copy your public token
4. Enter it when prompted in the app

## Extending the Map

### Adding New Locations

To add new emergency locations, edit the `emergencyLocationsData.ts` file:

```typescript
export const emergencyLocations: EmergencyLocation[] = [
  // Existing locations...
  {
    name: "New Emergency Service",
    coordinates: [-17.4000, 14.7000], // [longitude, latitude]
    category: "medical", // "police", "medical", "fire", or "other"
    address: "Service Address",
    phone: "Phone Number"
  }
];
```

### Adding New Categories

To add a new category:

1. Update `EmergencyLocationTypes.ts` to include the new category:
   ```typescript
   export interface EmergencyLocation {
     // ...
     category: "police" | "medical" | "fire" | "other" | "new-category";
     // ...
   }
   ```

2. Add styling for the new category in `useMapMarkers.ts`:
   ```typescript
   switch (location.category) {
     // Existing cases...
     case "new-category":
       markerElement.style.backgroundColor = '#yourColor';
       break;
   }
   ```

3. Add the category badge in `EmergencySearchFilter.tsx`:
   ```typescript
   const categories = [
     // Existing categories...
     { id: "new-category", label: "New Category", color: "bg-your-color-500" }
   ];
   ```

## Mobile Responsiveness

The map is fully responsive:
- Desktop: Map displays inline with filter controls above
- Mobile: Map is accessed via a drawer component for better usability

## Performance Considerations

- Markers are only created when needed and cleaned up afterward
- Map is only initialized after a token is provided
- Memory leaks are prevented by proper cleanup in useEffect hooks

## Troubleshooting

Common issues and solutions:

1. **Map not displaying**: Ensure a valid Mapbox token is provided
2. **Markers not showing**: Check if `emergencyLocationsData.ts` contains valid coordinates
3. **Category filters not working**: Verify category names match between components
4. **Console errors**: Check for proper cleanup in useEffect hooks
