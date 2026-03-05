import React from 'react';
import type { Feature108Block, ConnectBlock, FlipRevealBlock as FlipRevealBlockType, PodcastGridBlock, PodcastFeaturedBlock, PodcastPlayerBlock, CommunityReviewBlock, FestivalMapBlock as FestivalMapBlockType, FestivalCardBlock as FestivalCardBlockType } from '@/types/page-blocks';
import { blockRegistry } from './BlockRegistry';
import { Layout, Sparkles, Mic, Headphones, PlayCircle, Star, Globe } from 'lucide-react';

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

// Podcast blocks
const PodcastGridBlockComponent = React.lazy(() => import('@/components/Blocks/PodcastGridBlock'));
const PodcastGridEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/PodcastGridEditor'));
const PodcastFeaturedBlockComponent = React.lazy(() => import('@/components/Blocks/PodcastFeaturedBlock'));
const PodcastFeaturedEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/PodcastFeaturedEditor'));
const PodcastPlayerBlockComponent = React.lazy(() => import('@/components/Blocks/PodcastPlayerBlock'));
const PodcastPlayerEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/PodcastPlayerEditor'));

const CommunityReviewBlock = React.lazy(() => import('@/components/Blocks/CommunityReviewBlock'));
const CommunityReviewEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/CommunityReviewEditor'));

const FestivalMapBlock = React.lazy(() => import('@/components/Blocks/FestivalMapBlock'));
const FestivalMapEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/FestivalMapEditor'));

const FestivalCardBlock = React.lazy(() => import('@/components/Blocks/FestivalCardBlock'));
const FestivalCardEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/FestivalCardEditor'));

export function registerBlocks() {
    blockRegistry.register({
        type: 'scroll_animation',
        label: 'Container Scroll Animation',
        icon: <Layout className="h-4 w-4" />,
        desc: 'A premium 3D perspective scroll animation for images.',
        category: 'Animations',
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <ScrollAnimationBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: Record<string, unknown>) => (
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
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-48 bg-muted animate-pulse" />}>
                <CarouselBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: Record<string, unknown>) => (
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
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <KimiHeroSection {...props} />
            </React.Suspense>
        ),
        editor: (props: Record<string, unknown>) => (
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
        editor: (props: { content: Feature108Block['content']; onUpdate: (updates: Partial<Feature108Block['content']>) => void }) => (
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

    // ── Podcast Blocks ──────────────────────────────────────────────────

    blockRegistry.register({
        type: 'podcast_grid',
        label: 'Podcast Episode Grid',
        icon: <Mic className="h-4 w-4" />,
        desc: 'A browseable grid of podcast episodes with search and category filters.',
        category: 'Podcasts',
        renderer: (props: PodcastGridBlock['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <PodcastGridBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: PodcastGridBlock['content']; onUpdate: (updates: Partial<PodcastGridBlock['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <PodcastGridEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'podcast_featured',
        label: 'Featured Podcasts',
        icon: <Headphones className="h-4 w-4" />,
        desc: 'Showcase featured podcast episodes in hero, card, or list layout.',
        category: 'Podcasts',
        renderer: (props: PodcastFeaturedBlock['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <PodcastFeaturedBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: PodcastFeaturedBlock['content']; onUpdate: (updates: Partial<PodcastFeaturedBlock['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <PodcastFeaturedEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'podcast_player',
        label: 'Podcast Episode Player',
        icon: <PlayCircle className="h-4 w-4" />,
        desc: 'Embed a specific podcast episode with full player, share buttons, and related episodes.',
        category: 'Podcasts',
        renderer: (props: PodcastPlayerBlock['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <PodcastPlayerBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: PodcastPlayerBlock['content']; onUpdate: (updates: Partial<PodcastPlayerBlock['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <PodcastPlayerEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'community_review',
        label: 'Community Reviews',
        icon: <Star className="h-4 w-4" />,
        desc: 'Display community feedback and ratings with dreamy watercolor styling.',
        category: 'Travel',
        renderer: (props: CommunityReviewBlock['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <CommunityReviewBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: CommunityReviewBlock['content']; onUpdate: (updates: Partial<CommunityReviewBlock['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <CommunityReviewEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'festival_map',
        label: 'Festival Map Radar',
        icon: <Globe className="h-4 w-4" />,
        desc: 'Interactive map displaying festivals and sustainable hubs with dreamy styling.',
        category: 'Travel',
        renderer: (props: FestivalMapBlockType['content']) => (
            <React.Suspense fallback={<div className="h-[600px] bg-muted animate-pulse rounded-3xl" />}>
                <FestivalMapBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: FestivalMapBlockType['content']; onUpdate: (updates: Partial<FestivalMapBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <FestivalMapEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'festival_card',
        label: 'Festival Card',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Elegant festival card with slow-travel aesthetics.',
        category: 'Travel',
        renderer: (props: FestivalCardBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-3xl" />}>
                <FestivalCardBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: FestivalCardBlockType['content']; onUpdate: (updates: Partial<FestivalCardBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <FestivalCardEditor {...props} />
            </React.Suspense>
        )
    });
}
