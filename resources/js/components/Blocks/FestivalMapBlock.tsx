import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Filter, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Map, MapMarker, MapControls, MarkerContent, MarkerPopup } from '@/components/ui/map';
import { cn } from '@/lib/utils';
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
    title = "Explore the Magic",
    subtitle = "Find festivals and sustainable hubs near you",
    description,
    center: centerProp = { lat: 20, lng: 0 },
    zoom: zoomProp = 3,
    showSearch = true,
    theme = 'fairy-pirate',
    limit = 50
}) => {
    const [festivals, setFestivals] = useState<FestivalData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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

    return (
        <section className={cn(
            "py-24 relative overflow-hidden",
            theme === 'dark' ? "bg-slate-950 text-white" : "bg-background"
        )}>
            {/* Aesthetic background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] opacity-50" />
                <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] opacity-50" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <Badge variant="outline" className="mb-4 font-mono uppercase tracking-widest text-primary border-primary/20 bg-primary/5">
                            Festival Radar
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-display mb-6 tracking-tight">
                            {title}
                        </h2>
                        {subtitle && <p className="text-xl text-muted-foreground font-medium">{subtitle}</p>}
                    </motion.div>
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-primary/10 shadow-2xl bg-white/5 backdrop-blur-sm h-[600px] group">
                    <div className="absolute inset-0 z-0">
                        <Map
                            center={mapCenter}
                            zoom={zoomProp}
                            className="h-full w-full"
                            theme={theme === 'dark' ? 'dark' : 'light'}
                            cooperativeGestures={true}
                        >
                            {filteredFestivals.map((festival) => {
                                const lat = parseFloat(festival.location!.lat);
                                const lng = parseFloat(festival.location!.lng);
                                
                                return (
                                    <MapMarker 
                                        key={festival.id}
                                        latitude={lat} 
                                        longitude={lng}
                                    >
                                        <MarkerContent>
                                            <div className="relative group/marker">
                                                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover/marker:bg-primary/40 transition-all duration-500 animate-pulse" />
                                                <div className="relative z-10 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-lg transform group-hover/marker:scale-110 transition-transform duration-300">
                                                    <MapPin className="w-4 h-4 text-primary fill-primary/20" />
                                                </div>
                                            </div>
                                        </MarkerContent>
                                        <MarkerPopup className="p-0 overflow-hidden min-w-[200px] rounded-2xl border-none shadow-2xl">
                                            <div className="relative h-24 w-full">
                                                <img 
                                                    src={festival.image} 
                                                    alt={festival.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                                <Badge className="absolute top-2 right-2 bg-primary text-black text-[8px] uppercase font-bold py-0.5 px-1.5">
                                                    {festival.category}
                                                </Badge>
                                            </div>
                                            <div className="p-3 bg-card">
                                                <h4 className="font-bold text-sm text-foreground mb-1 leading-tight">{festival.title}</h4>
                                                <p className="text-[10px] text-muted-foreground mb-3 flex items-center gap-1">
                                                    <MapPin size={10} />
                                                    {festival.location?.address.split(',')[0]}
                                                </p>
                                                <Button 
                                                    asChild 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    className="w-full h-8 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-colors"
                                                >
                                                    <a href={festival.url}>
                                                        Explore Vibe
                                                        <ExternalLink size={10} className="ml-1.5" />
                                                    </a>
                                                </Button>
                                            </div>
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
                                    className="pl-10 h-11 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-white/20 shadow-xl rounded-2xl text-sm"
                                    placeholder="Search festivals or locations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2 pointer-events-auto">
                                <button className="h-11 px-5 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all duration-300">
                                    <Filter className="w-3.5 h-3.5" />
                                    Filter
                                </button>
                                <button className="h-11 px-5 bg-primary text-white shadow-xl shadow-primary/20 rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all duration-300">
                                    Map View
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bottom Info Status */}
                    <AnimatePresence>
                        {isLoading ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-6 left-6 z-20 pointer-events-none"
                            >
                                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-4 pointer-events-auto">
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
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-6 left-6 z-20 pointer-events-none"
                            >
                                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-4 pointer-events-auto">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">+{festivals.length > 3 ? festivals.length - 3 : 0}</div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold leading-none mb-1">Active Community</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">{festivals.length * 12 + 4} travelers currently exploring</p>
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

