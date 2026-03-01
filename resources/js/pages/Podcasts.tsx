import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Headphones, TrendingUp } from 'lucide-react';
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
            <SeoHead
                title="Podcasts"
                description="Explore our collection of episodes — from engaging conversations to insightful deep dives."
            />

            <main className="min-h-screen">
                {/* Hero Section */}
                <section className="relative py-20 md:py-28 overflow-hidden">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl opacity-30" />

                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Headphones className="size-3.5" />
                            {siteName} Podcasts
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                            Listen. Learn.
                            <span className="text-primary block md:inline"> Be Inspired.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                            Explore our collection of episodes — from engaging conversations to insightful deep dives.
                        </p>

                        {/* Search */}
                        <div className="max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                            <PodcastSearch />
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
                            <span className="flex items-center gap-1.5">
                                <Headphones className="size-4 text-primary" />
                                <strong className="text-foreground">{podcasts.total}</strong> Episodes
                            </span>
                            <span className="flex items-center gap-1.5">
                                <TrendingUp className="size-4 text-primary" />
                                <strong className="text-foreground">{categories.length}</strong> Categories
                            </span>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 space-y-16">
                    {/* Featured Episodes */}
                    {featured.length > 0 && (
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Featured Episodes</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Hand-picked episodes we think you'll love</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featured.map((podcast) => (
                                    <PodcastCard key={podcast.id} podcast={podcast} variant="featured" />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Category filters */}
                    {categories.length > 0 && (
                        <section>
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() => router.get('/podcasts', {}, { preserveState: true })}
                                    className={cn(
                                        'px-4 py-2 rounded-full text-sm font-bold transition-all',
                                        !filters.category
                                            ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                            : 'bg-muted hover:bg-accent text-muted-foreground'
                                    )}
                                >
                                    All Episodes
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => router.get('/podcasts', { category: cat.id }, { preserveState: true })}
                                        className={cn(
                                            'px-4 py-2 rounded-full text-sm font-bold transition-all',
                                            filters.category === String(cat.id)
                                                ? 'text-white shadow-md'
                                                : 'bg-muted hover:bg-accent text-muted-foreground'
                                        )}
                                        style={
                                            filters.category === String(cat.id)
                                                ? { backgroundColor: cat.color, boxShadow: `0 4px 14px ${cat.color}40` }
                                                : undefined
                                        }
                                    >
                                        {cat.name}
                                        <span className="ml-1.5 opacity-70">({cat.podcasts_count})</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Episodes Grid */}
                    <section className="space-y-8">
                        <h2 className="text-2xl font-bold">
                            {filters.category
                                ? `${categories.find(c => String(c.id) === filters.category)?.name || ''} Episodes`
                                : 'All Episodes'
                            }
                        </h2>

                        {podcasts.data.length === 0 ? (
                            <div className="text-center py-20">
                                <Headphones className="size-16 mx-auto text-muted-foreground/30 mb-4" />
                                <h3 className="text-xl font-bold">No episodes found</h3>
                                <p className="text-muted-foreground mt-2">
                                    {filters.search
                                        ? `No results for "${filters.search}"`
                                        : 'Check back soon for new episodes!'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {podcasts.data.map((podcast) => (
                                    <PodcastCard key={podcast.id} podcast={podcast} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {podcasts.last_page > 1 && (
                            <div className="flex justify-center gap-2 pt-8">
                                {podcasts.links.map((link, i) => (
                                    <Button
                                        key={i}
                                        variant={link.active ? 'default' : 'outline'}
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className="min-w-8"
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </MainLayout>
    );
}
