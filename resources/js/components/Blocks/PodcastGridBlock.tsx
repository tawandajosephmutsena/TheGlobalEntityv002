import React, { useState, useEffect } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { PodcastCard } from '@/components/podcast/PodcastCard';
import { PodcastCategoryBadge } from '@/components/podcast/PodcastCategoryBadge';
import { PodcastSearch } from '@/components/podcast/PodcastSearch';
import { Headphones, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PodcastItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail_url?: string | null;
    media_type: 'audio' | 'video';
    formatted_duration: string;
    play_count: number;
    published_at: string;
    category?: { id: number; name: string; slug: string; color: string } | null;
    categories?: Array<{ id: number; name: string; slug: string; color: string }> | null;
}

interface CategoryItem {
    id: number;
    name: string;
    slug: string;
    color: string;
    podcasts_count: number;
}

interface PodcastGridBlockProps {
    title?: string;
    subtitle?: string;
    limit?: number;
    showSearch?: boolean;
    showCategories?: boolean;
    showFeatured?: boolean;
    columns?: 2 | 3 | 4;
    ctaText?: string;
    ctaHref?: string;
}

export default function PodcastGridBlock({
    title = 'Our Podcasts',
    subtitle = 'Listen to our latest episodes',
    limit = 6,
    showSearch = true,
    showCategories = true,
    columns = 3,
    ctaText = 'View All Podcasts',
    ctaHref = '/podcasts',
}: PodcastGridBlockProps) {
    const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                const params = new URLSearchParams();
                params.set('limit', String(limit));
                if (activeCategory) params.set('category', activeCategory);
                const res = await fetch(`/api/podcasts/search?${params.toString()}`);
                const data = await res.json();
                setPodcasts(data.data || []);
            } catch {
                setPodcasts([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPodcasts();
    }, [limit, activeCategory]);

    useEffect(() => {
        if (showCategories) {
            fetch('/api/podcasts/search?categories=1')
                .then(res => res.json())
                .then(data => setCategories(data.categories || []))
                .catch(() => setCategories([]));
        }
    }, [showCategories]);

    const gridColsClass = columns === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : columns === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

    return (
        <section className="py-20 px-4 md:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <AnimatedSection animation="fade-up" className="text-center mb-12">
                    {subtitle && (
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <Headphones className="size-4" />
                            {subtitle}
                        </span>
                    )}
                    {title && (
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                            {title}
                        </h2>
                    )}
                </AnimatedSection>

                {/* Search */}
                {showSearch && (
                    <AnimatedSection animation="fade-up" delay={100} className="max-w-md mx-auto mb-8">
                        <PodcastSearch placeholder="Search episodes..." />
                    </AnimatedSection>
                )}

                {/* Category Pills */}
                {showCategories && categories.length > 0 && (
                    <AnimatedSection animation="fade-up" delay={150} className="flex flex-wrap justify-center gap-2 mb-10">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={cn(
                                'px-4 py-2 rounded-full text-sm font-medium transition-all',
                                !activeCategory
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            )}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                                className={activeCategory === cat.slug ? 'ring-2 ring-primary rounded-full' : ''}
                                title={`Filter by ${cat.name}`}
                            >
                                <PodcastCategoryBadge category={{ name: cat.name, color: cat.color }} />
                            </button>
                        ))}
                    </AnimatedSection>
                )}

                {/* Grid */}
                {isLoading ? (
                    <div className={cn('grid gap-6', gridColsClass)}>
                        {Array.from({ length: limit }).map((_, i) => (
                            <div key={i} className="h-72 bg-muted animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : podcasts.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <Headphones className="size-12 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">No episodes found</p>
                    </div>
                ) : (
                    <div className={cn('grid gap-6', gridColsClass)}>
                        {podcasts.map((podcast, index) => (
                            <AnimatedSection key={podcast.id} animation="fade-up" delay={index * 80}>
                                <PodcastCard podcast={podcast} />
                            </AnimatedSection>
                        ))}
                    </div>
                )}

                {/* CTA */}
                {ctaText && ctaHref && (
                    <AnimatedSection animation="fade-up" delay={300} className="text-center mt-12">
                        <a
                            href={ctaHref}
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {ctaText}
                            <ArrowRight className="size-4" />
                        </a>
                    </AnimatedSection>
                )}
            </div>
        </section>
    );
}
