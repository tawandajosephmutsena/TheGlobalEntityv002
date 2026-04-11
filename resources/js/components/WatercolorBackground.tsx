import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Each variant defines unique blob configurations for a watercolor-inspired background.
 * Properties per blob: position classes, size classes, blur, opacity, color key, and optional mix-blend-mode.
 */
interface BlobConfig {
    position: string;
    size: string;
    blur: string;
    opacity: string;
    color: 'start' | 'end' | 'accent';
    blend?: string;
}

interface VariantConfig {
    blobs: BlobConfig[];
    /** Extra CSS class for grain intensity */
    grainOpacity?: string;
}

const variants: Record<string, VariantConfig> = {
    manifesto: {
        blobs: [
            { position: '-top-[15%] -right-[10%]', size: 'h-[50%] w-[45%]', blur: 'blur-[140px]', opacity: 'opacity-25', color: 'start', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'top-[40%] -left-[15%]', size: 'h-[35%] w-[30%]', blur: 'blur-[100px]', opacity: 'opacity-15', color: 'end' },
            { position: 'bottom-[5%] right-[20%]', size: 'h-[30%] w-[35%]', blur: 'blur-[110px]', opacity: 'opacity-12', color: 'accent', blend: 'mix-blend-overlay' },
            { position: '-bottom-[10%] left-[10%]', size: 'h-[20%] w-[25%]', blur: 'blur-[80px]', opacity: 'opacity-10', color: 'start' },
        ],
    },
    appleCards: {
        blobs: [
            { position: 'top-[5%] left-[25%]', size: 'h-[45%] w-[50%]', blur: 'blur-[150px]', opacity: 'opacity-20', color: 'accent', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-bottom-[15%] -right-[10%]', size: 'h-[40%] w-[40%]', blur: 'blur-[130px]', opacity: 'opacity-18', color: 'start' },
            { position: 'top-[60%] -left-[10%]', size: 'h-[30%] w-[25%]', blur: 'blur-[90px]', opacity: 'opacity-12', color: 'end', blend: 'mix-blend-overlay' },
        ],
    },
    podcastFeatured: {
        blobs: [
            { position: '-bottom-[20%] left-[15%]', size: 'h-[55%] w-[45%]', blur: 'blur-[160px]', opacity: 'opacity-22', color: 'end', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'top-[10%] right-[10%]', size: 'h-[25%] w-[30%]', blur: 'blur-[90px]', opacity: 'opacity-15', color: 'accent' },
            { position: 'top-[30%] left-[5%]', size: 'h-[20%] w-[20%]', blur: 'blur-[70px]', opacity: 'opacity-10', color: 'start', blend: 'mix-blend-overlay' },
            { position: '-bottom-[5%] right-[30%]', size: 'h-[25%] w-[20%]', blur: 'blur-[100px]', opacity: 'opacity-12', color: 'accent' },
        ],
    },
    communityReview: {
        blobs: [
            { position: '-top-[10%] left-[35%]', size: 'h-[40%] w-[40%]', blur: 'blur-[130px]', opacity: 'opacity-18', color: 'start' },
            { position: 'top-[25%] -right-[15%]', size: 'h-[50%] w-[35%]', blur: 'blur-[140px]', opacity: 'opacity-20', color: 'end', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'bottom-[15%] left-[5%]', size: 'h-[25%] w-[30%]', blur: 'blur-[100px]', opacity: 'opacity-12', color: 'accent' },
            { position: '-bottom-[10%] right-[15%]', size: 'h-[20%] w-[25%]', blur: 'blur-[80px]', opacity: 'opacity-10', color: 'start', blend: 'mix-blend-overlay' },
            { position: 'top-[50%] left-[50%]', size: 'h-[15%] w-[15%]', blur: 'blur-[60px]', opacity: 'opacity-8', color: 'end' },
        ],
    },
    newsletterSignup: {
        blobs: [
            { position: '-top-[20%] left-[10%]', size: 'h-[55%] w-[50%]', blur: 'blur-[160px]', opacity: 'opacity-25', color: 'accent', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-top-[5%] right-[5%]', size: 'h-[35%] w-[30%]', blur: 'blur-[110px]', opacity: 'opacity-18', color: 'start' },
            { position: 'bottom-[20%] left-[40%]', size: 'h-[20%] w-[25%]', blur: 'blur-[80px]', opacity: 'opacity-10', color: 'end', blend: 'mix-blend-overlay' },
        ],
    },
    festivalMap: {
        blobs: [
            { position: 'bottom-[5%] -right-[10%]', size: 'h-[45%] w-[40%]', blur: 'blur-[140px]', opacity: 'opacity-22', color: 'start', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-top-[10%] -left-[5%]', size: 'h-[30%] w-[35%]', blur: 'blur-[110px]', opacity: 'opacity-15', color: 'accent' },
            { position: 'top-[50%] right-[30%]', size: 'h-[25%] w-[20%]', blur: 'blur-[90px]', opacity: 'opacity-12', color: 'end' },
            { position: '-bottom-[15%] left-[20%]', size: 'h-[20%] w-[30%]', blur: 'blur-[80px]', opacity: 'opacity-10', color: 'start', blend: 'mix-blend-overlay' },
        ],
    },
    aboutHero: {
        blobs: [
            { position: '-top-[15%] -left-[15%]', size: 'h-[55%] w-[50%]', blur: 'blur-[170px]', opacity: 'opacity-25', color: 'start', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'top-[20%] right-[5%]', size: 'h-[40%] w-[35%]', blur: 'blur-[130px]', opacity: 'opacity-20', color: 'end' },
            { position: 'bottom-[10%] left-[30%]', size: 'h-[30%] w-[25%]', blur: 'blur-[100px]', opacity: 'opacity-15', color: 'accent', blend: 'mix-blend-overlay' },
            { position: '-bottom-[10%] right-[40%]', size: 'h-[20%] w-[20%]', blur: 'blur-[70px]', opacity: 'opacity-8', color: 'start' },
        ],
    },
    aboutWhoAreYou: {
        blobs: [
            { position: 'bottom-[10%] left-[20%]', size: 'h-[50%] w-[45%]', blur: 'blur-[150px]', opacity: 'opacity-22', color: 'end', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-top-[5%] right-[15%]', size: 'h-[30%] w-[30%]', blur: 'blur-[100px]', opacity: 'opacity-15', color: 'accent' },
            { position: 'top-[40%] -left-[10%]', size: 'h-[25%] w-[20%]', blur: 'blur-[80px]', opacity: 'opacity-12', color: 'start', blend: 'mix-blend-overlay' },
        ],
    },
    parallaxFeatures: {
        blobs: [
            { position: 'top-[5%] -left-[10%]', size: 'h-[35%] w-[30%]', blur: 'blur-[120px]', opacity: 'opacity-18', color: 'start' },
            { position: 'top-[30%] right-[5%]', size: 'h-[30%] w-[35%]', blur: 'blur-[110px]', opacity: 'opacity-15', color: 'end', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'bottom-[20%] -left-[5%]', size: 'h-[25%] w-[25%]', blur: 'blur-[90px]', opacity: 'opacity-12', color: 'accent' },
            { position: '-bottom-[10%] right-[20%]', size: 'h-[35%] w-[30%]', blur: 'blur-[130px]', opacity: 'opacity-20', color: 'start', blend: 'mix-blend-overlay' },
            { position: 'top-[60%] left-[40%]', size: 'h-[15%] w-[15%]', blur: 'blur-[60px]', opacity: 'opacity-10', color: 'accent' },
        ],
    },
    journalHero: {
        blobs: [
            { position: '-top-[10%] -left-[10%]', size: 'h-[45%] w-[40%]', blur: 'blur-[150px]', opacity: 'opacity-22', color: 'accent', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'top-[15%] right-[10%]', size: 'h-[50%] w-[45%]', blur: 'blur-[160px]', opacity: 'opacity-20', color: 'start' },
            { position: 'bottom-[5%] left-[15%]', size: 'h-[25%] w-[30%]', blur: 'blur-[90px]', opacity: 'opacity-12', color: 'end', blend: 'mix-blend-overlay' },
            { position: '-bottom-[10%] right-[25%]', size: 'h-[20%] w-[20%]', blur: 'blur-[70px]', opacity: 'opacity-8', color: 'accent' },
        ],
    },
    journalArticleGrid: {
        blobs: [
            { position: 'bottom-[15%] left-[10%]', size: 'h-[40%] w-[45%]', blur: 'blur-[140px]', opacity: 'opacity-18', color: 'start', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-top-[10%] right-[20%]', size: 'h-[30%] w-[35%]', blur: 'blur-[110px]', opacity: 'opacity-15', color: 'end' },
            { position: 'top-[45%] -right-[5%]', size: 'h-[25%] w-[20%]', blur: 'blur-[80px]', opacity: 'opacity-10', color: 'accent', blend: 'mix-blend-overlay' },
        ],
    },
    journalNewsletter: {
        blobs: [
            { position: 'top-[10%] left-[25%]', size: 'h-[40%] w-[40%]', blur: 'blur-[130px]', opacity: 'opacity-22', color: 'accent', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-bottom-[15%] right-[10%]', size: 'h-[35%] w-[30%]', blur: 'blur-[100px]', opacity: 'opacity-15', color: 'start' },
            { position: '-top-[5%] -left-[5%]', size: 'h-[25%] w-[25%]', blur: 'blur-[80px]', opacity: 'opacity-12', color: 'end', blend: 'mix-blend-overlay' },
        ],
    },
    podcastGrid: {
        blobs: [
            { position: '-top-[10%] left-[5%]', size: 'h-[35%] w-[40%]', blur: 'blur-[130px]', opacity: 'opacity-18', color: 'end' },
            { position: 'top-[20%] -right-[15%]', size: 'h-[40%] w-[35%]', blur: 'blur-[140px]', opacity: 'opacity-20', color: 'start', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-bottom-[10%] left-[30%]', size: 'h-[30%] w-[30%]', blur: 'blur-[100px]', opacity: 'opacity-15', color: 'accent' },
            { position: 'bottom-[30%] right-[10%]', size: 'h-[20%] w-[20%]', blur: 'blur-[70px]', opacity: 'opacity-10', color: 'end', blend: 'mix-blend-overlay' },
        ],
    },
    partnersHero: {
        blobs: [
            { position: '-top-[20%] left-[20%]', size: 'h-[60%] w-[50%]', blur: 'blur-[180px]', opacity: 'opacity-25', color: 'start', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'top-[10%] -right-[15%]', size: 'h-[45%] w-[40%]', blur: 'blur-[150px]', opacity: 'opacity-20', color: 'accent' },
            { position: 'bottom-[15%] -left-[10%]', size: 'h-[35%] w-[30%]', blur: 'blur-[120px]', opacity: 'opacity-15', color: 'end', blend: 'mix-blend-overlay' },
            { position: '-bottom-[15%] right-[30%]', size: 'h-[25%] w-[25%]', blur: 'blur-[90px]', opacity: 'opacity-10', color: 'start' },
            { position: 'top-[45%] left-[10%]', size: 'h-[15%] w-[15%]', blur: 'blur-[60px]', opacity: 'opacity-8', color: 'accent' },
        ],
    },
    partnersBento: {
        blobs: [
            { position: 'bottom-[5%] -left-[10%]', size: 'h-[50%] w-[45%]', blur: 'blur-[160px]', opacity: 'opacity-22', color: 'end', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-top-[10%] right-[10%]', size: 'h-[35%] w-[30%]', blur: 'blur-[110px]', opacity: 'opacity-15', color: 'accent' },
            { position: 'top-[40%] left-[40%]', size: 'h-[25%] w-[25%]', blur: 'blur-[90px]', opacity: 'opacity-12', color: 'start', blend: 'mix-blend-overlay' },
            { position: '-bottom-[15%] right-[25%]', size: 'h-[20%] w-[20%]', blur: 'blur-[70px]', opacity: 'opacity-8', color: 'end' },
        ],
    },
    partnersProcess: {
        blobs: [
            { position: 'top-[10%] -left-[15%]', size: 'h-[40%] w-[35%]', blur: 'blur-[130px]', opacity: 'opacity-18', color: 'start' },
            { position: '-top-[5%] right-[25%]', size: 'h-[30%] w-[40%]', blur: 'blur-[120px]', opacity: 'opacity-20', color: 'accent', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-bottom-[10%] left-[40%]', size: 'h-[35%] w-[30%]', blur: 'blur-[100px]', opacity: 'opacity-15', color: 'end', blend: 'mix-blend-overlay' },
        ],
    },
    partnersContact: {
        blobs: [
            { position: '-top-[10%] -left-[10%]', size: 'h-[45%] w-[40%]', blur: 'blur-[140px]', opacity: 'opacity-22', color: 'accent', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'top-[20%] right-[5%]', size: 'h-[35%] w-[30%]', blur: 'blur-[110px]', opacity: 'opacity-15', color: 'start' },
            { position: '-bottom-[15%] right-[15%]', size: 'h-[40%] w-[35%]', blur: 'blur-[130px]', opacity: 'opacity-18', color: 'end' },
            { position: 'bottom-[30%] -left-[5%]', size: 'h-[20%] w-[25%]', blur: 'blur-[80px]', opacity: 'opacity-10', color: 'start', blend: 'mix-blend-overlay' },
        ],
    },
    festivalArchiveHero: {
        blobs: [
            { position: 'top-[20%] left-[15%]', size: 'h-[55%] w-[50%]', blur: 'blur-[180px]', opacity: 'opacity-25', color: 'start', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: '-bottom-[20%] -right-[10%]', size: 'h-[50%] w-[45%]', blur: 'blur-[160px]', opacity: 'opacity-20', color: 'end' },
            { position: '-top-[10%] right-[20%]', size: 'h-[30%] w-[30%]', blur: 'blur-[100px]', opacity: 'opacity-15', color: 'accent', blend: 'mix-blend-overlay' },
            { position: 'bottom-[30%] -left-[10%]', size: 'h-[25%] w-[20%]', blur: 'blur-[80px]', opacity: 'opacity-10', color: 'start' },
            { position: 'top-[50%] right-[40%]', size: 'h-[15%] w-[15%]', blur: 'blur-[60px]', opacity: 'opacity-8', color: 'accent' },
        ],
    },
    festivalBentoGrid: {
        blobs: [
            { position: '-top-[15%] right-[10%]', size: 'h-[40%] w-[45%]', blur: 'blur-[150px]', opacity: 'opacity-20', color: 'end', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'bottom-[10%] -left-[15%]', size: 'h-[45%] w-[35%]', blur: 'blur-[130px]', opacity: 'opacity-18', color: 'start' },
            { position: 'top-[35%] left-[30%]', size: 'h-[25%] w-[25%]', blur: 'blur-[90px]', opacity: 'opacity-12', color: 'accent', blend: 'mix-blend-overlay' },
            { position: '-bottom-[10%] right-[35%]', size: 'h-[20%] w-[20%]', blur: 'blur-[70px]', opacity: 'opacity-10', color: 'end' },
        ],
    },
    festivalProgressTrail: {
        blobs: [
            { position: 'top-[15%] -left-[20%]', size: 'h-[70%] w-[40%]', blur: 'blur-[160px]', opacity: 'opacity-18', color: 'start', blend: 'mix-blend-multiply dark:mix-blend-soft-light' },
            { position: 'top-[10%] -right-[20%]', size: 'h-[70%] w-[40%]', blur: 'blur-[160px]', opacity: 'opacity-18', color: 'end' },
            { position: 'top-[30%] left-[35%]', size: 'h-[40%] w-[30%]', blur: 'blur-[100px]', opacity: 'opacity-12', color: 'accent', blend: 'mix-blend-overlay' },
        ],
    },
};

const colorMap = {
    start: 'bg-theme-start',
    end: 'bg-theme-end',
    accent: 'bg-theme-accent',
};

interface WatercolorBackgroundProps {
    variant: keyof typeof variants;
    className?: string;
}

/**
 * Renders a unique watercolor-inspired background with multiple colored blobs
 * and a subtle noise texture overlay. Each variant has distinct blob positioning,
 * sizing, and blend modes to create a unique atmosphere per section.
 *
 * Usage:
 * ```tsx
 * <section className="relative overflow-hidden gradient-mesh-{variant}">
 *     <WatercolorBackground variant="manifesto" />
 *     <div className="relative z-10">...content...</div>
 * </section>
 * ```
 */
export default function WatercolorBackground({ variant, className }: WatercolorBackgroundProps) {
    const config = variants[variant];
    if (!config) return null;

    return (
        <div className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none", className)}>
            {/* Watercolor blobs */}
            {config.blobs.map((blob, i) => (
                <div
                    key={i}
                    className={cn(
                        'absolute rounded-full',
                        colorMap[blob.color],
                        blob.position,
                        blob.size,
                        blob.blur,
                        blob.opacity,
                        blob.blend
                    )}
                />
            ))}
            {/* Noise grain texture overlay for watercolor feel */}
            <div
                className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: '128px 128px',
                }}
            />
        </div>
    );
}
