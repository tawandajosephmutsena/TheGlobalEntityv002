import React, { useState, useEffect } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { PodcastPlayer } from '@/components/podcast/PodcastPlayer';
import { PodcastCard } from '@/components/podcast/PodcastCard';
import { ShareButtons } from '@/components/podcast/ShareButtons';
import { Headphones, Clock, Calendar, Eye } from 'lucide-react';

interface PodcastDetail {
    id: number;
    title: string;
    slug: string;
    description: string;
    show_notes?: string | null;
    thumbnail_url?: string | null;
    media_url: string;
    media_full_url: string;
    media_type: 'audio' | 'video';
    formatted_duration: string;
    duration: number;
    play_count: number;
    published_at: string;
    share_url: string;
    category?: { id: number; name: string; slug: string; color: string } | null;
    tags?: string[];
}

interface PodcastPlayerBlockProps {
    podcastSlug?: string;
    title?: string;
    description?: string;
    variant?: 'compact' | 'basic' | 'expanded';
    showRelated?: boolean;
    relatedLimit?: number;
    autoplay?: boolean;
}

export default function PodcastPlayerBlock({
    podcastSlug,
    title,
    description,
    variant = 'expanded',
    showRelated = true,
    relatedLimit = 3,
}: PodcastPlayerBlockProps) {
    const [podcast, setPodcast] = useState<PodcastDetail | null>(null);
    const [related, setRelated] = useState<PodcastDetail[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!podcastSlug) {
            setIsLoading(false);
            setError('No podcast selected');
            return;
        }

        const fetchPodcast = async () => {
            try {
                const res = await fetch(`/api/podcasts/search?slug=${encodeURIComponent(podcastSlug)}`);
                const data = await res.json();
                if (data.data && data.data.length > 0) {
                    setPodcast(data.data[0]);
                    // Fetch related
                    if (showRelated) {
                        const relRes = await fetch(`/api/podcasts/search?limit=${relatedLimit}&exclude=${data.data[0].id}`);
                        const relData = await relRes.json();
                        setRelated(relData.data || []);
                    }
                } else {
                    setError('Podcast not found');
                }
            } catch {
                setError('Failed to load podcast');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPodcast();
    }, [podcastSlug, showRelated, relatedLimit]);

    if (isLoading) {
        return (
            <section className="py-20 px-4 md:px-8 bg-background">
                <div className="max-w-4xl mx-auto">
                    <div className="h-96 bg-muted animate-pulse rounded-3xl" />
                </div>
            </section>
        );
    }

    if (error || !podcast) {
        return (
            <section className="py-20 px-4 md:px-8 bg-background">
                <div className="max-w-4xl mx-auto text-center">
                    <Headphones className="size-16 mx-auto mb-4 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-lg">
                        {error || 'Select a podcast to embed'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        Set the podcast slug in the page builder editor
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-muted/20 to-background">
            <div className="max-w-4xl mx-auto">
                {/* Optional custom title override */}
                {title && (
                    <AnimatedSection animation="fade-up" className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">{description}</p>
                        )}
                    </AnimatedSection>
                )}

                {/* Player Card */}
                <AnimatedSection animation="fade-up" delay={100}>
                    <div className="rounded-3xl overflow-hidden bg-card border border-border shadow-xl">
                        {/* Player */}
                        <PodcastPlayer
                            src={podcast.media_full_url}
                            mediaType={podcast.media_type}
                            title={title || podcast.title}
                            variant={variant === 'compact' ? 'compact' : 'basic'}
                            thumbnail={podcast.thumbnail_url || undefined}
                        />

                        {/* Info (Expanded only) */}
                        {variant === 'expanded' && (
                            <div className="p-6 md:p-8 border-t border-border bg-card/50">
                                {/* Meta */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3.5" />
                                        {podcast.formatted_duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Eye className="size-3.5" />
                                        {podcast.play_count} plays
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="size-3.5" />
                                        {new Date(podcast.published_at).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="text-muted-foreground">{description || podcast.description}</p>

                                {/* Tags */}
                                {podcast.tags && podcast.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {podcast.tags.map((tag) => (
                                            <span key={tag} className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Share */}
                                <div className="mt-8 pt-6 border-t border-border">
                                    <ShareButtons
                                        url={podcast.share_url}
                                        title={podcast.title}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </AnimatedSection>

                {/* Related Episodes */}
                {showRelated && related.length > 0 && (
                    <AnimatedSection animation="fade-up" delay={200} className="mt-12">
                        <h3 className="text-xl font-bold mb-6">More Episodes</h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related.map(ep => (
                                <PodcastCard key={ep.id} podcast={ep} />
                            ))}
                        </div>
                    </AnimatedSection>
                )}
            </div>
        </section>
    );
}
