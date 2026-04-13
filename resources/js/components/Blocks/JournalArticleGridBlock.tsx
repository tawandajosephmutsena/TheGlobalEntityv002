"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import type { JournalArticleGridBlock } from '@/types/page-blocks';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import CategoryIcon from '../CategoryIcon';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string | null;
}

interface InsightItem {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image?: string | null;
    author?: { name: string; avatar?: string | null };
    category?: { id?: number; name: string; slug: string; icon?: string | null };
    additional_categories?: { id: number; name: string; slug: string; icon?: string | null }[];
    additionalCategories?: { id: number; name: string; slug: string; icon?: string | null }[];
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
    categories?: Category[];
}

export default function JournalArticleGridBlock({ content, recentInsights = [], categories = [] }: Props) {
    const { columns = 3, staggered = true, showBentoCards = true, limit = 9 } = content;
    const [activeCategoryId, setActiveCategoryId] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Handle cross-block communication
    const handleCategoryClick = (id: number | 'all') => {
        setActiveCategoryId(id);
        const event = new CustomEvent('journal-category-filter', { detail: id });
        window.dispatchEvent(event);
    };

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

    // Reset visibility on search change
    useEffect(() => {
        setVisibleCount(limit);
    }, [searchQuery, limit]);


    const categoriesList = useMemo(() => {
        if (categories && categories.length > 0) return categories;
        
        // Fallback: Extract unique categories from posts
        const catsMap = new Map<number, Category>();
        allPosts.forEach(post => {
            if (post.category) {
                catsMap.set(post.category_id, {
                    id: post.category_id,
                    name: post.category.name,
                    slug: post.category.slug,
                    icon: post.category.icon
                });
            }
            const additional = (post.additional_categories || (post as any).additionalCategories || []);
            additional.forEach((cat: any) => {
                if (cat.id) {
                    catsMap.set(cat.id, {
                        id: cat.id,
                        name: cat.name,
                        slug: cat.slug,
                        icon: cat.icon
                    });
                }
            });
        });
        return Array.from(catsMap.values());
    }, [categories, allPosts]);


    const filteredPosts = useMemo(() => {
        let results = activeCategoryId === 'all' 
            ? allPosts 
            : allPosts.filter(p => p.category_id === activeCategoryId || p.additional_categories?.some(c => (c as any).id === activeCategoryId));
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            results = results.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.excerpt.toLowerCase().includes(query)
            );
        }
        
        return results;
    }, [activeCategoryId, allPosts, searchQuery]);

    const visiblePosts = useMemo(() => {
        return filteredPosts.slice(0, visibleCount);
    }, [filteredPosts, visibleCount]);

    const hasMore = visibleCount < filteredPosts.length;



    return (
        <section className="relative container mx-auto px-6 py-24 overflow-visible rounded-[3rem]">
            <div className="relative z-10">
                {/* Search Bar */}
                <div className="relative mb-12 group">
                    <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
                        <Search className="size-5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors duration-500" />
                    </div>
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search coordinates, themes, or chronicles..."
                        className="w-full bg-surface/40 backdrop-blur-md border border-white/10 rounded-full py-6 pl-20 pr-12 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/20 transition-all duration-700 font-light text-lg tracking-tight"
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-8 flex items-center text-on-surface-variant/40 hover:text-primary transition-colors active:scale-95"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest [font-variant-caps:small-caps]">Clear</span>
                        </button>
                    )}
                </div>

                {/* Category Filter Row */}
                <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-12 mb-4 scroll-smooth">
                    <button 
                        onClick={() => handleCategoryClick('all')}
                        className={cn(
                            "whitespace-nowrap px-8 py-2.5 rounded-full font-black text-[10px] lowercase [font-variant-caps:small-caps] tracking-widest transition-all duration-500",
                            activeCategoryId === 'all' 
                                ? "bg-on-surface text-surface shadow-xl scale-105" 
                                : "bg-surface/40 backdrop-blur-md border border-white/10 text-on-surface-variant hover:bg-surface-container-high hover:scale-105"
                        )}
                    >
                        All Chronicles
                    </button>
                    {categoriesList.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => handleCategoryClick(cat.id)}
                            className={cn(
                                "group flex items-center gap-3 whitespace-nowrap px-6 py-2.5 rounded-full font-black text-[10px] lowercase [font-variant-caps:small-caps] tracking-widest transition-all duration-500",
                                activeCategoryId === cat.id 
                                    ? "bg-primary text-on-primary shadow-xl scale-105" 
                                    : "bg-surface/40 backdrop-blur-md border border-white/10 text-on-surface-variant hover:bg-surface-container-high hover:scale-105"
                            )}
                        >
                            <CategoryIcon 
                                category={cat.slug} 
                                icon={cat.icon}
                                size={18} 
                                glow={activeCategoryId === cat.id}
                                variant="badge"
                            />
                            {cat.name}
                        </button>
                    ))}

                </div>
            
            {filteredPosts.length === 0 ? (
                <div className="py-32 text-center">
                    <div className="inline-block p-12 rounded-full liquid-glass mb-8 opacity-40">
                        <Search className="size-20" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight mb-4 text-on-surface [font-variant-caps:small-caps]">
                        {searchQuery ? `No matches for "${searchQuery}"` : "No chronicles found"}
                    </h3>
                    <p className="text-on-surface-variant max-w-md mx-auto font-light leading-relaxed">
                        {searchQuery 
                            ? "Our records show no chronicles matching these coordinates. Try refining your keywords or clearing the search." 
                            : "The map remains blank for this category. Explore other coordinates or search for hidden paths."}
                    </p>
                </div>
            ) : (
                <>
                    <div className={cn(
                        "grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16",
                        columns === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
                    )}>

                {visiblePosts.map((post, i) => {
                    const isBento = showBentoCards && i === 3;
                    const allCategories = [
                        post.category,
                        ...(post.additional_categories || post.additionalCategories || [])
                    ].filter(Boolean);

                    return (
                        <TooltipProvider key={post.id}>
                            <AnimatedSection 
                            key={post.id} 
                            animation="fade-up" 
                            delay={(i % 12) * 100}
                            className={cn(
                                "group relative",
                                isBento && "md:col-span-2 liquid-glass p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center",
                                staggered && !isBento && i % columns === 1 && "lg:mt-12"
                            )}
                        >
                            {isBento ? (
                                <>
                                    <div className="relative aspect-video md:aspect-square w-full md:w-1/2 overflow-hidden rounded-lg shadow-lg bg-on-surface/5">
                                        <img 
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-110 group-hover:scale-125 focus:scale-125" 
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                            src={post.featured_image || '/images/placeholder-blog.jpg'} 
                                            alt={post.title} 
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 space-y-6">
                                        <div className="flex flex-wrap gap-2">
                                            {allCategories.map((cat, ci) => {
                                                const slug = cat?.slug || '';
                                                
                                                return (
                                                    <Tooltip key={ci}>
                                                        <TooltipTrigger asChild>
                                                            <CategoryIcon 
                                                                category={slug} 
                                                                icon={cat?.icon} 
                                                                size={20} 
                                                                glow={true} 
                                                                variant="badge"
                                                            />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" sideOffset={8} className="bg-primary text-on-primary border-none shadow-xl px-4 py-2 rounded-xl">
                                                            <p className="font-black text-xs tracking-widest [font-variant-caps:small-caps]">{cat?.name?.replace(/\s\s+/g, ' ')}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                );
                                            })}
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
                                    <div className="relative aspect-[4/5] mb-6 overflow-hidden rounded-lg liquid-glass bg-on-surface/5 group-hover:shadow-2xl transition-all duration-500">
                                        <img 
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 scale-110 group-hover:scale-125 focus:scale-125" 
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                            src={post.featured_image || '/images/placeholder-blog.jpg'} 
                                            alt={post.title} 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex flex-wrap gap-3">
                                            {allCategories.map((cat, ci) => {
                                                const slug = cat?.slug || '';

                                                return (
                                                    <Tooltip key={ci} delayDuration={150}>
                                                        <TooltipTrigger asChild>
                                                            <CategoryIcon 
                                                                category={slug} 
                                                                icon={cat?.icon} 
                                                                size={20} 
                                                                glow={true}
                                                                variant="badge" 
                                                            />
                                                        </TooltipTrigger>
                                                        <TooltipContent side="top" sideOffset={8} className="bg-primary text-on-primary border-none shadow-xl px-4 py-2 rounded-xl">
                                                            <p className="font-black text-xs tracking-widest [font-variant-caps:small-caps]">{cat?.name?.replace(/\s\s+/g, ' ')}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                );
                                            })}
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
                        </TooltipProvider>
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
                </>
            )}
            </div>
        </section>
    );
}
