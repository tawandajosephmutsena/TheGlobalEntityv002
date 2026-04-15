"use client";

import React, { useState } from 'react';
import { 
    Search, 
    Play, 
    Filter, 
    Headphones, 
    Video, 
    ChevronRight, 
    Activity,
    Clock,
    LayoutGrid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, router, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { PodcastArchiveBlock } from '@/types/page-blocks';
import { PodcastCard } from '@/components/podcast/PodcastCard';
import CategoryIcon from '../CategoryIcon';

interface Podcast {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    media_type: 'audio' | 'video';
    formatted_duration: string;
    play_count: number;
    published_at?: string | null;
    created_at?: string;
    category: { id: number; name: string; color: string; icon?: string | null } | null;
    categories?: Array<{ id: number; name: string; color: string; icon?: string | null }> | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    icon?: string | null;
    podcasts_count: number;
}

interface PodcastArchiveProps {
    podcasts: {
        data: Podcast[];
        total: number;
    };
    featured: Podcast[];
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
    };
    content: PodcastArchiveBlock['content'];
}

/**
 * List Item component for Discovery section
 */
const PodcastListItem = ({ podcast }: { podcast: Podcast }) => {
    const displayDate = podcast.published_at 
        ? new Date(podcast.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : podcast.created_at ? new Date(podcast.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative flex items-center gap-6 p-4 rounded-3xl hover:bg-white/5 transition-all duration-500 border border-transparent hover:border-white/10"
        >
            <Link href={`/podcasts/${podcast.slug}`} className="relative size-24 md:size-32 rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-500">
                {podcast.thumbnail_url ? (
                    <img src={podcast.thumbnail_url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <Headphones className="size-12 text-primary/20" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500">
                        <Play className="size-5 fill-current ml-1" />
                    </div>
                </div>
            </Link>

            <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                        {podcast.media_type === 'video' ? 'Video Episode' : 'Audio Episode'}
                    </span>
                    <div className="size-1 rounded-full bg-white/20" />
                    <span className="text-[10px] font-black tracking-[0.2em] text-muted-foreground opacity-60">
                        {displayDate}
                    </span>
                </div>

                <Link href={`/podcasts/${podcast.slug}`}>
                    <h4 className="text-xl md:text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-500 truncate pr-8 relative">
                        {podcast.title}
                        <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 size-5 opacity-0 group-hover:opacity-40 group-hover:translate-x-1 transition-all" />
                    </h4>
                </Link>

                {podcast.description && (
                    <p className="text-sm md:text-base text-muted-foreground line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        {podcast.description}
                    </p>
                )}

                <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground/60">
                        <Clock className="size-3.5" />
                        {podcast.formatted_duration}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-muted-foreground/60">
                        <Activity className="size-3.5" />
                        {podcast.play_count.toLocaleString()} Plays
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function PodcastArchiveBlock(props: PodcastArchiveProps) {
    const { podcasts, featured, categories, filters, content } = props;
    const { site } = usePage<any>().props;
    
    // Prioritize admin settings, fallback to content prop, then defaults
    const title = site?.podcast?.archive_title || content.title || "Library";
    const subtitle = site?.podcast?.archive_subtitle || content.subtitle || "Explore our latest episodes";
    const { featuredLimit = 3 } = content;

    const [activeCategory, setActiveCategory] = useState<string | null>(filters.category || null);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleCategoryClick = (catId: number | null) => {
        const id = catId ? String(catId) : null;
        setActiveCategory(id);
        router.get('/podcasts', id ? { category: id } : {}, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/podcasts', { search: searchQuery }, { preserveState: true });
    };

    return (
        <section className="w-full min-h-screen bg-transparent text-foreground pt-32 pb-12 md:pt-48 md:pb-24 selection:bg-primary/20">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar - Prominent Category Filter */}
                    <aside className="w-full lg:w-80 shrink-0 space-y-12">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-4">
                                <h3 className="text-sm font-black tracking-[0.2em] text-muted-foreground uppercase opacity-40">Categories</h3>
                                <Filter className="size-3.5 text-muted-foreground opacity-40" />
                            </div>
                            
                            <nav className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleCategoryClick(null)}
                                    className={cn(
                                        "flex items-center gap-4 px-6 py-4 rounded-[2rem] transition-all duration-500 font-black text-[10px] tracking-[0.2em] uppercase group border",
                                        !activeCategory 
                                            ? "bg-on-surface text-surface border-on-surface shadow-2xl scale-105" 
                                            : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:border-white/20 hover:translate-x-1"
                                    )}
                                >
                                    <div className={cn(
                                        "size-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                                        !activeCategory ? "bg-surface/20" : "bg-white/10"
                                    )}>
                                        <LayoutGrid className="size-4" />
                                    </div>
                                    <div className="flex-1 text-left flex items-center justify-between">
                                        <span>All Episodes</span>
                                        <span className="opacity-40">{podcasts.total}</span>
                                    </div>
                                </button>

                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat.id)}
                                        className={cn(
                                            "flex items-center gap-4 px-6 py-4 rounded-[2rem] transition-all duration-500 font-black text-[10px] tracking-[0.2em] uppercase group border",
                                            activeCategory === String(cat.id)
                                                ? "shadow-2xl scale-105"
                                                : "bg-white/5 text-muted-foreground border-white/5 hover:bg-white/10 hover:border-white/20 hover:translate-x-1"
                                        )}
                                        style={activeCategory === String(cat.id) ? { 
                                            backgroundColor: cat.color,
                                            borderColor: cat.color,
                                            boxShadow: `0 15px 35px ${cat.color}40`,
                                            color: 'white'
                                        } : undefined}
                                    >
                                        <div className={cn(
                                            "size-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                                            activeCategory === String(cat.id) ? "bg-white/20" : "bg-white/5"
                                        )}>
                                            <CategoryIcon 
                                                category={cat.slug} 
                                                icon={cat.icon}
                                                size={18} 
                                                glow={activeCategory === String(cat.id)}
                                                variant="badge"
                                                className={cn(activeCategory === String(cat.id) ? "brightness-0 invert" : "")}
                                            />
                                        </div>
                                        <div className="flex-1 text-left flex items-center justify-between">
                                            <span>{cat.name}</span>
                                            <span className="opacity-40 group-hover:opacity-100 transition-opacity">{cat.podcasts_count}</span>
                                        </div>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Quick Stats Widget */}
                        <div className="hidden lg:block p-10 rounded-[2.5rem] glass-effect border border-white/5 space-y-8 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                                    <Headphones className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-widest opacity-40 uppercase">Library Total</p>
                                    <p className="text-2xl font-black">{podcasts.total}</p>
                                </div>
                            </div>
                            <div className="h-px bg-white/5" />
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-inner">
                                    <Video className="size-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black tracking-widest opacity-40 uppercase">Video Episodes</p>
                                    <p className="text-2xl font-black">
                                        {podcasts.data.filter(p => p.media_type === 'video').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 space-y-20 lg:pt-4">
                        {/* Header & Search */}
                        <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-white/5">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black tracking-widest border border-primary/20">
                                        • LIVE ARCHIVE
                                    </div>
                                    <span className="text-xs text-muted-foreground opacity-60 font-medium italic">Updated recently</span>
                                </div>
                                <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none italic">
                                    {activeCategory 
                                        ? categories.find(c => String(c.id) === activeCategory)?.name 
                                        : title
                                    }
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl opacity-70 italic leading-relaxed">
                                    {subtitle}
                                </p>
                            </div>

                            <form onSubmit={handleSearch} className="relative w-full md:w-[450px] group">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 size-6 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <input 
                                    type="text" 
                                    placeholder="Search library..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border-white/5 rounded-[2.5rem] py-6 pl-20 pr-10 text-lg font-bold placeholder:text-muted-foreground/30 focus:bg-white/10 focus:ring-8 focus:ring-primary/5 transition-all apple-shadow-hover focus:border-white/20"
                                />
                            </form>
                        </header>

                        {/* Featured Grid */}
                        {featured.length > 0 && !activeCategory && !searchQuery && (
                            <section className="space-y-12">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-4xl font-black tracking-tight">New Shows for You</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {featured.slice(0, featuredLimit).map((pod, i) => (
                                        <PodcastCard 
                                            key={pod.id} 
                                            podcast={pod} 
                                            variant="featured" 
                                            className={cn(
                                                "animate-in fade-in slide-in-from-bottom-8 duration-700 ease-apple",
                                                i === 0 ? "delay-0" : i === 1 ? "delay-150" : "delay-300"
                                            )}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Discovery Section - Always List Style as requested */}
                        <section className="space-y-12">
                            <div className="flex items-center justify-between">
                                <h2 className="text-4xl font-black tracking-tight">
                                    {searchQuery ? `Search results for "${searchQuery}"` : 'More to Discover'}
                                </h2>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {podcasts.data.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-48 rounded-[4rem] border-2 border-dashed border-white/10 glass-effect"
                                    >
                                        <Search className="size-24 mx-auto mb-8 text-muted-foreground/10" />
                                        <h3 className="text-3xl font-black tracking-tight">No episodes found</h3>
                                        <p className="text-xl text-muted-foreground mt-4 max-w-sm mx-auto opacity-50 font-medium">
                                            Try adjusting your search or filters to find what you're looking for.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-700">
                                        {podcasts.data.map((podcast) => (
                                            <PodcastListItem key={podcast.id} podcast={podcast} />
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Load More Button */}
                            {podcasts.total > podcasts.data.length && (
                                <div className="flex justify-center pt-24">
                                    <button className="group relative flex items-center gap-6 px-16 py-6 bg-white text-black rounded-full font-black text-xs tracking-[0.3em] hover:bg-primary hover:text-white transition-all duration-700 overflow-hidden shadow-2xl hover:scale-105 active:scale-95">
                                        <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                        <span className="relative z-10 uppercase">Load more episodes</span>
                                        <ChevronRight className="relative z-10 size-6 group-hover:translate-x-2 transition-transform duration-500" />
                                    </button>
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </section>
    );
}
