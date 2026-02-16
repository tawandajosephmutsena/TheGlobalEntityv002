import React from 'react';
import type { Feature108Block, ConnectBlock, FlipRevealBlock as FlipRevealBlockType } from '@/types/page-blocks';
import { blockRegistry } from './BlockRegistry';
import { Layout, Sparkles } from 'lucide-react';

// Dynamic imports for better performance
const CarouselBlock = React.lazy(() => import('@/components/Blocks/CarouselBlock'));
const CarouselEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/CarouselEditor'));
const KimiHeroSection = React.lazy(() => import('@/components/Blocks/KimiHeroSection'));
const KimiHeroEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/KimiHeroEditor'));
const ScrollAnimationBlock = React.lazy(() => import('@/components/Blocks/ScrollAnimationBlock'));
const ScrollAnimationEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/ScrollAnimationEditor'));
const Feature108 = React.lazy(() => import('@/components/Blocks/Feature108'));
const Feature108Editor = React.lazy(() => import('@/components/admin/PageBuilder/editors/Feature108Editor'));
const FlipRevealBlock = React.lazy(() => import('@/components/Blocks/FlipRevealBlock'));
const FlipRevealBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/FlipRevealBlockEditor'));

const Connect = React.lazy(() => import('@/components/Blocks/ConnectBlock'));
const ConnectEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/ConnectEditor'));

export function registerBlocks() {
    blockRegistry.register({
        type: 'scroll_animation',
        label: 'Container Scroll Animation',
        icon: <Layout className="h-4 w-4" />,
        desc: 'A premium 3D perspective scroll animation for images.',
        category: 'Animations',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <ScrollAnimationBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: any) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <ScrollAnimationEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'carousel',
        label: 'Image Carousel / Marquee',
        icon: <Layout className="h-4 w-4" />,
        desc: 'Auto-scrolling marquee carousel with customizable speed and direction.',
        category: 'Media',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-48 bg-muted animate-pulse" />}>
                <CarouselBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: any) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <CarouselEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'kimi_hero',
        label: 'Kimi Hero Section',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'A premium hero with 3D scrolling image carousel — automatically uses your active theme.',
        category: 'Heroes',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <KimiHeroSection {...props} />
            </React.Suspense>
        ),
        editor: (props: any) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <KimiHeroEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'feature108',
        label: 'Feature Tabs (108)',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'A collection of components built with Shadcn & Tailwind, featuring tabs with icons.',
        category: 'Content',
        renderer: (props: Feature108Block['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <Feature108 {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Feature108Block['content']; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <Feature108Editor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'flip_reveal',
        label: 'Flip Reveal Gallery',
        icon: <Layout className="h-4 w-4" />,
        desc: 'An animated, filterable gallery using GSAP Flip.',
        category: 'Showcase',
        renderer: (props: FlipRevealBlockType['content']) => (
            <React.Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <FlipRevealBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: FlipRevealBlockType['content']; onUpdate: (updates: Partial<FlipRevealBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <FlipRevealBlockEditor {...props} />
            </React.Suspense>
        )
    });
    blockRegistry.register({
        type: 'connect',
        label: 'Connect (Highlighter)',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Interactive connection section with mouse-following effects and floating labels.',
        category: 'Content',
        renderer: (props: ConnectBlock['content']) => (
            <React.Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <Connect {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: ConnectBlock['content']; onUpdate: (updates: Partial<ConnectBlock['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <ConnectEditor {...props} />
            </React.Suspense>
        )
    });
}
