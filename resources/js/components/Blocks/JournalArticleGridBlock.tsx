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
    additional_categories?: { name: string; slug: string; icon?: string | null }[];
    published_at: string | null;
    reading_time?: number | null;
    category_id: number;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedInsights {
    data: InsightItem[];
    links: PaginationLinks[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    content: JournalArticleGridBlock['content'];
    recentInsights?: InsightItem[] | PaginatedInsights;
}

export default function JournalArticleGridBlock({ content, recentInsights = [] }: Props) {
    const { columns = 3, staggered = true, showBentoCards = true, limit = 9 } = content;
    const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');

    // Extract posts and pagination links
    const isPaginated = !Array.isArray(recentInsights) && recentInsights !== null && 'data' in recentInsights;
    const allPosts = isPaginated ? (recentInsights as PaginatedInsights).data : (recentInsights as InsightItem[]);

    const [visibleCount, setVisibleCount] = useState(limit);

    // Subscribe to category filter events
    useEffect(() => {
        const handleFilter = (e: CustomEvent<number | 'all'>) => {
            setActiveCategoryId(e.detail);
            setVisibleCount(limit); // Reset visibility on filter change
        };
        window.addEventListener('journal-category-filter', handleFilter as EventListener);
        return () => window.removeEventListener('journal-category-filter', handleFilter as EventListener);
    }, [limit]);

    const filteredPosts = useMemo(() => {
        const posts = activeCategoryId === 'all' 
            ? allPosts 
            : allPosts.filter(p => p.category_id === activeCategoryId || p.additional_categories?.some(c => (c as any).id === activeCategoryId));
        
        // Skip the first one if it's the first page/all view as it's usually featured elsewhere (JournalHero)
        // But only if we have more than 1 post
        return posts.length > 1 ? posts.slice(1) : posts;
    }, [activeCategoryId, allPosts]);

    const visiblePosts = useMemo(() => {
        return filteredPosts.slice(0, visibleCount);
    }, [filteredPosts, visibleCount]);

    const hasMore = visibleCount < filteredPosts.length;

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
                {visiblePosts.map((post, i) => {
                    const isBento = showBentoCards && i === 3;
                    const allCategories = [
                        post.category,
                        ...(post.additional_categories || [])
                    ].filter(Boolean);

                    return (
                        <AnimatedSection 
                            key={post.id} 
                            animation="fade-up" 
                            delay={(i % 12) * 100}
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
                                        <div className="flex flex-wrap gap-2">
                                            {allCategories.map((cat, ci) => (
                                                <p key={ci} className="text-tertiary font-black text-[10px] tracking-widest [font-variant-caps:small-caps] flex items-center gap-1 bg-surface-container px-2 py-1 rounded-full uppercase">
                                                    <CategoryIcon category={cat?.slug || ''} icon={cat?.icon} size={10} glow={false} />
                                                    {cat?.name}
                                                </p>
                                            ))}
                                        </div>
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
                                        <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                                            {allCategories.map((cat, ci) => (
                                                <span key={ci} className="bg-surface/90 backdrop-blur-md text-on-surface text-[10px] font-black [font-variant-caps:small-caps] tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                                    <CategoryIcon 
                                                        category={cat?.slug || ''} 
                                                        icon={cat?.icon}
                                                        size={14} 
                                                        glow={false} 
                                                    />
                                                    {cat?.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                                            {allCategories.map((cat, ci) => (
                                                <p key={ci} className="text-secondary font-black text-[10px] tracking-widest [font-variant-caps:small-caps] flex items-center gap-2">
                                                    <CategoryIcon 
                                                        category={cat?.slug || ''} 
                                                        icon={cat?.icon}
                                                        size={12} 
                                                        glow={false} 
                                                    />
                                                    {cat?.name}
                                                </p>
                                            ))}
                                        </div>
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

            {hasMore && (
                <div className="mt-24 flex items-center justify-center">
                    <button
                        onClick={() => setVisibleCount(prev => prev + 12)}
                        className="px-8 py-4 bg-primary text-on-primary rounded-full text-[10px] font-black tracking-widest transition-all hover:scale-105 hover:shadow-xl active:scale-95 [font-variant-caps:small-caps]"
                    >
                        Show More Articles
                    </button>
                </div>
            )}
        </section>
    );
}
