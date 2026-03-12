import React, { useRef, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WaveformVisualizer } from './WaveformVisualizer';

// ─── YouTube helpers ───
const getYouTubeId = (url: string): string | null => {
    if (url.includes('youtu.be')) return url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || null;
    if (url.includes('youtube.com')) { const m = url.match(/[?&]v=([^&#]+)/); return m?.[1] || null; }
    return null;
};
const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');
const getYouTubeThumbnail = (id: string) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const getYouTubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
const getYouTubeEmbedUrl = (id: string) => `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&iv_load_policy=3`;

interface PodcastPlayerProps {
    src: string;
    title: string;
    artist?: string;
    thumbnail?: string | null;
    mediaType: 'audio' | 'video';
    duration?: number;
    description?: string | null;
    variant?: 'compact' | 'basic' | 'expanded';
    onPlay?: () => void;
    className?: string;
}

export function PodcastPlayer({
    src,
    title,
    artist,
    thumbnail,
    mediaType,
    duration: initialDuration,
    description,
    variant = 'expanded',
    onPlay,
    className,
}: PodcastPlayerProps) {
    const playerRef = useRef<HTMLVideoElement | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(initialDuration || 0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const togglePlay = useCallback(() => {
        setIsPlaying(prev => {
            const next = !prev;
            if (next && !hasPlayed) {
                setHasPlayed(true);
                onPlay?.();
            }
            return next;
        });
    }, [hasPlayed, onPlay]);

    const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
        setCurrentTime(e.currentTarget.currentTime);
    }, []);

    const handleDurationChange = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
        const dur = e.currentTarget.duration;
        if (dur && isFinite(dur)) {
            setDuration(dur);
        }
    }, []);

    const handleEnded = useCallback(() => {
        setIsPlaying(false);
    }, []);

    const skip = useCallback((seconds: number) => {
        const el = playerRef.current;
        if (!el) return;
        const newTime = Math.max(0, Math.min(el.currentTime + seconds, duration));
        el.currentTime = newTime;
        setCurrentTime(newTime);
    }, [duration]);

    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const progressBar = progressRef.current;
        const el = playerRef.current;
        if (!el || !progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        el.currentTime = pos * duration;
    }, [duration]);

    const toggleMute = useCallback(() => {
        setIsMuted(prev => !prev);
    }, []);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        setVolume(vol);
        if (vol === 0) setIsMuted(true);
        else if (isMuted) setIsMuted(false);
    }, [isMuted]);

    const cyclePlaybackRate = useCallback(() => {
        const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = rates.indexOf(playbackRate);
        const nextRate = rates[(currentIndex + 1) % rates.length];
        setPlaybackRate(nextRate);
    }, [playbackRate]);

    const formatTime = (seconds: number): string => {
        if (!seconds || !isFinite(seconds)) return '0:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Note: ReactPlayer handles both local files and external URLs (YouTube, Vimeo) automatically

    const ytId = getYouTubeId(src);
    const isYT = isYouTubeUrl(src);
    const [ytActivated, setYtActivated] = useState(false);

    return (
        <div className={cn('rounded-2xl bg-card border border-border overflow-hidden', className)}>
            {/* Video display area */}
            {mediaType === 'video' ? (
                <div className={cn('relative bg-black', isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video')}>
                    {isYT && ytId ? (
                        /* YouTube: show thumbnail first, embed on click to avoid bot checks */
                        ytActivated ? (
                            <>
                                <iframe
                                    title={title}
                                    src={getYouTubeEmbedUrl(ytId)}
                                    className="absolute inset-0 w-full h-full"
                                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                <a
                                    href={getYouTubeWatchUrl(ytId)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute bottom-3 right-3 z-10 text-xs text-white/60 hover:text-white bg-black/50 hover:bg-black/70 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors flex items-center gap-1"
                                >
                                    Watch on YouTube <ExternalLink className="size-3" />
                                </a>
                            </>
                        ) : (
                            <>
                                <img
                                    src={getYouTubeThumbnail(ytId)}
                                    alt={title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => setYtActivated(true)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40 z-10"
                                    aria-label="Play video"
                                >
                                    <div className="size-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/40 transition-transform hover:scale-110">
                                        <Play className="size-7 ml-1" />
                                    </div>
                                </button>
                            </>
                        )
                    ) : (
                        /* Direct video: use ReactPlayer as before */
                        <>
                            <ReactPlayer
                                ref={playerRef}
                                src={src}
                                playing={isPlaying}
                                volume={isMuted ? 0 : volume}
                                playbackRate={playbackRate}
                                onTimeUpdate={handleTimeUpdate}
                                onDurationChange={handleDurationChange}
                                onEnded={handleEnded as unknown as React.ReactEventHandler<HTMLVideoElement>}
                                width="100%"
                                height="100%"
                                style={{ position: 'absolute', top: 0, left: 0 }}
                                playsInline
                            />
                            {!isPlaying && (
                                <button
                                    onClick={togglePlay}
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/40 z-10"
                                    aria-label="Play video"
                                >
                                    <div className="size-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/40 transition-transform hover:scale-110">
                                        <Play className="size-7 ml-1" />
                                    </div>
                                </button>
                            )}
                        </>
                    )}
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                        {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                    </button>
                </div>
            ) : (
                /* Hidden audio player — ReactPlayer handles both local files and external URLs */
                <ReactPlayer
                    ref={playerRef}
                    src={src}
                    playing={isPlaying}
                    volume={isMuted ? 0 : volume}
                    playbackRate={playbackRate}
                    onTimeUpdate={handleTimeUpdate}
                    onDurationChange={handleDurationChange}
                    onEnded={handleEnded as unknown as React.ReactEventHandler<HTMLVideoElement>}
                    width="0"
                    height="0"
                    style={{ display: 'none' }}
                />
            )}

            {/* Player controls */}
            <div className="p-6">
                <div className="flex items-center gap-6">
                    {/* Thumbnail */}
                    {mediaType === 'audio' && variant !== 'compact' && (
                        <div className="relative group shrink-0 hidden sm:block">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-xl blur opacity-25 group-hover:opacity-50 transition-all duration-500" />
                            <div
                                className="relative size-20 rounded-lg bg-muted bg-cover bg-center shadow-md overflow-hidden"
                                style={thumbnail ? { backgroundImage: `url(${thumbnail})` } : undefined}
                            >
                                {!thumbnail && (
                                    <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/50">
                                        <Play className="size-8" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex-1 min-w-0 space-y-4">
                        {/* Title & artist */}
                        {variant !== 'compact' && (
                            <div>
                                <h3 className="text-lg font-bold truncate" title={title}>{title}</h3>
                                {artist && (
                                    <p className="text-sm text-muted-foreground truncate" title={artist}>{artist}</p>
                                )}
                            </div>
                        )}

                        {/* Description (Expanded variant only) */}
                        {variant === 'expanded' && description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {description}
                            </p>
                        )}

                        {/* Waveform / progress */}
                        <div className="space-y-2 pt-2">
                            <WaveformVisualizer
                                progress={progress}
                                isPlaying={isPlaying}
                                onClick={handleProgressClick}
                                ref={progressRef}
                            />

                            {/* Time display */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => skip(-10)}
                                    className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                                    title="Rewind 10s"
                                    aria-label="Rewind 10 seconds"
                                >
                                    <SkipBack className="size-5" />
                                </button>
                                <button
                                    onClick={togglePlay}
                                    className="size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-primary/20"
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
                                </button>
                                <button
                                    onClick={() => skip(30)}
                                    className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                                    title="Forward 30s"
                                    aria-label="Skip forward 30 seconds"
                                >
                                    <SkipForward className="size-5" />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 md:gap-4">
                                {/* Playback speed */}
                                <button
                                    onClick={cyclePlaybackRate}
                                    className="text-xs font-bold px-2.5 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                                    aria-label="Change playback speed"
                                    title="Playback Speed"
                                >
                                    {playbackRate}x
                                </button>

                                {/* Volume */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <button 
                                        onClick={toggleMute} 
                                        className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
                                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                                        title="Toggle Mute"
                                    >
                                        {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                                    </button>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="w-20 h-1.5 rounded-full bg-secondary accent-primary cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                        aria-label="Volume"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
