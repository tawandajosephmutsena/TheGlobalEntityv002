"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Calendar, MapPin, Ticket, Sparkles, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import type { FeaturedFestivalsBlock } from '@/types/page-blocks';

const EMPTY_ARRAY: number[] = [];

interface FestivalData {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    date: string;
    locationAddress: string;
    url: string;
    activities: string[];
    social_tags: string[];
    gallery: string[];
    author: {
        name: string;
        avatar: string;
    };
}

export default function FeaturedFestivalsBlockRenderer({
    title = "Featured Festivals",
    subtitle = "Magical gatherings for the conscious traveler",
    limit = 6,
    showViewAll = true,
    ctaText = "Join the Magic",
    selectedFestivalIds = EMPTY_ARRAY
}: FeaturedFestivalsBlock['content']) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const x = useMotionValue(0);
    const [festivals, setFestivals] = useState<FestivalData[]>([]);
    const [loading, setLoading] = useState(true);

    const memoizedIds = React.useMemo(() => JSON.stringify(selectedFestivalIds), [selectedFestivalIds]);

    useEffect(() => {
        const fetchFestivals = async () => {
            try {
                setLoading(true);
                let url = `/api/collections/festivals?limit=${limit}`;
                
                const currentIds = JSON.parse(memoizedIds);
                if (currentIds && currentIds.length > 0) {
                    url += `&ids=${currentIds.join(',')}`;
                } else {
                    // Fetch all festivals if no IDs provided
                }

                const response = await axios.get(url);
                let fetchedFestivals = response.data.data || [];

                // If we selected specific IDs, preserve that order
                if (selectedFestivalIds && selectedFestivalIds.length > 0) {
                    fetchedFestivals = selectedFestivalIds
                        .map((id: number) => fetchedFestivals.find((f: FestivalData) => f.id === id))
                        .filter((f: FestivalData | undefined): f is FestivalData => !!f);
                }

                setFestivals(fetchedFestivals);
            } catch (error) {
                console.error("Failed to fetch featured festivals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFestivals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, memoizedIds]);

    useEffect(() => {
        if (festivals.length > 0 && containerRef.current) {
            const updateWidth = () => {
                if (containerRef.current) {
                    setWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth);
                }
            };
            updateWidth();
            window.addEventListener('resize', updateWidth);
            return () => window.removeEventListener('resize', updateWidth);
        }
    }, [festivals]);

    const scrollTo = (direction: 'left' | 'right') => {
        const currentX = x.get();
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const scrollAmount = containerWidth * 0.8;
        let newX = direction === 'left' ? currentX + scrollAmount : currentX - scrollAmount;
        newX = Math.max(Math.min(newX, 0), -width);

        animate(x, newX, {
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 1,
        });
    };

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto py-24 px-8">
                <div className="h-8 w-64 bg-muted animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-muted animate-pulse rounded-lg mb-12" />
                <div className="flex gap-6 overflow-hidden">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="min-w-[400px] h-[500px] bg-muted animate-pulse rounded-[2.5rem]" />
                    ))}
                </div>
            </div>
        );
    }

    if (festivals.length === 0) return null;

    return (
        <section className="py-24 overflow-visible relative">
            <div className="max-w-7xl mx-auto px-8 relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-display font-black text-foreground mb-4 tracking-tighter [font-variant-caps:small-caps]"
                        >
                            {title}
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-muted-foreground max-w-2xl"
                        >
                            {subtitle}
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-4">
                        {showViewAll && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/40 group"
                                asChild
                            >
                                <Link href="/festivals">
                                    <span>View All</span>
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        )}
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => scrollTo('left')}
                                className="rounded-full border-border bg-secondary/5 text-foreground hover:bg-secondary/10 hover:border-border/20"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => scrollTo('right')}
                                className="rounded-full border-border bg-secondary/5 text-foreground hover:bg-secondary/10 hover:border-border/20"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                <motion.div
                    ref={containerRef}
                    className="cursor-grab active:cursor-grabbing"
                    whileTap={{ cursor: "grabbing" }}
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        dragElastic={0.1}
                        style={{ x }}
                        className="flex gap-4"
                    >
                        {festivals.map((festival) => (
                            <motion.div
                                key={festival.id}
                                className="min-w-[280px] md:min-w-[300px] group"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                <Link 
                                    href={festival.url}
                                    className="relative aspect-[3/4] rounded-[2rem] overflow-hidden liquid-glass border border-border/10 shadow-2xl transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-primary/10 block"
                                >
                                    <img 
                                        src={festival.image} 
                                        alt={festival.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-70 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                    
                                    {/* Top Content Overlay */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
                                        <Badge className="bg-primary/20 hover:bg-primary/30 text-primary backdrop-blur-md border border-primary/20 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest [font-variant-caps:small-caps]">
                                            {festival.category}
                                        </Badge>
                                        <div className="w-8 h-8 rounded-full bg-secondary/10 backdrop-blur-md flex items-center justify-center border border-border/10 text-muted-foreground group-hover:text-primary transition-colors">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                    </div>

                                    {/* Info Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-5 pt-12 bg-gradient-to-t from-background to-transparent">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20">
                                                <img src={festival.author.avatar} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[9px] font-black tracking-widest text-primary/80 [font-variant-caps:small-caps]">{festival.author.name}</span>
                                        </div>
                                        <h3 className="text-xl font-display font-black text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors leading-tight tracking-tighter [font-variant-caps:small-caps]">
                                            {festival.title}
                                        </h3>
                                        
                                        <div className="space-y-1.5 mb-4 opacity-80">
                                            <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                                {festival.date}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80">
                                                <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                                                <span className="line-clamp-1">{festival.locationAddress}</span>
                                            </div>
                                        </div>

                                        {/* Activities Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-5 overflow-hidden h-5">
                                            {festival.activities.slice(0, 2).map((activity, idx) => (
                                                <span key={idx} className="text-[9px] font-black tracking-wide text-muted-foreground bg-secondary/10 border border-border/10 px-1.5 py-0.5 rounded [font-variant-caps:small-caps]">
                                                    {activity}
                                                </span>
                                            ))}
                                            {festival.activities.length > 2 && (
                                                <span className="text-[9px] text-slate-500 flex items-center">+{festival.activities.length - 2}</span>
                                            )}
                                        </div>

                                        <Button className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-[11px] font-black tracking-widest transition-all shadow-lg shadow-primary/10 border-none [font-variant-caps:small-caps]">
                                            < Ticket className="w-3.5 h-3.5 mr-2" />
                                            {ctaText}
                                        </Button>
                                    </div>

                                    {/* Hover Details Shadow Card (Optional/Experimental) */}
                                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
