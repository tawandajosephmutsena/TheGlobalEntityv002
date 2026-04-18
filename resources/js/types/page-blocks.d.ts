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

export interface HomeReview {
    id: number;
    user: string;
    body: string;
    vibe: number;
    safety: number;
    sustainability?: number;
    date: string;
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
        icon?: string;
        iconType?: 'lucide' | 'custom';
        body: string;
        layout?: string;
        textSize?: string;
        textAlign?: string;
        columns?: Array<{
            id: string;
            type: 'text' | 'image' | 'video' | 'button' | 'globe_3d' | 'icon';
            content: Record<string, unknown>; // Using Record for flexibility
        }>;
    };
}

export interface ImageBlock extends BaseBlock {
    type: 'image';
    content: {
        image: {
            url: string;
            alt?: string;
        };
        aspectRatio?: string;
        objectFit?: string;
        caption?: string;
    };
}

export interface StitchFeaturedFestivalsBlock extends BaseBlock {
    type: 'stitch_featured_festivals';
    content: {
        badge?: string;
        title: string;
        subtitle?: string;
        limit?: number;
        selectedFestivalIds?: number[];
        ctaText?: string;
        ctaHref?: string;
        ctaLabel?: string;
    };
}

export interface StitchPodcastBlock extends BaseBlock {
    type: 'stitch_podcast_featured';
    content: {
        title: string;
        subtitle?: string;
        limit?: number;
        // Specific card styling
        card1BgColor?: string;
        card1Shadow?: boolean;
        card5BgColor?: string;
        card5Shadow?: boolean;
    };
}

export interface StitchCommunityReviewBlock extends BaseBlock {
    type: 'stitch_community_review';
    content: {
        title: string;
        subtitle?: string;
        limit?: number;
        ctaTitle?: string;
        ctaButtonText?: string;
        // Dynamic stats card
        statsRating?: string;
        statsTitle?: string;
        statsDescription?: string;
        statsAvatars?: string[];
        statsCount?: string;
        // Featured diary entry
        entryNumber?: string;
        entryLocation?: string;
        entryQuote?: string;
        entryTags?: string[];
        // Rating card
        ratingCardImage?: string;
        ratingCardTitle?: string;
        ratingCardDescription?: string;
        // Social proof
        socialProofPlatform?: string;
        // Footer
        footerCounterText?: string;
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
    | StackedCardsBlock
    | ScrollAnimationBlock
    | FlipRevealBlock
    | ConnectBlock
    | PodcastGridBlock
    | PodcastFeaturedBlock
    | PodcastArchiveBlock
    | PodcastPlayerBlock
    | CommunityReviewBlock
    | FestivalMapBlock
    | FestivalCardBlock
    | FeaturedFestivalsBlock
    | CTAHeroBlock
    | GlassmorphismPricingBlock
    | NewsletterSignupBlock
    | EcosystemContentBlock
    | EnterprisePricingBlock
    | FaqSectionBlock
    | AiFeaturesBlock
    | StackingCardsBlock
    | ProductCardStackBlock
    | CardsSliderBlock
    | AboutHeroBlock
    | AboutWhoAreYouBlock
    | AboutTruthUntangledBlock
    | AboutMoreThanEntertainmentBlock
    | AboutOriginStoryBlock
    | StitchFeaturedBlogBlock
    | StitchFeaturedFestivalsBlock
    | StitchPodcastBlock
    | StitchCommunityReviewBlock
    | JournalHeroBlock
    | JournalCategoryFilterBlock
    | JournalArticleGridBlock
    | JournalNewsletterBlock
    | ContactEtherealHeroBlock
    | ContactEtherealInfoBlock
    | ContactCartographerBlock
    | PartnersHeroBlock
    | PartnersBentoBlock
    | PartnersProcessBlock
    | PartnersContactBlock
    | FestivalArchiveHeroBlock
    | FestivalFilterBarBlock
    | FestivalBentoGridBlock
    | FestivalProgressTrailBlock
    | Globe3DBlock;


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
        imagePosition?: 'left' | 'right';
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
        subtitle?: string;
        description?: string;
        feedSource?: 'manual' | 'services' | 'portfolio' | 'insights';
        maxItems?: number;
        sourceCategory?: string;
        items?: Array<{
            image: string;
            title: string;
            subtitle?: string;
            description?: string;
            category: string;
            categoryIcon?: string;
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
        layout?: 'hero' | 'cards' | 'list' | 'bento';
        showPlayButton?: boolean;
        ctaText?: string;
        ctaHref?: string;
    };
}

export interface PodcastArchiveBlock extends BaseBlock {
    type: 'podcast_archive';
    content: {
        title?: string;
        subtitle?: string;
        showSidebar?: boolean;
        showFeaturedGrid?: boolean;
        featuredLimit?: number;
        discoveryLayout?: 'list' | 'grid';
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
        reviews?: HomeReview[]; // Dynamic reviews passed from backend
    };
}

export interface FestivalMapBlock extends BaseBlock {
    type: 'festival_map';
    content: {
        badge?: string;
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

export interface GlassmorphismPricingBlock extends BaseBlock {
    type: 'glassmorphism_pricing';
    content: {
        title?: string;
        subtitle?: string;
        plans?: Array<{
            name: string;
            price: string;
            description: string;
            features: string[];
            popular: boolean;
            buttonText?: string;
            buttonLink?: string;
        }>;
    };
}

export interface NewsletterSignupBlock extends BaseBlock {
    type: 'newsletter_signup';
    content: {
        badgeText?: string;
        title?: string;
        description?: string;
        features?: string[];
        placeholderText?: string;
        buttonText?: string;
        footerText?: string;
        successTitle?: string;
        successDescription?: string;
        trustIndicatorNumber?: string;
        trustIndicatorText?: string;
    };
}

export interface EcosystemContentBlock extends BaseBlock {
    type: 'ecosystem_content';
    content: {
        heading?: string;
        imageDarkSrc?: string;
        imageLightSrc?: string;
        imageAlt?: string;
        description1?: string;
        description2?: string;
        quoteText?: string;
        quoteAuthor?: string;
    };
}

export interface EnterprisePricingBlock extends BaseBlock {
    type: 'enterprise_pricing';
    content: {
        heading?: string;
        planName?: string;
        planDescription?: string;
        priceAmount?: string;
        priceCurrency?: string;
        buttonText?: string;
        buttonLink?: string;
        featuresText?: string;
        features?: Array<{ text: string }>;
        trustedText?: string;
    };
}

export interface FaqSectionBlock extends BaseBlock {
    type: 'faq_section';
    content: {
        heading?: string;
        description?: string;
        faqs?: Array<{
            id: string;
            icon: string;
            question: string;
            answer: string;
        }>;
    };
}

export interface AiFeaturesBlock extends BaseBlock {
    type: 'ai_features';
    content: {
        heading?: string;
        description?: string;
        features?: Array<{
            id: string;
            icon: string;
            title: string;
            description: string;
            imageSrc: string;
        }>;
    };
}

export interface StackingCardsBlock extends BaseBlock {
    type: 'stacking_cards';
    content: {
        scrollText?: string;
        footerText?: string;
        cards?: Array<{
            bgColor: string;
            title: string;
            description: string;
            imageSrc: string;
        }>;
    };
}

export interface ProductCardStackBlock extends BaseBlock {
    type: 'product_card_stack';
    content: {
        cards?: Array<{
            id: string;
            title: string;
            subtitle: string;
            imageSrc: string;
            specs?: Array<{ label: string; value: string }>;
        }>;
    };
}

export interface StackedCardsBlock extends BaseBlock {
    type: 'stacked_cards';
    content: {
        collection?: string; // 'insights', 'portfolio', 'services'
        limit?: number;
        title?: string;
        description?: string;
    };
}


export interface CardsSliderBlock extends BaseBlock {
    type: 'cards_slider';
    content: {
        collection?: string; // 'insights', 'portfolio', 'services'
        limit?: number;
    };
}

export interface FeaturedFestivalsBlock extends BaseBlock {
    type: 'featured_festivals';
    content: {
        title?: string;
        subtitle?: string;
        limit?: number;
        showViewAll?: boolean;
        ctaText?: string;
        selectedFestivalIds?: number[];
    };
}

export interface AboutHeroBlock extends BaseBlock {
    type: 'about_hero';
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        backgroundImage?: string;
        ctaText?: string;
        ctaLink?: string;
    };
}

export interface AboutWhoAreYouBlock extends BaseBlock {
    type: 'about_who_are_you';
    content: {
        title?: string;
        description?: string;
        image?: string;
        signature?: string;
        items?: Array<{
            title?: string;
            description?: string;
            colorClass?: string;
        }>;
    };
}

export interface AboutTruthUntangledBlock extends BaseBlock {
    type: 'about_truth_untangled';
    content: {
        title?: string;
        description?: string;
        items?: Array<{
            icon?: string;
            title?: string;
            description?: string;
        }>;
    };
}

export interface AboutMoreThanEntertainmentBlock extends BaseBlock {
    type: 'about_more_than_entertainment';
    content: {
        title?: string;
        description?: string;
        cards?: Array<{
            image?: string;
            title?: string;
            subtitle?: string;
            link?: string;
        }>;
    };
}

export interface AboutOriginStoryBlock extends BaseBlock {
    type: 'about_origin_story';
    content: {
        title?: string;
        description?: string;
        image?: string;
        timeline?: Array<{
            year?: string;
            event?: string;
        }>;
    };
}

export interface StitchFeaturedBlogBlock extends BaseBlock {
    type: 'stitch_featured_blog';
    content: {
        title?: string;
        subtitle?: string;
        useDynamicPosts?: boolean;
        collection?: string;
        limit?: number;
        posts?: Array<{
            id?: string;
            title?: string;
            excerpt?: string;
            image?: string;
            author?: string;
            date?: string;
            link?: string;
        }>;
    };
}

export interface JournalHeroBlock extends BaseBlock {
    type: 'journal_hero';
    content: {
        titleHighlight?: string;
        titleMain?: string;
        description?: string;
        featuredPostId?: number; // Optional override
    };
}

export interface JournalCategoryFilterBlock extends BaseBlock {
    type: 'journal_category_filter';
    content: {
        showAllLabel?: string;
    };
}

export interface JournalArticleGridBlock extends BaseBlock {
    type: 'journal_article_grid';
    content: {
        columns?: 2 | 3;
        staggered?: boolean;
        showBentoCards?: boolean;
        limit?: number;
    };
}

export interface JournalNewsletterBlock extends BaseBlock {
    type: 'journal_newsletter';
    content: {
        title?: string;
        description?: string;
        placeholder?: string;
        buttonText?: string;
        badge?: string;
    };
}

export interface ContactEtherealHeroBlock extends BaseBlock {
    type: 'contact_ethereal_hero';
    content: {
        badgeText?: string;
        titleLine1?: string;
        titleLine2Highlight?: string;
        description?: string;
        sideImage?: string;
        sideImageAlt?: string;
        formBadgeText?: string;
        formSubmitText?: string;
        formEtaText?: string;
        labels?: {
            name?: string;
            email?: string;
            message?: string;
        };
        placeholders?: {
            name?: string;
            email?: string;
            message?: string;
        };
    };
}

export interface ContactEtherealInfoBlock extends BaseBlock {
    type: 'contact_ethereal_info';
    content: {
        archive?: {
            title?: string;
            description?: string;
            buttonText?: string;
            buttonLink?: string;
            image?: string;
        };
        directPort?: {
            number?: string;
            title?: string;
            description?: string;
        };
        instantMagic?: {
            title?: string;
        };
        voiceFrequency?: {
            title?: string;
            description?: string;
            phone?: string;
        };
        socialTether?: {
            title?: string;
            links?: Array<{
                label: string;
                url: string;
            }>;
        };
    };
}

export interface ContactCartographerBlock extends BaseBlock {
    type: 'contact_cartographer';
    content: {
        // Hero Section (Left)
        heroTitle?: string;
        heroTitleHighlight?: string;
        heroDescription?: string;
        
        // Info Section (Right - Bento)
        infoTitle?: string;
        infoDescription?: string;
        inquiryCards?: Array<{
            id: string;
            icon: string; // Lucide icon name
            title: string;
            description: string;
            color: 'primary' | 'secondary' | 'tertiary';
        }>;
        
        // Form Section (Right - Bottom)
        formTitle?: string;
        formDescription?: string;
        formSubmitText?: string;
        formSuccessMessage?: string;
        formAdminEmail?: string;
        subjects?: string[];
    };
}

export interface PartnersHeroBlock extends BaseBlock {
    type: 'partners_hero';
    content: {
        badgeText?: string;
        title?: string;
        description?: string;
        cta1?: { text: string; href: string };
        cta2?: { text: string; href: string };
        image?: string;
    };
}

export interface PartnersBentoBlock extends BaseBlock {
    type: 'partners_bento';
    content: {
        title?: string;
        subtitle?: string;
        cards: Array<{
            id: string;
            title: string;
            description: string;
            icon: string;
            link?: string;
        }>;
    };
}

export interface PartnersProcessBlock extends BaseBlock {
    type: 'partners_process';
    content: {
        title?: string;
        subtitle?: string;
        steps: Array<{
            id: string;
            title: string;
            description: string;
            icon: string;
        }>;
    };
}

export interface PartnersContactBlock extends BaseBlock {
    type: 'partners_contact';
    content: {
        title?: string;
        subtitle?: string;
        description?: string;
        features: string[];
        formTitle?: string;
        formDescription?: string;
        submitText?: string;
    };
}

export interface FestivalArchiveHeroBlock extends BaseBlock {
    type: 'festival_archive_hero';
    content: {
        badge?: string;
        title?: string;
        description?: string;
        watercolorBlurs?: Array<{
            color: string;
            position: { x: string; y: string };
            size: string;
        }>;
        marginalia?: Array<{
            id: string;
            type: 'text' | 'image' | 'stamp';
            content: string;
            position: { x: string; y: string };
            rotation?: number;
            parallaxSpeed?: number;
        }>;
    };
}

export interface FestivalFilterBarBlock extends BaseBlock {
    type: 'festival_filter_bar';
    content: {
        searchPlaceholder?: string;
        categories: Array<{
            id: string;
            label: string;
            count: string;
        }>;
    };
}

export interface FestivalBentoGridBlock extends BaseBlock {
    type: 'festival_bento_grid';
    content: {
        title?: string;
        subtitle?: string;
        useDynamicFestivals?: boolean;
        dynamicLimit?: number;
        ctaText?: string;
        ctaLink?: string;
        items: Array<{
            id: string;
            type: 'festival' | 'stat' | 'feature' | 'signup';
            festivalId?: number;
            title: string;
            subtitle?: string;
            image?: string;
            location?: string;
            rating?: string;
            tags?: string[];
            size: 'sm' | 'md' | 'lg' | 'wide' | 'tall';
            link?: string;
        }>;
    };
}

export interface FestivalProgressTrailBlock extends BaseBlock {
    type: 'festival_progress_trail';
    content: {
        steps: Array<{
            id: string;
            label: string;
            status: 'completed' | 'current' | 'upcoming';
        }>;
        scriptText?: string;
        pathType?: 'wave' | 'loop' | 'zigzag';
        color?: string;
    };
}

export interface Globe3DBlock extends BaseBlock {
    type: 'globe_3d';
    content: {
        markers?: Array<{
            id: string;
            lat: number;
            lng: number;
            label?: string;
            src?: string;
        }>;
        showAtmosphere?: boolean;
        atmosphereColor?: string;
        atmosphereIntensity?: number;
        ambientIntensity?: number;
        pointLightIntensity?: number;
        autoRotateSpeed?: number;
        bumpScale?: number;
        enableZoom?: boolean;
        showWireframe?: boolean;
        height?: string;
    };
}
