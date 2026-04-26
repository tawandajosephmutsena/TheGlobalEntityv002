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
    ArrowUpDown,
    ListFilter
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
        sort?: 'latest' | 'oldest';
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
                    <h4 className="text-xl md:text-2xl font-black tracking-tight group-hover:text-primary transition-colors duration-500 truncate pr-8 relative text-foreground">
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
        router.get('/podcasts', { ...filters, search: searchQuery }, { preserveState: true });
    };

    const handleSort = (sort: 'latest' | 'oldest') => {
        router.get('/podcasts', { ...filters, sort }, { preserveState: true });
    };

    return (
        <section className="w-full min-h-screen bg-transparent text-foreground pt-32 pb-12 md:pt-48 md:pb-24 selection:bg-primary/20">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="space-y-20">
                    {/* Main Content Area */}
                    <main className="flex-1 space-y-20">
                        {/* Header & Search */}
                        <header className="flex flex-col gap-12">
                            <div className="space-y-6">
                                <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.85] italic text-foreground">
                                    {activeCategory 
                                        ? categories.find(c => String(c.id) === activeCategory)?.name 
                                        : title
                                    }
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-3xl opacity-70 italic leading-relaxed">
                                    {subtitle}
                                </p>
                            </div>

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-8 border-t border-white/10">
                                <form onSubmit={handleSearch} className="relative w-full lg:max-w-xl group">
                                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 size-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                    <input 
                                        type="text" 
                                        placeholder="Search episodes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/5 border-white/10 rounded-2xl py-6 pl-16 pr-8 text-lg font-bold placeholder:text-muted-foreground/30 focus:bg-white/10 focus:ring-4 focus:ring-primary/5 transition-all focus:border-white/20 text-foreground shadow-sm"
                                    />
                                </form>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-white/5 p-1.5 rounded-2xl border border-white/10">
                                        <button 
                                            onClick={() => handleSort('latest')}
                                            className={cn(
                                                "px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-500",
                                                filters.sort !== 'oldest' ? "bg-white text-black shadow-lg" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Latest
                                        </button>
                                        <button 
                                            onClick={() => handleSort('oldest')}
                                            className={cn(
                                                "px-6 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all duration-500",
                                                filters.sort === 'oldest' ? "bg-white text-black shadow-lg" : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Oldest
                                        </button>
                                    </div>

                                    <div className="hidden sm:flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black tracking-widest uppercase text-muted-foreground">
                                        <Activity className="size-4" />
                                        <span>{podcasts.total} Records</span>
                                    </div>
                                </div>
                            </div>

                            {/* Category Pills */}
                            <nav className="flex flex-wrap gap-3 pb-4">
                                <button
                                    onClick={() => handleCategoryClick(null)}
                                    className={cn(
                                        "px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 border",
                                        !activeCategory 
                                            ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                            : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/30 hover:bg-white/10"
                                    )}
                                >
                                    All Episodes
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat.id)}
                                        className={cn(
                                            "px-6 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all duration-500 border",
                                            activeCategory === String(cat.id)
                                                ? "shadow-lg"
                                                : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/30 hover:bg-white/10"
                                        )}
                                        style={activeCategory === String(cat.id) ? { 
                                            backgroundColor: cat.color,
                                            borderColor: cat.color,
                                            color: 'white',
                                            boxShadow: `0 8px 20px ${cat.color}40`
                                        } : undefined}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </nav>
                        </header>

                        {/* Featured Grid */}
                        {featured.length > 0 && !activeCategory && !searchQuery && (
                            <section className="space-y-10">
                                <div className="flex items-center gap-4 px-2">
                                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                                    <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic">Featured Selection</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {featured.slice(0, featuredLimit).map((pod, i) => (
                                        <PodcastCard 
                                            key={pod.id} 
                                            podcast={pod} 
                                            variant="featured" 
                                            className={cn(
                                                "animate-in fade-in slide-in-from-bottom-8 duration-700 ease-apple backdrop-blur-sm",
                                                i === 0 ? "delay-0" : i === 1 ? "delay-150" : "delay-300"
                                            )}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Discovery Section - Always List Style */}
                        <section className="space-y-10">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic">
                                    {searchQuery ? `Search: ${searchQuery}` : 'The Collection'}
                                </h2>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {podcasts.data.length === 0 ? (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-40 rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-xl"
                                    >
                                        <Search className="size-20 mx-auto mb-8 text-muted-foreground/20" />
                                        <h3 className="text-2xl font-black tracking-tight text-foreground">No records found</h3>
                                        <p className="text-lg text-muted-foreground mt-2 max-w-sm mx-auto opacity-40 font-medium italic">
                                            Try adjusting your search or filters.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6 animate-in fade-in duration-1000">
                                        {podcasts.data.map((podcast) => (
                                            <PodcastListItem key={podcast.id} podcast={podcast} />
                                        ))}
                                    </div>
                                )}
                            </AnimatePresence>

                            {/* Load More Button */}
                            {podcasts.total > podcasts.data.length && (
                                <div className="flex justify-center pt-20">
                                    <button className="group relative flex items-center gap-6 px-12 py-5 bg-white text-black rounded-full font-black text-xs tracking-[0.4em] hover:bg-primary hover:text-white transition-all duration-700 overflow-hidden shadow-xl hover:scale-105 active:scale-95">
                                        <span className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                        <span className="relative z-10 uppercase">Load More Episodes</span>
                                        <ChevronRight className="relative z-10 size-5 group-hover:translate-x-2 transition-transform duration-500" />
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

