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
    FeaturedFestivalsBlock as FeaturedFestivalsBlockType,
    CTAHeroBlock as CTAHeroBlockType,
    StackedCardsBlock as StackedCardsBlockType,
    StitchFeaturedFestivalsBlock as StitchFeaturedFestivalsBlockType,
    StitchPodcastBlock as StitchPodcastBlockType,
    StitchCommunityReviewBlock as StitchCommunityReviewBlockType,
    AboutHeroBlock as AboutHeroBlockType,
    AboutWhoAreYouBlock as AboutWhoAreYouBlockType,
    AboutTruthUntangledBlock as AboutTruthUntangledBlockType,
    AboutMoreThanEntertainmentBlock as AboutMoreThanEntertainmentBlockType,
    AboutOriginStoryBlock as AboutOriginStoryBlockType,
    StitchFeaturedBlogBlock as StitchFeaturedBlogBlockType,
    JournalHeroBlock as JournalHeroBlockType,
    JournalCategoryFilterBlock as JournalCategoryFilterBlockType,
    JournalArticleGridBlock as JournalArticleGridBlockType,
    JournalNewsletterBlock as JournalNewsletterBlockType,
    ContactEtherealHeroBlock as ContactEtherealHeroBlockType,
    ContactEtherealInfoBlock as ContactEtherealInfoBlockType,
    PartnersHeroBlock as PartnersHeroBlockType,
    PartnersBentoBlock as PartnersBentoBlockType,
    PartnersProcessBlock as PartnersProcessBlockType,
    PartnersContactBlock as PartnersContactBlockType,
    FestivalArchiveHeroBlock as FestivalArchiveHeroBlockType,
    FestivalFilterBarBlock as FestivalFilterBarBlockType,
    FestivalBentoGridBlock as FestivalBentoGridBlockType,
    FestivalProgressTrailBlock as FestivalProgressTrailBlockType,
    Globe3DBlock as Globe3DBlockType,
    EditorialCtaBlock as EditorialCtaBlockType
} from '@/types/page-blocks';
import { blockRegistry } from './BlockRegistry';
import { Layout, Sparkles, Mic, Headphones, PlayCircle, Star, Globe, Mail, HelpCircle, Layers, User, Search, History, Newspaper, Plus } from 'lucide-react';

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

const StackedCardsBlockComponent = React.lazy(() => import('@/components/Blocks/StackedCardsBlock'));
const StackedCardsBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/StackedCardsBlockEditor'));
const CardsSliderBlockComponent = React.lazy(() => import('@/components/Blocks/CardsSliderBlock'));
const CardsSliderBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/CardsSliderBlockEditor'));

const FeaturedFestivalsBlockComponent = React.lazy(() => import('@/components/Blocks/FeaturedFestivalsBlock'));
const FeaturedFestivalsEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/FeaturedFestivalsEditor'));

const StitchFeaturedFestivalsBlockComponent = React.lazy(() => import('@/components/Blocks/StitchFeaturedFestivalsBlock'));
const StitchFeaturedFestivalsEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/StitchFeaturedFestivalsEditor'));

const StitchPodcastBlockComponent = React.lazy(() => import('@/components/Blocks/StitchPodcastBlock'));
const StitchPodcastEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/StitchPodcastEditor'));

const StitchCommunityReviewBlockComponent = React.lazy(() => import('@/components/Blocks/StitchCommunityReviewBlock'));
const StitchCommunityReviewEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/StitchCommunityReviewEditor'));

// About Page Blocks
const AboutHeroBlock = React.lazy(() => import('@/components/Blocks/AboutHeroBlock'));
const AboutHeroBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/AboutHeroBlockEditor'));

const AboutWhoAreYouBlock = React.lazy(() => import('@/components/Blocks/AboutWhoAreYouBlock'));
const AboutWhoAreYouBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/AboutWhoAreYouBlockEditor'));

const AboutTruthUntangledBlock = React.lazy(() => import('@/components/Blocks/AboutTruthUntangledBlock'));
const AboutTruthUntangledBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/AboutTruthUntangledBlockEditor'));

const AboutMoreThanEntertainmentBlock = React.lazy(() => import('@/components/Blocks/AboutMoreThanEntertainmentBlock'));
const AboutMoreThanEntertainmentBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/AboutMoreThanEntertainmentBlockEditor'));

const AboutOriginStoryBlock = React.lazy(() => import('@/components/Blocks/AboutOriginStoryBlock'));
const AboutOriginStoryBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/AboutOriginStoryBlockEditor'));

const StitchFeaturedBlogBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/StitchFeaturedBlogBlockEditor'));

const JournalHeroBlock = React.lazy(() => import('@/components/Blocks/JournalHeroBlock'));
const JournalHeroEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/JournalHeroEditor'));
const JournalCategoryFilterBlock = React.lazy(() => import('@/components/Blocks/JournalCategoryFilterBlock'));
const JournalCategoryFilterEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/JournalCategoryFilterEditor'));
const JournalArticleGridBlock = React.lazy(() => import('@/components/Blocks/JournalArticleGridBlock'));
const JournalArticleGridEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/JournalArticleGridEditor'));
const JournalNewsletterBlock = React.lazy(() => import('@/components/Blocks/JournalNewsletterBlock'));
const JournalNewsletterEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/JournalNewsletterEditor'));

const ContactEtherealHeroBlock = React.lazy(() => import('@/components/Blocks/ContactEtherealHeroBlock'));
const ContactEtherealHeroEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/ContactEtherealHeroEditor'));
const ContactEtherealInfoBlock = React.lazy(() => import('@/components/Blocks/ContactEtherealInfoBlock'));
const ContactEtherealInfoEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/ContactEtherealInfoEditor'));
const ContactCartographerBlock = React.lazy(() => import('@/components/Blocks/ContactCartographerBlock'));
const ContactCartographerEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/ContactCartographerEditor'));

const PartnersHero = React.lazy(() => import('@/components/Blocks/PartnersHero'));
const PartnersHeroEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/PartnersHeroEditor'));
const PartnersBento = React.lazy(() => import('@/components/Blocks/PartnersBento'));
const PartnersBentoEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/PartnersBentoEditor'));
const PartnersProcess = React.lazy(() => import('@/components/Blocks/PartnersProcess'));
const PartnersProcessEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/PartnersProcessEditor'));
const PartnersContact = React.lazy(() => import('@/components/Blocks/PartnersContact'));
const PartnersContactEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/PartnersContactEditor'));

const StitchFeaturedBlogBlock = React.lazy(() => import('@/components/Blocks/StitchFeaturedBlogBlock'));

// Festival Archive Blocks
const FestivalArchiveHero = React.lazy(() => import('@/components/Blocks/FestivalArchiveHero'));
const FestivalArchiveHeroEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/FestivalArchiveHeroEditor'));
const FestivalFilterBar = React.lazy(() => import('@/components/Blocks/FestivalFilterBar'));
const FestivalFilterBarEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/FestivalFilterBarEditor'));
const FestivalBentoGrid = React.lazy(() => import('@/components/Blocks/FestivalBentoGrid'));
const FestivalBentoGridEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/FestivalBentoGridEditor'));
const FestivalProgressTrail = React.lazy(() => import('@/components/Blocks/FestivalProgressTrail'));
const FestivalProgressTrailEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/FestivalProgressTrailEditor'));

// Globe 3D Block
const Globe3DBlock = React.lazy(() => import('@/components/Blocks/Globe3DBlock'));
const Globe3DBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/Globe3DBlockEditor'));

const EditorialCtaBlock = React.lazy(() => import('@/components/Blocks/EditorialCtaBlock'));
const EditorialCtaBlockEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/EditorialCtaBlockEditor'));

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
        editor: (props: { block: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
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
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <KimiHeroSection {...props} />
            </React.Suspense>
        ),
        editor: (props: { block: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
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
        category: 'Content',
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

    // ── Pricing Blocks ──────────────────────────────────────────────────

    blockRegistry.register({
        type: 'glassmorphism_pricing',
        label: 'Glassmorphism Pricing',
        icon: <Layout className="h-4 w-4" />,
        desc: 'A premium, semi-transparent pricing cards section with features list.',
        category: 'Pricing',
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <GlassmorphismPricingBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
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
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <NewsletterSignupBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
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
        type: 'featured_festivals',
        label: 'Featured Festivals Slider',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Horizontal slider of featured festivals with dreamy aesthetics.',
        category: 'Travel',
        renderer: (props: FeaturedFestivalsBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-3xl" />}>
                <FeaturedFestivalsBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: FeaturedFestivalsBlockType['content']; onUpdate: (updates: Partial<FeaturedFestivalsBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <FeaturedFestivalsEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'ecosystem_content',
        label: 'Ecosystem Content',
        icon: <Layout className="h-4 w-4" />,
        desc: 'Hero content block showing ecosystem details.',
        category: 'Content',
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <EcosystemContentBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
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
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <EnterprisePricingBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
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
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <FaqSectionBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
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
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <AiFeaturesBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
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
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <StackingCardsBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
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
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <ProductCardStackBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <ProductCardStackBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'stacked_cards',
        label: 'Dynamic Stacked Cards',
        icon: <Layers className="h-4 w-4" />,
        desc: 'Dynamic cards that stack on top of each other, pulling from selected collections.',
        category: 'Content',
        renderer: (props: StackedCardsBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <StackedCardsBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: StackedCardsBlockType['content']; onUpdate: (updates: Partial<StackedCardsBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <StackedCardsBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'cards_slider',
        label: 'Cards Slider',
        icon: <Layers className="h-4 w-4" />,
        desc: 'Horizontal slider of dynamic cards, pulling from selected collections.',
        category: 'Content',
        renderer: (props: Record<string, unknown>) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <CardsSliderBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: Record<string, unknown>; onUpdate: (updates: Record<string, unknown>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <CardsSliderBlockEditor {...props} />
            </React.Suspense>
        )
    });

    // ── Stitch Blocks ──────────────────────────────────────────────────

    blockRegistry.register({
        type: 'stitch_featured_festivals',
        label: 'Stitch Featured Festivals',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Advanced animated grid showing featured festivals in Stitch theme.',
        category: 'Travel',
        renderer: (props: StitchFeaturedFestivalsBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <StitchFeaturedFestivalsBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: StitchFeaturedFestivalsBlockType['content']; onUpdate: (updates: Partial<StitchFeaturedFestivalsBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <StitchFeaturedFestivalsEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'stitch_podcast',
        label: 'Stitch Podcast Grid',
        icon: <Mic className="h-4 w-4" />,
        desc: 'Dynamic grid showing featured podcasts in Stitch theme with waveform animations.',
        category: 'Podcasts',
        renderer: (props: StitchPodcastBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <StitchPodcastBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: StitchPodcastBlockType['content']; onUpdate: (updates: Partial<StitchPodcastBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <StitchPodcastEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'stitch_community_review',
        label: 'Stitch Community Reviews',
        icon: <Star className="h-4 w-4" />,
        desc: 'Dreamy, glassmorphic bento grid for community reviews.',
        category: 'Travel',
        renderer: (props: StitchCommunityReviewBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <StitchCommunityReviewBlockComponent {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <StitchCommunityReviewEditor block={{ content: props.content }} onUpdate={props.onUpdate} />
            </React.Suspense>
        )
    });

    // About Section Blocks
    blockRegistry.register({
        type: 'about_hero',
        label: 'About Hero',
        icon: <Layout className="h-4 w-4" />,
        desc: 'Premium about page hero section with stats.',
        category: 'About, Team & Interaction',
        renderer: (props: AboutHeroBlockType['content']) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <AboutHeroBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: AboutHeroBlockType['content']; onUpdate: (updates: Partial<AboutHeroBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <AboutHeroBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'about_who_are_you',
        label: 'Who Are You',
        icon: <User className="h-4 w-4" />,
        desc: 'Introductory section about the audience or entity.',
        category: 'About, Team & Interaction',
        renderer: (props: AboutWhoAreYouBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <AboutWhoAreYouBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: AboutWhoAreYouBlockType['content']; onUpdate: (updates: Partial<AboutWhoAreYouBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <AboutWhoAreYouBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'about_truth_untangled',
        label: 'Truth Untangled',
        icon: <Search className="h-4 w-4" />,
        desc: 'Modern grid highlighting key mission points.',
        category: 'About, Team & Interaction',
        renderer: (props: AboutTruthUntangledBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <AboutTruthUntangledBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: AboutTruthUntangledBlockType['content']; onUpdate: (updates: Partial<AboutTruthUntangledBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <AboutTruthUntangledBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'about_more_than_entertainment',
        label: 'More Than Entertainment',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Visual section for core values and belief statement.',
        category: 'About, Team & Interaction',
        renderer: (props: AboutMoreThanEntertainmentBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <AboutMoreThanEntertainmentBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: AboutMoreThanEntertainmentBlockType['content']; onUpdate: (updates: Partial<AboutMoreThanEntertainmentBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <AboutMoreThanEntertainmentBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'about_origin_story',
        label: 'Origin Story',
        icon: <History className="h-4 w-4" />,
        desc: 'Timeline-style section for the brand history.',
        category: 'About, Team & Interaction',
        renderer: (props: AboutOriginStoryBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <AboutOriginStoryBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: AboutOriginStoryBlockType['content']; onUpdate: (updates: Partial<AboutOriginStoryBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <AboutOriginStoryBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'stitch_featured_blog',
        label: 'Featured Blog',
        icon: <Newspaper className="h-4 w-4" />,
        desc: 'Stitch styled featured blog posts.',
        category: 'Stitch Components',
        renderer: (props: StitchFeaturedBlogBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <StitchFeaturedBlogBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: StitchFeaturedBlogBlockType['content']; onUpdate: (updates: Partial<StitchFeaturedBlogBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <StitchFeaturedBlogBlockEditor {...props} />
            </React.Suspense>
        )
    });

    // Journal Blocks
    blockRegistry.register({
        type: 'journal_hero',
        label: 'Journal Hero',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Premium journal archive hero with search and featured articles.',
        category: 'Journal',
        renderer: (props: JournalHeroBlockType['content']) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <JournalHeroBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: JournalHeroBlockType['content']; onUpdate: (updates: Partial<JournalHeroBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <JournalHeroEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'journal_category_filter',
        label: 'Journal Category Filter',
        icon: <Layers className="h-4 w-4" />,
        desc: 'Filterable category navigation for journal articles.',
        category: 'Journal',
        renderer: (props: JournalCategoryFilterBlockType['content']) => (
            <React.Suspense fallback={<div className="h-24 bg-muted animate-pulse" />}>
                <JournalCategoryFilterBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: JournalCategoryFilterBlockType['content']; onUpdate: (updates: Partial<JournalCategoryFilterBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <JournalCategoryFilterEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'journal_article_grid',
        label: 'Journal Article Grid',
        icon: <Layout className="h-4 w-4" />,
        desc: 'A premium grid of journal articles with load more functionality.',
        category: 'Journal',
        renderer: (props: JournalArticleGridBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <JournalArticleGridBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: JournalArticleGridBlockType['content']; onUpdate: (updates: Partial<JournalArticleGridBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <JournalArticleGridEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'journal_newsletter',
        label: 'Journal Newsletter',
        icon: <Mail className="h-4 w-4" />,
        desc: 'Premium newsletter signup section with journal aesthetic.',
        category: 'Journal',
        renderer: (props: JournalNewsletterBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <JournalNewsletterBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: JournalNewsletterBlockType['content']; onUpdate: (updates: Partial<JournalNewsletterBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <JournalNewsletterEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'contact_ethereal_hero',
        label: 'Ethereal Contact Hero',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Premium contact hero with parchment texture and rough edges.',
        category: 'Ethereal Portal',
        renderer: (props: ContactEtherealHeroBlockType['content']) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <ContactEtherealHeroBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: ContactEtherealHeroBlockType['content']; onUpdate: (updates: Partial<ContactEtherealHeroBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <ContactEtherealHeroEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'contact_ethereal_info',
        label: 'Ethereal Contact Info',
        icon: <Layers className="h-4 w-4" />,
        desc: 'Asymmetric grid of contact information cards with ethereal styling.',
        category: 'Ethereal Portal',
        renderer: (props: ContactEtherealInfoBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <ContactEtherealInfoBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: ContactEtherealInfoBlockType['content']; onUpdate: (updates: Partial<ContactEtherealInfoBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <ContactEtherealInfoEditor {...props} />
            </React.Suspense>
        )
    });
    blockRegistry.register({
        type: 'contact_cartographer',
        label: 'Contact Cartographer',
        icon: 'Map',
        desc: 'Advanced 5/7 editorial contact layout with bento grid info cards.',
        category: 'Contact',
        renderer: ContactCartographerBlock,
        editor: ContactCartographerEditor
    });

    blockRegistry.register({
        type: 'partners_hero',
        label: 'Partners Hero',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Premium ethereal hero for partnership pages.',
        category: 'Partners',
        renderer: (props: PartnersHeroBlockType['content']) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <PartnersHero {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: PartnersHeroBlockType['content']; onUpdate: (updates: Partial<PartnersHeroBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <PartnersHeroEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'partners_bento',
        label: 'Partners Bento Grid',
        icon: <Layout className="h-4 w-4" />,
        desc: 'Glassmorphic bento grid for showcasing partner perks.',
        category: 'Partners',
        renderer: (props: PartnersBentoBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <PartnersBento {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: PartnersBentoBlockType['content']; onUpdate: (updates: Partial<PartnersBentoBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <PartnersBentoEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'partners_process',
        label: 'Partners Process Trail',
        icon: <History className="h-4 w-4" />,
        desc: "Animated SVG 'Pirate Trail' process section.",
        category: 'Partners',
        renderer: (props: PartnersProcessBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <PartnersProcess {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: PartnersProcessBlockType['content']; onUpdate: (updates: Partial<PartnersProcessBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <PartnersProcessEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'partners_contact',
        label: 'Partners Contact Form',
        icon: <Mail className="h-4 w-4" />,
        desc: 'Split layout contact form for partnership inquiries.',
        category: 'Partners',
        renderer: (props: PartnersContactBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse" />}>
                <PartnersContact {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: PartnersContactBlockType['content']; onUpdate: (updates: Partial<PartnersContactBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <PartnersContactEditor {...props} />
            </React.Suspense>
        )
    });

    // ── Festival Archive Blocks ─────────────────────────────────────────

    blockRegistry.register({
        type: 'festival_archive_hero',
        label: 'Festival Archive Hero',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'Premium hero with watercolor blurs and floating marginalia fragments.',
        category: 'Festival Archive',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <FestivalArchiveHero {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: FestivalArchiveHeroBlockType['content']; onUpdate: (updates: Partial<FestivalArchiveHeroBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <FestivalArchiveHeroEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'festival_filter_bar',
        label: 'Festival Filter Bar',
        icon: <Search className="h-4 w-4" />,
        desc: 'Organic brutalist filter bar with search and category pills.',
        category: 'Festival Archive',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-24 bg-muted animate-pulse" />}>
                <FestivalFilterBar {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: FestivalFilterBarBlockType['content']; onUpdate: (updates: Partial<FestivalFilterBarBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <FestivalFilterBarEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'festival_bento_grid',
        label: 'Festival Bento Grid',
        icon: <Layout className="h-4 w-4" />,
        desc: 'Asymmetric grid with multiple card types (Festival, Stat, Feature, Signup).',
        category: 'Festival Archive',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="min-h-screen bg-muted animate-pulse" />}>
                <FestivalBentoGrid {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: FestivalBentoGridBlockType['content']; onUpdate: (updates: Partial<FestivalBentoGridBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <FestivalBentoGridEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'festival_progress_trail',
        label: 'Festival Progress Trail',
        icon: <History className="h-4 w-4" />,
        desc: 'Decorative animated dashed trail with script-style transition text.',
        category: 'Festival Archive',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-64 bg-muted animate-pulse" />}>
                <FestivalProgressTrail {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: FestivalProgressTrailBlockType['content']; onUpdate: (updates: Partial<FestivalProgressTrailBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <FestivalProgressTrailEditor {...props} />
            </React.Suspense>
        )
    });

    // ── 3D Globe Block ──────────────────────────────────────────────────

    blockRegistry.register({
        type: 'globe_3d',
        label: '3D Globe',
        icon: <Globe className="h-4 w-4" />,
        desc: 'Interactive 3D globe with configurable markers, lighting, and atmosphere.',
        category: 'Media',
        renderer: (props: any) => (
            <React.Suspense fallback={<div className="h-[500px] bg-muted animate-pulse rounded-3xl" />}>
                <Globe3DBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: any; onUpdate: (updates: any) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <Globe3DBlockEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'editorial_cta',
        label: 'Editorial CTA',
        icon: <Plus className="h-4 w-4" />,
        desc: 'A premium call-to-action block with glassmorphism and trust indicators — mirrors the newsletter signup design.',
        category: 'Content',
        renderer: (props: EditorialCtaBlockType['content']) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <EditorialCtaBlock {...props} />
            </React.Suspense>
        ),
        editor: (props: { content: EditorialCtaBlockType['content']; onUpdate: (updates: Partial<EditorialCtaBlockType['content']>) => void }) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <EditorialCtaBlockEditor {...props} />
            </React.Suspense>
        )
    });
}
