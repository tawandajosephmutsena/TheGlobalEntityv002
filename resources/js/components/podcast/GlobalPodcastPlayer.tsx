import React, { useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, X, ChevronUp, ChevronDown } from 'lucide-react';
import { usePodcastPlayer } from '@/contexts/PodcastPlayerContext';
import { cn } from '@/lib/utils';

export function GlobalPodcastPlayer() {
    const {
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playbackRate,
        isVisible,
        isMinimized,
        togglePlay,
        skip,
        seekTo,
        setVolume,
        toggleMute,
        cyclePlaybackRate,
        closePlayer,
        toggleMinimize,
    } = usePodcastPlayer();

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const formatTime = useCallback((seconds: number): string => {
        if (!seconds || !isFinite(seconds)) return '0:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    }, []);

    const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        seekTo(pos * duration);
    }, [duration, seekTo]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    }, [setVolume]);

    if (!currentTrack || !isVisible) return null;

    return (
        <div
            className={cn(
                'fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
                'bg-card/95 backdrop-blur-xl border-t border-border shadow-2xl shadow-black/20',
            )}
        >
            {/* Progress bar (clickable) — always on top */}
            <div
                className="h-1 w-full bg-muted cursor-pointer group relative"
                onClick={handleProgressClick}
            >
                <div
                    className="h-full bg-primary transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${progress}%`, transform: `translate(-50%, -50%)` }}
                />
            </div>

            {/* Main controls */}
            <div className="px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="relative shrink-0">
                        <div
                            className={cn(
                                'size-12 rounded-lg bg-muted bg-cover bg-center shadow-md overflow-hidden',
                                isPlaying && 'ring-2 ring-primary/50',
                            )}
                            style={currentTrack.thumbnail ? { backgroundImage: `url(${currentTrack.thumbnail})` } : undefined}
                        >
                            {!currentTrack.thumbnail && (
                                <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/50">
                                    <Play className="size-5" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate">{currentTrack.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {currentTrack.artist && <span className="truncate">{currentTrack.artist}</span>}
                            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Playback controls */}
                    <div className="flex items-center gap-2 md:gap-3">
                        <button
                            onClick={() => skip(-10)}
                            className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full"
                            aria-label="Rewind 10 seconds"
                        >
                            <SkipBack className="size-4" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                        </button>

                        <button
                            onClick={() => skip(30)}
                            className="hidden sm:flex text-muted-foreground hover:text-primary transition-colors p-1.5 rounded-full"
                            aria-label="Skip forward 30 seconds"
                        >
                            <SkipForward className="size-4" />
                        </button>
                    </div>

                    {/* Secondary controls */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Playback speed */}
                        <button
                            onClick={cyclePlaybackRate}
                            className="text-xs font-bold px-2 py-1 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                            aria-label="Change playback speed"
                        >
                            {playbackRate}x
                        </button>

                        {/* Volume */}
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={toggleMute}
                                className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-full"
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
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
                                className="w-16 h-1 rounded-full bg-secondary accent-primary cursor-pointer"
                                aria-label="Volume"
                            />
                        </div>
                    </div>

                    {/* Expand/Close */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={toggleMinimize}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full"
                            aria-label={isMinimized ? 'Expand' : 'Minimize'}
                        >
                            {isMinimized ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>
                        <button
                            onClick={closePlayer}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-full"
                            aria-label="Close player"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
