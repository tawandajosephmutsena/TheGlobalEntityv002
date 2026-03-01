import React from 'react';
import { Link } from '@inertiajs/react';
import { Play, Clock, Headphones, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PodcastCategoryBadge } from './PodcastCategoryBadge';

interface PodcastCardProps {
    podcast: {
        id: number;
        title: string;
        slug: string;
        description?: string | null;
        thumbnail_url?: string | null;
        media_type: 'audio' | 'video';
        formatted_duration: string;
        play_count: number;
        category?: {
            id: number;
            name: string;
            color: string;
        } | null;
    };
    variant?: 'default' | 'featured' | 'compact';
    className?: string;
}

export function PodcastCard({ podcast, variant = 'default', className }: PodcastCardProps) {
    if (variant === 'featured') {
        return (
            <Link
                href={`/podcasts/${podcast.slug}`}
                className={cn(
                    'group relative block rounded-2xl overflow-hidden bg-card border border-border transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1',
                    className
                )}
            >
                {/* Glow effect */}
                <div className="absolute -inset-px bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                        {podcast.thumbnail_url ? (
                            <img
                                src={podcast.thumbnail_url}
                                alt={podcast.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                {podcast.media_type === 'video' ? (
                                    <Video className="size-12 text-primary/40" />
                                ) : (
                                    <Headphones className="size-12 text-primary/40" />
                                )}
                            </div>
                        )}

                        {/* Play overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="size-14 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                                <Play className="size-6 ml-0.5" />
                            </div>
                        </div>

                        {/* Duration badge */}
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 text-white text-xs font-bold backdrop-blur-sm">
                            {podcast.formatted_duration}
                        </div>

                        {/* Media type badge */}
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/70 text-white text-xs font-bold backdrop-blur-sm flex items-center gap-1">
                            {podcast.media_type === 'video' ? <Video className="size-3" /> : <Headphones className="size-3" />}
                            {podcast.media_type === 'video' ? 'Video' : 'Audio'}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                        {podcast.category && (
                            <PodcastCategoryBadge category={podcast.category} />
                        )}
                        <h3 className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {podcast.title}
                        </h3>
                        {podcast.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{podcast.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Play className="size-3" /> {podcast.play_count.toLocaleString()} plays
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="size-3" /> {podcast.formatted_duration}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link
                href={`/podcasts/${podcast.slug}`}
                className={cn(
                    'group flex items-center gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors',
                    className
                )}
            >
                <div className="relative size-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    {podcast.thumbnail_url ? (
                        <img src={podcast.thumbnail_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <Play className="size-4 text-primary" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{podcast.title}</h4>
                    <p className="text-xs text-muted-foreground">{podcast.formatted_duration}</p>
                </div>
            </Link>
        );
    }

    // Default variant
    return (
        <Link
            href={`/podcasts/${podcast.slug}`}
            className={cn(
                'group block rounded-xl overflow-hidden bg-card border border-border transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
                className
            )}
        >
            {/* Thumbnail */}
            <div className="relative aspect-square bg-muted overflow-hidden">
                {podcast.thumbnail_url ? (
                    <img
                        src={podcast.thumbnail_url}
                        alt={podcast.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        {podcast.media_type === 'video' ? (
                            <Video className="size-10 text-primary/40" />
                        ) : (
                            <Headphones className="size-10 text-primary/40" />
                        )}
                    </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div className="size-12 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                        <Play className="size-5 ml-0.5" />
                    </div>
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-xs font-bold">
                    {podcast.formatted_duration}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                {podcast.category && (
                    <PodcastCategoryBadge category={podcast.category} size="sm" />
                )}
                <h3 className="font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                    {podcast.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Play className="size-3" /> {podcast.play_count.toLocaleString()}
                    </span>
                </div>
            </div>
        </Link>
    );
}
