import React, { useCallback } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, Clock, Play, Tag, Headphones, Share2, Video,
} from 'lucide-react';
import { PodcastPlayer } from '@/components/podcast/PodcastPlayer';
import { usePodcastPlayer } from '@/contexts/PodcastPlayerContext';
import { PodcastCard } from '@/components/podcast/PodcastCard';
import { ShareButtons } from '@/components/podcast/ShareButtons';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PodcastCategoryBadge } from '@/components/podcast/PodcastCategoryBadge';
import MainLayout from '@/layouts/MainLayout';
import { SeoHead } from '@/components/SeoHead';
import { SharedData } from '@/types';

interface Category {
    id: number;
    name: string;
    color: string;
}

interface Episode {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    media_full_url: string;
    media_type: 'audio' | 'video';
    thumbnail_url: string | null;
    duration: string | number;
    formatted_duration: string;
    formatted_file_size: string;
    play_count: number;
    share_count: number;
    season_number: number | null;
    episode_number: number | null;
    tags: string[] | null;
    published_at: string | null;
    category: Category | null;
    categories: Category[];
    author: { id: number; name: string } | null;
    thumbnail: string | null;
    external_link: string | null;
    media_path: string;
    transcript_url: string | null;
    transcript_link_text: string | null;
    created_at: string;
}

interface Props {
    podcast: Episode;
    related: Episode[];
    site?: {
        name: string;
    };
}

export default function PodcastShow({ podcast, related, site: propSite }: Props) {
    const { props } = usePage<SharedData>();
    const site = propSite || props.site;
    const { playTrack, currentTrack, togglePlay } = usePodcastPlayer();

    const handlePlay = useCallback(() => {
        const mediaSrc = podcast?.external_link || podcast?.media_path || podcast?.media_full_url;
        
        if (currentTrack?.src === mediaSrc) {
            togglePlay();
            return;
        }

        if (podcast) {
            playTrack({
                src: mediaSrc,
                title: podcast.title,
                artist: podcast.author?.name || site?.name || 'The Global Entity',
                thumbnail: podcast.thumbnail || podcast.thumbnail_url,
                mediaType: podcast.media_type,
                podcastId: podcast.id,
                slug: podcast.slug,
            });

            fetch(`/api/podcasts/${podcast.id}/play`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            }).catch(() => { /* silent fail */ });
        }
    }, [podcast, currentTrack, playTrack, togglePlay, site]);

    if (!podcast) {
        return (
            <MainLayout title="Episode Not Found">
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold">Episode not found</h1>
                        <Link href="/podcasts" className="text-primary hover:underline">Return to all episodes</Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const currentUrl = typeof window !== 'undefined' ? window.location.href : `/podcasts/${podcast.slug}`;
    const displayImage = podcast.thumbnail || podcast.thumbnail_url;

    return (
        <MainLayout title={podcast.title}>
            <div className="relative">
            <SeoHead
                title={podcast.title}
                description={podcast.description || `Listen to ${podcast.title}`}
                image={displayImage || undefined}
            />

            <main className="min-h-screen pb-20">
                {/* Immersive Header */}
                <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                    {/* Background Blur Effect */}
                    {displayImage && (
                        <div 
                            className="absolute inset-0 z-0 bg-cover bg-center scale-110 blur-3xl opacity-30 dark:opacity-20"
                            style={{ backgroundImage: `url(${displayImage})` }}
                        />
                    )}
                    
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/0 via-background/60 to-background" />

                    <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col justify-end pb-12">
                        <Link 
                            href="/podcasts" 
                            className="inline-flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-all mb-12 group"
                        >
                            <div className="size-8 rounded-full border border-border/40 flex items-center justify-center transition-all group-hover:border-primary/40 group-hover:bg-primary/5">
                                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                            </div>
                            Back to Library
                        </Link>

                        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-12 items-end">
                            {/* Large Thumbnail with Floating Animation */}
                            <div className="relative group hidden sm:block animate-in fade-in zoom-in-95 duration-1000 ease-apple">
                                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
                                <div className="relative size-64 md:size-96 rounded-[3rem] overflow-hidden apple-shadow-hover ring-1 ring-white/10 transition-transform duration-700 hover:scale-[1.02] hover:-rotate-1">
                                    {displayImage ? (
                                        <img 
                                            src={displayImage} 
                                            alt={podcast.title} 
                                            className="size-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="size-full bg-muted flex items-center justify-center">
                                            <Headphones className="size-24 text-muted-foreground/20" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-6 flex-1 max-w-2xl">
                                <div className="flex flex-wrap items-center gap-3">
                                    {podcast.categories && podcast.categories.length > 0 ? (
                                        podcast.categories.map((cat) => (
                                            <PodcastCategoryBadge key={cat.id} category={cat} />
                                        ))
                                    ) : podcast.category ? (
                                        <PodcastCategoryBadge category={podcast.category} />
                                    ) : null}
                                    {podcast.media_type === 'video' && (
                                        <Badge variant="secondary" className="gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-md border-white/20 text-[10px] font-black uppercase tracking-widest">
                                            <Video className="size-3" /> Video
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1] animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    {podcast.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-xs font-black uppercase tracking-widest text-muted-foreground/80">
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Calendar className="size-3.5 text-primary" />
                                        </div>
                                        {podcast.published_at ? new Date(podcast.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(podcast.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Clock className="size-3.5 text-primary" />
                                        </div>
                                        {podcast.formatted_duration}
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Play className="size-3.5 text-primary" />
                                        </div>
                                        {podcast.play_count.toLocaleString()} plays
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 lg:gap-20">
                        {/* Main Content */}
                        <div className="min-w-0 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                            {/* Player Card */}
                            <div className="glass-effect rounded-3xl p-6 md:p-8 apple-shadow -mt-10 overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <PodcastPlayer
                                    src={podcast.external_link || podcast.media_path || podcast.media_full_url}
                                    title={podcast.title}
                                    artist={podcast.author?.name || site?.name}
                                    thumbnail={displayImage}
                                    mediaType={podcast.media_type}
                                    duration={podcast.duration as any}
                                    variant="expanded"
                                    onPlay={handlePlay}
                                />
                            </div>

                            {/* Details */}
                            <div className="space-y-12">
                                {podcast.description && (
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-bold tracking-tight">About this episode</h2>
                                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {podcast.description}
                                        </p>
                                    </section>
                                )}

                                {podcast.content && (
                                    <section className="space-y-4">
                                        <h2 className="text-2xl font-bold tracking-tight">Show Notes</h2>
                                        <div 
                                            className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground"
                                            dangerouslySetInnerHTML={{ __html: podcast.content }}
                                        />
                                    </section>
                                )}

                                {podcast.tags && podcast.tags.length > 0 && (
                                    <section className="space-y-4 pt-6 border-t">
                                        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground/60 uppercase tracking-widest">
                                            <Tag className="size-4" />
                                            Tags
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {podcast.tags.map((tag) => (
                                                <Badge 
                                                    key={tag} 
                                                    variant="secondary" 
                                                    className="px-4 py-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors border-none"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
                            {/* Share & Actions */}
                            <div className="glass-effect rounded-3xl p-6 apple-shadow">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                            <Share2 className="size-5 text-primary" />
                                        </div>
                                        <h3 className="font-bold">Spread the word</h3>
                                    </div>
                                    <ShareButtons url={currentUrl} title={podcast.title} />
                                    {podcast.transcript_url && (
                                        <div className="pt-4 border-t">
                                            <Button asChild variant="outline" className="w-full rounded-2xl h-12 border-muted-foreground/20 hover:bg-muted group">
                                                <a href={podcast.transcript_url} target="_blank" rel="noopener noreferrer">
                                                    {podcast.transcript_link_text || 'View Transcript'}
                                                    <Headphones className="ml-2 size-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                </a>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Related Content */}
                            {related && related.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold tracking-tight">More like this</h3>
                                        <Link href="/podcasts" className="text-sm font-medium text-primary hover:underline">
                                            View all
                                        </Link>
                                    </div>
                                    <div className="space-y-4">
                                        {related.slice(0, 3).map((ep, index) => (
                                            <PodcastCard 
                                                key={ep.id} 
                                                podcast={ep} 
                                                variant="compact" 
                                                className={`animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[${700 + index * 100}ms]`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
            </div>
        </MainLayout>
    );
}
