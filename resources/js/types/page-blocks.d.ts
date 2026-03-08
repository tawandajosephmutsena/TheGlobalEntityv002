import { FormField } from './index';

/**
 * Type definitions for page builder blocks
 */

export interface BaseBlock {
    id: string;
    type: string;
    is_enabled: boolean;
    order?: number;
}

export interface HeroBlock extends BaseBlock {
    type: 'hero';
    content: {
        title: string;
        subtitle: string;
        description: string;
        ctaText: string;
        ctaHref: string;
        marqueeText?: string;
        backgroundImages?: string[];
        showFloatingImages?: boolean;
        secondaryCtaText?: string;
        secondaryCtaHref?: string;
    };
}

export interface StatsBlock extends BaseBlock {
    type: 'stats';
    content: {
        title?: string;
        subtitle?: string;
        items: Array<{
            value: string;
            label: string;
            suffix?: string;
        }>;
    };
}

export interface ServicesBlock extends BaseBlock {
    type: 'services';
    content: {
        title: string;
        subtitle?: string;
        limit?: number;
        useStackedCards?: boolean;
    };
}

export interface PortfolioBlock extends BaseBlock {
    type: 'portfolio';
    content: {
        title: string;
        subtitle?: string;
        description?: string;
        limit?: number;
        showViewAll?: boolean;
    };
}

export interface InsightsBlock extends BaseBlock {
    type: 'insights';
    content: {
        title: string;
        limit?: number;
    };
}

export interface CtaBlock extends BaseBlock {
    type: 'cta';
    content: {
        title: string;
        subtitle: string;
        ctaText: string;
        ctaHref: string;
        email: string;
    };
}

export interface TextBlock extends BaseBlock {
    type: 'text';
    content: {
        title?: string;
        body: string;
        layout?: string;
        textSize?: string;
        textAlign?: string;
        columns?: Array<{
            id: string;
            type: 'text' | 'image' | 'video' | 'button';
            content: Record<string, unknown>; // Using Record for flexibility
        }>;
    };
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    content: {
        url: string;
        alt: string;
        caption?: string;
    };
}

export interface CinematicHeroBlock extends BaseBlock {
    type: 'cinematic_hero';
    content: {
        slides: Array<{
            title: string;
            subtitle: string;
            tagline: string;
            image: string;
        }>;
    };
}

export interface FormBlock extends BaseBlock {
    type: 'form';
    content: {
        title: string;
        description: string;
        steps: Array<{
            id: string;
            title?: string;
            fields: FormField[];
        }>;
        submitText: string;
        adminEmail?: string;
        replyToEmail?: string;
        confirmationEmailBody?: string;
        successMessage?: string;
        allowMultipleSubmissions?: boolean;
    };
}

export interface StoryBlock extends BaseBlock {
    type: 'story';
    content: {
        title: string;
        subtitle: string;
        body: string;
        items: Array<{
            value: string;
            label: string;
        }>;
    };
}

export interface ManifestoBlock extends BaseBlock {
    type: 'manifesto';
    content: {
        title: string;
        subtitle: string;
        items: Array<{
            emoji: string;
            title: string;
            desc: string;
        }>;
    };
}

export interface ProcessBlock extends BaseBlock {
    type: 'process';
    content: {
        title: string;
        subtitle: string;
        items: Array<{
            step: string;
            title: string;
            desc: string;
        }>;
    };
}

export interface ContactInfoBlock extends BaseBlock {
    type: 'contact_info';
    content: {
        title: string;
        subtitle: string;
        items: Array<{
            label: string;
            value: string;
            href?: string;
        }>;
        office_hours: string[];
        show_map?: boolean;
        google_maps_url?: string;
        show_form?: boolean;
        form_title?: string;
        success_message?: string;
        admin_email?: string;
        reply_to_email?: string;
        confirmation_email_body?: string;
        allow_multiple_submissions?: boolean;
    };
}

export interface FaqBlock extends BaseBlock {
    type: 'faq';
    content: {
        title: string;
        subtitle: string;
        items: Array<{
            q: string;
            a: string;
        }>;
    };
}

export interface VideoBlock extends BaseBlock {
    type: 'video';
    content: {
        url: string;
    };
}

export interface AnimatedShaderHeroBlock extends BaseBlock {
    type: 'animated_shader_hero';
    content: {
        trustBadge?: { text: string; icons?: string[] };
        headline: { line1: string; line2: string };
        subtitle: string;
        buttons?: {
            primary?: { text: string; url?: string };
            secondary?: { text: string; url?: string };
        };
    };
}

export interface FeaturesBlock extends BaseBlock {
    type: 'features';
    content: {
        title: string;
        items: Array<{
            title: string;
            desc: string;
        }>;
    };
}

export type PageBlock =
    | HeroBlock
    | StatsBlock
    | ServicesBlock
    | PortfolioBlock
    | InsightsBlock
    | CtaBlock
    | TextBlock
    | ImageBlock
    | CinematicHeroBlock
    | FormBlock
    | StoryBlock
    | ManifestoBlock
    | ProcessBlock
    | ContactInfoBlock
    | FaqBlock
    | VideoBlock
    | FeaturesBlock
    | AnimatedShaderHeroBlock
    | TestimonialBlock
    | LogoCloudBlock
    | CoverDemoBlock
    | AppleCardsCarouselBlock
    | VideoBackgroundHeroBlock
    | ParallaxFeaturesBlock
    | GSAPHorizontalScrollBlock
    | CreativeGridBlock
    | TeamHeroBlock
    | TeamGridBlock
    | CultureBentoBlock
    | TeamJoinBlock
    | Feature108Block
    | ScrollAnimationBlock
    | FlipRevealBlock
    | ConnectBlock
    | PodcastGridBlock
    | PodcastFeaturedBlock
    | PodcastPlayerBlock
    | CommunityReviewBlock
    | FestivalMapBlock
    | FestivalCardBlock
    | CTAHeroBlock;

export interface CTAHeroBlock extends BaseBlock {
    type: 'cta_hero';
    content: {
        badge?: string;
        titlePrefix?: string;
        titleHighlight?: string;
        description?: string;
        emailPlaceholder?: string;
        buttonText?: string;
        buttonLink?: string;
        benefits?: string[];
        statsValue?: string;
        statsLabel?: string;
        image?: string;
        imageLink?: string;
    };
}


export interface Feature108Block extends BaseBlock {
    type: 'feature108';
    content: {
        badge?: string;
        heading?: string;
        description?: string;
        tabs?: Array<{
            value: string;
            icon: string; // lucide icon name
            label: string;
            content: {
                badge: string;
                title: string;
                description: string;
                buttonText: string;
                buttonLink?: string;
                imageSrc: string;
                imageAlt: string;
            };
        }>;
    };
}


export interface ScrollAnimationBlock extends BaseBlock {
    type: 'scroll_animation';
    content: {
        title?: string;
        highlightTitle?: string;
        image?: string;
        highlightColor?: string;
    };
}


export interface CreativeGridBlock extends BaseBlock {
    type: 'creative_grid';
    content: {
        title?: string;
        subtitle?: string;
        feedSource?: 'manual' | 'services' | 'portfolio' | 'insights';
        maxItems?: number;
        sourceCategory?: string;
        items?: Array<{
            image: string;
            title: string;
            category: string;
            description: string;
            link?: string;
        }>;
    };
}


export interface TestimonialBlock extends BaseBlock {
    type: 'testimonials';
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        items?: Array<{
            text: string;
            image: string;
            name: string;
            role: string;
        }>;
    };
}

export interface LogoCloudBlock extends BaseBlock {
    type: 'logo_cloud';
    content: {
        title?: string;
        items?: Array<{
            name: string;
            url: string;
        }>;
    };
}

export interface CoverDemoBlock extends BaseBlock {
    type: 'cover_demo';
    content: {
        titleOne?: string;
        titleTwo?: string;
        coverText?: string;
        fontSize?: string;
        fontWeight?: string;
    };
}

export interface AppleCardsCarouselBlock extends BaseBlock {
    type: 'apple_cards_carousel';
    content: {
        title?: string;
        items?: Array<{
            image: string;
            title: string;
            category: string;
            content: string;
            link?: string;
        }>;
    };
}

export interface VideoBackgroundHeroBlock extends BaseBlock {
    type: 'video_background_hero';
    content: {
        title?: string;
        subtitle?: string;
        ctaText1?: string;
        ctaLink1?: string;
        ctaText2?: string;
        ctaLink2?: string;
        videoUrl?: string;
        trustedByText?: string;
        logos?: Array<{ name: string; url: string }>;
        showLogoSlider?: boolean;
    };
}

export interface PageContent {
    blocks: PageBlock[];
}

export interface ParallaxFeaturesBlock extends BaseBlock {
    type: 'parallax_features';
    content: {
        title?: string;
        subtitle?: string;
        items?: Array<{
            title: string;
            description: string;
            image?: string;
            icon?: string;
            link?: string;
        }>;
    };
}

export interface GSAPHorizontalScrollBlock extends BaseBlock {
    type: 'gsap_horizontal_scroll';
    content: {
        title?: string;
        subtitle?: string;
        items?: Array<{
            title: string;
            description: string;
            image?: string;
            tag?: string;
            link?: string;
        }>;
        backgroundColor?: string;
    };
}

export interface KimiHeroBlock extends BaseBlock {
    type: 'kimi_hero';
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        ctaText?: string;
        ctaLink?: string;
        ctaSecondaryText?: string;
        ctaSecondaryLink?: string;
        images?: string[];
        backgroundColor?: string;
        scrollSpeed?: number;
    };
}

export interface TeamHeroBlock extends BaseBlock {
    type: 'team_hero';
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        marqueeText?: string;
    };
}

export interface TeamGridBlock extends BaseBlock {
    type: 'team_grid';
    content: {
        title?: string;
        subtitle?: string;
        feedSource?: 'manual' | 'team';
        maxItems?: number;
        items?: Array<{
            name: string;
            position: string;
            avatar?: string;
            bio?: string;
            social_links?: {
                linkedin?: string;
                github?: string;
                twitter?: string;
                website?: string;
            };
        }>;
    };
}

export interface CultureBentoBlock extends BaseBlock {
    type: 'culture_bento';
    content: {
        title?: string;
        description?: string;
        statValue?: string;
        statLabel?: string;
    };
}

export interface TeamJoinBlock extends BaseBlock {
    type: 'team_join';
    content: {
        title?: string;
        subtitle?: string;
        ctaText?: string;
        ctaHref?: string;
    };
}


export interface FlipRevealBlock extends BaseBlock {
    type: 'flip_reveal';
    content: {
        title?: string;
        subtitle?: string;
        categories: Array<{
            id: string;
            label: string;
        }>;
        items: Array<{
            id: string;
            category: string;
            image: string;
            title?: string;
        }>;
    };
}


export interface ConnectBlock extends BaseBlock {
    type: 'connect';
    content: {
        title?: string;
        description?: string;
        labels?: string[];
        pointerLabel?: string;
        ctaText?: string;
        ctaHref?: string;
        email?: string;
        whatsapp?: string;
    };
}

export interface PodcastGridBlock extends BaseBlock {
    type: 'podcast_grid';
    content: {
        title?: string;
        subtitle?: string;
        limit?: number;
        showSearch?: boolean;
        showCategories?: boolean;
        showFeatured?: boolean;
        columns?: 2 | 3 | 4;
        ctaText?: string;
        ctaHref?: string;
    };
}

export interface PodcastFeaturedBlock extends BaseBlock {
    type: 'podcast_featured';
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        limit?: number;
        layout?: 'hero' | 'cards' | 'list';
        showPlayButton?: boolean;
        ctaText?: string;
        ctaHref?: string;
    };
}

export interface PodcastPlayerBlock extends BaseBlock {
    type: 'podcast_player';
    content: {
        podcastSlug?: string;
        title?: string;
        description?: string;
        variant?: 'compact' | 'basic' | 'expanded';
        showRelated?: boolean;
        relatedLimit?: number;
        autoplay?: boolean;
    };
}

export interface CommunityReviewBlock extends BaseBlock {
    type: 'community_review';
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        reviewableType?: string;
        reviewableId?: number;
        showRatings?: boolean;
        limit?: number;
        layout?: 'list' | 'grid' | 'carousel';
    };
}

export interface FestivalMapBlock extends BaseBlock {
    type: 'festival_map';
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        center?: { lat: number; lng: number };
        zoom?: number;
        showSearch?: boolean;
        theme?: 'light' | 'dark' | 'fairy-pirate';
        limit?: number;
    };
}

export interface FestivalCardBlock extends BaseBlock {
    type: 'festival_card';
    content: {
        festivalId?: number;
        variant?: 'elegant' | 'compact' | 'dreamy';
        showActivities?: boolean;
        showTags?: boolean;
        ctaText?: string;
    };
}

