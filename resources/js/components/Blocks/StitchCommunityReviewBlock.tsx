"use client";

import React, { useEffect, useState } from 'react';
import { 
    Star, 
    Quote, 
    BookOpen, 
    PenTool, 
    ThumbsUp, 
    CheckCircle,
    ArrowRight,
    MapPin,
    Calendar,
    Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import type { StitchCommunityReviewBlock } from '@/types/page-blocks';
import AnimatedSection from '@/Components/AnimatedSection';
import { cn } from '@/lib/utils';

interface ReviewData {
    id: number;
    author: {
        name: string;
        avatar: string;
    };
    role?: string;
    rating: number;
    content: string;
    event_name?: string;
    image?: string;
}

/**
 * Radial Progress Meter for Stats
 */
const RadialMeter = ({ value, label }: { value: string; label: string }) => {
    const percentage = (parseFloat(value) / 5) * 100;
    
    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-primary/10"
                />
                <motion.circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray="364.4"
                    initial={{ strokeDashoffset: 364.4 }}
                    animate={{ strokeDashoffset: 364.4 - (364.4 * percentage) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    fill="transparent"
                    strokeLinecap="round"
                    className="text-primary"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black tracking-tighter">{value}</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</span>
            </div>
        </div>
    );
};

export default function StitchCommunityReviewBlockRenderer(props: StitchCommunityReviewBlock['content']) {
    const extractContent = (data: unknown): any => {
        if (data && typeof data === 'object' && 'content' in data && data.content !== null) {
            return extractContent((data as any).content);
        }
        return data;
    };

    const blockContent = extractContent(props);
    const {
        title = "Voices from the Uncharted Trails.",
        subtitle = "Genuine stories from our community of global cartographers. Every review is a coordinate on our shared map of discovery.",
        limit = 4,
        ctaTitle = "Ready to start your own chapter?",
        ctaButtonText = "Join the Expedition",
        statsRating = "4.9",
        statsTitle = "Unmatched Accuracy",
        statsDescription = "Across 12,000+ trails tracked this season alone.",
        statsAvatars = [
            "https://i.pravatar.cc/100?img=11",
            "https://i.pravatar.cc/100?img=12",
            "https://i.pravatar.cc/100?img=13"
        ],
        statsCount = "+2k",
        entryNumber = "402",
        entryLocation = "The Misty Valley",
        entryQuote = "This isn't just an app; it's a silent partner in every discovery I make.",
        entryTags = ["#Hiking", "#Exploration"],
        ratingCardImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80",
        ratingCardTitle = "Rate your adventure",
        ratingCardDescription = "Help the community discover the best routes. Your feedback matters!",
        socialProofPlatform = "Shared on TrailChat Community",
        footerCounterText = "45,000+ Reviews and counting"
    } = blockContent;

    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/collections/reviews?featured=1&limit=${limit}`).catch(() => ({ data: { data: [] } }));
                if (response.data?.data?.length > 0) {
                    const mappedReviews = response.data.data.map((r: any) => ({
                        id: r.id,
                        author: {
                            name: r.author?.name || r.name || 'Anonymous',
                            avatar: r.author?.avatar || r.avatar || ''
                        },
                        role: r.role || 'Reviewer',
                        rating: r.rating || 5,
                        content: r.content || r.review || '',
                        event_name: r.event_name || r.event || 'Recent Event',
                        image: r.image || r.author?.avatar || ''
                    }));
                    setReviews(mappedReviews);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [limit]);

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto py-24 px-8 theme-stitch">
                <div className="h-12 w-2/3 bg-surface-container animate-pulse rounded-2xl mb-4" />
                <div className="h-6 w-1/2 bg-surface-container animate-pulse rounded-xl mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-12 bg-surface-container animate-pulse h-[500px] rounded-3xl" />
                </div>
            </div>
        );
    }

    const getRev = (index: number) => reviews[index % reviews.length];

    return (
        <section className="relative bg-surface text-on-surface py-24 md:py-32 theme-stitch overflow-hidden">
            {/* Top Wave Divider Mask */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-surface-container-low/20 to-transparent pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <header className="mb-24 text-center">
                    <AnimatedSection animation="fade-up" textReveal>
                        <h2 className="font-display text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 mx-auto max-w-5xl">
                            {title.split(' ').map((word, i, arr) => (
                                <span key={i} className={cn(
                                    "inline-block",
                                    i >= arr.length - 2 && "text-primary italic font-serif font-light"
                                )}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h2>
                    </AnimatedSection>
                    <AnimatedSection animation="fade-up" delay={200}>
                        <p className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed max-w-3xl mx-auto opacity-70">
                            {subtitle}
                        </p>
                    </AnimatedSection>
                </header>

                {reviews.length > 0 ? (
                    <div className="asymmetric-grid-container gap-10 items-stretch">
                        
                        {/* 1. FEATURED: The High-Quality Portrait Card */}
                        <AnimatedSection animation="fade-right" className="lg:col-span-7">
                            <div className="group relative h-full min-h-[500px] bg-surface-container-low rounded-[3rem] overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col md:flex-row">
                                <div className="md:w-1/2 relative overflow-hidden">
                                    <img 
                                        src={getRev(0).image} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" 
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="md:w-1/2 p-12 flex flex-col justify-center bg-surface-container-low/50 backdrop-blur-sm">
                                    <div className="flex gap-1 mb-8">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn(
                                                "w-5 h-5",
                                                i < (getRev(0).rating || 5) ? "text-primary fill-current" : "text-outline-variant"
                                            )} />
                                        ))}
                                    </div>
                                    <Quote className="w-12 h-12 text-primary/10 mb-6" />
                                    <p className="text-2xl md:text-3xl font-display font-black leading-tight mb-10 italic tracking-tight">
                                        "{getRev(0).content}"
                                    </p>
                                    <div className="pt-8 border-t border-outline-variant/30">
                                        <p className="font-black text-xl tracking-tight">{getRev(0).author.name}</p>
                                        <p className="text-sm font-bold opacity-40 uppercase tracking-[0.2em]">{getRev(0).event_name}</p>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* 2. QUOTE: Minimalist Brand Bold Card */}
                        <AnimatedSection animation="scale" delay={300} className="lg:col-span-5">
                            <div className="h-full bg-primary text-on-primary rounded-[3rem] p-12 relative overflow-hidden flex flex-col justify-between group shadow-xl hover:shadow-primary/20 transition-all">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3" />
                                
                                <Quote className="w-40 h-40 absolute -top-10 -left-10 opacity-10 rotate-12" />
                                
                                <div className="relative z-10 pt-10">
                                    <p className="font-display text-4xl font-black leading-[1.1] mb-12 group-hover:translate-x-3 transition-transform duration-700">
                                        "{getRev(1).content}"
                                    </p>
                                </div>

                                <div className="relative z-10 pt-10 border-t border-white/10 flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-2xl tracking-tight">{getRev(1).author.name}</p>
                                        <p className="text-[10px] font-black opacity-60 uppercase tracking-[0.3em]">{getRev(1).role}</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                                        <ArrowRight className="w-6 h-6 rotate-[-45deg]" />
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* 3. STATS: The Radial Meter Card */}
                        <AnimatedSection animation="fade-up" delay={400} className="lg:col-span-4">
                            <div className="h-full bg-surface-container-highest rounded-[3rem] p-12 flex flex-col items-center text-center justify-between shadow-lg border border-outline-variant/30 hover:bg-surface-container transition-colors">
                                <RadialMeter value={statsRating} label="RATING" />
                                
                                <div className="my-8">
                                    <h3 className="text-2xl font-display font-black leading-tight mb-3 italic tracking-tight">{statsTitle}</h3>
                                    <p className="font-medium text-on-surface-variant opacity-70 px-4">{statsDescription}</p>
                                </div>

                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex -space-x-4">
                                        {statsAvatars.map((url, i) => (
                                            <motion.img 
                                                key={url}
                                                whileHover={{ y: -5, zIndex: 50 }}
                                                src={url} 
                                                className="w-12 h-12 rounded-full border-4 border-surface-container-highest shadow-xl object-cover relative pointer-events-auto"
                                            />
                                        ))}
                                        <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary border-4 border-surface-container-highest flex items-center justify-center text-xs font-black shadow-xl">
                                            {statsCount}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black tracking-[0.3em] opacity-40 uppercase">TRUSTED BY EXPLORERS</span>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* 4. DIARY: The Handwritten Journal Card */}
                        <AnimatedSection animation="fade-up" delay={500} className="lg:col-span-8">
                            <div className="h-full relative overflow-hidden rounded-[3rem] p-1 p-0.5 bg-gradient-to-br from-outline-variant/30 to-transparent group">
                                <div className="h-full bg-surface-container-lowest rounded-[2.9rem] p-12 md:p-16 flex flex-col relative overflow-hidden shadow-inner">
                                    {/* Paper Texture Overlay */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                                    
                                    <div className="flex flex-wrap items-center justify-between gap-6 mb-12 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 organic-border bg-tertiary/10 flex items-center justify-center text-tertiary">
                                                <PenTool className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-1">JOURNAL LOG NO. {entryNumber}</p>
                                                <h4 className="text-3xl font-display font-black tracking-tighter flex items-center gap-3">
                                                    <MapPin className="w-6 h-6 text-primary" />
                                                    {entryLocation}
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="bg-surface-container px-6 py-2 rounded-full border border-outline-variant/30 text-[10px] font-black tracking-widest uppercase flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-primary" />
                                            OCTOBER 23, 2026
                                        </div>
                                    </div>

                                    <div className="flex-1 relative z-10">
                                        <p className="text-2xl md:text-3xl font-medium leading-[1.6] text-on-surface-variant/80 mb-10 max-w-4xl">
                                            {getRev(2).content}
                                        </p>
                                        <p className="handwritten text-4xl md:text-5xl text-primary transform -rotate-1 origin-left leading-tight py-4">
                                            "{entryQuote}"
                                        </p>
                                    </div>

                                    <div className="mt-12 pt-10 border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-full border-2 border-primary p-1">
                                                <img src={getRev(2).author.avatar} className="w-full h-full object-cover rounded-full" alt="" />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg tracking-tight">{getRev(2).author.name}</p>
                                                <p className="text-xs font-bold opacity-40 uppercase tracking-widest italic">{getRev(2).role}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            {entryTags.map((tag) => (
                                                <span key={tag} className="px-5 py-2 glass rounded-full text-[10px] font-black uppercase tracking-widest">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* 5. INTERACTIVE: Glass Rate Card */}
                        <AnimatedSection animation="fade-right" delay={600} className="lg:col-span-6">
                            <div className="h-[500px] relative rounded-[3rem] overflow-hidden group shadow-2xl card-3d-hover">
                                <img src={ratingCardImage} className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-110 transition-transform duration-[2000ms]" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                
                                <div className="absolute inset-x-8 bottom-8 glass p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-2xl border-white/10 z-20 overflow-hidden">
                                     <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[60px] rounded-full" />
                                     
                                     <div className="flex flex-wrap items-end justify-between gap-6 relative z-10">
                                        <div className="flex-1 min-w-[200px]">
                                            <h4 className="text-3xl font-display font-black text-white tracking-tight mb-3 italic">{ratingCardTitle}</h4>
                                            <p className="text-white/60 font-medium leading-relaxed max-w-sm">{ratingCardDescription}</p>
                                        </div>
                                        <div className="flex gap-2 p-4 bg-black/40 rounded-3xl border border-white/5 shadow-inner">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <motion.div key={i} whileHover={{ scale: 1.2, rotate: 15 }}>
                                                    <Star className={cn(
                                                        "w-7 h-7 cursor-pointer transition-all",
                                                        i < 5 ? "text-primary fill-current drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" : "text-white/20"
                                                    )} />
                                                </motion.div>
                                            ))}
                                        </div>
                                     </div>
                                     
                                     <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full mt-10 py-5 bg-white text-on-surface rounded-full font-black text-[10px] tracking-[0.4em] uppercase hover:bg-primary hover:text-on-primary transition-all shadow-2xl relative overflow-hidden group/btn"
                                     >
                                        <span className="relative z-10">Sign the Manifest</span>
                                        <div className="absolute inset-0 bg-primary translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                     </motion.button>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* 6. PROOF: Floating Social Proof Card */}
                        <AnimatedSection animation="fade-left" delay={700} className="lg:col-span-6">
                            <div className="h-[500px] bg-secondary-container rounded-[3rem] p-16 flex flex-col justify-between group relative overflow-hidden cursor-pointer shadow-xl hover:shadow-secondary/20 transition-all">
                                 {/* Decorative Orbitals */}
                                 <div className="absolute inset-0 opacity-10 pointer-events-none">
                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white rounded-full animate-spin-slow" />
                                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/50 rounded-full animate-spin-slow [animation-direction:reverse]" />
                                 </div>

                                 <div className="flex items-start justify-between relative z-10">
                                    <div className="w-20 h-20 rounded-3xl bg-on-secondary-container flex items-center justify-center text-secondary shadow-2xl animate-float">
                                        <Award className="w-10 h-10" />
                                    </div>
                                    <div className="glass px-6 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest text-on-secondary-container">
                                        VERIFIED JOURNEY
                                    </div>
                                 </div>

                                 <div className="relative z-10">
                                    <Quote className="w-12 h-12 text-on-secondary-container/10 mb-6" />
                                    <p className="text-3xl md:text-4xl font-display font-black text-on-secondary-container leading-[1.1] mb-6 italic group-hover:translate-x-3 transition-transform duration-700">
                                        "{getRev(3).content}"
                                    </p>
                                    <p className="text-on-secondary-container/50 font-black text-xs tracking-widest uppercase">{socialProofPlatform}</p>
                                 </div>

                                 <div className="flex items-center gap-6 pt-10 border-t border-on-secondary-container/10 relative z-10">
                                    <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-2xl group-hover:scale-110 transition-transform">
                                        <img src={getRev(3).author.avatar} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-black text-2xl tracking-tight text-on-secondary-container">{getRev(3).author.name}</p>
                                        <p className="text-xs font-bold opacity-60 uppercase tracking-widest text-on-secondary-container">{getRev(3).role}</p>
                                    </div>
                                 </div>
                            </div>
                        </AnimatedSection>
                    </div>
                ) : (
                    <AnimatedSection animation="fade-up" className="text-center py-32 bg-surface-container-low/30 rounded-[3rem] border-2 border-dashed border-outline-variant/30 flex flex-col items-center">
                        <CircleDashed className="w-24 h-24 text-primary/20 mb-8 animate-spin-slow" />
                        <h3 className="text-4xl font-display font-black mb-4 tracking-tighter italic">Echoes in the Void.</h3>
                        <p className="text-xl text-on-surface-variant font-medium max-w-sm opacity-60 leading-relaxed">
                            Every explorer has a story. Be the one to break the silence.
                        </p>
                    </AnimatedSection>
                )}

                {/* Call to Action Section */}
                <AnimatedSection animation="slide-up" delay={800} className="mt-32 pt-24 border-t border-outline-variant/20 text-center">
                    <div className="inline-flex items-center gap-4 px-8 py-3 bg-surface-container-highest rounded-full shadow-inner mb-12 border border-outline-variant/30">
                        <ThumbsUp className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">{footerCounterText}</span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter mb-16 max-w-4xl mx-auto">
                        {ctaTitle.split(' ').map((word, i, arr) => (
                            <span key={i} className={cn(
                                "inline-block mr-3",
                                i >= arr.length - 2 && "text-primary italic font-serif font-light"
                            )}>
                                {word}
                            </span>
                        ))}
                    </h2>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-6 bg-primary text-on-primary rounded-full font-black text-xs tracking-[0.4em] uppercase shadow-2xl shadow-primary/30 active:shadow-none transition-shadow"
                        >
                            {ctaButtonText}
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.05, y: -5 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-6 bg-surface-container-highest text-on-surface rounded-full font-black text-xs tracking-[0.4em] uppercase hover:bg-surface-container transition-colors shadow-lg"
                        >
                            Browse the Map
                        </motion.button>
                    </div>
                </AnimatedSection>
            </div>

            {/* Bottom Floating Visualizer */}
            <div className="absolute inset-x-0 bottom-0 py-12 px-6 pointer-events-none opacity-20">
                <div className="container mx-auto h-24 overflow-hidden border-t-2 border-primary/20 flex items-center justify-center">
                    <div className="flex items-end gap-1 h-12">
                        {Array.from({ length: 120 }).map((_, i) => (
                            <motion.div 
                                key={i}
                                className="w-px bg-primary rounded-full"
                                animate={{ height: [`${Math.random() * 20 + 5}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 20 + 5}%`] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.01 }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
