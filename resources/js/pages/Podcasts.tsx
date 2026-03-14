import React from 'react';
import { router, usePage } from '@inertiajs/react';
import { Headphones, TrendingUp, Sparkles } from 'lucide-react';
import { PodcastCard } from '@/components/podcast/PodcastCard';
import { PodcastSearch } from '@/components/podcast/PodcastSearch';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MainLayout from '@/layouts/MainLayout';
import { SeoHead } from '@/components/SeoHead';

interface Podcast {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    media_type: 'audio' | 'video';
    formatted_duration: string;
    play_count: number;
    category: { id: number; name: string; color: string } | null;
}

interface PodcastCategory {
    id: number;
    name: string;
    slug: string;
    color: string;
    podcasts_count: number;
}

interface Props {
    podcasts: {
        data: Podcast[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    featured: Podcast[];
    categories: PodcastCategory[];
    filters: {
        search?: string;
        category?: string;
    };
}

export default function PodcastsIndex({ podcasts, featured, categories, filters }: Props) {
    const page = usePage<{ settings?: Record<string, string> }>();
    const siteName = page.props.settings?.site_name || 'Our';

    return (
        <MainLayout title={`Podcasts - ${siteName}`}>
            <div className="relative">
            <SeoHead
                title="Podcasts"
                description="Explore our collection of episodes — from engaging conversations to insightful deep dives."
            />

            <main className="min-h-screen pb-32">
                {/* Immersive Hero Section */}
                <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden">
                    {/* Apple-style Gradient Background */}
                    <div className="absolute inset-0 bg-background" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse" />
                        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] opacity-30" />
                    </div>
                    
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-12">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full glass-effect border border-white/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-apple">
                            <Sparkles className="size-3.5" />
                            Premium Content
                        </div>

                        {/* High-impact Title */}
                        <div className="space-y-4 max-w-4xl mx-auto">
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 ease-apple">
                                Listen to the 
                                <span className="block text-primary drop-shadow-sm">Future of Tech.</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 ease-apple opacity-80">
                                Converging insights from the world's most innovative minds, delivered directly to your ears.
                            </p>
                        </div>

                        {/* Search & Discovery */}
                        <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 ease-apple">
                            <div className="apple-shadow-hover rounded-3xl overflow-hidden">
                                <PodcastSearch />
                            </div>
                        </div>

                        {/* Animated Performance Stats */}
                        <div className="flex items-center justify-center gap-12 text-xs font-black uppercase tracking-widest text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400 ease-apple">
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                    <Headphones className="size-5" />
                                </div>
                                <span className="opacity-60">
                                    <strong className="text-lg text-foreground block">{podcasts.total}</strong> 
                                    Episodes
                                </span>
                            </div>
                            <div className="h-10 w-px bg-border/40" />
                            <div className="flex flex-col items-center gap-2 group">
                                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                    <TrendingUp className="size-5" />
                                </div>
                                <span className="opacity-60">
                                    <strong className="text-lg text-foreground block">{categories.length}</strong> 
                                    Categories
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-24">
                    {/* Featured Episodes - Larger Focus */}
                    {featured.length > 0 && (
                        <section className="space-y-12">
                            <div className="flex items-end justify-between border-b border-border/40 pb-8">
                                <div className="space-y-2">
                                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">Editors' Picks</h2>
                                    <p className="text-muted-foreground font-medium">Curated conversations for deeper exploration</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {featured.map((podcast, index) => (
                                    <PodcastCard 
                                        key={podcast.id} 
                                        podcast={podcast} 
                                        variant="featured" 
                                        className={cn(
                                            "animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-apple",
                                            index === 0 ? "delay-0" : index === 1 ? "delay-150" : "delay-300"
                                        )}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Filter Bar with Horizontal Scroll on Mobile */}
                    <section className="sticky top-24 z-30 py-4 glass-effect border-y border-white/5 apple-shadow">
                        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide px-4">
                            <button
                                onClick={() => router.get('/podcasts', {}, { preserveState: true })}
                                className={cn(
                                    'px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap',
                                    !filters.category
                                        ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20'
                                        : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                                )}
                            >
                                All Library
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => router.get('/podcasts', { category: cat.id }, { preserveState: true })}
                                    className={cn(
                                        'px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap',
                                        filters.category === String(cat.id)
                                            ? 'text-white shadow-xl'
                                            : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                                    )}
                                    style={
                                        filters.category === String(cat.id)
                                            ? { backgroundColor: cat.color, boxShadow: `0 8px 20px ${cat.color}30` }
                                            : undefined
                                    }
                                >
                                    {cat.name}
                                    <span className="ml-2 opacity-50 font-medium">({cat.podcasts_count})</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Episodes Library */}
                    <section className="space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tight">
                                {filters.category
                                    ? <span className="text-primary">{categories.find(c => String(c.id) === filters.category)?.name}</span>
                                    : 'Recent'
                                } Episodes
                            </h2>
                        </div>

                        {podcasts.data.length === 0 ? (
                            <div className="text-center py-32 glass-effect rounded-[3rem] border border-dashed border-border/60">
                                <Headphones className="size-20 mx-auto text-muted-foreground/20 mb-6" />
                                <h3 className="text-2xl font-black tracking-tight">No episodes found</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                                    {filters.search
                                        ? `We couldn't find anything matching "${filters.search}". Try different keywords.`
                                        : 'Our library is currently empty. Check back very soon!'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {podcasts.data.map((podcast, index) => (
                                    <PodcastCard 
                                        key={podcast.id} 
                                        podcast={podcast} 
                                        className={cn(
                                            "animate-in fade-in slide-in-from-bottom-8 duration-700 ease-apple",
                                            `delay-[${(index % 4) * 100}ms]`
                                        )}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Premium Pagination */}
                        {podcasts.last_page > 1 && (
                            <div className="flex justify-center items-center gap-3 pt-12">
                                {podcasts.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'ghost'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={cn(
                                            "min-w-10 h-10 rounded-xl font-black transition-all",
                                            link.active ? "shadow-lg shadow-primary/20 scale-110" : "hover:bg-muted"
                                        )}
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Button>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            </div>
        </MainLayout>
    );
}
