import React from 'react';
import type { 
    ConnectBlock, 
    Feature108Block, 
    FlipRevealBlock as FlipRevealBlockType, 
    PodcastGridBlock, 
    PodcastFeaturedBlock, 
    PodcastPlayerBlock,
    CommunityReviewBlock, 
    FestivalMapBlock as FestivalMapBlockType, 
    FestivalCardBlock as FestivalCardBlockType, 
    CTAHeroBlock as CTAHeroBlockType 
} from '@/types/page-blocks';
import { blockRegistry } from './BlockRegistry';
import { Layout, Sparkles, Mic, Headphones, PlayCircle, Star, Globe, Mail, HelpCircle, Layers } from 'lucide-react';

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
const CTAHeroBlock = React.lazy(() => import('@/components/Blocks/CTAHeroBlock'));
const CTAHeroBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/CTAHeroBlockEditor'));

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

const GlassmorphismPricingBlock = React.lazy(() => import('@/components/Blocks/GlassmorphismPricingBlock'));
const GlassmorphismPricingEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/GlassmorphismPricingBlockEditor'));

const NewsletterSignupBlock = React.lazy(() => import('@/components/Blocks/NewsletterSignupBlock'));
const NewsletterSignupEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/NewsletterSignupEditor'));

const EcosystemContentBlockComponent = React.lazy(() => import('@/components/Blocks/EcosystemContentBlock'));
const EcosystemContentBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/EcosystemContentBlockEditor'));

const EnterprisePricingBlockComponent = React.lazy(() => import('@/components/Blocks/EnterprisePricingBlock'));
const EnterprisePricingBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/EnterprisePricingBlockEditor'));

const FaqSectionBlockComponent = React.lazy(() => import('@/components/Blocks/FaqSectionBlock'));
const FaqSectionBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/FaqSectionBlockEditor'));

const AiFeaturesBlockComponent = React.lazy(() => import('@/components/Blocks/AiFeaturesBlock'));
const AiFeaturesBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/AiFeaturesBlockEditor'));

const StackingCardsBlockComponent = React.lazy(() => import('@/components/Blocks/StackingCardsBlock'));
const StackingCardsBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/StackingCardsBlockEditor'));

const ProductCardStackBlockComponent = React.lazy(() => import('@/components/Blocks/ProductCardStackBlock'));
const ProductCardStackBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/ProductCardStackBlockEditor'));

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
        editor: (props: { block: any; onUpdate: (updates: any) => void }) => (
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
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
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
        editor: (props: { block: any; onUpdate: (updates: any) => void }) => (
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
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <Feature108 {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
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
        category: 'Content',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <FlipRevealBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
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
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-48 bg-muted animate-pulse rounded-2xl" />}>
                <Connect {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
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

    // ── Pricing Blocks ──────────────────────────────────────────────────

    blockRegistry.register({
        type: 'glassmorphism_pricing',
        label: 'Glassmorphism Pricing',
        icon: <Layout className="h-4 w-4" />,
        desc: 'A premium, semi-transparent pricing cards section with features list.',
        category: 'Pricing',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <GlassmorphismPricingBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <GlassmorphismPricingEditor {...props} />
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
        type: 'newsletter_signup',
        label: 'Newsletter Signup',
        icon: <Mail className="h-4 w-4" />,
        desc: 'A premium newsletter signup section with animated background and features list.',
        category: 'Content',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <NewsletterSignupBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <NewsletterSignupEditor {...props} />
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

    blockRegistry.register({
        type: 'ecosystem_content',
        label: 'Ecosystem Content',
        icon: <Layout className="h-4 w-4" />,
        desc: 'Hero content block showing ecosystem details.',
        category: 'Content',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <EcosystemContentBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <EcosystemContentBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'enterprise_pricing',
        label: 'Enterprise Pricing',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Advanced pricing tier block with features.',
        category: 'Pricing',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <EnterprisePricingBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <EnterprisePricingBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'cta_hero',
        label: 'CTA Hero Section',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'A premium hero section with integrated call-to-action and animated background.',
        category: 'Heroes',
        renderer: (props: CTAHeroBlockType['content']) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <CTAHeroBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: CTAHeroBlockType['content']; onUpdate: (updates: Partial<CTAHeroBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <CTAHeroBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'faq_section',
        label: 'FAQ Section',
        icon: <HelpCircle className="h-4 w-4" />,
        desc: 'Frequently asked questions with accordion.',
        category: 'Content',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <FaqSectionBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <FaqSectionBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'ai_features',
        label: 'AI Features',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Animated AI features list with changing images.',
        category: 'Content',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <AiFeaturesBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <AiFeaturesBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'stacking_cards',
        label: 'Stacking Cards',
        icon: <Layers className="h-4 w-4" />,
        desc: 'Cards that stack on top of each other on scroll.',
        category: 'Content',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <StackingCardsBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <StackingCardsBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'product_card_stack',
        label: 'Product Card Stack',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Product cards that animate back into a stack.',
        category: 'Content',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <ProductCardStackBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <ProductCardStackBlockEditor {...props} />
            </React.Suspense>
        )
    });
}
