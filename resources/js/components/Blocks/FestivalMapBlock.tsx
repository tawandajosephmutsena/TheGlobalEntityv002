import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { FestivalMapBlock as FestivalMapBlockType } from '@/types/page-blocks';

const FestivalMapBlock: React.FC<FestivalMapBlockType['content']> = ({
    title = "Explore the Magic",
    subtitle = "Find festivals and sustainable hubs near you",
    description,
    center = { lat: 20, lng: 0 },
    zoom = 3,
    showSearch = true,
    theme = 'fairy-pirate'
}) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simple loading state simulation for the map
        // In a real implementation, 'center' and 'zoom' would be passed to the map engine
        console.log(`Initializing map at ${center.lat}, ${center.lng} with zoom ${zoom} and theme ${theme}`);
        const timer = setTimeout(() => setIsLoaded(true), 1000);
        return () => clearTimeout(timer);
    }, [center, zoom, theme]);

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
                    {/* Mock Map Background */}
                    <div className={cn(
                        "absolute inset-0 transition-opacity duration-1000 flex items-center justify-center",
                        theme === 'dark' ? "bg-slate-900" : "bg-slate-100",
                        isLoaded ? "opacity-100" : "opacity-0"
                    )}>
                        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,var(--color-primary)_1px,transparent_1px)] bg-[length:40px_40px]" />
                        
                        <div className="relative text-center p-8">
                            <MapPin className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
                            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Interactive Map Engine Initializing...</p>
                        </div>

                        {/* Sample Markers */}
                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.2, type: 'spring' }}
                            className="absolute top-[30%] left-[40%] group/pin"
                        >
                            <div className="relative cursor-pointer">
                                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl group-hover/pin:bg-primary/40 transition-all duration-500 animate-pulse" />
                                <MapPin className="w-8 h-8 text-primary fill-primary/20 relative z-10" />
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 p-2 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-lg shadow-xl opacity-0 group-hover/pin:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover/pin:translate-y-0">
                                    <p className="text-[10px] font-bold text-primary uppercase mb-0.5">Forest Magic</p>
                                    <p className="text-[10px] text-foreground font-medium">Sustainable Gathering</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.4, type: 'spring' }}
                            className="absolute top-[50%] right-[30%] group/pin"
                        >
                            <div className="relative cursor-pointer">
                                <div className="absolute -inset-4 bg-accent/20 rounded-full blur-xl group-hover/pin:bg-accent/40 transition-all duration-500 animate-pulse" />
                                <MapPin className="w-8 h-8 text-accent fill-accent/20 relative z-10" />
                                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 p-2 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-lg shadow-xl opacity-0 group-hover/pin:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover/pin:translate-y-0">
                                    <p className="text-[10px] font-bold text-accent uppercase mb-0.5">Coastal Echo 2026</p>
                                    <p className="text-[10px] text-foreground font-medium">Slow Travel Summit</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Search & Interface Overlays */}
                    {showSearch && (
                        <div className="absolute top-6 left-6 right-6 flex flex-col md:flex-row gap-3 z-20 pointer-events-none">
                            <div className="relative flex-1 max-w-md pointer-events-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input 
                                    className="pl-10 h-11 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-white/20 shadow-xl rounded-2xl text-sm"
                                    placeholder="Search festivals or locations..."
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
                    <div className="absolute bottom-6 left-6 z-20 pointer-events-none">
                        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-4 pointer-events-auto">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-primary to-accent" />
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">+12</div>
                            </div>
                            <div>
                                <p className="text-xs font-bold leading-none mb-1">Active Community</p>
                                <p className="text-[10px] text-muted-foreground font-medium">124 travelers currently exploring</p>
                            </div>
                        </div>
                    </div>
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
