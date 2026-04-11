"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@inertiajs/react';
import AnimatedSection from '@/components/AnimatedSection';
import type { JournalHeroBlock } from '@/types/page-blocks';
import WatercolorBackground from '@/components/WatercolorBackground';

interface InsightItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string | null;
    author?: { name: string; avatar?: string | null };
    category?: { name: string; slug: string };
    published_at: string | null;
    reading_time?: number | null;
}

interface Props {
    content: JournalHeroBlock['content'];
    recentInsights?: InsightItem[];
}

export default function JournalHeroBlock({ content, recentInsights = [] }: Props) {
    const { titleHighlight, titleMain, description, featuredPostId } = content;
    
    // Find the featured post - either by ID or just the first one
    const featuredPost = featuredPostId 
        ? recentInsights.find(p => p.id === featuredPostId) 
        : recentInsights[0];

    if (!featuredPost && !titleMain) return null;

    // Use content values if provided, otherwise fallback to post data
    const displayTitle = titleMain || featuredPost?.title || "The Journal";
    const displayDescription = description || featuredPost?.excerpt || "";
    const highlight = titleHighlight || "Featured Story";

    const contentInside = (
        <div className="asymmetric-grid items-center grid grid-cols-12 gap-y-12">
            <div className="col-span-12 lg:col-span-7 relative z-10 lg:pr-12 py-12">
                <span className="inline-block py-1 px-4 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-black tracking-widest mb-6 shadow-sm [font-variant-caps:small-caps]">
                    {highlight}
                </span>
                <h1 className="font-display font-black text-5xl lg:text-7xl text-on-surface leading-[1.1] mb-8 tracking-tighter [font-variant-caps:small-caps]">
                    {displayTitle.split(' ').map((word, i) => (
                        <span key={i} className={i % 4 === 3 ? "text-primary italic" : ""}>{word} </span>
                    ))}
                </h1>
                <p className="text-on-surface-variant text-lg lg:text-xl max-w-xl mb-10 leading-relaxed font-light line-clamp-3">
                    {displayDescription}
                </p>
                
                {featuredPost && (
                    <div className="flex items-center gap-4 group/author">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high border-2 border-primary/10">
                            {featuredPost.author?.avatar ? (
                                <img className="w-full h-full object-cover" src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                            ) : (
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                    {featuredPost.author?.name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-sm group-hover/author:text-primary transition-colors">By {featuredPost.author?.name || 'Anonymous'}</p>
                            <p className="text-[10px] text-on-surface-variant tracking-widest font-medium [font-variant-caps:small-caps]">
                                {featuredPost.reading_time || 5} Min Read • {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : 'Recently'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="col-span-12 lg:col-span-5 relative h-[400px] lg:h-[600px]">
                <div className="absolute inset-0 bg-surface-container-low rounded-lg transform translate-x-4 translate-y-4 -z-10 opacity-50"></div>
                <div className="w-full h-full overflow-hidden rounded-lg shadow-2xl">
                    <img 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        src={featuredPost?.featured_image || '/images/placeholder-blog.jpg'} 
                        alt={displayTitle} 
                    />
                </div>
                {/* Decorative Watercolor Overlap */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
            </div>
        </div>
    );

    return (
        <section className="container mx-auto px-6 pt-48 mb-24">
            <AnimatedSection animation="fade-in" className="relative group cursor-pointer overflow-hidden rounded-[2rem] gradient-mesh-journal-hero p-8 md:p-12">
                <WatercolorBackground variant="journalHero" />
                
                <div className="relative z-10">
                    {featuredPost ? (
                        <Link href={`/blog/${featuredPost.slug}`} className="block">
                            {contentInside}
                        </Link>
                    ) : (
                        contentInside
                    )}
                </div>
            </AnimatedSection>
        </section>
    );
}
