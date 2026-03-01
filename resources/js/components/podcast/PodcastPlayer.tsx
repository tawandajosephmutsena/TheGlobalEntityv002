import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import ReactPlayer from 'react-player';
import { cn } from '@/lib/utils';
import { WaveformVisualizer } from './WaveformVisualizer';

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
    const audioRef = useRef<HTMLAudioElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const videoRef = useRef<any>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(initialDuration || 0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Audio-specific event listeners
    useEffect(() => {
        if (mediaType !== 'audio') return;
        
        const media = audioRef.current;
        if (!media) return;

        const handleTimeUpdate = () => setCurrentTime(media.currentTime);
        const handleDurationChange = () => {
            if (media.duration && isFinite(media.duration)) {
                setDuration(media.duration);
            }
        };
        const handleEnded = () => setIsPlaying(false);
        const handlePlayEvent = () => setIsPlaying(true);
        const handlePauseEvent = () => setIsPlaying(false);

        media.addEventListener('timeupdate', handleTimeUpdate);
        media.addEventListener('durationchange', handleDurationChange);
        media.addEventListener('loadedmetadata', handleDurationChange);
        media.addEventListener('ended', handleEnded);
        media.addEventListener('play', handlePlayEvent);
        media.addEventListener('pause', handlePauseEvent);

        return () => {
            media.removeEventListener('timeupdate', handleTimeUpdate);
            media.removeEventListener('durationchange', handleDurationChange);
            media.removeEventListener('loadedmetadata', handleDurationChange);
            media.removeEventListener('ended', handleEnded);
            media.removeEventListener('play', handlePlayEvent);
            media.removeEventListener('pause', handlePauseEvent);
        };
    }, [mediaType]);

    const togglePlay = useCallback(async () => {
        try {
            if (mediaType === 'audio') {
                const media = audioRef.current;
                if (!media) return;
                
                if (isPlaying) {
                    media.pause();
                } else {
                    await media.play();
                    if (!hasPlayed) {
                        setHasPlayed(true);
                        onPlay?.();
                    }
                }
            } else {
                // Video handling via ReactPlayer state
                setIsPlaying(!isPlaying);
                if (!isPlaying && !hasPlayed) {
                    setHasPlayed(true);
                    onPlay?.();
                }
            }
        } catch (error) {
            console.error('Playback failed:', error);
            setIsPlaying(false);
        }
    }, [isPlaying, hasPlayed, onPlay, mediaType]);

    const skip = useCallback((seconds: number) => {
        if (mediaType === 'audio') {
            const media = audioRef.current;
            if (!media) return;
            media.currentTime = Math.max(0, Math.min(media.currentTime + seconds, duration));
        } else {
            const media = videoRef.current;
            if (!media) return;
            media.seekTo(Math.max(0, Math.min(currentTime + seconds, duration)), 'seconds');
        }
    }, [duration, mediaType, currentTime]);

    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const progressBar = progressRef.current;
        if (!progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const newTime = pos * duration;
        
        if (mediaType === 'audio') {
            if (audioRef.current) audioRef.current.currentTime = newTime;
        } else {
            if (videoRef.current) videoRef.current.seekTo(newTime, 'seconds');
        }
    }, [duration, mediaType]);

    const toggleMute = useCallback(() => {
        if (mediaType === 'audio') {
            if (audioRef.current) audioRef.current.muted = !isMuted;
        }
        setIsMuted(!isMuted);
    }, [isMuted, mediaType]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const vol = parseFloat(e.target.value);
        if (mediaType === 'audio') {
            if (audioRef.current) audioRef.current.volume = vol;
        }
        setVolume(vol);
        if (vol === 0) setIsMuted(true);
        else if (isMuted) setIsMuted(false);
    }, [isMuted, mediaType]);

    const cyclePlaybackRate = useCallback(() => {
        const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
        const currentIndex = rates.indexOf(playbackRate);
        const nextRate = rates[(currentIndex + 1) % rates.length];
        
        if (mediaType === 'audio' && audioRef.current) {
            audioRef.current.playbackRate = nextRate;
        }
        setPlaybackRate(nextRate);
    }, [playbackRate, mediaType]);

    const formatTime = (seconds: number): string => {
        if (!seconds || !isFinite(seconds)) return '0:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cn('rounded-2xl bg-card border border-border overflow-hidden', className)}>
            {/* Video element (hidden for audio) */}
            {mediaType === 'video' ? (
                <div className={cn('relative bg-black transition-all duration-300', isFullscreen ? 'fixed inset-0 z-[100]' : 'aspect-video')}>
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    {/* @ts-ignore - React 19 class components mismatch */}
                    <ReactPlayer
                        ref={videoRef}
                        url={src}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        volume={volume}
                        muted={isMuted}
                        playbackRate={playbackRate}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onProgress={(state: any) => setCurrentTime(state.playedSeconds)}
                        onDuration={(d: number) => setDuration(d)}
                        onEnded={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onReady={() => setIsVideoReady(true)}
                        config={
                            {
                                youtube: { playerVars: { showinfo: 1, controls: 0 } },
                                vimeo: { playerOptions: { byline: false, portrait: false, title: false, controls: false } }
                            } as any
                        }
                    />
                    {(!isPlaying || !isVideoReady) && (
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
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors z-20"
                        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                        {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
                    </button>
                </div>
            ) : (
                <audio ref={audioRef} src={src} preload="metadata" />
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
                                        title="Toggle Mite"
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
