import React from 'react';
import { Map } from "@/components/ui/map";

/**
 * BasicMap Example
 * 
 * Shows a minimal implementation of a Mapcn map.
 * Requirements:
 * - Parent container must have a fixed height.
 */
export const BasicMapExample = () => {
    return (
        <div className="h-[400px] w-full border rounded-xl overflow-hidden shadow-lg bg-muted/20">
            <Map 
                center={[0, 0]} // [Longitude, Latitude]
                zoom={2}
                onLoad={() => console.log("Map initialized successfully!")}
            />
        </div>
    );
};

export default BasicMapExample;
