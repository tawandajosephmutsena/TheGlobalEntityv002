import React, { useCallback } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, Clock, Play, Tag, User, Headphones, Video,
} from 'lucide-react';
import { PodcastPlayer } from '@/components/podcast/PodcastPlayer';
import { PodcastCard } from '@/components/podcast/PodcastCard';
import { PodcastCategoryBadge } from '@/components/podcast/PodcastCategoryBadge';
import { ShareButtons } from '@/components/podcast/ShareButtons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MainLayout from '@/layouts/MainLayout';
import { SeoHead } from '@/components/SeoHead';
import { SharedData } from '@/types';

interface Podcast {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    media_full_url: string;
    media_type: 'audio' | 'video';
    thumbnail_url: string | null;
    duration: number;
    formatted_duration: string;
    formatted_file_size: string;
    play_count: number;
    share_count: number;
    season_number: number | null;
    episode_number: number | null;
    tags: string[] | null;
    published_at: string | null;
    category: { id: number; name: string; color: string } | null;
    author: { id: number; name: string } | null;
}

interface RelatedPodcast {
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

interface Props {
    podcast: Podcast;
    related: RelatedPodcast[];
}

export default function PodcastShow({ podcast, related }: Props) {
    const { props } = usePage<SharedData>();
    const site = props.site;

    const handlePlay = useCallback(() => {
        // Track play via API
        fetch(`/api/podcasts/${podcast.id}/play`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        }).catch(() => { /* silent fail */ });
    }, [podcast.id]);

    const publishedDate = podcast.published_at
        ? new Date(podcast.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    const currentUrl = typeof window !== 'undefined' ? window.location.href : `/podcasts/${podcast.slug}`;

    return (
        <MainLayout title={`${podcast.title} - ${site?.name || 'Podcasts'}`}>
            <SeoHead
                title={podcast.title}
                description={podcast.description || `Listen to ${podcast.title}`}
                image={podcast.thumbnail_url || undefined}
            />

            <main className="min-h-screen pb-20">
                {/* Back navigation */}
                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
                    <Link
                        href="/podcasts"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="size-4" /> All Episodes
                    </Link>
                </div>

                <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-10">
                    {/* Header */}
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-3">
                            {podcast.category && (
                                <PodcastCategoryBadge category={podcast.category} />
                            )}
                            {podcast.season_number && podcast.episode_number && (
                                <Badge variant="secondary" className="text-xs">
                                    S{podcast.season_number} · E{podcast.episode_number}
                                </Badge>
                            )}
                            <Badge variant="secondary" className="text-xs gap-1">
                                {podcast.media_type === 'video' ? <Video className="size-3" /> : <Headphones className="size-3" />}
                                {podcast.media_type === 'video' ? 'Video' : 'Audio'}
                            </Badge>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                            {podcast.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                            {podcast.author && (
                                <span className="flex items-center gap-1.5">
                                    <User className="size-4" />
                                    {podcast.author.name}
                                </span>
                            )}
                            {publishedDate && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="size-4" />
                                    {publishedDate}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-4" />
                                {podcast.formatted_duration}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Play className="size-4" />
                                {podcast.play_count.toLocaleString()} plays
                            </span>
                        </div>
                    </div>

                    {/* Player */}
                    <PodcastPlayer
                        src={podcast.media_full_url}
                        title={podcast.title}
                        artist={podcast.author?.name}
                        thumbnail={podcast.thumbnail_url}
                        mediaType={podcast.media_type}
                        duration={podcast.duration}
                        variant="compact"
                        onPlay={handlePlay}
                    />

                    {/* Content grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            {podcast.description && (
                                <div className="space-y-3">
                                    <h2 className="text-xl font-bold">About this episode</h2>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {podcast.description}
                                    </p>
                                </div>
                            )}

                            {/* Extended notes */}
                            {podcast.content && (
                                <div className="space-y-3">
                                    <h2 className="text-xl font-bold">Show Notes</h2>
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                                        dangerouslySetInnerHTML={{ __html: podcast.content }}
                                    />
                                </div>
                            )}

                            {/* Tags */}
                            {podcast.tags && podcast.tags.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-muted-foreground flex items-center gap-1.5">
                                        <Tag className="size-3.5" /> Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {podcast.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Share */}
                            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                                <h3 className="font-bold">Share this episode</h3>
                                <ShareButtons url={currentUrl} title={podcast.title} />
                            </div>

                            {/* Episode info */}
                            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                                <h3 className="font-bold">Episode Details</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-medium">{podcast.formatted_duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">File Size</span>
                                        <span className="font-medium">{podcast.formatted_file_size}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Type</span>
                                        <span className="font-medium capitalize">{podcast.media_type}</span>
                                    </div>
                                    {podcast.season_number && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Season</span>
                                            <span className="font-medium">{podcast.season_number}</span>
                                        </div>
                                    )}
                                    {podcast.episode_number && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Episode</span>
                                            <span className="font-medium">{podcast.episode_number}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </aside>
                    </div>

                    {/* Related episodes */}
                    {related.length > 0 && (
                        <section className="space-y-6 pt-6 border-t border-border">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Related Episodes</h2>
                                <Link href="/podcasts">
                                    <Button variant="ghost" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {related.map((ep) => (
                                    <PodcastCard key={ep.id} podcast={ep} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>
        </MainLayout>
    );
}
