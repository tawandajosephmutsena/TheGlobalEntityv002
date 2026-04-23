"use client";

import React, { useEffect, useState } from 'react';
import { MapPin, ArrowRight, Calendar, Sun, Music, Star, Play, Compass, User } from 'lucide-react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { OptimizedImage } from '@/components/OptimizedImage';
import type { StitchFeaturedFestivalsBlock } from '@/types/page-blocks';

const EMPTY_ARRAY: number[] = [];

interface FestivalData {
    id: number;
    title: string;
    description: string;
    image: string;
    image_conversions?: any;
    date: string;
    locationAddress: string;
    url: string;
    author: {
        name: string;
        avatar: string;
    };
    rating?: number | null;
    review_count?: number;
}

export default function StitchFeaturedFestivalsBlockRenderer(props: StitchFeaturedFestivalsBlock['content']) {
    // Recursively extract the actual content if it's nested
    const extractContent = (data: unknown): unknown => {
        if (data && typeof data === 'object' && 'content' in data && data.content !== null) {
            return extractContent((data as { content: unknown }).content);
        }
        return data;
    };

    const blockContent = extractContent(props) as StitchFeaturedFestivalsBlock['content'];
    
    // Ensure we have at least an empty object
    const finalContent = (blockContent && typeof blockContent === 'object') ? blockContent : {} as StitchFeaturedFestivalsBlock['content'];

    const {
        badge = "Featured Festivals",
        title = "Global Spectacles",
        subtitle = "Curated gatherings where culture, art, and geography collide. From the salt flats of Bolivia to the neon alleys of Tokyo.",
        limit = 6,
        selectedFestivalIds = EMPTY_ARRAY,
        ctaText = "Explore Festival Archive",
        ctaHref = "/festivals",
        ctaLabel = "Ready for the journey?"
    } = finalContent;
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
                }

                const response = await axios.get(url);
                let fetchedFestivals = response.data.data || [];

                // If we selected specific IDs, preserve that order
                if (selectedFestivalIds && selectedFestivalIds.length > 0) {
                    fetchedFestivals = selectedFestivalIds
                        .map((id: number) => fetchedFestivals.find((f: FestivalData) => f.id === id))
                        .filter((f): f is FestivalData => !!f);
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

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto py-24 px-8 theme-stitch">
                <div className="h-8 w-64 bg-muted animate-pulse rounded-lg mb-4" />
                <div className="h-4 w-96 bg-muted animate-pulse rounded-lg mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 bg-muted animate-pulse h-[400px] rounded-lg"></div>
                    <div className="md:col-span-4 bg-muted animate-pulse h-[400px] rounded-lg"></div>
                </div>
            </div>
        );
    }



    // Helper functions to safely extract data
    const getFest = (index: number) => {
        const fest = festivals[index % (festivals.length || 1)];
        return fest || { title: '', description: '', url: '#', image: '', image_conversions: null, locationAddress: '', date: '' };
    };
    
    const defaultAvatars = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCFyzPdyqFBkgZGhUGYrOz8V66ZkOk-SuJLsJH-3uX8beYYkA8v5h-vF9a5hm22bR9UOGbVDOxfjy0Mg9Oycnh1GPVFou2SKklxwpWDgXDQ05h1fC6LfeyX0pw8zz73vIleQc4brXuYrSo8iLjL_cT_2BfmlhMWIxpqw4wLgK7yJq8G3zwwF3cTdVgSwl2AXS8CkU0ho7snAXipIB2SGB6j1TrQodCZips-vAL4smTFj1F4m2iemHPMqXfHt_SaLbZQGFJUjQcLq9My",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCWW5_JYWiRfhQbcqbjOH6_fxA5CKf4BRyi9tNDby6PClSx3IZhjHFpsizleZBUldUIAmyfpeoQY-xrlRRxtNHOPQY-pqU31-XcJ-X92hBgg5YyP1hdk6MVcrIql4ehyI5pzfYMR2AsjxuLwmoa-J6Ee_EwesWUZ0xM708O67Q3zUixLiVPF4QAQVJy_45UKXCgbSq4s9vHNuqPZkToLyj5EyzTXtt-M8zt1Li4N7kvfNIdUnPqlDPuPDq0er1Ec6yrsP2i_I62W9Sg",
    ];

    return (
        <section className="w-full py-12 pb-32 gradient-aurora text-on-surface font-body selection:bg-primary/20 selection:text-on-primary-container theme-stitch relative overflow-hidden bg-transparent">
            <div className="tge-bg-pattern opacity-[0.5] dark:opacity-[0.35]" />
            
            <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-12">
                {/* Hero Section */}
                <div className="mb-20">
                    <div className="theme-gradient-animated text-white px-4 py-1 rounded-full text-xs font-black tracking-tighter mb-4 inline-block shadow-lg">
                        {badge}
                    </div>
                    <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-4">
                        {title.split(' ').map((word: string, i: number) => (
                            <span key={i} className={i === 1 ? 'theme-gradient-text italic' : ''}>{word} </span>
                        ))}
                    </h2>
                    {subtitle && (
                        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl font-medium leading-relaxed italic">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Bento Grid Gallery or Empty State */}
                {festivals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        {/* 1. Immersive Card with Map Pin */}
                        {festivals.length > 0 && (
                            <Link 
                                href={getFest(0).url} 
                                aria-label={`View details for ${getFest(0).title} festival`}
                                className="block md:col-span-8 group relative overflow-hidden rounded-[2.5rem] aspect-video md:aspect-auto md:h-[500px] liquid-glass shadow-sea-mist"
                            >
                                <OptimizedImage 
                                    className="w-full h-full" 
                                    src={getFest(0).image} 
                                    conversions={getFest(0).image_conversions}
                                    alt=""
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
                                <div className="absolute top-8 left-8">
                                    <div className="theme-gradient-animated text-white px-4 py-1 rounded-full text-xs font-black tracking-tighter mb-4 inline-block shadow-lg">Featured</div>
                                    <h3 className="font-display text-4xl lg:text-5xl font-black text-on-surface mb-2 tracking-tighter">{getFest(0).title}</h3>
                                </div>
                                <div className="absolute bottom-12 left-8 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center text-on-surface animate-float group-hover:bg-primary group-hover:text-on-primary transition-colors duration-500">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-on-surface font-black tracking-tighter">{getFest(0).locationAddress}</p>
                                        <p className="text-on-surface-variant text-sm font-medium italic">{getFest(0).date}</p>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* 2. Glass-morphic Info Overlay */}
                        {festivals.length > 1 && (
                            <Link 
                                href={getFest(1).url} 
                                aria-label={`View details for ${getFest(1).title} festival`}
                                className="block md:col-span-4 group relative overflow-hidden rounded-[2.5rem] aspect-square liquid-glass shadow-sea-mist"
                            >
                                <OptimizedImage 
                                    className="w-full h-full grayscale group-hover:grayscale-0" 
                                    src={getFest(1).image} 
                                    conversions={getFest(1).image_conversions}
                                    alt=""
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute inset-0 flex items-end p-6">
                                    <div className="bg-surface/70 dark:bg-surface-container-high/70 backdrop-blur-xl w-full p-8 rounded-3xl border border-primary/10 shadow-2xl transform transition-transform duration-500 group-hover:-translate-y-2 text-on-surface">
                                        <h3 className="font-display text-2xl lg:text-3xl font-black mb-3 leading-none tracking-tighter">{getFest(1).title}</h3>
                                        <p className="text-on-surface-variant text-sm mb-6 line-clamp-2 font-medium italic">{getFest(1).description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-primary font-black text-[10px] tracking-tighter">Cultural Voyage</span>
                                            <div className="bg-primary text-on-primary p-3 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* 3. Minimalist Date/Location Card (Now with Image) */}
                        {festivals.length > 2 && (
                            <Link 
                                href={getFest(2).url} 
                                aria-label={`View details for ${getFest(2).title} festival`}
                                className="block md:col-span-4 group relative overflow-hidden rounded-[2.5rem] h-[400px] liquid-glass transition-all duration-700 shadow-sea-mist"
                            >
                                <OptimizedImage 
                                    className="absolute inset-0 w-full h-full grayscale opacity-20 group-hover:opacity-40 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                                    src={getFest(2).image} 
                                    conversions={getFest(2).image_conversions}
                                    alt=""
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="p-10 h-full flex flex-col justify-between relative z-10 bg-gradient-to-b from-surface/40 to-surface/80">
                                    <div>
                                        <div className="flex justify-between items-start mb-8">
                                            <span className="text-6xl font-black text-primary/20 font-display group-hover:text-primary transition-colors duration-700">03</span>
                                            <Calendar className="text-secondary w-8 h-8 group-hover:rotate-12 transition-transform duration-500 border-2 border-primary/10 bg-surface/50 p-1.5 rounded-xl backdrop-blur-md" />
                                        </div>
                                        <h3 className="font-display text-3xl font-black text-on-surface leading-[0.9] mb-4 group-hover:text-primary transition-colors duration-500 tracking-tighter">{getFest(2).title}</h3>
                                        <p className="text-on-surface-variant font-medium italic bg-surface/30 backdrop-blur-sm px-3 py-1 rounded-lg inline-block border border-primary/5">{getFest(2).locationAddress}</p>
                                    </div>
                                    <div className="border-t border-primary/10 pt-6">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-on-surface tracking-tighter">
                                            <span>{getFest(2).date}</span>
                                            <span className="w-8 h-px bg-primary/20"></span>
                                            <span>Dispatch</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -right-12 -bottom-12 opacity-[0.03] pointer-events-none group-hover:opacity-10 group-hover:rotate-12 transition-all duration-1000">
                                    <Sun className="w-[300px] h-[300px] fill-current" />
                                </div>
                            </Link>
                        )}

                        {/* 4. Full-bleed Interactive Card (Carousel Style) */}
                        {festivals.length > 3 && (
                            <Link 
                                href={getFest(3).url} 
                                aria-label={`Read story about ${getFest(3).title}`}
                                className="block md:col-span-8 group relative overflow-hidden rounded-[2.5rem] h-[400px] shadow-sea-mist"
                            >
                                <OptimizedImage 
                                    className="w-full h-full grayscale group-hover:grayscale-0" 
                                    src={getFest(3).image} 
                                    conversions={getFest(3).image_conversions}
                                    alt=""
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                />
                                <div className="absolute inset-0 bg-background/40 mix-blend-multiply transition-all duration-700 group-hover:bg-transparent"></div>
                                <div className="absolute inset-0 p-12 flex flex-col justify-end bg-gradient-to-t from-background/80 via-transparent to-transparent">
                                    <div className="max-w-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                                        <span className="text-on-surface text-[10px] font-black tracking-tighter mb-3 block opacity-70">Journal Entry</span>
                                        <h3 className="font-display text-5xl md:text-6xl font-black text-on-surface mb-6 tracking-tighter leading-[0.85] italic-not-really">{getFest(3).title}</h3>
                                        <div className="flex items-center gap-6">
                                            <div className="theme-gradient-animated text-white px-8 py-4 rounded-full font-black text-xs tracking-tighter hover:scale-105 transition-all duration-500 shadow-xl theme-gradient-glow">
                                                Read Story
                                            </div>
                                            <div className="flex -space-x-3 items-center">
                                                <div className="w-10 h-10 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-primary">
                                                    <User className="size-5" />
                                                </div>
                                                <div className="min-w-10 h-10 px-2 rounded-full border-2 border-background bg-surface text-[10px] text-on-surface flex items-center justify-center font-black">
                                                    +{getFest(3).review_count || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* 5. Dynamic Grid Tile with Hover Details */}
                        {festivals.length > 4 && (
                            <div className="md:col-span-6 group relative overflow-hidden rounded-[2.5rem] aspect-[4/3] liquid-glass shadow-sea-mist">
                                <OptimizedImage 
                                    className="w-full h-full grayscale group-hover:grayscale-0" 
                                    src={getFest(4).image} 
                                    conversions={getFest(4).image_conversions}
                                    alt=""
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-surface/90 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center p-12 backdrop-blur-xl">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
                                            <Music size={32} />
                                        </div>
                                        <h4 className="text-on-surface font-display text-4xl font-black mb-4 tracking-tighter leading-none">{getFest(4).title}</h4>
                                        <p className="text-on-surface-variant text-base mb-8 max-w-xs mx-auto leading-relaxed font-medium italic line-clamp-3">
                                            {getFest(4).description}
                                        </p>
                                        <Link href={getFest(4).url} className="inline-block border-2 border-primary text-primary px-10 py-3 rounded-full font-black text-xs tracking-tighter hover:bg-primary hover:text-on-primary transition-all duration-500">
                                            Voyage Details
                                        </Link>
                                    </div>
                                </div>
                                <div className="absolute top-8 right-8 bg-surface/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-primary/10">
                                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                                    <span className="text-xs font-black text-on-surface tracking-tighter">
                                        {getFest(4).rating ? `${getFest(4).rating} / 5` : 'New'}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 6. Video-Style Motion Card */}
                        {festivals.length > 5 && (
                            <Link href={getFest(5).url} className="block md:col-span-6 group relative overflow-hidden rounded-[2.5rem] aspect-[4/3] liquid-glass shadow-sea-mist">
                                <div className="absolute inset-0 animate-pulse opacity-50 bg-[var(--theme-gradient-subtle)]"></div>
                                <OptimizedImage 
                                    className="w-full h-full mix-blend-overlay grayscale group-hover:grayscale-0" 
                                    src={getFest(5).image} 
                                    conversions={getFest(5).image_conversions}
                                    alt={getFest(5).title} 
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 bg-background/20 backdrop-blur-[2px] transition-all duration-700 group-hover:backdrop-blur-none">
                                    <div className="w-24 h-24 rounded-full border-4 border-primary/20 flex items-center justify-center mb-8 bg-surface/30 backdrop-blur-xl group-hover:bg-primary group-hover:border-primary transition-all duration-700 shadow-2xl">
                                        <Play className="w-12 h-12 text-primary group-hover:text-on-primary fill-current transition-colors" />
                                    </div>
                                    <h4 className="font-display text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 leading-[0.85]">{getFest(5).title}</h4>
                                    <p className="text-on-surface-variant font-black text-[10px] tracking-tighter opacity-70">Live from {(getFest(5).locationAddress || '').split(',').pop()}</p>
                                </div>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-40 liquid-glass rounded-[3rem] border-2 border-primary/10 border-dashed backdrop-blur-sm relative overflow-hidden max-w-4xl mx-auto shadow-sea-mist">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                        <Compass className="w-20 h-20 text-primary/20 mx-auto mb-8 animate-spin-slow" />
                        <p className="font-display text-3xl md:text-4xl font-black text-on-surface-variant mb-4 italic tracking-tighter leading-none">No spectacles on the horizon.</p>
                        <p className="text-on-surface-variant font-medium max-w-md mx-auto leading-relaxed">The cultural map is waiting for its next great gathering. Check back as new voyages are charted.</p>
                    </div>
                )}

                {/* Bottom CTA Section */}
                {(ctaText || ctaLabel) && (
                    <div className="mt-24 text-center">
                        {ctaLabel && (
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 mb-6">
                                {ctaLabel}
                            </p>
                        )}
                        {ctaText && (
                            <Link 
                                href={ctaHref || '#'}
                                className="inline-flex items-center gap-4 bg-on-surface text-surface px-12 py-5 rounded-full font-black text-xs tracking-tighter hover:scale-105 transition-all duration-500 shadow-2xl group"
                            >
                                <span>{ctaText}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

