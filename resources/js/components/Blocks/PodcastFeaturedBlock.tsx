import React, { useState, useEffect } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { Play, Headphones, Video, Clock, ArrowRight } from 'lucide-react';


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
}

interface PodcastFeaturedBlockProps {
    title?: string;
    subtitle?: string;
    description?: string;
    limit?: number;
    layout?: 'hero' | 'cards' | 'list';
    showPlayButton?: boolean;
    ctaText?: string;
    ctaHref?: string;
}

export default function PodcastFeaturedBlock({
    title = 'Featured Episodes',
    subtitle,
    description,
    limit = 3,
    layout = 'hero',
    showPlayButton = true,
    ctaText = 'Browse All',
    ctaHref = '/podcasts',
}: PodcastFeaturedBlockProps) {
    const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/podcasts/search?featured=1&limit=${limit}`)
            .then(res => res.json())
            .then(data => setPodcasts(data.data || []))
            .catch(() => setPodcasts([]))
            .finally(() => setIsLoading(false));
    }, [limit]);

    if (isLoading) {
        return (
            <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-muted/30 to-background">
                <div className="max-w-7xl mx-auto">
                    <div className="h-96 bg-muted animate-pulse rounded-3xl" />
                </div>
            </section>
        );
    }

    if (podcasts.length === 0) return null;

    const featured = podcasts[0];
    const rest = podcasts.slice(1);

    return (
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <AnimatedSection animation="fade-up" className="mb-12">
                    {subtitle && (
                        <span className="inline-flex items-center gap-2 text-primary text-sm font-semibold uppercase tracking-wider mb-3">
                            <Headphones className="size-4" />
                            {subtitle}
                        </span>
                    )}
                    {title && (
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            {description}
                        </p>
                    )}
                </AnimatedSection>

                {layout === 'hero' && (
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Main Featured */}
                        <AnimatedSection animation="fade-up" delay={100} className="lg:col-span-3">
                            <a href={`/podcasts/${featured.slug}`} className="group block relative rounded-3xl overflow-hidden bg-card border border-border shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                <div className="aspect-video relative overflow-hidden bg-muted">
                                    {featured.thumbnail_url ? (
                                        <img src={featured.thumbnail_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                            <Headphones className="size-20 text-primary/30" />
                                        </div>
                                    )}
                                    {/* Play overlay */}
                                    {showPlayButton && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
                                            <div className="size-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                                                <Play className="size-7 ml-1" />
                                            </div>
                                        </div>
                                    )}
                                    {/* Duration badge */}
                                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-xs font-medium flex items-center gap-1">
                                        <Clock className="size-3" />
                                        {featured.formatted_duration}
                                    </div>
                                    {/* Media type badge */}
                                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-semibold uppercase flex items-center gap-1">
                                        {featured.media_type === 'video' ? <Video className="size-3" /> : <Headphones className="size-3" />}
                                        {featured.media_type}
                                    </div>
                                </div>
                                <div className="p-6">
                                    {featured.category && (
                                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                            {featured.category.name}
                                        </span>
                                    )}
                                    <h3 className="text-2xl font-bold mt-1 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                        {featured.title}
                                    </h3>
                                    <p className="text-muted-foreground line-clamp-2">{featured.description}</p>
                                </div>
                            </a>
                        </AnimatedSection>

                        {/* Side Episodes */}
                        {rest.length > 0 && (
                            <div className="lg:col-span-2 flex flex-col gap-4">
                                {rest.map((podcast, index) => (
                                    <AnimatedSection key={podcast.id} animation="fade-up" delay={200 + index * 100}>
                                        <a href={`/podcasts/${podcast.slug}`} className="group flex gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                            <div className="size-20 rounded-xl overflow-hidden bg-muted shrink-0 relative">
                                                {podcast.thumbnail_url ? (
                                                    <img src={podcast.thumbnail_url} alt={podcast.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                                        <Headphones className="size-6 text-primary/40" />
                                                    </div>
                                                )}
                                                {showPlayButton && (
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                                        <Play className="size-5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {podcast.category && (
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                                        {podcast.category.name}
                                                    </span>
                                                )}
                                                <h4 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">
                                                    {podcast.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    <Clock className="size-3" />
                                                    <span>{podcast.formatted_duration}</span>
                                                    <span>•</span>
                                                    <span>{podcast.play_count} plays</span>
                                                </div>
                                            </div>
                                        </a>
                                    </AnimatedSection>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {layout === 'cards' && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {podcasts.map((podcast, index) => (
                            <AnimatedSection key={podcast.id} animation="fade-up" delay={100 + index * 80}>
                                <a href={`/podcasts/${podcast.slug}`} className="group block rounded-2xl overflow-hidden bg-card border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="aspect-video relative overflow-hidden bg-muted">
                                        {podcast.thumbnail_url ? (
                                            <img src={podcast.thumbnail_url} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                                <Headphones className="size-12 text-primary/30" />
                                            </div>
                                        )}
                                        {showPlayButton && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                                <div className="size-12 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-xl">
                                                    <Play className="size-5 ml-0.5" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        {podcast.category && (
                                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{podcast.category.name}</span>
                                        )}
                                        <h3 className="text-lg font-bold mt-1 mb-1 line-clamp-2 group-hover:text-primary transition-colors">{podcast.title}</h3>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Clock className="size-3" />
                                            <span>{podcast.formatted_duration}</span>
                                        </div>
                                    </div>
                                </a>
                            </AnimatedSection>
                        ))}
                    </div>
                )}

                {layout === 'list' && (
                    <div className="space-y-4">
                        {podcasts.map((podcast, index) => (
                            <AnimatedSection key={podcast.id} animation="fade-up" delay={100 + index * 60}>
                                <a href={`/podcasts/${podcast.slug}`} className="group flex items-center gap-6 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                    <div className="size-24 rounded-xl overflow-hidden bg-muted shrink-0 relative">
                                        {podcast.thumbnail_url ? (
                                            <img src={podcast.thumbnail_url} alt={podcast.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                                <Headphones className="size-8 text-primary/30" />
                                            </div>
                                        )}
                                        {showPlayButton && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                                <Play className="size-6 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        {podcast.category && (
                                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{podcast.category.name}</span>
                                        )}
                                        <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">{podcast.title}</h3>
                                        <p className="text-muted-foreground text-sm line-clamp-1 mt-1">{podcast.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                                            {podcast.media_type === 'video' ? <Video className="size-3" /> : <Headphones className="size-3" />}
                                            <span>{podcast.formatted_duration}</span>
                                            <span>•</span>
                                            <span>{podcast.play_count} plays</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                                </a>
                            </AnimatedSection>
                        ))}
                    </div>
                )}

                {/* CTA */}
                {ctaText && ctaHref && (
                    <AnimatedSection animation="fade-up" delay={400} className="text-center mt-12">
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
