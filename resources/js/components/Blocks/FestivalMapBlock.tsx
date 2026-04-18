import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Map, MapMarker, MapControls, MarkerContent, MarkerPopup } from '@/components/ui/map';
import type { FestivalMapBlock as FestivalMapBlockType } from '@/types/page-blocks';

interface FestivalData {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    location: {
        address: string;
        lat: string;
        lng: string;
    } | null;
    url: string;
    activities: string[];
}

const FestivalMapBlock: React.FC<FestivalMapBlockType['content']> = ({
    badge = "Festival Radar",
    title = "Explore the Magic",
    subtitle = "Find festivals and sustainable hubs near you",
    description,
    center: centerProp = { lat: 20, lng: 0 },
    zoom: zoomProp = 3,
    showSearch = true,
    limit = 50,
    theme
}) => {
    const [festivals, setFestivals] = useState<FestivalData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [mapInstance, setMapInstance] = useState<any>(null);

    useEffect(() => {
        if (mapInstance && festivals.length > 0) {
            let minLng = 180, maxLng = -180, minLat = 90, maxLat = -90;
            festivals.forEach(f => {
                const lng = parseFloat(f.location!.lng);
                const lat = parseFloat(f.location!.lat);
                if (lng < minLng) minLng = lng;
                if (lng > maxLng) maxLng = lng;
                if (lat < minLat) minLat = lat;
                if (lat > maxLat) maxLat = lat;
            });
            
            if (minLng === maxLng && minLat === maxLat) {
                mapInstance.flyTo({ center: [minLng, minLat], zoom: 12 });
            } else {
                mapInstance.fitBounds([
                    [minLng, minLat],
                    [maxLng, maxLat]
                ], { padding: 50, maxZoom: 12, duration: 1000 });
            }
        }
    }, [mapInstance, festivals]);

    useEffect(() => {
        const fetchFestivals = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/collections/festivals?limit=${limit}`);
                const result = await response.json();
                
                // Filter out festivals without location data or invalid coordinates
                const locatedFestivals = (result.data || []).filter((f: FestivalData) => {
                    if (!f.location?.lat || !f.location?.lng) return false;
                    const lat = parseFloat(f.location.lat);
                    const lng = parseFloat(f.location.lng);
                    return (
                        !isNaN(lat) && !isNaN(lng) && 
                        lat >= -90 && lat <= 90 && 
                        lng >= -180 && lng <= 180
                    );
                });
                setFestivals(locatedFestivals);
            } catch (error) {
                console.error('Error fetching festivals for map:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFestivals();
    }, [limit]);

    const filteredFestivals = festivals.filter(f => 
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.location?.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const mapCenter: [number, number] = [centerProp.lng, centerProp.lat];

    const groupedFestivals = React.useMemo(() => {
        const groups: Record<string, FestivalData[]> = {};
        filteredFestivals.forEach(festival => {
            if (!festival.location) return;
            // Round coordinates slightly to handle minor floating point differences
            const key = `${parseFloat(festival.location.lat).toFixed(5)},${parseFloat(festival.location.lng).toFixed(5)}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(festival);
        });
        return Object.values(groups);
    }, [filteredFestivals]);
    return (
        <section className="relative py-24 overflow-visible border-t border-border/10">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Badge variant="outline" className="mb-4 font-mono tracking-widest text-primary border-primary/20 bg-primary/5">
                            {badge}
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-display mb-6 tracking-tight">
                            {title}
                        </h2>
                        {subtitle && <p className="text-xl text-muted-foreground font-medium">{subtitle}</p>}
                    </motion.div>
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-white/5 shadow-2xl liquid-glass h-[600px] group">
                    <div className="absolute inset-0 z-0">
                        <Map
                            ref={setMapInstance}
                            center={mapCenter}
                            zoom={zoomProp}
                            className="h-full w-full"
                            cooperativeGestures={true}
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            theme={theme as any}
                            styles={{
                                light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                                dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
                            }}
                        >
                            {groupedFestivals.map((festivalsInGroup) => {
                                const firstFestival = festivalsInGroup[0];
                                const lat = parseFloat(firstFestival.location!.lat);
                                const lng = parseFloat(firstFestival.location!.lng);
                                
                                return (
                                    <MapMarker 
                                        key={`marker-${firstFestival.id}`}
                                        latitude={lat} 
                                        longitude={lng}
                                    >
                                        <MarkerContent>
                                            <div className="relative group">
                                                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500 animate-pulse" />
                                                <MapPin className="w-8 h-8 text-primary fill-primary/20 relative z-10" />
                                            </div>
                                        </MarkerContent>
                                            <MarkerPopup className="p-3 w-[220px] rounded-3xl border border-white/10 shadow-2xl liquid-glass flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                                {festivalsInGroup.map((festival, index) => (
                                                    <div key={festival.id} className={`flex flex-col gap-3 ${index > 0 ? "pt-3 border-t border-white/10 mt-1" : ""}`}>
                                                        {/* Top Text Section */}
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
                                                                <MapPin size={14} className="text-primary" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-bold text-sm text-foreground leading-tight truncate">{festival.title}</h4>
                                                                <p className="text-[10px] text-foreground/70 truncate">{festival.location?.address.split(',')[0]}</p>
                                                            </div>
                                                        </div>

                                                        {/* Middle Image Section */}
                                                        {festival.image && (
                                                            <div className="relative h-28 w-full rounded-2xl overflow-hidden shrink-0">
                                                                <img 
                                                                    src={festival.image} 
                                                                    alt={festival.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <Badge className="absolute top-2 right-2 bg-background/70 backdrop-blur-md text-foreground text-[8px] font-bold py-0.5 px-2 rounded-full border border-white/10">
                                                                    {festival.category}
                                                                </Badge>
                                                            </div>
                                                        )}

                                                        {/* Bottom Button Section */}
                                                        <div className="flex justify-between items-center mt-0.5">
                                                            <div className="flex-1"></div>
                                                            <Button 
                                                                asChild 
                                                                variant="secondary" 
                                                                size="sm" 
                                                                className="h-8 px-4 text-[11px] font-semibold rounded-full bg-white/10 hover:bg-primary text-foreground hover:text-black border border-white/10 transition-colors"
                                                            >
                                                                <a href={festival.url || '#'}>
                                                                    Explore Vibe
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </MarkerPopup>
                                        </MapMarker>
                                    );
                                })}
                            <MapControls 
                                position="bottom-right" 
                                showLocate 
                                showFullscreen 
                                showCompass
                            />
                        </Map>
                    </div>

                    {/* Search & Interface Overlays */}
                    {showSearch && (
                        <div className="absolute top-6 left-6 right-6 flex flex-col md:flex-row gap-3 z-20 pointer-events-none">
                            <div className="relative flex-1 max-w-md pointer-events-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    className="pl-10 h-11 border-border/20 shadow-xl rounded-2xl text-sm liquid-glass"
                                    placeholder="Search festivals or locations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 pointer-events-auto">
                                <button className="h-11 px-5 border border-border/20 shadow-xl rounded-2xl text-xs font-bold tracking-widest flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-foreground liquid-glass">
                                    <Filter className="w-3.5 h-3.5" />
                                    Filter
                                </button>
                                <button className="h-11 px-5 bg-primary text-primary-foreground shadow-xl shadow-primary/20 rounded-2xl text-xs font-bold tracking-widest hover:scale-105 transition-all duration-300">
                                    Map View
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bottom Info Status */}
                    <AnimatePresence>
                        {isLoading && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-6 left-6 z-20 pointer-events-none"
                            >
                                <div className="border border-border/20 p-4 rounded-2xl shadow-xl flex items-center gap-4 pointer-events-auto liquid-glass">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold leading-none mb-1">Mapping Festivals</p>
                                        <p className="text-[10px] text-muted-foreground font-medium italic">Synchronizing with global vibe radar...</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {description && (
                    <div className="mt-8 max-w-2xl mx-auto text-center">
                        <p className="text-muted-foreground leading-relaxed italic">{description}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FestivalMapBlock;

