"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import type { JournalArticleGridBlock } from '@/types/page-blocks';
import CategoryIcon from '../CategoryIcon';

interface InsightItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string | null;
    author?: { name: string; avatar?: string | null };
    category?: { name: string; slug: string; icon?: string | null };
    published_at: string | null;
    reading_time?: number | null;
    category_id: number;
}

interface Props {
    content: JournalArticleGridBlock['content'];
    recentInsights?: InsightItem[];
}

export default function JournalArticleGridBlock({ content, recentInsights = [] }: Props) {
    const { columns = 3, staggered = true, showBentoCards = true, limit = 9 } = content;
    const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');

    // Subscribe to category filter events
    useEffect(() => {
        const handleFilter = (e: CustomEvent<number | 'all'>) => {
            setActiveCategoryId(e.detail);
        };
        window.addEventListener('journal-category-filter', handleFilter as EventListener);
        return () => window.removeEventListener('journal-category-filter', handleFilter as EventListener);
    }, []);

    const filteredPosts = useMemo(() => {
        const posts = activeCategoryId === 'all' 
            ? recentInsights 
            : recentInsights.filter(p => p.category_id === activeCategoryId);
        return posts.slice(1, limit + 1); // Skip the first one as it's usually featured
    }, [activeCategoryId, recentInsights, limit]);

    if (filteredPosts.length === 0) {
        return (
            <div className="py-32 text-center">
                <div className="inline-block p-12 rounded-full bg-surface-container-low mb-8 opacity-20">
                    <Search className="size-20" />
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-4 text-on-surface [font-variant-caps:small-caps]">No chronicles found</h3>
                <p className="text-on-surface-variant max-w-md mx-auto font-light">
                    The map remains blank for this category. Explore other coordinates or search for hidden paths.
                </p>
            </div>
        );
    }

    return (
        <section className="container mx-auto px-6">
            <div className={cn(
                "grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16",
                columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
            )}>
                {filteredPosts.map((post, i) => {
                    const isBento = showBentoCards && i === 3;

                    return (
                        <AnimatedSection 
                            key={post.id} 
                            animation="fade-up" 
                            delay={i * 100}
                            className={cn(
                                "group relative",
                                isBento && "md:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center",
                                staggered && !isBento && i % columns === 1 && "lg:mt-12"
                            )}
                        >
                            {isBento ? (
                                <>
                                    <div className="relative aspect-video md:aspect-square w-full md:w-1/2 overflow-hidden rounded-lg shadow-lg">
                                        <img 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                            src={post.featured_image || '/images/placeholder-blog.jpg'} 
                                            alt={post.title} 
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 space-y-6">
                                        <p className="text-tertiary font-black text-[10px] tracking-widest [font-variant-caps:small-caps]">Editorial Feature</p>
                                        <h3 className="font-display font-black text-3xl group-hover:text-primary transition-colors leading-[1.1] text-on-surface [font-variant-caps:small-caps]">
                                            {post.title}
                                        </h3>
                                        <p className="text-on-surface-variant text-base leading-relaxed font-light line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 font-black text-[10px] tracking-widest text-primary hover:gap-4 transition-all [font-variant-caps:small-caps]">
                                            {"READ FULL FEATURE"}
                                            <ArrowUpRight className="size-4" />
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <Link href={`/blog/${post.slug}`} className="block">
                                    <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-lg bg-surface-container-low group-hover:shadow-2xl transition-all duration-500">
                                        <img 
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                            src={post.featured_image || '/images/placeholder-blog.jpg'} 
                                            alt={post.title} 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        <span className="absolute top-6 right-6 bg-surface/90 backdrop-blur-md text-on-surface text-[10px] font-black [font-variant-caps:small-caps] tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                            <CategoryIcon 
                                                category={post.category?.slug || ''} 
                                                icon={post.category?.icon}
                                                size={14} 
                                                glow={false} 
                                            />
                                            {post.category?.name || 'Insight'}
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-secondary font-black text-[10px] tracking-widest [font-variant-caps:small-caps] flex items-center gap-2">
                                            <CategoryIcon 
                                                category={post.category?.slug || ''} 
                                                icon={post.category?.icon}
                                                size={12} 
                                                glow={false} 
                                            />
                                            {post.category?.name || 'Journal'}
                                        </p>
                                        <h3 className="font-display font-black text-2xl group-hover:text-primary transition-colors leading-tight tracking-tighter text-on-surface [font-variant-caps:small-caps]">
                                            {post.title}
                                        </h3>
                                        <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed font-light">
                                            {post.excerpt}
                                        </p>
                                        <div className="pt-2 flex items-center justify-between">
                                            <span className="text-[10px] text-on-surface-variant font-bold [font-variant-caps:small-caps] tracking-widest opacity-60">
                                                {post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                                            </span>
                                            <ArrowRight className="size-5 text-primary group-hover:translate-x-2 transition-transform duration-500" />
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </AnimatedSection>
                    );
                })}
            </div>
        </section>
    );
}
