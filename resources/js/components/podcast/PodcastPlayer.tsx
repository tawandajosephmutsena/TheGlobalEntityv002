import React, { useRef, useState, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WaveformVisualizer } from './WaveformVisualizer';

// ─── YouTube helpers ───
const getYouTubeId = (url: string | null | undefined): string | null => {
    if (!url || typeof url !== 'string') return null;
    if (url.includes('youtu.be')) return url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || null;
    if (url.includes('youtube.com')) { const m = url.match(/[?&]v=([^&#]+)/); return m?.[1] || null; }
    return null;
};
const isYouTubeUrl = (url: string | null | undefined) => {
    if (!url || typeof url !== 'string') return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
};
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
        <div className={cn('rounded-3xl glass-effect apple-shadow apple-shadow-hover overflow-hidden transition-all duration-500', className)}>
            {/* Video display area */}
            {mediaType === 'video' ? (
                <div className={cn('relative bg-black group/video', isFullscreen ? 'fixed inset-0 z-50' : 'aspect-video')}>
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
                                    className="absolute bottom-4 right-4 z-10 text-[10px] font-black tracking-widest text-white/40 hover:text-white bg-black/40 hover:bg-black/60 px-4 py-2 rounded-full backdrop-blur-md border border-white/5 transition-all flex items-center gap-2"
                                >
                                    Watch on YouTube <ExternalLink className="size-3" />
                                </a>
                            </>
                        ) : (
                            <>
                                <img
                                    src={getYouTubeThumbnail(ytId)}
                                    alt={title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-105"
                                />
                                <button
                                    onClick={() => setYtActivated(true)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/40 transition-all duration-500 z-10 backdrop-blur-0 group-hover/video:backdrop-blur-[2px]"
                                    aria-label="Play video"
                                >
                                    <div className="size-20 rounded-full bg-primary/95 flex items-center justify-center text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group-hover/video:scale-100 scale-75">
                                        <Play className="size-8 fill-current ml-1" />
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
                                    className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/40 transition-all duration-500 z-10 backdrop-blur-0 group-hover/video:backdrop-blur-[2px]"
                                    aria-label="Play video"
                                >
                                    <div className="size-20 rounded-full bg-primary/95 flex items-center justify-center text-primary-foreground shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group-hover/video:scale-100 scale-75">
                                        <Play className="size-8 fill-current ml-1" />
                                    </div>
                                </button>
                            )}
                        </>
                    )}
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="absolute top-6 right-6 p-3 rounded-2xl bg-black/40 text-white hover:bg-black/60 backdrop-blur-md border border-white/10 transition-all z-10"
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                        {isFullscreen ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
                    </button>
                    {mediaType === 'video' && !isPlaying && (
                         <div className="absolute bottom-6 left-6 z-10 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                            <h3 className="text-white font-black text-sm tracking-tight">{title}</h3>
                            {artist && <p className="text-white/60 text-[11px] font-bold tracking-wider">{artist}</p>}
                         </div>
                    )}
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

            {/* Minimal variant UI */}
            {variant === 'minimal' && (
                <div className="flex items-center gap-6 p-2 px-4 h-full">
                    {thumbnail && (
                        <div className="size-10 rounded-lg overflow-hidden shrink-0 shadow-sm border border-white/10">
                            <img src={thumbnail} className="size-full object-cover" alt="" />
                        </div>
                    )}
                    
                    <div className="flex flex-col justify-center min-w-0 max-w-[150px]">
                        <h3 className="text-[11px] font-black tracking-tight truncate leading-none mb-1" title={title}>{title}</h3>
                        {artist && <p className="text-[9px] opacity-40 font-bold truncate leading-none">{artist}</p>}
                    </div>

                    <div className="flex-1 h-6 min-w-[100px] hidden sm:block">
                        <WaveformVisualizer
                            progress={progress}
                            isPlaying={isPlaying}
                            onClick={handleProgressClick}
                            ref={progressRef}
                            className="h-full"
                            barCount={60}
                            barWidth={2}
                            barGap={2}
                        />
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <div className="text-[9px] font-black opacity-30 tabular-nums hidden md:block">
                            {formatTime(currentTime)}
                        </div>
                        
                        <button
                            onClick={togglePlay}
                            className="size-10 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground flex items-center justify-center transition-all duration-300 active:scale-90"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current ml-0.5" />}
                        </button>

                        <button
                            onClick={cyclePlaybackRate}
                            className="h-7 px-2 rounded-lg bg-secondary/30 text-[9px] font-black tracking-widest text-secondary-foreground hover:bg-secondary transition-all hidden lg:block"
                        >
                            {playbackRate}x
                        </button>
                    </div>
                </div>
            )}

            {/* Player controls */}
            {variant !== 'minimal' && (
                <div className={cn("p-8 md:p-10", mediaType === 'video' && "pt-6")}>
                    <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
                    {/* Thumbnail */}
                    {mediaType === 'audio' && variant !== 'compact' && thumbnail && (
                        <div className="relative group shrink-0 self-center md:self-auto">
                            <div className="absolute -inset-2 bg-gradient-to-br from-primary/40 to-primary/0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-1000" />
                            <div
                                className="relative size-32 md:size-40 rounded-2xl bg-muted bg-cover bg-center shadow-2xl overflow-hidden apple-shadow transition-transform duration-700 group-hover:scale-[1.02]"
                                style={{ '--bg-image': `url(${thumbnail})` } as React.CSSProperties}
                            >
                                <div className="absolute inset-0 bg-[image:var(--bg-image)] bg-cover bg-center" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                            </div>
                        </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        {/* Title & artist */}
                        {variant !== 'compact' && (
                            <div className="space-y-1 mb-6 text-center md:text-left">
                                <h3 className="text-2xl md:text-3xl font-black tracking-tighter leading-none truncate" title={title}>{title}</h3>
                                {artist && (
                                    <p className="text-sm md:text-base font-bold text-muted-foreground/60 tracking-widest truncate" title={artist}>{artist}</p>
                                )}
                            </div>
                        )}

                        {/* Waveform / progress */}
                        <div className="space-y-4">
                            <WaveformVisualizer
                                progress={progress}
                                isPlaying={isPlaying}
                                onClick={handleProgressClick}
                                ref={progressRef}
                                className="h-16"
                                barCount={80}
                            />

                            {/* Time display */}
                            <div className="flex items-center justify-between text-[11px] font-black tracking-widest text-muted-foreground/40">
                                <span>{formatTime(currentTime)}</span>
                                <span>-{formatTime(duration - currentTime)}</span>
                            </div>
                        </div>

                        {/* Main Controls Area */}
                        <div className="flex flex-col sm:flex-row md:flex-row md:items-center gap-8 md:gap-10">
                            {/* Playback Controls */}
                            <div className="flex items-center gap-8">
                                <button
                                    onClick={() => skip(-10)}
                                    className="group relative text-muted-foreground hover:text-primary transition-colors p-2"
                                    title="Rewind 10s"
                                >
                                    <SkipBack className="size-6 transition-transform group-active:scale-90" />
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity">10</span>
                                </button>
                                <button
                                    onClick={togglePlay}
                                    className="size-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300 group"
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? (
                                        <Pause className="size-7 fill-current transition-transform group-hover:scale-110" />
                                    ) : (
                                        <Play className="size-7 fill-current ml-1 transition-transform group-hover:scale-110" />
                                    )}
                                </button>
                                <button
                                    onClick={() => skip(30)}
                                    className="group relative text-muted-foreground hover:text-primary transition-colors p-2"
                                    title="Forward 30s"
                                >
                                    <SkipForward className="size-6 transition-transform group-active:scale-90" />
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-black opacity-0 group-hover:opacity-100 transition-opacity">30</span>
                                </button>
                            </div>

                            {/* Secondary Controls Area */}
                            <div className="flex items-center gap-6 w-full sm:w-auto justify-center sm:justify-end">
                                {/* Playback speed */}
                                    <button
                                        onClick={cyclePlaybackRate}
                                        className="h-10 px-4 rounded-xl bg-secondary/50 text-[11px] font-black tracking-widest text-secondary-foreground hover:bg-secondary transition-all active:scale-95"
                                        title="Playback Speed"
                                    >
                                    {playbackRate}x
                                </button>

                                {/* Volume */}
                                <div className="flex items-center gap-3 group/volume">
                                    <button
                                        onClick={toggleMute}
                                        className="text-muted-foreground/60 hover:text-primary transition-colors p-1"
                                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                                    >
                                        {isMuted || volume === 0 ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
                                    </button>
                                    <div className="relative w-24 h-1.5 group-hover/volume:w-32 transition-all duration-500">
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={isMuted ? 0 : volume}
                                            onChange={handleVolumeChange}
                                            className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
                                            aria-label="Volume"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-secondary/50 overflow-hidden">
                                            <div
                                                className="h-full bg-primary/60 transition-all duration-300"
                                                style={{ '--volume-pct': `${(isMuted ? 0 : volume) * 100}%`, width: 'var(--volume-pct)' } as React.CSSProperties}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}
