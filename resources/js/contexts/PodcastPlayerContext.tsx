import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import ReactPlayer from 'react-player';

export interface PodcastTrack {
    src: string;
    title: string;
    artist?: string;
    thumbnail?: string | null;
    mediaType: 'audio' | 'video';
    podcastId?: number;
    slug?: string;
}

interface PodcastPlayerState {
    currentTrack: PodcastTrack | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    isMuted: boolean;
    playbackRate: number;
    isMinimized: boolean;
    isVisible: boolean;
}

interface PodcastPlayerActions {
    playTrack: (track: PodcastTrack) => void;
    pause: () => void;
    resume: () => void;
    togglePlay: () => void;
    seekTo: (seconds: number) => void;
    skip: (seconds: number) => void;
    setVolume: (volume: number) => void;
    toggleMute: () => void;
    setPlaybackRate: (rate: number) => void;
    cyclePlaybackRate: () => void;
    closePlayer: () => void;
    toggleMinimize: () => void;
    playerRef: React.RefObject<HTMLVideoElement | null>;
}

type PodcastPlayerContextType = PodcastPlayerState & PodcastPlayerActions;

const PodcastPlayerContext = createContext<PodcastPlayerContextType | null>(null);

export function usePodcastPlayer() {
    const context = useContext(PodcastPlayerContext);
    if (!context) {
        throw new Error('usePodcastPlayer must be used within a PodcastPlayerProvider');
    }
    return context;
}

export function usePodcastPlayerOptional() {
    return useContext(PodcastPlayerContext);
}

export function PodcastPlayerProvider({ children }: { children: React.ReactNode }) {
    const playerRef = useRef<HTMLVideoElement | null>(null);
    const [state, setState] = useState<PodcastPlayerState>({
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.8,
        isMuted: false,
        playbackRate: 1,
        isMinimized: true,
        isVisible: false,
    });

    const playTrack = useCallback((track: PodcastTrack) => {
        setState(prev => ({
            ...prev,
            currentTrack: track,
            isPlaying: true,
            currentTime: 0,
            duration: 0,
            isVisible: true,
            isMinimized: true,
        }));
    }, []);

    const pause = useCallback(() => {
        setState(prev => ({ ...prev, isPlaying: false }));
    }, []);

    const resume = useCallback(() => {
        setState(prev => ({ ...prev, isPlaying: true }));
    }, []);

    const togglePlay = useCallback(() => {
        setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    }, []);

    const seekTo = useCallback((seconds: number) => {
        const el = playerRef.current;
        if (el) {
            el.currentTime = seconds;
        }
        setState(prev => ({ ...prev, currentTime: seconds }));
    }, []);

    const skip = useCallback((seconds: number) => {
        const el = playerRef.current;
        if (!el) return;
        const current = el.currentTime;
        const dur = el.duration || 0;
        const newTime = Math.max(0, Math.min(current + seconds, dur));
        el.currentTime = newTime;
        setState(prev => ({ ...prev, currentTime: newTime }));
    }, []);

    const setVolume = useCallback((volume: number) => {
        setState(prev => ({
            ...prev,
            volume,
            isMuted: volume === 0,
        }));
    }, []);

    const toggleMute = useCallback(() => {
        setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
    }, []);

    const setPlaybackRate = useCallback((rate: number) => {
        setState(prev => ({ ...prev, playbackRate: rate }));
    }, []);

    const cyclePlaybackRate = useCallback(() => {
        const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
        setState(prev => {
            const currentIndex = rates.indexOf(prev.playbackRate);
            const nextRate = rates[(currentIndex + 1) % rates.length];
            return { ...prev, playbackRate: nextRate };
        });
    }, []);

    const closePlayer = useCallback(() => {
        setState(prev => ({
            ...prev,
            isPlaying: false,
            isVisible: false,
            currentTrack: null,
            currentTime: 0,
            duration: 0,
        }));
    }, []);

    const toggleMinimize = useCallback(() => {
        setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
    }, []);

    // Callbacks for ReactPlayer (used by GlobalPodcastPlayer)
    const handleProgress = useCallback((progressState: { playedSeconds: number }) => {
        setState(prev => ({ ...prev, currentTime: progressState.playedSeconds }));
    }, []);

    const handleDuration = useCallback((dur: number) => {
        setState(prev => ({ ...prev, duration: dur }));
    }, []);

    const handleEnded = useCallback(() => {
        setState(prev => ({ ...prev, isPlaying: false }));
    }, []);

    const value: PodcastPlayerContextType = {
        ...state,
        playTrack,
        pause,
        resume,
        togglePlay,
        seekTo,
        skip,
        setVolume,
        toggleMute,
        setPlaybackRate,
        cyclePlaybackRate,
        closePlayer,
        toggleMinimize,
        playerRef,
    };

    return (
        <PodcastPlayerContext.Provider value={value}>
            {children}
            {/* Hidden ReactPlayer — always mounted so playback persists across navigations */}
            {/* Skip YouTube URLs here — they can't play hidden and trigger bot checks.
                YouTube videos are handled in-place by PodcastPlayer's iframe embed. */}
            {state.currentTrack && state.isVisible && 
             !(state.currentTrack.src.includes('youtube.com') || state.currentTrack.src.includes('youtu.be')) && (
                <ReactPlayer
                    ref={playerRef}
                    src={state.currentTrack.src}
                    playing={state.isPlaying}
                    volume={state.isMuted ? 0 : state.volume}
                    playbackRate={state.playbackRate}
                    onTimeUpdate={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                        const el = e.currentTarget;
                        handleProgress({ playedSeconds: el.currentTime });
                    }}
                    onDurationChange={(e: React.SyntheticEvent<HTMLVideoElement>) => {
                        const el = e.currentTarget;
                        if (el.duration && isFinite(el.duration)) {
                            handleDuration(el.duration);
                        }
                    }}
                    onEnded={handleEnded as unknown as React.ReactEventHandler<HTMLVideoElement>}
                    width="0"
                    height="0"
                    style={{ position: 'absolute', pointerEvents: 'none', opacity: 0 }}
                />
            )}
        </PodcastPlayerContext.Provider>
    );
}
