"use client";

import React, { useEffect, useState } from 'react';
import { 
    Play, 
    PlayCircle, 
    Library, 
    History, 
    Waves, 
    Mountain, 
    Trees, 
    SkipBack, 
    SkipForward, 
    ArrowRight,
    CircleDashed,
    Volume2
} from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import type { StitchPodcastBlock } from '@/types/page-blocks';
import AnimatedSection from '@/components/AnimatedSection';
import { cn } from '@/lib/utils';

interface PodcastData {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    audio_url?: string;
    duration?: string;
    author: {
        name: string;
        avatar: string;
    };
    created_at?: string;
}

/**
 * High-fidelity Waveform Visualizer
 */
const ModernWaveform = ({ count = 40, active = true }: { count?: number; active?: boolean }) => {
    // Generate stable random-looking heights based on index to satisfy React purity rules
    const generateHeight = (i: number, step: number) => {
        const seed = (i * 1.5 + step) % 1;
        return 10 + seed * 70;
    };

    return (
        <div className="flex items-end gap-[2px] h-full w-full px-4 transform-gpu">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    className="flex-1 bg-primary/40 rounded-full"
                    animate={active ? {
                        height: [
                            `${generateHeight(i, 0)}%`, 
                            `${generateHeight(i, 0.5)}%`, 
                            `${generateHeight(i, 0)}%`
                        ]
                    } : { height: '15%' }}
                    transition={{
                        duration: 1 + (i % 5) * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.02
                    }}
                />
            ))}
        </div>
    );
};

export default function StitchPodcastBlockRenderer(props: StitchPodcastBlock['content']) {
    const extractContent = (data: unknown): any => {
        if (data && typeof data === 'object' && 'content' in data && data.content !== null) {
            return extractContent((data as any).content);
        }
        return data;
    };

    const blockContent = extractContent(props);
    const finalContent = (blockContent && typeof blockContent === 'object') ? blockContent : {};

    const {
        title = "Voices of the Wild.",
        subtitle = "Immersive audio journeys through the forgotten trails and vibrant subcultures of the modern cartographer's world.",
        limit = 6,
        card1BgColor,
        card1Shadow,
        card5BgColor,
        card5Shadow
    } = finalContent;

    const [podcasts, setPodcasts] = useState<PodcastData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/collections/podcasts?featured=1&limit=${limit}`).catch(() => ({ data: { data: [] } }));
                if (response.data?.data?.length > 0) {
                    const mappedPodcasts = response.data.data.map((p: Record<string, any>) => ({
                        id: p.id,
                        title: p.title,
                        description: p.description,
                        category: p.category?.name || 'Podcast',
                        image: p.thumbnail_url || p.image || '',
                        audio_url: p.url || p.audio_url,
                        duration: p.duration,
                        author: {
                            name: p.author?.name || 'Unknown',
                            avatar: p.author?.avatar || ''
                        },
                        created_at: p.published_at || p.created_at
                    }));
                    setPodcasts(mappedPodcasts);
                }
            } catch (error) {
                console.error("Failed to fetch podcasts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPodcasts();
    }, [limit]);

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto py-24 px-8 theme-stitch">
                <div className="h-12 w-96 bg-surface-container animate-pulse rounded-2xl mb-4" />
                <div className="h-6 w-1/2 bg-surface-container animate-pulse rounded-xl mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-8 bg-surface-container animate-pulse h-[450px] rounded-3xl" />
                    <div className="md:col-span-4 bg-surface-container animate-pulse h-[450px] rounded-3xl" />
                </div>
            </div>
        );
    }

    const getPod = (index: number) => podcasts[index % podcasts.length];

    return (
        <section className="relative overflow-hidden bg-surface text-on-surface py-24 md:py-32 theme-stitch selection:bg-primary/20">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="container mx-auto px-6 relative z-10">
                {/* Header Section */}
                <header className="mb-20 max-w-4xl">
                    <AnimatedSection animation="fade-up" textReveal>
                        <h2 className="font-display text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
                            {title.split(' ').map((word: string, i: number, arr: string[]) => (
                                <span key={i} className={cn(
                                    "inline-block",
                                    i === arr.length - 1 && "text-primary italic font-serif font-light"
                                )}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h2>
                    </AnimatedSection>
                    
                    <AnimatedSection animation="fade-up" delay={200}>
                        <p className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-2xl border-l-4 border-primary/20 pl-8">
                            {subtitle}
                        </p>
                    </AnimatedSection>
                </header>

                {podcasts.length > 0 ? (
                    <div className="asymmetric-grid-container gap-8">
                        {/* FEATURED: The High-Fidelity Waveform Card */}
                        <AnimatedSection animation="scale" className="md:col-span-8">
                            <div 
                                className={cn(
                                    "group relative h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-primary/10 border border-outline-variant/30",
                                    card1Shadow && "shadow-shadow"
                                )}
                                style={{ backgroundColor: card1BgColor || 'var(--surface-container-low)' }}
                            >
                                {/* Layered Background Visualizer */}
                                <div className="absolute inset-0 z-0">
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 opacity-40 mix-blend-overlay">
                                        <ModernWaveform count={60} />
                                    </div>
                                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Volume2 className="w-64 h-64 text-primary" />
                                    </div>
                                </div>

                                <div className="absolute inset-0 p-12 flex flex-col justify-between z-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-6">
                                                <span className="bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                                                    Editor's Choice
                                                </span>
                                                <span className="flex items-center gap-1.5 text-on-surface-variant text-xs font-bold">
                                                    <CircleDashed className="w-3 h-3 animate-spin-slow" />
                                                    04:20 Remaining
                                                </span>
                                            </div>
                                            <h3 className="font-display text-5xl md:text-6xl font-black mb-4 leading-tight group-hover:translate-x-2 transition-transform duration-500">
                                                {getPod(0).title}
                                            </h3>
                                            <p className="text-lg text-on-surface-variant max-w-md line-clamp-2 font-medium opacity-80">
                                                {getPod(0).description}
                                            </p>
                                        </div>
                                        
                                        <div className="hidden md:flex flex-col items-end gap-2">
                                            <div className="w-16 h-1 bg-primary/20 rounded-full overflow-hidden">
                                                <motion.div 
                                                    className="h-full bg-primary" 
                                                    animate={{ width: ['20%', '90%', '20%'] }}
                                                    transition={{ duration: 10, repeat: Infinity }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-black tracking-widest uppercase opacity-40">SIGNAL STRENGTH</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <motion.a 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                            href={getPod(0).audio_url}
                                            target="_blank"
                                            className="w-24 h-24 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden group/btn"
                                        >
                                            <div className="absolute inset-0 bg-white/20 scale-0 group-hover/btn:scale-100 transition-transform duration-500 rounded-full" />
                                            <Play className="w-10 h-10 fill-current relative z-10 ml-1" />
                                        </motion.a>
                                        
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Now Streaming</p>
                                            <p className="text-2xl font-bold flex items-center gap-3">
                                                {getPod(0).author.name}
                                                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* SECONDARY: Album Art Focus */}
                        <AnimatedSection animation="fade-left" delay={300} className="md:col-span-4">
                            <div className="h-full bg-surface-container-highest rounded-[2.5rem] overflow-hidden group relative card-3d-hover">
                                <img 
                                    src={getPod(1).image} 
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                                    alt={getPod(1).title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                                
                                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3">UP NEXT</span>
                                    <h3 className="text-3xl font-display font-bold text-white mb-6 leading-tight">
                                        {getPod(1).title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
                                                <img src={getPod(1).author.avatar} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <p className="text-white/80 font-bold text-sm tracking-tight">{getPod(1).author.name}</p>
                                        </div>
                                        <PlayCircle className="w-12 h-12 text-white/40 group-hover:text-primary transition-colors cursor-pointer" />
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        <AnimatedSection animation="fade-up" delay={400} className="md:col-span-4">
                            <div className="h-full bg-surface-container-lowest border border-primary/10 rounded-[2.5rem] p-10 flex flex-col shadow-inner transition-colors duration-500">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="font-display text-2xl font-black flex items-center gap-3">
                                        <History className="w-6 h-6 text-primary" />
                                        Broadcast Log
                                    </h3>
                                    <span className="text-[10px] font-black opacity-30 tracking-widest">{podcasts.length} TOTAL</span>
                                </div>
                                
                                <div className="space-y-6 flex-1 overflow-y-auto pr-2 hide-scrollbar">
                                    {podcasts.slice(2, 5).map((pod, i) => (
                                        <motion.a 
                                            key={pod.id}
                                            href={pod.audio_url}
                                            target="_blank"
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-5 p-4 rounded-2xl hover:bg-surface-container transition-colors group/item"
                                        >
                                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-on-primary transition-colors shadow-inner">
                                                {i === 0 ? <Waves className="w-6 h-6" /> : i === 1 ? <Mountain className="w-6 h-6" /> : <Trees className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-sm truncate uppercase tracking-tight">{pod.title}</h4>
                                                <p className="text-xs text-on-surface-variant font-medium opacity-60">Episode {pod.id} • {pod.duration || '24m'}</p>
                                            </div>
                                            <PlayCircle className="w-6 h-6 text-primary opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                        </motion.a>
                                    ))}
                                </div>
                                
                                <div className="mt-10 pt-8 border-t border-outline-variant/30">
                                    <button className="w-full flex items-center justify-between font-black text-[10px] tracking-[0.2em] uppercase text-on-surface-variant hover:text-primary transition-colors">
                                        View Full Archive
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* LIVE: Glassmorphic Control Panel */}
                        <AnimatedSection animation="fade-up" delay={500} className="md:col-span-8">
                            <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden flex items-end group shadow-2xl">
                                <img 
                                    src={getPod(5).image} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                                    alt="Live"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                                
                                <div className="glass w-[calc(100%-4rem)] mx-auto mb-8 p-8 rounded-[2rem] flex flex-wrap lg:flex-nowrap items-center justify-between gap-8 relative z-20">
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-2xl bg-black shadow-2xl overflow-hidden border border-white/20 group/art">
                                                <img src={getPod(0).image} className="w-full h-full object-cover opacity-80 group-hover/art:opacity-100 transition-opacity" alt="" />
                                            </div>
                                            <div className="absolute -top-2 -left-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg animate-pulse">LIVE</div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-1">CARTOGRAPHER SIGNAL</p>
                                            <h3 className="text-2xl font-display font-black tracking-tight">{getPod(5).title}</h3>
                                            <p className="text-on-surface-variant/80 font-bold text-sm tracking-tight italic">With {getPod(5).author.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <SkipBack className="w-10 h-10 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                                        <motion.a 
                                            whileHover={{ scale: 1.1 }}
                                            href={getPod(5).audio_url}
                                            target="_blank"
                                            className="w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/20"
                                        >
                                            <Play className="w-8 h-8 fill-current ml-1" />
                                        </motion.a>
                                        <SkipForward className="w-10 h-10 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                                    </div>

                                    <div className="hidden xl:block w-48 space-y-3">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[10px] font-black text-primary tracking-widest">LIVE AUDIO</span>
                                            <div className="flex gap-0.5 h-3">
                                                <div className="w-1 bg-primary rounded-full h-full animate-waveform-bar" style={{ animationDelay: '0.1s' }} />
                                                <div className="w-1 bg-primary rounded-full h-1/2 animate-waveform-bar" style={{ animationDelay: '0.3s' }} />
                                                <div className="w-1 bg-primary rounded-full h-2/3 animate-waveform-bar" style={{ animationDelay: '0.2s' }} />
                                            </div>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                                            <motion.div 
                                                className="h-full bg-primary" 
                                                initial={{ width: '0%' }}
                                                animate={{ width: '65%' }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* ARTIFACT: The Floating Disk Card */}
                        <AnimatedSection animation="fade-right" delay={600} className="md:col-span-5">
                            <div 
                                className={cn(
                                    "h-full relative overflow-hidden rounded-[2.5rem] p-12 group transition-all duration-700 flex flex-col items-center text-center",
                                    card5Shadow && "shadow-shadow"
                                )}
                                style={{ backgroundColor: card5BgColor || 'var(--primary-container)', color: card5BgColor ? 'inherit' : 'var(--on-primary-container)' }}
                            >
                                <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 group-hover:scale-150" />
                                
                                <div className="relative z-10 mb-10">
                                    <div className="w-48 h-48 rounded-full bg-surface-container shadow-2xl p-6 relative group/disk hover-lift transition-all duration-500 border border-outline-variant/10">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                                        <img 
                                            src={getPod(1).image} 
                                            className="w-full h-full object-cover rounded-full shadow-lg group-hover/disk:rotate-[360deg] transition-transform duration-[4000ms] ease-linear" 
                                            alt="" 
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-on-surface text-surface rounded-full shadow-xl flex items-center justify-center border border-primary/20">
                                                <Play className="w-5 h-5 fill-current ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <h3 className="font-display text-4xl font-black mb-6 leading-tight group-hover:scale-105 transition-transform duration-500">
                                    Cartographer's Daily
                                </h3>
                                <p className="text-lg font-medium opacity-80 mb-10 max-w-sm leading-relaxed">
                                    Quick 10-minute updates on border openings, gear reviews, and local festivities around the globe.
                                </p>
                                
                                <div className="flex flex-wrap justify-center gap-3">
                                    <span className="px-5 py-2 glass rounded-full text-xs font-black uppercase tracking-widest border border-white/10 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500">#Signal</span>
                                    <span className="px-5 py-2 glass rounded-full text-xs font-black uppercase tracking-widest border border-white/10 group-hover:bg-primary group-hover:text-on-primary transition-all duration-500 delay-75">#DailyLog</span>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* INTERVIEW: Wide Split Screen */}
                        <AnimatedSection animation="fade-left" delay={700} className="md:col-span-7">
                            <div className="h-full bg-surface-container rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row border border-outline-variant/30 group hover:border-primary/30 transition-colors duration-500 shadow-xl">
                                <div className="lg:w-1/2 p-12 flex flex-col justify-between items-start">
                                    <div className="w-full">
                                        <div className="flex items-center gap-3 mb-10">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/50 animate-pulse" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">FIELD INTERVIEW</span>
                                        </div>
                                        <h3 className="font-display text-5xl font-black italic tracking-tighter leading-none mb-8 group-hover:translate-x-3 transition-transform duration-700">
                                            {getPod(2).title}
                                        </h3>
                                        <p className="text-lg text-on-surface-variant font-medium opacity-70 mb-10 line-clamp-4 max-w-md leading-relaxed">
                                            {getPod(2).description}
                                        </p>
                                    </div>
                                    <motion.a 
                                        whileHover={{ x: 10 }}
                                        href={getPod(2).audio_url}
                                        target="_blank"
                                        className="inline-flex items-center gap-4 px-10 py-5 bg-on-surface text-surface rounded-full font-black text-[10px] tracking-[0.3em] uppercase hover:bg-primary transition-colors group/link"
                                    >
                                        Enter Conversation
                                        <ArrowRight className="w-5 h-5 group-hover/link:translate-x-2 transition-transform" />
                                    </motion.a>
                                </div>
                                <div className="lg:w-1/2 relative min-h-[350px] overflow-hidden">
                                    <img 
                                        src={getPod(2).image} 
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                                        alt="" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-overlay" />
                                    <div className="absolute top-0 right-0 p-10 flex flex-col items-end">
                                        <div className="w-12 h-12 bg-surface/20 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-white">
                                            <Library className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-10 w-full bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-1">STATION MASTER</p>
                                        <h4 className="text-3xl font-display font-black text-white italic tracking-tight">{getPod(2).author.name}</h4>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>
                ) : (
                    <AnimatedSection animation="fade-up" className="text-center py-32 rounded-[3rem] border-2 border-dashed border-outline-variant/30 bg-surface-container-lowest relative overflow-hidden">
                         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)] opacity-[0.03]" />
                         <PlayCircle className="w-24 h-24 text-primary/20 mx-auto mb-8 animate-pulse" />
                         <h3 className="font-display text-4xl font-black mb-4 tracking-tight">Static on the Frequency.</h3>
                         <p className="text-xl text-on-surface-variant font-medium max-w-sm mx-auto opacity-70">
                             We're waiting for the signal to return. Check back shortly for new audio journeys.
                         </p>
                    </AnimatedSection>
                )}
            </div>
            
            {/* Bottom Marquee Decoration */}
            <div className="mt-32 border-y border-outline-variant/20 py-8 overflow-hidden bg-surface-container-low/30 backdrop-blur-sm">
                <div className="animate-marquee-slow flex whitespace-nowrap gap-12 text-[10px] font-black tracking-[0.5em] uppercase text-primary/30">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <span key={i} className="flex items-center gap-12">
                            VOICES OF THE WILD <CircleDashed className="w-2 h-2" /> UNCHARTED TRAILS <CircleDashed className="w-2 h-2" /> MODERN CARTOGRAPHER
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
