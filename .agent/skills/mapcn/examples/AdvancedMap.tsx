import React, { useRef } from 'react';
import { Map, MapControls, MapMarker, MarkerPopup, type MapRef } from "@/components/ui/map";

/**
 * AdvancedMap Example
 * 
 * Demonstrates:
 * - Map controls (Zoom, Fullscreen, etc.)
 * - Interactive markers with popups
 * - Programmatic map manipulation using MapRef
 */
export const AdvancedMapExample = () => {
    const mapRef = useRef<MapRef>(null);

    const locations = [
        { id: 1, name: "London", coords: [-0.1276, 51.5074] as [number, number], desc: "Capital of England" },
        { id: 2, name: "Paris", coords: [2.3522, 48.8566] as [number, number], desc: "The City of Light" },
        { id: 3, name: "New York", coords: [-74.006, 40.7128] as [number, number], desc: "The Big Apple" },
    ];

    const flyToLocation = (coords: [number, number]) => {
        mapRef.current?.flyTo({
            center: coords,
            zoom: 10,
            duration: 2000
        });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4">
            <div className="flex gap-2 flex-wrap">
                {locations.map(loc => (
                    <button 
                        key={loc.id}
                        onClick={() => flyToLocation(loc.coords)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Fly to {loc.name}
                    </button>
                ))}
            </div>

            <div className="h-[600px] w-full border-2 border-border rounded-2xl overflow-hidden shadow-inner relative group">
                <Map 
                    ref={mapRef}
                    center={[15, 45]} 
                    zoom={3}
                >
                    {/* Controls positioned in the corners */}
                    <MapControls position="top-right" showZoom showFullscreen showCompass />
                    <MapControls position="bottom-left" showLocate />

                    {/* Rendering markers from data */}
                    {locations.map(loc => (
                        <MapMarker key={loc.id} coordinates={loc.coords}>
                            <MarkerPopup>
                                <div className="p-3 bg-card text-card-foreground shadow-sm max-w-[200px]">
                                    <h3 className="font-bold text-base leading-tight">{loc.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">{loc.desc}</p>
                                    <button 
                                        className="mt-2 text-primary font-semibold text-[10px] uppercase tracking-wider hover:underline"
                                        onClick={() => alert(`Visiting ${loc.name}...`)}
                                    >
                                        Explore More
                                    </button>
                                </div>
                            </MarkerPopup>
                        </MapMarker>
                    ))}
                </Map>
                
                {/* Visual Overlay if not loaded yet or for flair */}
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight border shadow-sm pointer-events-none transition-opacity group-hover:opacity-100 opacity-60">
                    EXPLORER VIEW
                </div>
            </div>
        </div>
    );
};

export default AdvancedMapExample;
