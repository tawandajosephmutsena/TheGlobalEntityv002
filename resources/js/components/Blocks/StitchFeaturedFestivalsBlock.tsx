"use client";

import React, { useEffect, useState } from 'react';
import { MapPin, ArrowRight, Calendar, Sun, Music, Star, Play } from 'lucide-react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import type { StitchFeaturedFestivalsBlock } from '@/types/page-blocks';

const EMPTY_ARRAY: number[] = [];

interface FestivalData {
    id: number;
    title: string;
    description: string;
    image: string;
    date: string;
    locationAddress: string;
    url: string;
    activities: string[];
    author: {
        name: string;
        avatar: string;
    };
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
        title = "Global Spectacles",
        subtitle = "Curated gatherings where culture, art, and geography collide. From the salt flats of Bolivia to the neon alleys of Tokyo.",
        limit = 6,
        selectedFestivalIds = EMPTY_ARRAY
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
        return fest || { title: '', description: '', url: '#', image: '', locationAddress: '', date: '' };
    };
    
    // For rendering avatars
    const defaultAvatars = [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCFyzPdyqFBkgZGhUGYrOz8V66ZkOk-SuJLsJH-3uX8beYYkA8v5h-vF9a5hm22bR9UOGbVDOxfjy0Mg9Oycnh1GPVFou2SKklxwpWDgXDQ05h1fC6LfeyX0pw8zz73vIleQc4brXuYrSo8iLjL_cT_2BfmlhMWIxpqw4wLgK7yJq8G3zwwF3cTdVgSwl2AXS8CkU0ho7snAXipIB2SGB6j1TrQodCZips-vAL4smTFj1F4m2iemHPMqXfHt_SaLbZQGFJUjQcLq9My",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCWW5_JYWiRfhQbcqbjOH6_fxA5CKf4BRyi9tNDby6PClSx3IZhjHFpsizleZBUldUIAmyfpeoQY-xrlRRxtNHOPQY-pqU31-XcJ-X92hBgg5YyP1hdk6MVcrIql4ehyI5pzfYMR2AsjxuLwmoa-J6Ee_EwesWUZ0xM708O67Q3zUixLiVPF4QAQVJy_45UKXCgbSq4s9vHNuqPZkToLyj5EyzTXtt-M8zt1Li4N7kvfNIdUnPqlDPuPDq0er1Ec6yrsP2i_I62W9Sg",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC09aG3hfcpxNzPh0YZBZZnrADxag3d-4tTInbm5dSf2g6RpSwHPNnlJT0PmloLubQyBjN5MhE23h3EgPbzCgzjt6Cz4-DnB7sR95lUgGgSm3vy9mnSipseY6XT-SgggCodZD0Mx575SjdTUzaBdYY6Hr1ZMue_JX6x7fFSbrvf8LL5hBJJNejnXzwMT7jvRjD_fKV8kG5MaDjsCn4_IKL0yaa_3erdFVEHd7yFphrJ1X4Q4uokgVFQ-8S4AmdSeH0Ud9nooWCwebrf"
    ];

    return (
        <section className="max-w-screen-2xl mx-auto px-6 md:px-12 py-12 pb-32 bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container theme-stitch">
            {/* Hero Section */}
            <div className="mb-20">
                <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-4">
                    {title.split(' ').map((word: string, i: number) => (
                        <span key={i} className={i === 1 ? 'text-primary italic' : ''}>{word} </span>
                    ))}
                </h2>
                {subtitle && (
                    <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl font-medium leading-relaxed">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Bento Grid Gallery or Empty State */}
            {festivals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* 1. Immersive Card with Map Pin */}
                    {festivals.length > 0 && (
                        <Link href={getFest(0).url} className="block md:col-span-8 group relative overflow-hidden rounded-[2rem] aspect-video md:aspect-auto md:h-[500px] bg-surface-container-low">
                            <img 
                                alt={getFest(0).title} 
                                src={getFest(0).image} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>
                            <div className="absolute top-8 left-8">
                                <div className="bg-primary px-4 py-1 rounded-full text-white text-xs font-bold tracking-widest uppercase mb-4 inline-block">Featured</div>
                                <h3 className="font-display text-4xl font-bold text-white mb-2">{getFest(0).title}</h3>
                            </div>
                            <div className="absolute bottom-12 left-8 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white animate-float group-hover:bg-primary transition-colors">
                                    <MapPin className="w-6 h-6 fill-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{getFest(0).locationAddress}</p>
                                    <p className="text-white/70 text-sm font-body">{getFest(0).date}</p>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* 2. Glass-morphic Info Overlay */}
                    {festivals.length > 1 && (
                        <Link href={getFest(1).url} className="block md:col-span-4 group relative overflow-hidden rounded-[2rem] aspect-square bg-surface-container-low">
                            <img 
                                alt={getFest(1).title} 
                                src={getFest(1).image} 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 flex items-end p-6">
                                <div className="bg-surface/70 dark:bg-surface-container-high/70 backdrop-blur-xl w-full p-6 rounded-2xl border border-white/20 dark:border-outline-variant/20 shadow-xl transform transition-transform duration-500 group-hover:-translate-y-2 text-on-surface">
                                    <h3 className="font-display text-2xl font-bold mb-2">{getFest(1).title}</h3>
                                    <p className="text-on-surface-variant text-sm mb-4 line-clamp-2 font-body">{getFest(1).description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary font-bold text-xs uppercase tracking-widest">Cultural Event</span>
                                        <div className="bg-primary text-on-primary p-2 rounded-full flex items-center justify-center group-hover:bg-primary-dim transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* 3. Minimalist Date/Location Card */}
                    {festivals.length > 2 && (
                        <Link href={getFest(2).url} className="block md:col-span-4 group relative overflow-hidden rounded-[2rem] h-[400px] bg-surface-container-lowest transition-colors hover:bg-surface-container-low border-none">
                            <div className="p-8 h-full flex flex-col justify-between relative z-10">
                                <div>
                                    <div className="flex justify-between items-start mb-8">
                                        <span className="text-5xl font-black text-primary/10 font-display group-hover:text-primary/20 transition-colors">03</span>
                                        <Calendar className="text-secondary w-8 h-8 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <h3 className="font-display text-3xl font-bold text-on-surface leading-tight mb-4 group-hover:text-primary transition-colors">{getFest(2).title}</h3>
                                    <p className="text-on-surface-variant font-medium font-body">{getFest(2).locationAddress}</p>
                                </div>
                                <div className="border-t border-outline-variant/10 pt-6">
                                    <div className="flex items-center gap-2 text-sm font-bold text-on-surface uppercase tracking-widest font-body">
                                        <span>{getFest(2).date}</span>
                                        <span className="w-8 h-px bg-outline-variant/20"></span>
                                        <span>Event</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none group-hover:opacity-10 group-hover:rotate-12 transition-all duration-700">
                                <Sun className="w-[200px] h-[200px] fill-current" />
                            </div>
                        </Link>
                    )}

                    {/* 4. Full-bleed Interactive Card (Carousel Style) */}
                    {festivals.length > 3 && (
                        <Link href={getFest(3).url} className="block md:col-span-8 group relative overflow-hidden rounded-[2rem] h-[400px]">
                            <img 
                                alt={getFest(3).title} 
                                src={getFest(3).image} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                            />
                            <div className="absolute inset-0 bg-secondary/20 mix-blend-multiply group-hover:bg-transparent transition-all"></div>
                            <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                <div className="max-w-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-white text-xs font-bold tracking-widest uppercase mb-2 block font-body">Immersive</span>
                                    <h3 className="font-display text-5xl font-black text-white mb-4">{getFest(3).title}</h3>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary text-white px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                                            Experience It
                                        </div>
                                        <div className="flex -space-x-3">
                                            {defaultAvatars.map((src, i) => (
                                                <img key={i} className="w-8 h-8 rounded-full border-2 border-white" src={src} alt="Attendee" />
                                            ))}
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-on-surface text-[10px] text-white flex items-center justify-center font-bold">
                                                +2k
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}

                    {/* 5. Dynamic Grid Tile with Hover Details */}
                    {festivals.length > 4 && (
                        <div className="md:col-span-6 group relative overflow-hidden rounded-[2rem] aspect-[4/3] bg-surface-container-low border-none">
                            <img 
                                alt={getFest(4).title} 
                                src={getFest(4).image} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                            />
                            <div className="absolute inset-0 bg-on-surface/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-8 backdrop-blur-md">
                                <div className="text-center">
                                    <Music className="text-white w-12 h-12 mx-auto mb-4" />
                                    <h4 className="text-white font-display text-3xl font-bold mb-2">{getFest(4).title}</h4>
                                    <p className="text-white/80 text-sm mb-6 max-w-xs mx-auto leading-relaxed line-clamp-3 font-body">
                                        {getFest(4).description}
                                    </p>
                                    <Link href={getFest(4).url} className="inline-block border-2 border-white text-white px-8 py-2 rounded-full font-bold hover:bg-white hover:text-on-surface transition-all font-body">
                                        Details
                                    </Link>
                                </div>
                            </div>
                            <div className="absolute top-6 right-6 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <Star className="w-3 h-3 text-secondary fill-secondary" />
                                <span className="text-[10px] font-bold text-on-surface">4.9</span>
                            </div>
                        </div>
                    )}

                    {/* 6. Video-Style Motion Card */}
                    {festivals.length > 5 && (
                        <Link href={getFest(5).url} className="block md:col-span-6 group relative overflow-hidden rounded-[2rem] aspect-[4/3] bg-surface-container-low border-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-tertiary/30 animate-pulse opacity-50"></div>
                            <img 
                                alt={getFest(5).title} 
                                src={getFest(5).image} 
                                className="w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-1000" 
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-20 h-20 rounded-full border-4 border-white/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform cursor-pointer bg-white/10 backdrop-blur-sm group-hover:bg-primary group-hover:border-primary">
                                    <Play className="w-10 h-10 text-white fill-white" />
                                </div>
                                <h4 className="font-display text-4xl font-black text-white uppercase tracking-tighter mb-2">{getFest(5).title}</h4>
                                <p className="text-white/90 font-bold text-sm tracking-widest font-body">LIVE FROM {(getFest(5).locationAddress || '').split(',').pop()?.toUpperCase()}</p>
                            </div>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="text-center py-24 bg-surface-container-low rounded-3xl border border-outline-variant/30 border-dashed backdrop-blur-sm">
                    <p className="font-headline text-2xl md:text-3xl font-bold text-on-surface-variant mb-4 italic">No spectacles on the horizon.</p>
                    <p className="text-on-surface-variant font-medium">Gatherings will appear here when added to the cultural map.</p>
                </div>
            )}
        </section>
    );
}
