import React from 'react';
import { blockRegistry } from '@/lib/BlockRegistry';
import DOMPurify from 'dompurify';
import AnimatedSection from '@/components/AnimatedSection';
import VideoPlayer from '@/components/ui/video-player';
import DynamicIcon from '@/components/DynamicIcon';

import { 
    PageBlock, 
    VideoBlock as VideoBlockType, 
    TextBlock as TextBlockType, 
    ImageBlock as ImageBlockType, 
    FeaturesBlock as FeaturesBlockType,
    AnimatedShaderHeroBlock,
    StoryBlock as StoryBlockType,
    ManifestoBlock as ManifestoBlockType,
    ProcessBlock as ProcessBlockType,
    ContactInfoBlock as ContactInfoBlockType,
    FaqBlock as FaqBlockType,
    TestimonialBlock as TestimonialBlockType,
    LogoCloudBlock as LogoCloudBlockType,
    AppleCardsCarouselBlock as AppleCardsCarouselBlockType,
    CoverDemoBlock as CoverDemoBlockType,
    VideoBackgroundHeroBlock as VideoBackgroundHeroBlockType,
    ParallaxFeaturesBlock as ParallaxFeaturesBlockType,
    GSAPHorizontalScrollBlock as GSAPHorizontalScrollBlockType,
    CreativeGridBlock as CreativeGridBlockType,
    TeamHeroBlock as TeamHeroBlockType,
    TeamGridBlock as TeamGridBlockType,
    CultureBentoBlock as CultureBentoBlockType,
    TeamJoinBlock as TeamJoinBlockType,
    CommunityReviewBlock as CommunityReviewBlockType
} from '@/types/page-blocks';
import { cn } from '@/lib/utils';

import AnimatedShaderHero from '@/components/ui/animated-shader-hero';


// Lazy load block components for performance optimization
const HeroSection = React.lazy(() => import('@/components/HeroSection'));
const StatsSection = React.lazy(() => import('@/components/StatsSection'));
const ServicesSection = React.lazy(() => import('@/components/ServicesSection'));
const FeaturedProjects = React.lazy(() => import('@/components/FeaturedProjects'));
const RecentInsights = React.lazy(() => import('@/components/RecentInsights'));
const FormSection = React.lazy(() => import('@/components/FormSection'));
const StoryBlock = React.lazy(() => import('./StoryBlock'));
const ManifestoBlock = React.lazy(() => import('./ManifestoBlock'));
const ProcessBlock = React.lazy(() => import('./ProcessBlock'));
const ContactInfoBlock = React.lazy(() => import('./ContactInfoBlock'));
const FAQBlock = React.lazy(() => import('./FAQBlock'));
const CtaBlock = React.lazy(() => import('./CtaBlock'));
const TestimonialBlock = React.lazy(() => import('./TestimonialBlock'));
const LogoCloudBlock = React.lazy(() => import('./LogoCloudBlock'));
const AppleCardsCarouselBlock = React.lazy(() => import('./AppleCardsCarouselBlock'));
const CoverDemoBlock = React.lazy(() => import('./CoverDemoBlock'));
const VideoBackgroundHero = React.lazy(() => import('./VideoBackgroundHero'));
const ParallaxFeaturesBlock = React.lazy(() => import('./ParallaxFeaturesBlock'));
const GSAPHorizontalScrollBlock = React.lazy(() => import('./GSAPHorizontalScrollBlock'));
const CreativeGridBlock = React.lazy(() => import('./CreativeGridBlock'));
const TeamHeroBlock = React.lazy(() => import('./TeamHeroBlock'));
const TeamGridBlock = React.lazy(() => import('./TeamGridBlock'));
const CultureBentoBlock = React.lazy(() => import('./CultureBentoBlock'));
const TeamJoinBlock = React.lazy(() => import('./TeamJoinBlock'));
const CommunityReviewBlock = React.lazy(() => import('./CommunityReviewBlock'));
const JournalHeroBlock = React.lazy(() => import('./JournalHeroBlock'));
const JournalCategoryFilterBlock = React.lazy(() => import('./JournalCategoryFilterBlock'));
const JournalArticleGridBlock = React.lazy(() => import('./JournalArticleGridBlock'));
const JournalNewsletterBlock = React.lazy(() => import('./JournalNewsletterBlock'));
const CinematicHero = React.lazy(() => import('./CinematicHero'));
const Globe3DBlockRenderer = React.lazy(() => import('./Globe3DBlock'));



import { 
    Service, 
    PortfolioItem as ProjectItem, 
    Insight as InsightItem, 
    Category,
    Review,
    TeamMember 
} from '@/types';

// Column content type for text blocks
interface ColumnContent {
    body?: string;
    textSize?: string;
    textAlign?: string;
    url?: string;
    alt?: string;
    caption?: string;
    text?: string;
    style?: string;
    icon?: string;
    iconType?: 'lucide' | 'custom';
}

interface BlockRendererProps {
    blocks: PageBlock[];
    featuredServices?: Service[];
    featuredProjects?: ProjectItem[];
    recentInsights?: InsightItem[];
    categories?: Category[];
    teamMembers?: TeamMember[];
    reviews?: Review[];
}

const VideoBlock = ({ content }: { content: VideoBlockType['content'] }) => {
    const { url } = content;
    if (!url) return null;
    return (
        <section className="py-20 bg-background overflow-hidden px-4 md:px-8">
            <div className="mx-auto max-w-7xl">
                <AnimatedSection animation="fade-up">
                    <VideoPlayer src={url} />
                </AnimatedSection>
            </div>
        </section>
    );
};

// Helper functions for TextBlock
const getGridClass = (layout: string): string => {
    switch (layout) {
        case '1':     return 'grid grid-cols-1 gap-8';
        case '1-1':   return 'grid grid-cols-1 md:grid-cols-2 gap-8';
        case '1-1-1': return 'grid grid-cols-1 md:grid-cols-3 gap-8';
        case '2-1':   return 'grid grid-cols-1 md:grid-cols-3 gap-8 [&>*:first-child]:md:col-span-2';
        case '1-2':   return 'grid grid-cols-1 md:grid-cols-3 gap-8 [&>*:last-child]:md:col-span-2';
        default:      return 'grid grid-cols-1 gap-8';
    }
};

const getTextSizeClass = (size: string): string => {
    switch (size) {
        case 'sm':   return 'prose-sm';
        case 'base': return 'prose-base';
        case 'lg':   return 'prose-lg';
        case 'xl':   return 'prose-xl';
        case '2xl':  return 'prose-2xl';
        default:     return 'prose-base';
    }
};

const getTextAlignClass = (align: string): string => {
    switch (align) {
        case 'left':   return 'text-left';
        case 'center': return 'text-center';
        case 'right':  return 'text-right';
        default:       return 'text-left';
    }
};

// Column content renderer for TextBlock
const ColumnRenderer = ({ column }: { column: NonNullable<TextBlockType['content']['columns']>[number] }) => {
    const { type, content: rawContent } = column;
    // Cast to ColumnContent for proper type access
    const content = rawContent as ColumnContent;

    switch (type) {
        case 'text': {
            const body = (content?.body as string) || '';
            const sanitizedHTML = DOMPurify.sanitize(body, {
                ALLOWED_TAGS: [
                    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'ul', 'ol', 'li',
                    'a', 'blockquote', 'code', 'pre',
                    'mark', 'span', 'div',
                    'img', 'figure', 'figcaption',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td',
                    'hr'
                ],
                ALLOWED_ATTR: [
                    'href', 'target', 'rel', 'class', 'style',
                    'src', 'alt', 'title', 'width', 'height',
                    'data-*', 'id'
                ],
                ALLOW_DATA_ATTR: true
            });
            const sizeClass = getTextSizeClass(content?.textSize || 'base');
            const alignClass = getTextAlignClass(content?.textAlign || 'left');
            return (
                <div className={cn('prose dark:prose-invert max-w-none font-sans', sizeClass, alignClass)}>
                    {content?.icon && (
                        <div className={cn("mb-4 flex", alignClass === 'text-center' ? 'justify-center' : alignClass === 'text-right' ? 'justify-end' : 'justify-start')}>
                            <DynamicIcon 
                                icon={content.icon} 
                                type={content.iconType as any || 'lucide'} 
                                size={32} 
                                className="text-primary"
                                glow={content.iconType === 'custom'}
                            />
                        </div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
                </div>
            );
        }
        case 'icon': {
            const size = (content?.iconSize as number) || 48;
            const alignClass = getTextAlignClass(content?.textAlign || 'left');
            if (!content?.icon) return null;
            return (
                <div className={cn("flex w-full", alignClass === 'text-center' ? 'justify-center' : alignClass === 'text-right' ? 'justify-end' : 'justify-start')}>
                    <DynamicIcon 
                        icon={content.icon as string} 
                        type={content.iconType as any || 'lucide'} 
                        size={size} 
                        className="text-primary"
                        glow={content.iconType === 'custom'}
                    />
                </div>
            );
        }
        case 'image': {
            const url = content?.url as string;
            if (!url) return null;
            return (
                <figure className="relative">
                    <img 
                        src={url} 
                        alt={(content?.alt as string) || 'Image'} 
                        loading="lazy"
                        decoding="async"
                        className="w-full rounded-2xl shadow-lg object-cover" 
                    />
                    {content?.caption && (
                        <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                            {content.caption as string}
                        </figcaption>
                    )}
                </figure>
            );
        }
        case 'video': {
            const url = content?.url as string;
            if (!url) return null;
            return <VideoPlayer src={url} />;
        }
        case 'button': {
            const text = content?.text as string;
            if (!text) return null;
            const getButtonClasses = (style: string) => {
                const baseClasses = "inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
                switch (style) {
                    case 'primary':
                        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg`;
                    case 'secondary':
                        return `${baseClasses} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
                    case 'outline':
                        return `${baseClasses} border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground`;
                    case 'ghost':
                        return `${baseClasses} text-primary hover:bg-primary/10 underline-offset-4 hover:underline`;
                    default:
                        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
                }
            };
            return (
                <div className="flex items-center">
                    <a 
                        href={(content?.url as string) || '#'} 
                        className={getButtonClasses((content?.style as string) || 'primary')}
                    >
                        {text}
                    </a>
                </div>
            );
        }
        case 'globe_3d': {
            // Note: Since Globe3DBlockRenderer expects props based on Globe3DBlock['content'],
            // we cast rawContent to any and pass it down. 
            // In ColumnRenderer we don't have the nice layout wrapper around the block, so we 
            // just pass the properties directly. The Globe3DBlockRenderer component itself provides
            // a nice padded section wrapper. To use it in a column, we might want to avoid the extra 
            // section padding. Let's pass the rawContent and a flag or just let Globe3DBlockRenderer 
            // handle it. Alternatively, to keep it clean in a column:
            const globeContent = rawContent as any;
            return (
                <div className="w-full flex justify-center">
                    <React.Suspense fallback={<div className="h-[400px] w-full animate-pulse bg-muted rounded-2xl" />}>
                        <Globe3DBlockRenderer {...globeContent} disableSectionPadding={true} />
                    </React.Suspense>
                </div>
            );
        }
        default:
            return null;
    }
};

const TextBlock = ({ content }: { content: TextBlockType['content'] }) => {
    const { title, layout, columns, body } = content;
    
    // Legacy support: if no columns exist, render old-style text block
    if (!columns || columns.length === 0) {
        const sanitizedHTML = DOMPurify.sanitize(body || '', {
            ALLOWED_TAGS: [
                'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike', 'del',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li',
                'a', 'blockquote', 'code', 'pre',
                'mark', 'span', 'div',
                'img', 'figure', 'figcaption',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'hr'
            ],
            ALLOWED_ATTR: [
                'href', 'target', 'rel', 'class', 'style',
                'src', 'alt', 'title', 'width', 'height',
                'data-*', 'id'
            ],
            ALLOW_DATA_ATTR: true
        });

        return (
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto prose dark:prose-invert font-sans">
                    {content.icon && (
                        <div className="mb-6 flex">
                            <DynamicIcon 
                                icon={content.icon} 
                                type={content.iconType as any || 'lucide'} 
                                size={48} 
                                className="text-primary"
                                glow={content.iconType === 'custom'}
                            />
                        </div>
                    )}
                    {title && <h2>{title}</h2>}
                    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
                </div>
            </section>
        );
    }

    // New multi-column layout
    const gridClass = getGridClass(layout || '1');
    
    return (
        <section className="py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center mb-12">
                    {content.icon && (
                        <AnimatedSection animation="fade-up" className="mb-6">
                            <DynamicIcon 
                                icon={content.icon} 
                                type={content.iconType as any || 'lucide'} 
                                size={64} 
                                className="text-primary"
                                glow={content.iconType === 'custom'}
                            />
                        </AnimatedSection>
                    )}
                    {title && (
                        <AnimatedSection animation="fade-up" className="text-center">
                            <h2 className="text-4xl font-black tracking-tight">{title}</h2>
                        </AnimatedSection>
                    )}
                </div>
                <div className={cn(gridClass, "items-center")}>
                    {columns.map((col, idx) => (
                        <AnimatedSection key={col.id || idx} animation="fade-up" delay={idx * 100}>
                            <ColumnRenderer column={col} />
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

const ImageBlock = ({ content }: { content: ImageBlockType['content'] }) => {
    const { image, aspectRatio, objectFit, caption } = content;
    const { url, alt } = image || {};
    return (
        <section className="py-20 bg-background px-4">
            <div className="mx-auto max-w-7xl">
                <AnimatedSection animation="scale">
                    <figure className="relative">
                        <img 
                            src={url} 
                            alt={alt || 'Image'} 
                            loading="lazy"
                            decoding="async"
                            className={cn(
                                "w-full rounded-[40px] shadow-2xl",
                                aspectRatio && `aspect-${aspectRatio}`,
                                objectFit && `object-${objectFit}`
                            )} 
                        />
                        {caption && (
                            <figcaption className="mt-4 text-center text-sm text-muted-foreground">
                                {caption}
                            </figcaption>
                        )}
                    </figure>
                </AnimatedSection>
            </div>
        </section>
    );
};

const FeaturesBlock = ({ content }: { content: FeaturesBlockType['content'] }) => {
    const { title, items } = content;
    return (
        <section className="py-24 bg-muted/20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {title && (
                    <div className="mb-16 text-center">
                        <h2 className="text-4xl font-black tracking-tight md:text-6xl">
                            {title}
                        </h2>
                    </div>
                )}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {(items || []).map((item: Record<string, unknown>, i: number) => (
                        <AnimatedSection key={i} animation="fade-up" delay={i * 100} className="rounded-2xl border bg-card p-8 shadow-sm">
                            <h3 className="mb-4 text-xl font-bold">{item.title as string}</h3>
                            <p className="text-muted-foreground">{item.desc as string}</p>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default function BlockRenderer({ 
    blocks, 
    featuredServices = [], 
    featuredProjects = [], 
    recentInsights = [],
    categories = [],
    teamMembers = [],
    reviews = []
}: BlockRendererProps) {

    if (!blocks || blocks.length === 0) return null;

    return (
        <div className="flex flex-col">
            <React.Suspense fallback={<div className="min-h-[200px] flex items-center justify-center bg-background/50 animate-pulse rounded-2xl m-4 border-2 border-dashed border-muted-foreground/20 text-muted-foreground h-full w-full">Loading section...</div>}>
                {blocks.map((block, index) => {
                    if (block.is_enabled === false) return null;

                    const blockKey = block.id || `block-${index}`;
                    
                    // Centralized animation properties for blocks
                    const animationProps = {
                        animation: "fade-up",
                        delay: 0, // Individual blocks can still override internally
                        className: "w-full overflow-hidden"
                    };

                    const renderBlock = () => {
                        switch (block.type) {
                            case 'animated_shader_hero': {
                                const content = block.content as AnimatedShaderHeroBlock['content'];
                                return (
                                    <div className="relative z-0">
                                        <AnimatedShaderHero
                                            trustBadge={content.trustBadge}
                                            headline={content.headline}
                                            subtitle={content.subtitle}
                                            buttons={{
                                                primary: { 
                                                    text: content.buttons?.primary?.text || '', 
                                                    onClick: () => {
                                                        if (typeof window !== 'undefined') {
                                                            window.location.href = content.buttons?.primary?.url || '#';
                                                        }
                                                    }
                                                },
                                                secondary: { 
                                                    text: content.buttons?.secondary?.text || '', 
                                                    onClick: () => {
                                                        if (typeof window !== 'undefined') {
                                                            window.location.href = content.buttons?.secondary?.url || '#';
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                );
                            }
                            case 'hero':
                                return (
                                    <HeroSection
                                        title={block.content.title}
                                        subtitle={block.content.subtitle}
                                        description={block.content.description}
                                        ctaText={block.content.ctaText}
                                        ctaHref={block.content.ctaHref}
                                        marqueeText={block.content.marqueeText}
                                        backgroundImages={block.content.backgroundImages}
                                        showFloatingImages={block.content.showFloatingImages !== false}
                                        secondaryCtaText={block.content.secondaryCtaText}
                                        secondaryCtaHref={block.content.secondaryCtaHref}
                                    />
                                );
                            case 'text':
                                return <TextBlock content={block.content as TextBlockType['content']} />;
                            case 'image':
                                return <ImageBlock content={block.content as ImageBlockType['content']} />;
                            case 'features':
                                return <FeaturesBlock content={block.content as FeaturesBlockType['content']} />;
                            case 'stats':
                                return <StatsSection stats={block.content.items} title={block.content.title} subtitle={block.content.subtitle} />;
                            case 'services':
                                return <ServicesSection title={block.content.title} services={featuredServices?.slice(0, Number(block.content.limit) || 3)} useStackedCards={block.content.useStackedCards} />;
                            case 'portfolio':
                                return (
                                    <FeaturedProjects 
                                        title={block.content.title} 
                                        subtitle={block.content.subtitle} 
                                        description={block.content.description}
                                        showViewAll={block.content.showViewAll}
                                        projects={featuredProjects?.slice(0, Number(block.content.limit) || 3)} 
                                    />
                                );
                            case 'insights':
                                return <RecentInsights title={block.content.title} insights={recentInsights?.slice(0, Number(block.content.limit) || 3)} />;
                            case 'cta':
                                return (
                                    <CtaBlock 
                                        title={block.content.title}
                                        subtitle={block.content.subtitle}
                                        ctaText={block.content.ctaText}
                                        ctaHref={block.content.ctaHref}
                                        email={block.content.email}
                                    />
                                );
                            case 'cinematic_hero':
                                return <CinematicHero slides={block.content.slides || []} />;
                            case 'video':
                                return <VideoBlock content={block.content as VideoBlockType['content']} />;
                            case 'form':
                                return (
                                    <FormSection 
                                        title={block.content.title}
                                        description={block.content.description}
                                        steps={(block.content.steps || []).map((step) => ({
                                            ...step,
                                            id: step.id || Math.random().toString(36).substring(2, 9),
                                            title: step.title || '',
                                            fields: step.fields || [],
                                        }))}
                                        submitText={block.content.submitText}
                                        adminEmail={block.content.adminEmail}
                                        replyToEmail={block.content.replyToEmail}
                                        confirmationEmailBody={block.content.confirmationEmailBody}
                                        successMessage={block.content.successMessage}
                                        allowMultipleSubmissions={block.content.allowMultipleSubmissions}
                                    />
                                );
                            case 'story':
                                return <StoryBlock {...(block.content as StoryBlockType['content'])} />;
                            case 'manifesto':
                                return <ManifestoBlock {...(block.content as ManifestoBlockType['content'])} />;
                            case 'process':
                                return <ProcessBlock {...(block.content as ProcessBlockType['content'])} />;
                            case 'contact_info':
                                return <ContactInfoBlock {...(block.content as ContactInfoBlockType['content'])} />;
                            case 'faq':
                                return <FAQBlock {...(block.content as FaqBlockType['content'])} />;
                            case 'testimonials':
                                return <TestimonialBlock {...(block.content as TestimonialBlockType['content'])} />;
                            case 'logo_cloud':
                                return <LogoCloudBlock {...(block.content as LogoCloudBlockType['content'])} />;
                            case 'apple_cards_carousel':
                                return (
                                    <AppleCardsCarouselBlock 
                                        {...(block.content as AppleCardsCarouselBlockType['content'])} 
                                        services={featuredServices}
                                        portfolio={featuredProjects}
                                        insights={recentInsights}
                                    />
                                );
                            case 'cover_demo':
                                return <CoverDemoBlock {...(block.content as CoverDemoBlockType['content'])} />;
                            case 'video_background_hero':
                                return <VideoBackgroundHero {...(block.content as VideoBackgroundHeroBlockType['content'])} />;
                            case 'parallax_features':
                                return <ParallaxFeaturesBlock {...(block.content as ParallaxFeaturesBlockType['content'])} />;
                            case 'gsap_horizontal_scroll':
                                return <GSAPHorizontalScrollBlock {...(block.content as GSAPHorizontalScrollBlockType['content'])} />;
                            case 'creative_grid':
                                return (
                                    <CreativeGridBlock 
                                        {...(block.content as CreativeGridBlockType['content'])} 
                                        services={featuredServices}
                                        portfolio={featuredProjects}
                                        insights={recentInsights}
                                    />
                                );
                            case 'team_hero':
                                return <TeamHeroBlock {...(block.content as TeamHeroBlockType['content'])} />;
                            case 'team_grid':
                                return (
                                    <TeamGridBlock 
                                        {...(block.content as TeamGridBlockType['content'])} 
                                        teamMembers={teamMembers}
                                    />
                                );
                            case 'culture_bento':
                                return <CultureBentoBlock {...(block.content as CultureBentoBlockType['content'])} />;
                            case 'team_join':
                                return <TeamJoinBlock {...(block.content as TeamJoinBlockType['content'])} />;

                            case 'community_review':
                                return (
                                    <CommunityReviewBlock 
                                        {...(block.content as CommunityReviewBlockType['content'])} 
                                        reviews={reviews}
                                    />
                                );

                            case 'journal_hero':
                                return (
                                    <JournalHeroBlock 
                                        content={block.content as any} 
                                        recentInsights={recentInsights as any} 
                                    />
                                );
                            case 'journal_category_filter':
                                return (
                                    <JournalCategoryFilterBlock 
                                        content={block.content as any} 
                                        categories={categories} 
                                    />
                                );
                            case 'journal_article_grid':
                                return (
                                    <JournalArticleGridBlock 
                                        content={block.content as any} 
                                        recentInsights={recentInsights as any} 
                                        categories={categories}
                                    />
                                );
                            case 'journal_newsletter':
                                return (
                                    <JournalNewsletterBlock 
                                        content={block.content as any} 
                                    />
                                );

                            default: {
                                const unknownBlock = block as unknown as {
                                    type: string;
                                    id: string | number;
                                    content: Record<string, unknown>;
                                };
                                const dynamicBlock = blockRegistry.get(unknownBlock.type);
                                if (dynamicBlock) {
                                    const Renderer = dynamicBlock.renderer;
                                    return <Renderer {...unknownBlock.content} />;
                                }
                                return null;
                            }
                        }
                    };

                    // Only wrap non-hero blocks in AnimatedSection to avoid double animations with internal logic
                    // Hero blocks usually handle their own entrance for LCP optimization
                    const isHero = ['hero', 'animated_shader_hero', 'cinematic_hero', 'video_background_hero', 'journal_hero'].includes(block.type);
                    
                    if (isHero) {
                        return <div key={blockKey}>{renderBlock()}</div>;
                    }

                    return (
                        <AnimatedSection key={blockKey} {...animationProps}>
                            {renderBlock()}
                        </AnimatedSection>
                    );
                })}

            </React.Suspense>
        </div>

    );
}

