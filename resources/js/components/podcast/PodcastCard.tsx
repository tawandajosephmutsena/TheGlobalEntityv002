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
        published_at?: string | null;
        created_at?: string;
        category?: {
            id: number;
            name: string;
            color: string;
        } | null;
        categories?: Array<{
            id: number;
            name: string;
            color: string;
        }> | null;
    };
    variant?: 'default' | 'featured' | 'compact';
    className?: string;
}

export function PodcastCard({ podcast, variant = 'default', className }: PodcastCardProps) {
    const displayDate = podcast.published_at 
        ? new Date(podcast.published_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
        : podcast.created_at ? new Date(podcast.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '';

    if (variant === 'featured') {
        return (
            <Link
                href={`/podcasts/${podcast.slug}`}
                className={cn(
                    'group relative block rounded-[2.5rem] overflow-hidden glass-effect apple-shadow-hover transition-all duration-700 ease-apple',
                    className
                )}
            >
                <div className="relative">
                    {/* Thumbnail with Gradient Mask */}
                    <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-muted overflow-hidden">
                        {podcast.thumbnail_url ? (
                            <img
                                src={podcast.thumbnail_url}
                                alt={podcast.title}
                                className="w-full h-full object-cover transition-transform duration-1000 ease-apple-out group-hover:scale-105"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent flex items-center justify-center">
                                {podcast.media_type === 'video' ? (
                                    <Video className="size-20 text-primary/20" />
                                ) : (
                                    <Headphones className="size-20 text-primary/20" />
                                )}
                            </div>
                        )}

                        {/* Immersive Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                        
                        {/* Play Action Layer */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                            <div className="size-24 rounded-full bg-primary/95 backdrop-blur-xl flex items-center justify-center text-primary-foreground shadow-[0_0_50px_rgba(var(--primary),0.3)] border border-white/20">
                                <Play className="size-10 fill-current ml-1" />
                            </div>
                        </div>

                        {/* Top Badges */}
                        <div className="absolute inset-x-6 top-6 flex justify-between items-start pointer-events-none">
                            <div className="flex gap-2">
                                <div className="px-4 py-2 rounded-full bg-black/40 text-white text-[10px] font-black tracking-widest backdrop-blur-xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-700">
                                    {podcast.media_type === 'video' ? <Video className="size-3.5" /> : <Headphones className="size-3.5" />}
                                    {podcast.media_type}
                                </div>
                            </div>
                            <div className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-[10px] font-black tracking-widest shadow-lg shadow-primary/20 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
                                Featured
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-8 md:p-10 space-y-6 relative">
                        <div className="flex flex-wrap items-center gap-4">
                            {podcast.categories && podcast.categories.length > 0 ? (
                                podcast.categories.map((cat) => (
                                    <PodcastCategoryBadge key={cat.id} category={cat} />
                                ))
                            ) : podcast.category ? (
                                <PodcastCategoryBadge category={podcast.category} />
                            ) : null}
                            <div className="h-4 w-px bg-border/50" />
                            <span className="text-[11px] font-black tracking-[0.2em] text-muted-foreground/50">
                                {displayDate}
                            </span>
                        </div>

                        <h3 className="text-3xl md:text-4xl font-black leading-[1.1] tracking-tight group-hover:text-primary transition-colors duration-500 line-clamp-2">
                            {podcast.title}
                        </h3>

                        {podcast.description && (
                            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2 opacity-70 group-hover:opacity-90 transition-opacity duration-500">
                                {podcast.description}
                            </p>
                        )}

                        <div className="flex items-center gap-8 pt-4 border-t border-border/40">
                            <span className="flex items-center gap-2.5 text-xs font-black tracking-widest text-muted-foreground/60 group-hover:text-foreground transition-colors">
                                <Play className="size-4 text-primary fill-current opacity-40" />
                                {podcast.play_count.toLocaleString()} Plays
                            </span>
                            <span className="flex items-center gap-2.5 text-xs font-black tracking-widest text-muted-foreground/60">
                                <Clock className="size-4 text-primary opacity-40" />
                                {podcast.formatted_duration}
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
                    'group flex items-center gap-5 p-4 rounded-[1.5rem] glass-effect hover:bg-accent/40 border border-transparent hover:border-white/10 transition-all duration-500 apple-shadow-hover',
                    className
                )}
            >
                <div className="relative size-20 rounded-2xl bg-muted overflow-hidden shrink-0 shadow-lg transition-transform duration-700 ease-apple group-hover:scale-105">
                    {podcast.thumbnail_url ? (
                        <img src={podcast.thumbnail_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                            <Headphones className="size-8 text-primary/30" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center backdrop-blur-none group-hover:backdrop-blur-[2px]">
                        <div className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                             <Play className="size-4 fill-current ml-0.5" />
                        </div>
                    </div>
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                    <h4 className="text-base font-black truncate group-hover:text-primary transition-colors duration-500">{podcast.title}</h4>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground font-black tracking-widest">{podcast.formatted_duration}</span>
                        <div className="size-1 rounded-full bg-border" />
                        <span className="text-[10px] text-muted-foreground font-black tracking-widest">{displayDate}</span>
                    </div>
                </div>
            </Link>
        );
    }

    // Default variant - Grid View
    return (
        <Link
            href={`/podcasts/${podcast.slug}`}
            className={cn(
                'group flex flex-col rounded-[2.5rem] overflow-hidden glass-effect border border-border/20 transition-all duration-700 apple-shadow apple-shadow-hover hover:-translate-y-1.5 ease-apple',
                className
            )}
        >
            {/* Thumbnail */}
            <div className="relative aspect-square bg-muted overflow-hidden">
                {podcast.thumbnail_url ? (
                    <img
                        src={podcast.thumbnail_url}
                        alt={podcast.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-apple-out group-hover:scale-110"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/5 to-transparent flex items-center justify-center">
                        {podcast.media_type === 'video' ? (
                            <Video className="size-16 text-primary/20" />
                        ) : (
                            <Headphones className="size-16 text-primary/20" />
                        )}
                    </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center backdrop-blur-none group-hover:backdrop-blur-[1px]">
                    <div className="size-20 rounded-full bg-primary/95 flex items-center justify-center text-primary-foreground shadow-2xl opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-700 ease-apple">
                        <Play className="size-8 fill-current ml-1" />
                    </div>
                </div>

                <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-black/60 text-white text-[10px] font-black tracking-widest backdrop-blur-xl border border-white/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    {podcast.formatted_duration}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col space-y-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                        {podcast.categories && podcast.categories.length > 0 ? (
                            podcast.categories.map((cat) => (
                                <PodcastCategoryBadge key={cat.id} category={cat} size="sm" />
                            ))
                        ) : podcast.category ? (
                            <PodcastCategoryBadge category={podcast.category} size="sm" />
                        ) : null}
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-muted-foreground/40 shrink-0">
                        {podcast.media_type}
                    </span>
                </div>
                <h3 className="font-black leading-[1.2] tracking-tight line-clamp-2 group-hover:text-primary transition-colors duration-500 text-lg">
                    {podcast.title}
                </h3>
                <div className="pt-3 mt-auto flex items-center justify-between text-[10px] font-black tracking-widest text-muted-foreground/60 border-t border-border/40">
                    <span className="flex items-center gap-1.5">
                        <Play className="size-3 text-primary fill-current opacity-30" /> 
                        {podcast.play_count.toLocaleString()}
                    </span>
                    <span>{displayDate}</span>
                </div>
            </div>
        </Link>
    );
}
