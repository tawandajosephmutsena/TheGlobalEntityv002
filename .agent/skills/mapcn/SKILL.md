---
name: Mapcn
description: Integrated MapLibre-based map components following shadcn/ui principles. High-performance, customizable, and React-first.
---

# Mapcn Skill

Use this skill when a map component is needed in the project. Mapcn is a shadcn-like library built on top of MapLibre GL, offering high-performance vector maps with easy React integration.

## Prerequisites

- **Tailwind CSS**: Required for styling the map components and controls.
- **shadcn/ui**: The components are designed to live in your `components/ui` folder.
- **MapLibre GL**: The underlying engine for vector tile rendering.

## Installation

To add the map components to your project, use the shadcn CLI:

```bash
npx shadcn@latest add @mapcn/map
```

This will create several components in your `resources/js/components/ui/map` directory (or similar based on your project structure).

## Core Components

| Component | Description |
| :--- | :--- |
| `Map` | The primary container. Requires a fixed height on its parent. |
| `MapControls` | Adds navigation UI (Zoom, Fullscreen, Compass, Locate). |
| `MapMarker` | DOM-based marker for specific coordinates. |
| `MarkerPopup` | Popup attached to a marker, triggered on click. |
| `MapPopup` | Standalone popup for general annotations. |

## Instructions

### 1. Basic Map Implementation

1. Create a container with a fixed height.
2. Render the `Map` component with `center` and `zoom` props.

```tsx
import { Map } from "@/components/ui/map";

export function SimpleMap() {
  return (
    <div className="h-[400px] w-full border rounded-xl overflow-hidden shadow-sm">
      <Map 
        center={[-74.006, 40.7128]} 
        zoom={12} 
      />
    </div>
  );
}
```

### 2. Adding Controls and Interactivity

Use `MapControls` for UI navigation and `mapRef` for programmatic control.

```tsx
import { Map, MapControls, type MapRef } from "@/components/ui/map";
import { useRef } from "react";

export function InteractiveMap() {
  const mapRef = useRef<MapRef>(null);

  const handleFlyTo = () => {
    mapRef.current?.flyTo({
      center: [-73.935242, 40.730610],
      zoom: 14,
      essential: true
    });
  };

  return (
    <div className="space-y-4">
      <button onClick={handleFlyTo} className="btn-primary">Fly to Queens</button>
      <div className="h-[500px] w-full rounded-lg overflow-hidden">
        <Map 
          ref={mapRef}
          center={[-74.006, 40.7128]} 
          zoom={12}
        >
          <MapControls position="top-right" showZoom showFullscreen />
        </Map>
      </div>
    </div>
  );
}
```

### 3. Markers and Popups

Mapcn markers use React portals, making them easy to style and interact with.

```tsx
<Map center={[-74.006, 40.7128]} zoom={12}>
  <MapMarker coordinates={[-74.006, 40.7128]}>
    <MarkerPopup>
      <div className="p-3">
        <h4 className="font-semibold text-lg">Empire State Building</h4>
        <p className="text-sm text-muted-foreground italic">Iconic Art Deco skyscraper.</p>
      </div>
    </MarkerPopup>
  </MapMarker>
</Map>
```

## Best Practices

- **Container Height**: Always ensure the parent `div` of `Map` has a explicit height (e.g., `h-[500px]`, `h-screen`, or `aspect-video`).
- **Performance**: While `MapMarker` is convenient for small sets (up to ~200), use GeoJSON source/layers for thousands of points to ensure 60fps performance.
- **Theming**: Use the `theme` prop or Tailwind classes on the map container to match your application's aesthetic.
- **Token Security**: Always use environment variables for MapTiler or Mapbox access tokens (e.g., `process.env.VITE_MAP_TOKEN`).

## Troubleshooting

| Issue | Solution |
| :--- | :--- |
| Map is blank | Ensure you have a valid token if using a provider like MapTiler. |
| Markers not appearing | Check if coordinates are in `[longitude, latitude]` order. |
| Controls overlapping UI | Use the `position` prop (`top-left`, `bottom-right`, etc.) to move them. |
