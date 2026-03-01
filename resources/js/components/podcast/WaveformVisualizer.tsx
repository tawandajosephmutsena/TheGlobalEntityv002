import React, { forwardRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface WaveformVisualizerProps {
    progress: number; // 0–100
    isPlaying: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
    barCount?: number;
    className?: string;
}

export const WaveformVisualizer = forwardRef<HTMLDivElement, WaveformVisualizerProps>(
    ({ progress, isPlaying, onClick, barCount = 60, className }, ref) => {
        // Generate deterministic but varied bar heights
        const barHeights = useMemo(() => {
            const heights: number[] = [];
            for (let i = 0; i < barCount; i++) {
                // Use a seeded pseudo-random pattern
                const seed = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
                const height = 20 + (seed - Math.floor(seed)) * 80; // 20% to 100%
                heights.push(height);
            }
            return heights;
        }, [barCount]);

        return (
            <div
                ref={ref}
                onClick={onClick}
                className={cn(
                    'flex items-end gap-[2px] h-12 w-full cursor-pointer group',
                    className
                )}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                {barHeights.map((height, i) => {
                    const barProgress = (i / barCount) * 100;
                    const isActive = barProgress <= progress;
                    return (
                        <div
                            key={i}
                            className={cn(
                                'flex-1 rounded-full transition-all duration-150',
                                isActive
                                    ? 'bg-primary'
                                    : 'bg-primary/20 group-hover:bg-primary/30',
                                isPlaying && isActive && 'animate-pulse'
                            )}
                            style={{
                                height: `${height}%`,
                                animationDelay: isPlaying ? `${i * 30}ms` : undefined,
                                animationDuration: isPlaying ? '1.5s' : undefined,
                            }}
                        />
                    );
                })}
            </div>
        );
    }
);

WaveformVisualizer.displayName = 'WaveformVisualizer';
