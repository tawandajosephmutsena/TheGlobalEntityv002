import React, { Suspense, useMemo, lazy } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Comment, Insight, ReactionType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { SeoHead } from '@/components/SeoHead';
import { ArrowLeft, Clock, Share2, Globe, Lightbulb, CheckCircle2, Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import CategoryIcon from '@/components/CategoryIcon';

// Lazy loaded components for better initial bundle size
const CommentSection = lazy(() => import('@/components/Comments/CommentSection'));
const ReactionButton = lazy(() => import('@/components/Reactions/ReactionButton'));
const PodcastPlayer = lazy(() => import('@/components/podcast/PodcastPlayer').then(m => ({ default: m.PodcastPlayer })));
const FestivalCardBlock = lazy(() => import('@/components/Blocks/FestivalCardBlock'));
const AnimatedSection = lazy(() => import('@/components/AnimatedSection'));

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

            {/* Reading Progress Bar (Fixed at top) */}
            <div className="fixed top-[80px] left-0 w-full h-1.5 z-[60] bg-agency-accent/5">
                <div className="h-full bg-gradient-to-r from-agency-accent to-agency-accent/40 w-0 transition-all duration-300" id="reading-progress"></div>
            </div>

            <div className="relative h-[calc(100vh-120px)] min-h-[700px] pt-12 flex items-center bg-transparent">
                <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                    
                    {/* Split Hero Section (50/50) */}
                    <Suspense fallback={<div className="h-96 w-full animate-pulse bg-white/5 rounded-[50px] mb-24" />}>
                        <AnimatedSection animation="slide-up" className="mb-24 lg:mb-40 w-full">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-stretch min-h-[500px] lg:h-[65vh]">
                                
                                {/* Left Side: Header Text & Meta (Vertically Centered) */}
                                <div className="flex flex-col justify-center">
                                    <Link href="/blog" className="inline-flex items-center gap-2 text-agency-accent font-black uppercase tracking-widest text-[10px] mb-8 hover:gap-4 transition-all">
                                        <ArrowLeft className="h-3 w-3" /> Chronicles
                                    </Link>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-tighter leading-[0.95] mb-12 uppercase italic">
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
                                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Visionary</span>
                                                <span className="text-xs font-bold uppercase">{insight.author?.name}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="h-8 w-px bg-agency-primary/10 dark:bg-white/10 hidden md:block" />
                                        
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Duration</span>
                                            <div className="flex items-center gap-2 font-bold uppercase text-xs">
                                                <Clock className="size-3 text-agency-accent" /> {insight.reading_time || 5} Min
                                            </div>
                                        </div>

                                        <div className="h-8 w-px bg-agency-primary/10 dark:bg-white/10 hidden md:block" />

                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-40 leading-none mb-1">Vibration</span>
                                            <div className="flex items-center gap-2 font-bold uppercase text-xs">
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

                                        {insight.podcast && (insight.podcast.media_full_url || insight.podcast.media_url) && (
                                            <div className="flex-1 max-w-sm glass-effect p-3 rounded-2xl border border-white/10">
                                                <Suspense fallback={<div className="h-20 w-full animate-pulse bg-white/5 rounded-xl" />}>
                                                    <PodcastPlayer 
                                                        src={insight.podcast.media_full_url || insight.podcast.media_url}
                                                        title={insight.podcast.title}
                                                        artist={insight.author?.name}
                                                        thumbnail={insight.podcast.thumbnail_url || insight.podcast.thumbnail || insight.featured_image}
                                                        mediaType={insight.podcast.media_type || 'audio'}
                                                        variant="compact"
                                                        className="bg-transparent border-none shadow-none p-0"
                                                    />
                                                </Suspense>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Featured Image (50%) */}
                                {insight.featured_image && (
                                    <div className="relative group h-full">
                                        <div className="h-full min-h-[500px] lg:min-h-[700px] overflow-hidden rounded-[50px] shadow-3xl bg-agency-primary/5 dark:bg-white/5 border border-white/10 relative transform transition-all duration-1000 group-hover:scale-[1.02]">
                                            <img 
                                                src={insight.featured_image} 
                                                alt={insight.title} 
                                                loading="eager"
                                                decoding="async"
                                                className="absolute inset-0 size-full object-cover transition-transform duration-[4s] group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-1000" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AnimatedSection>
                    </Suspense>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-20">
                        
                        {/* Main Content (Left) - 3/4 Width */}
                        <main className="lg:col-span-3 min-w-0">
                            
                            {/* Article Body (Glass Container) */}
                            <div className="relative">
                                {/* The Glass frosted background */}
                                <div className="absolute -inset-8 md:-inset-16 lg:-inset-24 bg-white/30 dark:bg-black/40 backdrop-blur-[120px] rounded-[60px] md:rounded-[80px] border border-white/30 dark:border-white/10 shadow-4xl -z-10" />
                                
                                <div className="prose prose-xl lg:prose-2xl dark:prose-invert max-w-none font-serif prose-headings:font-display prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-headings:italic prose-p:text-[20px] lg:prose-p:text-[24px] prose-p:leading-[1.8] prose-p:dark:text-white/90 prose-blockquote:border-l-[12px] prose-blockquote:border-agency-accent prose-blockquote:bg-agency-accent/5 prose-blockquote:p-8 lg:prose-blockquote:p-12 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:text-2xl lg:prose-blockquote:text-3xl prose-blockquote:font-display first-letter:text-7xl lg:first-letter:text-9xl first-letter:font-black first-letter:text-agency-accent first-letter:mr-4 lg:first-letter:mr-6 first-letter:float-left first-letter:leading-[0.7] first-letter:mt-3">
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
                                            <h2 className="text-4xl font-display font-black uppercase tracking-tight">Executive <span className="text-agency-accent italic">Tips</span></h2>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {insight.quick_tips.map((tip, idx) => (
                                                <div key={idx} className="glass-effect p-12 rounded-[50px] border border-white/10 hover:border-agency-accent/40 transition-all duration-700 group hover:-translate-y-2">
                                                    <div className="space-y-6">
                                                        <h4 className="text-2xl font-black uppercase tracking-tight group-hover:text-agency-accent transition-colors">{tip.title}</h4>
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
                                            <h2 className="text-4xl font-display font-black uppercase tracking-tight">The <span className="italic opacity-30">Experience</span></h2>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Manifesting Now</span>
                                        </div>
                                        <Suspense fallback={<div className="h-64 w-full animate-pulse bg-white/5 rounded-[50px]" />}>
                                            <FestivalCardBlock festival={insight.festival} />
                                        </Suspense>
                                    </div>
                                )}

                                {/* Reactions on Post */}
                                <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Interaction Index</span>
                                        <h3 className="text-xl font-black uppercase">Share your vibration</h3>
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
                                            <span key={tag} className="px-8 py-3 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-agency-accent/20 transition-all cursor-pointer">
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
                                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-agency-accent mb-4 block">Manifested By</span>
                                        <h4 className="text-5xl font-display font-black uppercase tracking-tight mb-8">{insight.author?.name}</h4>
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

                        {/* Sidebar (Right) - Exactly 25% Width with Independent Scroll */}
                        <aside className="lg:col-span-1 lg:sticky lg:top-32 h-fit z-30">
                            <div className="flex flex-col gap-12 pl-4">
                            
                            {/* Discover More Podcasts */}
                            {relatedPodcasts.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">More Media</span>
                                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                                        </div>
                                                <div className="flex flex-col gap-4">
                                                    {relatedPodcasts.map((pod) => (
                                                        <Link 
                                                            key={pod.id} 
                                                            href={`/blog/${pod.slug}`}
                                                            className="group flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-agency-accent/30 transition-all duration-500"
                                                        >
                                                            <div className="size-14 rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-700">
                                                                <img 
                                                                    src={pod.thumbnail_url || pod.thumbnail || '/images/placeholder.jpg'} 
                                                                    alt={pod.title} 
                                                                    className="size-full object-cover"
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-xs font-black uppercase tracking-tight group-hover:text-agency-accent transition-colors line-clamp-2 leading-tight">{pod.title}</h4>
                                                                <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 mt-1">Podcast</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                    </div>
                            )}

                            {/* Related Chronicles */}
                            {relatedInsights.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Related Chronicles</span>
                                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                                        </div>
                                        <div className="flex flex-col gap-6">
                                            {relatedInsights.map((relPost) => (
                                                <Link 
                                                    key={relPost.id} 
                                                    href={`/blog/${relPost.slug}`}
                                                    className="group flex items-center gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-agency-accent/30 transition-all duration-500"
                                                >
                                                    <div className="size-16 rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-700">
                                                        <img 
                                                            src={relPost.featured_image || '/images/placeholder.jpg'} 
                                                            alt={relPost.title} 
                                                            className="size-full object-cover grayscale group-hover:grayscale-0"
                                                            loading="lazy"
                                                            decoding="async"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-xs font-black uppercase tracking-tight group-hover:text-agency-accent transition-colors line-clamp-2 leading-tight mb-1">{relPost.title}</h4>
                                                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">
                                                            {relPost.published_at ? new Date(relPost.published_at).toLocaleDateString() : 'Recent'}
                                                        </p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                            )}

                            {/* Category Cloud */}
                            {allCategories.length > 0 && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Insight Universe</span>
                                            <div className="h-px flex-1 bg-agency-primary/10 dark:bg-white/10" />
                                        </div>
                                        <TooltipProvider>
                                            <div className="flex flex-wrap gap-2">
                                                {allCategories.map((cat) => (
                                                    <Link 
                                                        key={cat.id} 
                                                         href={`/blog?category=${cat.slug}`}
                                                        className="flex items-center gap-3 px-5 py-3 rounded-full bg-agency-primary/90 dark:bg-white/10 border border-white/20 hover:bg-agency-accent hover:border-agency-accent hover:text-white transition-all duration-500 group shadow-lg"
                                                    >
                                                        <CategoryIcon category={cat.slug} icon={cat.icon} size={14} glow={true} className="brightness-150" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:text-white">{cat.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </TooltipProvider>
                                    </div>
                            )}
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            {/* Float Share Bar (Mobile Only) */}
            <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
                <div className="glass-effect px-8 py-4 rounded-full border border-white/20 shadow-4xl flex items-center gap-6">
                    <button onClick={() => handleShare('facebook')} className="hover:text-agency-accent transition-colors"><Facebook className="size-5" /></button>
                    <button onClick={() => handleShare('twitter')} className="hover:text-agency-accent transition-colors"><Twitter className="size-5" /></button>
                    <button onClick={() => handleShare('linkedin')} className="hover:text-agency-accent transition-colors"><Linkedin className="size-5" /></button>
                    <div className="w-px h-6 bg-white/10" />
                    <button onClick={handleCopyLink} className="hover:text-agency-accent transition-colors"><Share2 className="size-5" /></button>
                </div>
            </div>

        </MainLayout>
    );
}
