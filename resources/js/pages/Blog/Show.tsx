import AnimatedSection from '@/components/AnimatedSection';
import CommentSection from '@/components/Comments/CommentSection';
import ReactionButton from '@/components/Reactions/ReactionButton';
import MainLayout from '@/layouts/MainLayout';
import { Comment, Insight, ReactionType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { SeoHead } from '@/components/SeoHead';
import { ArrowLeft, Clock, User, Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';


import { PodcastPlayer } from '@/components/podcast/PodcastPlayer';
import FestivalCardBlock from '@/components/Blocks/FestivalCardBlock';
import CategoryIcon from '@/components/CategoryIcon';


interface Podcast {
    media_url: string;
    media_type: 'audio' | 'video';
    title: string;
    thumbnail?: string | null;
    episode_number?: number | null;
    season_number?: number | null;
}

interface Festival {
    id: number;
    title: string;
    // other fields as needed
}

interface Props {
    insight: Insight & {
        podcast?: Podcast;
        festival?: Festival;
        festival_id?: number;
        additionalCategories?: { name: string; slug: string; icon?: string | null }[];
    };
    comments: Comment[];
    reactionCounts: Record<string, number>;
    userReaction: ReactionType | null;
    relatedInsights?: Insight[];
}

export default function BlogShow({ insight, comments, reactionCounts, userReaction, relatedInsights = [] }: Props) {
    const { site } = usePage<{ 
        site: { 
            url: string; 
            logo: string; 
            name: string;

        } 
    }>().props;



    const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
        const url = encodeURIComponent(window.location.origin + window.location.pathname);
        const text = encodeURIComponent(insight.title);
        
        let shareUrl = '';
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const handleCopyLink = () => {
        const url = window.location.origin + window.location.pathname;
        
        const copyToClipboard = (text: string) => {
            if (navigator.clipboard) {
                return navigator.clipboard.writeText(text);
            } else {
                // Fallback for non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    return Promise.resolve();
                } catch (err) {
                    return Promise.reject(err);
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        };

        copyToClipboard(url)
            .then(() => toast.success('Link copied to clipboard!'))
            .catch(() => toast.error('Failed to copy link. Please copy it manually.'));
    };

    return (
        <MainLayout title={`${insight.title} - ${site?.name || 'Insights'}`}>
            <SeoHead
                title={insight.title}
                description={insight.excerpt}
                type="article"
                image={insight.featured_image}
                publishedTime={insight.published_at}
                modifiedTime={insight.updated_at}
                author={insight.author?.name || 'Anonymous'}
                structuredData={{
                    '@context': 'https://schema.org',
                    '@type': 'BlogPosting',
                    'headline': insight.title,
                    'description': insight.excerpt,
                    'image': insight.featured_image,
                    'datePublished': insight.published_at,
                    'dateModified': insight.updated_at,
                    'author': {
                        '@type': 'Person',
                        'name': insight.author?.name || 'Anonymous',
                    },
                    'publisher': {
                        '@type': 'Organization',
                        'name': site?.name || 'Website',
                        'logo': {
                            '@type': 'ImageObject',
                            'url': `${site?.url || ''}/logo.png`,
                        },
                    },
                }}
            />

            {/* Reading Progress Bar (Fixed at top) */}
            <div className="fixed top-[80px] left-0 w-full h-1 z-50 bg-agency-accent/20">
                <div className="h-full bg-agency-accent w-0 transition-all duration-300 transition-all" id="reading-progress"></div>
            </div>

            {/* Article Hero */}
            <article className="bg-white dark:bg-agency-dark">
                <header className="pt-48 pb-20 border-b border-agency-primary/5 dark:border-white/5">
                    <div className="mx-auto max-w-6xl px-4 text-center">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-agency-accent font-bold uppercase tracking-widest text-[10px] mb-12 hover:gap-4 transition-all">
                            <ArrowLeft className="h-3 w-3" /> Back to Insights
                        </Link>
                        
                        <AnimatedSection animation="slide-up">
                            <div className="flex flex-col items-center gap-6 mb-12">
                                <div className="flex flex-wrap justify-center gap-3">
                                    {[
                                        insight.category,
                                        ...(insight.additionalCategories || [])
                                    ].filter(Boolean).map((cat, idx) => (
                                        <div key={idx} className="category-icon-wrapper flex items-center gap-2 px-4 py-2 rounded-xl bg-agency-primary/5 dark:bg-white/5 border border-agency-primary/10 dark:border-white/10 shadow-sm backdrop-blur-sm transition-all hover:bg-agency-primary/10 dark:hover:bg-white/10"
                                             data-category={cat?.slug || ''}>
                                            <CategoryIcon 
                                                category={cat?.slug || ''} 
                                                icon={cat?.icon}
                                                size={18} 
                                                glow={true} 
                                            />
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-agency-primary/70 dark:text-white/70">
                                                {cat?.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em] opacity-30">
                                    <div className="flex items-center gap-2.5"><Clock className="size-3.5" /> {insight.reading_time || 5} min read</div>
                                    <div className="flex items-center gap-2.5"><User className="size-3.5" /> {insight.author?.name || 'Anonymous'}</div>
                                </div>
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-black [font-variant-caps:small-caps] tracking-[0.05em] leading-tight mb-12">
                                {insight.title}
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-agency-primary/60 dark:text-white/60 font-light leading-relaxed italic max-w-3xl mx-auto border-l-4 border-agency-accent pl-8 text-left">
                                {insight.excerpt}
                            </p>
                        </AnimatedSection>
                    </div>
                </header>

                {/* Featured Image - Constrained Viewport Height */}
                {insight.featured_image && (
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-[40px] shadow-2xl bg-agency-primary/5 dark:bg-white/5 flex items-center justify-center">
                            <img 
                                src={insight.featured_image} 
                                alt={insight.title} 
                                className="w-full h-auto max-h-[65vh] object-contain transition-all duration-700 bg-black/5"
                                style={{ maxHeight: '65vh' }}
                            />
                        </div>
                    </div>
                )}

                {/* Article Content */}
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-32">
                    {/* Social Share Bar */}
                    <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-agency-primary/5 dark:border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Share Article</span>
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => handleShare('facebook')}
                                title="Share on Facebook" 
                                aria-label="Share on Facebook" 
                                className="size-12 rounded-full bg-agency-primary/5 dark:bg-white/5 flex items-center justify-center hover:bg-agency-accent hover:text-white transition-all"
                            >
                                <Facebook className="size-5" />
                            </button>
                            <button 
                                onClick={() => handleShare('twitter')}
                                title="Share on Twitter" 
                                aria-label="Share on Twitter" 
                                className="size-12 rounded-full bg-agency-primary/5 dark:bg-white/5 flex items-center justify-center hover:bg-agency-accent hover:text-white transition-all"
                            >
                                <Twitter className="size-5" />
                            </button>
                            <button 
                                onClick={() => handleShare('linkedin')}
                                title="Share on LinkedIn" 
                                aria-label="Share on LinkedIn" 
                                className="size-12 rounded-full bg-agency-primary/5 dark:bg-white/5 flex items-center justify-center hover:bg-agency-accent hover:text-white transition-all"
                            >
                                <Linkedin className="size-5" />
                            </button>
                            <button 
                                onClick={handleCopyLink}
                                title="Copy Link" 
                                aria-label="Copy Link" 
                                className="size-12 rounded-full bg-agency-primary/5 dark:bg-white/5 flex items-center justify-center hover:bg-agency-accent hover:text-white transition-all"
                            >
                                <Share2 className="size-5" />
                            </button>
                        </div>
                    </div>

                    {/* Minimal Podcast Player (Conditional) */}
                    {insight.podcast && (insight.podcast.media_full_url || insight.podcast.media_url) && (
                        <div className="mb-16">
                            <div className="mb-6 flex items-center gap-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-agency-accent">Featured Podcast</span>
                                <div className="h-px flex-1 bg-agency-primary/5 dark:bg-white/5" />
                            </div>
                            <PodcastPlayer 
                                src={insight.podcast.media_full_url || insight.podcast.media_url}
                                title={insight.podcast.title}
                                artist={insight.author?.name}
                                thumbnail={insight.podcast.thumbnail_url || insight.podcast.thumbnail || insight.featured_image}
                                mediaType={insight.podcast.media_type || 'audio'}
                                variant="compact"
                                className="border border-agency-primary/10 dark:border-white/10 bg-white/5 backdrop-blur-md rounded-3xl"
                            />
                        </div>
                    )}

                    <div className="w-full">
                        <div className="prose prose-2xl dark:prose-invert max-w-none font-serif prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:mt-24 prose-headings:mb-10 prose-p:my-10 prose-p:text-[25px] prose-p:md:text-[33px] prose-p:leading-[1.8] prose-p:md:leading-[1.9] prose-li:text-[25px] prose-li:md:text-[33px] prose-li:leading-[1.8] prose-li:md:leading-[1.9] prose-a:text-agency-accent prose-a:transition-colors prose-a:duration-300 hover:prose-a:text-agency-primary dark:hover:prose-a:text-white prose-strong:text-agency-primary dark:prose-strong:text-white prose-blockquote:border-l-8 prose-blockquote:border-agency-accent prose-blockquote:bg-agency-accent/5 prose-blockquote:py-10 prose-blockquote:px-12 prose-blockquote:rounded-r-3xl prose-blockquote:italic prose-blockquote:text-3xl prose-blockquote:font-serif first-of-type:prose-p:first-letter:text-8xl first-of-type:prose-p:first-letter:font-black first-of-type:prose-p:first-letter:mr-4 first-of-type:prose-p:first-letter:float-left first-of-type:prose-p:first-letter:leading-[0.8] first-of-type:prose-p:first-letter:text-agency-accent">
                            {/* Using dangerouslySetInnerHTML because we expect rich text from the CMS */}
                            {insight.content?.body ? (
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(insight.content.body)) }} />
                            ) : (
                                <p className="italic opacity-40">Article content is being developed...</p>
                            )}
                        </div>

                        {/* Associated Festival Card (Conditional) */}
                        {(insight.festival_id || insight.festival) && (
                            <div className="mt-24">
                                <div className="mb-8 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-agency-primary/5 dark:bg-white/5" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Associated Experience</span>
                                    <div className="h-px flex-1 bg-agency-primary/5 dark:bg-white/5" />
                                </div>
                                <FestivalCardBlock 
                                    festivalId={Number(insight.festival_id || insight.festival?.id)} 
                                    variant="dreamy" 
                                    showActivities={true} 
                                    showTags={true} 
                                />
                            </div>
                        )}

                        {/* Reactions on Post */}
                        <div className="mt-16 pt-10 border-t border-agency-primary/5 dark:border-white/5">
                            <ReactionButton
                                reactableId={insight.id}
                                reactableType="insight"
                                counts={reactionCounts}
                                userReaction={userReaction}
                            />
                        </div>

                        {/* Tags */}
                        {insight.tags && insight.tags.length > 0 && (
                            <div className="mt-12 pt-10 border-t border-agency-primary/5 dark:border-white/5">
                                <div className="flex flex-wrap gap-3">
                                    {insight.tags.map(tag => (
                                        <span key={tag} className="px-5 py-2 rounded-full bg-agency-secondary dark:bg-white/5 text-[10px] font-bold uppercase tracking-widest">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author Bio */}
                        <div className="mt-24 p-12 rounded-[50px] bg-agency-secondary dark:bg-white/5 flex flex-col md:flex-row items-center gap-10">
                            {insight.author?.avatar && (
                                <div className="size-24 rounded-full overflow-hidden shrink-0 border-2 border-agency-accent p-1">
                                    <img 
                                        src={insight.author.avatar} 
                                        alt={insight.author.name} 
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                            )}
                            <div className="text-center md:text-left">
                                <span className="text-agency-accent font-bold uppercase tracking-widest text-xs mb-2 block">Written by</span>
                                <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">{insight.author?.name || 'Anonymous'}</h4>
                                <p className="text-agency-primary/60 dark:text-white/60 leading-relaxed font-light">
                                    Thought leader and creative visionary, exploring the intersection of design, technology, and human experience.
                                </p>
                            </div>
                        </div>
                        {/* Comments Section */}
                        <CommentSection insightSlug={insight.slug} insightId={insight.id} comments={comments} />
                    </div>
                </div>
            </article>

            {/* Related Insights Grid */}
            {relatedInsights.length > 0 && (
                <section className="bg-agency-secondary dark:bg-black/40 py-40">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <header className="mb-20 flex justify-between items-end">
                            <div>
                                <span className="text-agency-accent font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Keep Reading</span>
                                <h2 className="text-5xl font-black uppercase tracking-tighter">More <span className="italic opacity-30">Insights.</span></h2>
                            </div>
                            <Link href="/blog" className="text-xs font-black uppercase tracking-widest hover:text-agency-accent transition-colors">See all articles</Link>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {relatedInsights.map((post, i) => (
                                <AnimatedSection key={post.id} animation="slide-up" delay={i * 100} className="group flex flex-col">
                                    <Link href={`/blog/${post.slug}`} className="block">
                                        <div className="relative aspect-video rounded-[40px] overflow-hidden mb-8 shadow-xl bg-agency-primary/5 dark:bg-white/5">
                                            {post.featured_image && (
                                                <img 
                                                    src={post.featured_image} 
                                                    alt={post.title} 
                                                    loading="lazy"
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                                                />
                                            )}
                                        </div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter text-agency-primary dark:text-white group-hover:text-agency-accent transition-colors duration-500">
                                            {post.title}
                                        </h3>
                                    </Link>
                                </AnimatedSection>
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </MainLayout>
    );
}
