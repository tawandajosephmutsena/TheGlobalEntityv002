import React, { Suspense, useMemo, lazy } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Comment, Insight, ReactionType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { SeoHead } from '@/components/SeoHead';
import { ArrowLeft, Clock, Share2, Globe, Lightbulb, CheckCircle2, Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { TooltipProvider } from '@/components/ui/tooltip';
import CategoryIcon from '@/components/CategoryIcon';
import AnimatedSection from '@/components/AnimatedSection';

// Lazy loaded components for better initial bundle size
const CommentSection = lazy(() => import('@/components/Comments/CommentSection'));
const ReactionButton = lazy(() => import('@/components/Reactions/ReactionButton'));
const PodcastPlayer = lazy(() => import('@/components/podcast/PodcastPlayer').then(m => ({ default: m.PodcastPlayer })));
const FestivalCardBlock = lazy(() => import('@/components/Blocks/FestivalCardBlock'));

interface Podcast {
    id: number;
    slug: string;
    media_url: string;
    media_full_url?: string;
    media_type: 'audio' | 'video';
    title: string;
    thumbnail?: string | null;
    thumbnail_url?: string | null;
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
    allCategories?: any[];
    relatedPodcasts?: Podcast[];
}

export default function BlogShow({ insight, comments, reactionCounts, userReaction, relatedInsights = [], allCategories = [], relatedPodcasts = [] }: Props) {
    const { site } = usePage<{ 
        site: { 
            url: string; 
            logo: string; 
            name: string;

        } 
    }>().props;

    React.useEffect(() => {
        const updateProgress = () => {
            const progress = document.getElementById('reading-progress');
            if (!progress) return;
            
            const totalWidth = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / totalWidth) * 100;
            progress.style.width = scrollPercent + '%';
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);



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
    // Memoized sanitized content to prevent heavy blocking on every re-render
    const sanitizedBody = useMemo(() => {
        if (!insight.content?.body) return null;
        return DOMPurify.sanitize(String(insight.content.body));
    }, [insight.content?.body]);

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
            {/* Redundant background removed as it is handled by MainLayout */}

            {/* Reading Progress Bar (Fixed at the very top) */}
            <div className="fixed top-0 left-0 w-full h-1 z-[110] bg-agency-accent/5">
                <div className="h-full bg-gradient-to-r from-agency-accent to-agency-accent/40 w-0 transition-all duration-300" id="reading-progress"></div>
            </div>

            <div className="relative pt-24 pb-24 lg:pb-32 bg-transparent min-h-[90vh] flex items-center overflow-visible">
                <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                    {/* Split Hero Section (50/50) */}
                    <AnimatedSection animation="slide-up" className="mb-12 lg:mb-20 w-full h-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                            {/* Left Side: Header Text & Meta (Vertically Centered) */}
                            <div className="flex flex-col justify-center h-full">
                                <Link href="/blog" className="inline-flex items-center gap-2 text-agency-accent font-black tracking-widest text-[10px] mb-8 hover:gap-4 transition-all">
                                    <ArrowLeft className="h-3 w-3" /> Chronicles
                                </Link>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter leading-[0.95] mb-12 italic">
                                    {insight.title.split(' ').map((word, i) => (
                                        <span key={i} className={i % 2 === 0 ? "text-agency-primary dark:text-white" : "text-agency-accent/40 not-italic"}>
                                            {word}{' '}
                                        </span>
                                    ))}
                                </h1>
                                
                                {insight.excerpt && (
                                    <p className="text-lg md:text-xl opacity-60 leading-relaxed font-serif mb-8 line-clamp-4 italic">
                                        {insight.excerpt}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-8 mb-8">
                                    <div className="flex items-center gap-4">
                                        {insight.author?.avatar && (
                                            <div className="size-10 rounded-full overflow-hidden border-2 border-agency-accent p-0.5">
                                                <img src={insight.author.avatar} alt={insight.author.name} className="size-full object-cover rounded-full" loading="lazy" decoding="async" />
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black tracking-widest opacity-40 leading-none mb-1">Visionary</span>
                                            <span className="text-xs font-bold">{insight.author?.name}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="h-8 w-px bg-agency-primary/10 dark:bg-white/10 hidden md:block" />
                                    
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black tracking-widest opacity-40 leading-none mb-1">Duration</span>
                                        <div className="flex items-center gap-2 font-bold text-xs">
                                            <Clock className="size-3 text-agency-accent" /> {insight.reading_time || 5} Min
                                        </div>
                                    </div>

                                    <div className="h-8 w-px bg-agency-primary/10 dark:bg-white/10 hidden md:block" />

                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black tracking-widest opacity-40 leading-none mb-1">Vibration</span>
                                        <div className="flex items-center gap-2 font-bold text-xs">
                                            {insight.published_at ? new Date(insight.published_at).toLocaleDateString() : 'Now'}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-12">
                                    <Suspense fallback={<div className="h-10 w-20 animate-pulse bg-white/5 rounded-full" />}>
                                        <ReactionButton
                                            reactableId={insight.id}
                                            reactableType="insight"
                                            counts={reactionCounts}
                                            userReaction={userReaction}
                                        />
                                    </Suspense>
                                </div>

                            </div>

                            {/* Right Side: Featured Image (50%) - Bulletproof Cover Fill */}
                            {insight.featured_image && (
                                <div className="relative h-full min-h-[500px] lg:min-h-[800px] w-full group">
                                    <div 
                                        className="absolute inset-0 overflow-hidden rounded-[50px] shadow-3xl border border-white/10 group-hover:scale-[1.02] transition-all duration-1000 bg-cover bg-center bg-no-repeat"
                                        style={{ 
                                            backgroundImage: `url(${insight.featured_image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        {/* Subtle overlay for text readability if needed */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-1000" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </AnimatedSection>
                </div>
            </div>

            <div className="max-w-5xl mx-auto pb-32">
                {/* Main Content (Centered) */}
                <main className="min-w-0">
                    {/* Article Body (Glass Container) */}
                    <div className="relative">
                        {/* The Glass frosted background */}
                        <div className="absolute -inset-8 md:-inset-16 lg:-inset-24 bg-white/30 dark:bg-black/40 backdrop-blur-[120px] rounded-[60px] md:rounded-[80px] border border-white/30 dark:border-white/10 shadow-4xl -z-10" />

                        {insight.podcast && (insight.podcast.media_full_url || insight.podcast.media_url) && (
                            <div className="mb-16">
                                <Suspense fallback={<div className="h-48 w-full animate-pulse bg-white/5 rounded-3xl" />}>
                                    <PodcastPlayer 
                                        src={insight.podcast.media_full_url || insight.podcast.media_url}
                                        title={insight.podcast.title}
                                        artist={insight.author?.name}
                                        thumbnail={insight.podcast.thumbnail_url || insight.podcast.thumbnail || insight.featured_image}
                                        mediaType={insight.podcast.media_type || 'audio'}
                                        variant="expanded"
                                        className="shadow-2xl border border-white/10"
                                    />
                                </Suspense>
                            </div>
                        )}

                        <div className="prose prose-xl lg:prose-2xl dark:prose-invert max-w-none font-serif prose-headings:font-display prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic prose-p:text-[20px] lg:prose-p:text-[24px] prose-p:leading-[1.8] prose-p:dark:text-white/90 prose-blockquote:border-l-[12px] prose-blockquote:border-agency-accent prose-blockquote:bg-agency-accent/5 prose-blockquote:p-8 lg:prose-blockquote:p-12 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:text-2xl lg:prose-blockquote:text-3xl prose-blockquote:font-display first-letter:text-7xl lg:first-letter:text-9xl first-letter:font-black first-letter:text-agency-accent first-letter:mr-4 lg:first-letter:mr-6 first-letter:float-left first-letter:leading-[0.7] first-letter:mt-3">
                            {sanitizedBody ? (
                                <div dangerouslySetInnerHTML={{ __html: sanitizedBody }} />
                            ) : (
                                <p className="italic opacity-40">Assembling the narrative structure...</p>
                            )}
                        </div>

                        {/* Quick Tips Section */}
                        {insight.quick_tips && insight.quick_tips.length > 0 && (
                            <div className="mt-40 space-y-12">
                                <div className="flex items-center gap-6">
                                    <div className="size-14 rounded-full bg-agency-accent/10 flex items-center justify-center text-agency-accent">
                                        <Lightbulb className="size-8" />
                                    </div>
                                    <h2 className="text-4xl font-display font-black tracking-tight">Executive <span className="text-agency-accent italic">Tips</span></h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {insight.quick_tips.map((tip, idx) => (
                                        <div key={idx} className="glass-effect p-12 rounded-[50px] border border-white/10 hover:border-agency-accent/40 transition-all duration-700 group hover:-translate-y-2">
                                            <div className="space-y-6">
                                                <h4 className="text-2xl font-black tracking-tight group-hover:text-agency-accent transition-colors">{tip.title}</h4>
                                                <div className="text-lg opacity-70 leading-relaxed font-sans font-light">
                                                    {tip?.type === 'points' ? (
                                                        <ul className="space-y-4">
                                                            {(tip.content || '').split('\n').filter(Boolean).map((pt: string, pi: number) => (
                                                                <li key={pi} className="flex gap-4 items-start">
                                                                    <CheckCircle2 className="size-5 text-agency-accent shrink-0 mt-1" />
                                                                    {pt.replace(/^[-*]\s*/, '')}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : <p>{tip.content}</p>}
                                                </div>
                                                {tip.image && (
                                                    <div className="aspect-video rounded-3xl overflow-hidden mt-8">
                                                            <img src={tip.image} alt="" className="size-full object-cover group-hover:scale-110 transition-transform duration-[2s]" loading="lazy" decoding="async" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Festival Association */}
                        {(insight.festival_id || insight.festival) && (
                            <div className="mt-40">
                                <div className="mb-12 flex items-center justify-between">
                                    <h2 className="text-4xl font-display font-black tracking-tight">The <span className="italic opacity-30">Experience</span></h2>
                                    <span className="text-[10px] font-black tracking-widest opacity-40">Manifesting Now</span>
                                </div>
                                <Suspense fallback={<div className="h-64 w-full animate-pulse bg-white/5 rounded-[50px]" />}>
                                    <FestivalCardBlock festivalId={insight.festival_id} />
                                </Suspense>
                            </div>
                        )}

                        {/* Reactions on Post */}
                        <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-black tracking-widest opacity-40">Interaction Index</span>
                                <h3 className="text-xl font-black">Share your vibration</h3>
                            </div>
                            <Suspense fallback={<div className="h-10 w-20 animate-pulse bg-white/5 rounded-full" />}>
                                <ReactionButton
                                    reactableId={insight.id}
                                    reactableType="insight"
                                    counts={reactionCounts}
                                    userReaction={userReaction}
                                />
                            </Suspense>
                        </div>

                        {/* Tags Pillbox */}
                        {insight.tags && insight.tags.length > 0 && (
                            <div className="mt-16 flex flex-wrap gap-4">
                                {insight.tags.map(tag => (
                                    <span key={tag} className="px-8 py-3 rounded-full bg-white/5 border border-white/5 text-[10px] font-black tracking-widest hover:bg-agency-accent/20 transition-all cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Author Signature */}
                        <div className="mt-40 glass-effect p-16 rounded-[80px] flex flex-col md:flex-row items-center gap-16 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 size-64 bg-agency-accent/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                            
                            {insight.author?.avatar && (
                                <div className="size-40 rounded-full overflow-hidden border-8 border-white/10 shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-1000">
                                    <img src={insight.author.avatar} alt={insight.author.name} className="size-full object-cover" loading="lazy" decoding="async" />
                                </div>
                            )}
                            <div className="flex-1 text-center md:text-left relative z-10">
                                <span className="text-[10px] font-black tracking-[0.5em] text-agency-accent mb-4 block">Manifested By</span>
                                <h4 className="text-5xl font-display font-black tracking-tight mb-8">{insight.author?.name}</h4>
                                <p className="text-xl opacity-60 leading-relaxed font-light font-serif mb-10 max-w-2xl">
                                    {insight.author?.about || "A strategic explorer mapping the intersection of global culture and local identity."}
                                </p>
                                <div className="flex justify-center md:justify-start gap-6">
                                    {insight.author?.social_links && Object.entries(insight.author.social_links).map(([platform, url]) => (
                                        url && (
                                            <a key={platform} href={url as string} target="_blank" className="p-4 rounded-full bg-white/5 hover:bg-agency-accent transition-all">
                                                {platform === 'twitter' && <Twitter className="size-5" />}
                                                {platform === 'linkedin' && <Linkedin className="size-5" />}
                                                {platform === 'github' && <Github className="size-5" />}
                                                {platform === 'website' && <Globe className="size-5" />}
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Comment System */}
                        <div className="mt-40">
                            <Suspense fallback={<div className="h-64 w-full animate-pulse bg-white/5 rounded-[50px]" />}>
                                <CommentSection insightSlug={insight.slug} insightId={insight.id} comments={comments} />
                            </Suspense>
                        </div>
                    </div>
                </main>
            </div>

            {/* New Discovery & Navigation Sections (Formerly in Sidebar) */}
            <div className="max-w-5xl mx-auto mt-40 space-y-32">
                {/* Related Podcasts (Horizontal Grid) */}
                {relatedPodcasts.length > 0 && (
                    <div className="space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                            <span className="text-xs font-black tracking-[0.5em] opacity-40 whitespace-nowrap">Audio Chronicles</span>
                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPodcasts.slice(0, 3).map((pod) => (
                                <Link 
                                    key={pod.id} 
                                    href={`/blog/${pod.slug}`}
                                    className="group glass-effect p-6 rounded-[32px] border border-white/10 hover:border-agency-accent/40 transition-all duration-700 hover:-translate-y-2"
                                >
                                    <div className="aspect-square rounded-2xl overflow-hidden mb-6 shadow-2xl group-hover:scale-105 transition-transform duration-1000">
                                        <img 
                                            src={pod.thumbnail_url || pod.thumbnail || '/images/placeholder.jpg'} 
                                            alt={pod.title} 
                                            className="size-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <h4 className="text-xl font-black tracking-tight group-hover:text-agency-accent transition-colors line-clamp-2 leading-tight">{pod.title}</h4>
                                    <p className="text-[10px] font-bold tracking-widest text-agency-accent mt-3">Podcast Insight</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Related Articles (Horizontal Grid) */}
                {relatedInsights.length > 0 && (
                    <div className="space-y-12">
                        <div className="flex items-center gap-6">
                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                            <span className="text-xs font-black tracking-[0.5em] opacity-40 whitespace-nowrap">Deep Narratives</span>
                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {relatedInsights.slice(0, 2).map((relPost) => (
                                <Link 
                                    key={relPost.id} 
                                    href={`/blog/${relPost.slug}`}
                                    className="group relative overflow-hidden rounded-[40px] border border-white/10 h-80"
                                >
                                    <img 
                                        src={relPost.featured_image || '/images/placeholder.jpg'} 
                                        alt={relPost.title} 
                                        className="absolute inset-0 size-full object-cover grayscale transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-10 flex flex-col justify-end">
                                        <h4 className="text-2xl font-black tracking-tight text-white mb-2 line-clamp-2">{relPost.title}</h4>
                                        <p className="text-xs font-medium text-white/60 tracking-widest">
                                            {relPost.published_at ? new Date(relPost.published_at).toLocaleDateString() : 'Recent Narrative'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Explorer (Centered Cloud) */}
                {allCategories.length > 0 && (
                    <div className="text-center space-y-12 pb-20">
                        <div className="flex items-center gap-6 max-w-2xl mx-auto">
                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                            <span className="text-xs font-black tracking-[0.5em] opacity-40 whitespace-nowrap">Insight Universe</span>
                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                        </div>
                        <TooltipProvider>
                            <div className="flex flex-wrap justify-center gap-4">
                                {allCategories.map((cat) => (
                                    <Link 
                                        key={cat.id} 
                                        href={`/blog?category=${cat.slug}`}
                                        className="flex items-center gap-4 px-8 py-5 rounded-full bg-agency-primary/90 dark:bg-white/10 border border-white/20 hover:bg-agency-accent hover:border-agency-accent hover:text-white transition-all duration-500 group shadow-2xl"
                                    >
                                        <CategoryIcon category={cat.slug} icon={cat.icon} size={18} glow={true} className="brightness-150" />
                                        <span className="text-[12px] font-black tracking-widest text-white group-hover:text-white">{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </TooltipProvider>
                    </div>
                )}
            </div>

            {/* Float Share Bar (Mobile Only) */}
            <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
                <div className="glass-effect px-8 py-4 rounded-full border border-white/20 shadow-4xl flex items-center gap-6">
                    <button onClick={() => handleShare('facebook')} className="hover:text-agency-accent transition-colors" title="Share on Facebook" aria-label="Share on Facebook"><Facebook className="size-5" /></button>
                    <button onClick={() => handleShare('twitter')} className="hover:text-agency-accent transition-colors" title="Share on Twitter" aria-label="Share on Twitter"><Twitter className="size-5" /></button>
                    <button onClick={() => handleShare('linkedin')} className="hover:text-agency-accent transition-colors" title="Share on LinkedIn" aria-label="Share on LinkedIn"><Linkedin className="size-5" /></button>
                    <div className="w-px h-6 bg-white/10" aria-hidden="true" />
                    <button onClick={handleCopyLink} className="hover:text-agency-accent transition-colors" title="Copy Link" aria-label="Copy Link"><Share2 className="size-5" /></button>
                </div>
            </div>
        </MainLayout>
    );
}
