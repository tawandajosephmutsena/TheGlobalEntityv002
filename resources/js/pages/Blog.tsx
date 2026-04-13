import { cn } from '@/lib/utils';
import { Head, Link, useForm, router } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import AnimatedSection from '@/components/AnimatedSection';
import { Search, ArrowRight, ArrowUpRight, CheckCircle2, Mail, Loader2 } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import BlockRenderer from '@/components/Blocks/BlockRenderer';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import CategoryIcon from '@/components/CategoryIcon';
import { Insight, Category, PaginatedData, PageBlock } from '@/types';

interface Props {
    insights: PaginatedData<Insight>;
    categories: Category[];
    activeCategoryId: string | number;
    blocks?: PageBlock[];
}

export default function Blog({ insights, categories, activeCategoryId, blocks = [] }: Props) {
    const { data, setData, post, processing } = useForm({
        email: '',
    });
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
    
    // Infinite Scroll State - All posts including loaded ones
    const [allPosts, setAllPosts] = useState<Insight[]>(insights.data);
    const [loadingMore, setLoadingMore] = useState(false);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Reset list when category or search changes (full refresh)
    const [prevCategoryId, setPrevCategoryId] = useState(activeCategoryId);
    if (prevCategoryId !== activeCategoryId) {
        setPrevCategoryId(activeCategoryId);
        setAllPosts(insights.data);
    }

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('newsletter.subscribe'), {
            onSuccess: () => setNewsletterSubmitted(true),
        });
    };

    const loadMore = () => {
        if (!insights.next_page_url || loadingMore) return;

        setLoadingMore(true);
        router.get(insights.next_page_url, {}, {
            preserveScroll: true,
            preserveState: true,
            only: ['insights'],
            onSuccess: (page) => {
                const newInsights = page.props.insights as unknown as PaginatedData<Insight>;
                setAllPosts(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const uniqueNew = newInsights.data.filter(p => !existingIds.has(p.id));
                    return [...prev, ...uniqueNew];
                });
            },
            onFinish: () => setLoadingMore(false)
        });
    };

    // Handle Infinite Scroll Visibility
    useEffect(() => {
        if (!insights.next_page_url) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !loadingMore) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [insights.next_page_url, loadingMore, loadMore]);

    const gridPosts = useMemo(() => {
        return allPosts;
    }, [allPosts]);

    return (
        <MainLayout>
            <Head title="The Journal - Ottoman" />

            <main className="min-h-screen bg-surface pt-32 pb-20 overflow-x-hidden">
                {/* Dynamic Blocks (including Hero) */}
                {blocks && blocks.length > 0 && (
                    <div className="space-y-0">
                        <BlockRenderer 
                            blocks={blocks} 
                            recentInsights={insights.data}
                            categories={categories}
                        />
                    </div>
                )}

                {/* Main Content Area (Categories + Grid) if no blocks or explicitly requested */}
                {(!blocks || blocks.length === 0 || activeCategoryId !== 'all') && (
                    <>
                        <section className="container mx-auto px-6 mb-20">
                            <AnimatedSection animation="fade-in">
                                <h1 className="font-display font-black text-6xl lg:text-8xl mb-8 tracking-tighter uppercase">
                                    THE <span className="text-primary italic">JOURNAL</span>
                                </h1>
                            </AnimatedSection>

                            {/* Category Filter */}
                            <TooltipProvider>
                                <div className="flex items-center gap-4 overflow-x-auto pb-6 scrollbar-hide no-scrollbar">
                                    <Link 
                                        href="/blog?category=all"
                                        preserveScroll
                                        className={cn(
                                            "whitespace-nowrap px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500",
                                            activeCategoryId === 'all' 
                                                ? "bg-on-surface text-surface shadow-xl scale-105" 
                                                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:scale-105"
                                        )}
                                    >
                                        All Archives
                                    </Link>
                                    {categories.map((cat) => (
                                        <Link 
                                            key={cat.id}
                                            href={`/blog?category=${cat.id}`}
                                            preserveScroll
                                            className={cn(
                                                "whitespace-nowrap px-8 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center gap-2",
                                                activeCategoryId === cat.id.toString() || activeCategoryId === cat.slug
                                                    ? "bg-primary text-on-primary shadow-xl scale-105" 
                                                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:scale-105"
                                            )}
                                        >
                                            {cat.icon && <CategoryIcon category={cat.slug} icon={cat.icon} size={14} glow={false} />}
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </TooltipProvider>
                        </section>

                        {/* Article Grid */}
                        <section className="container mx-auto px-6">
                            <TooltipProvider>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                                    {gridPosts.map((post: Insight, i: number) => {
                                        // Special handle for bento-style card
                                        const isBento = i === 3; 

                                        return (
                                            <AnimatedSection 
                                                key={post.id} 
                                                animation="fade-up" 
                                                delay={i * 100}
                                                className={cn(
                                                    "group relative",
                                                    isBento && "md:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center",
                                                    !isBento && i % 3 === 1 && "lg:mt-12" 
                                                )}
                                            >
                                                {isBento ? (
                                                    <>
                                                        <div className="relative aspect-video md:aspect-square w-full md:w-1/2 overflow-hidden rounded-lg shadow-lg">
                                                            <img 
                                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                                                src={post.featured_image || '/images/placeholder-blog.jpg'} 
                                                                alt={post.title} 
                                                            />
                                                        </div>
                                                        <div className="w-full md:w-1/2 space-y-6">
                                                             <div className="flex flex-wrap gap-2">
                                                                {[
                                                                    post.category,
                                                                    ...(post.additionalCategories || post.additional_categories || [])
                                                                ].filter((cat): cat is Category => Boolean(cat)).map((cat, ci) => {
                                                                    const slug = cat?.slug || '';
                                                                    return (
                                                                        <Tooltip key={ci}>
                                                                            <TooltipTrigger asChild>
                                                                                <div className="category-icon-wrapper size-10 glow" data-category={slug}>
                                                                                    <CategoryIcon category={slug} icon={cat?.icon} size={20} glow={true} />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                <p className="font-bold tracking-wider [font-variant-caps:small-caps]">{cat?.name}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    );
                                                                })}
                                                            </div>
                                                            <h3 className="font-display font-black text-3xl group-hover:text-primary transition-colors leading-[1.1]">
                                                                {post.title}
                                                            </h3>
                                                            <p className="text-on-surface-variant text-base leading-relaxed font-light line-clamp-3">
                                                                {post.excerpt}
                                                            </p>
                                                            <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 font-black text-[10px] tracking-widest text-primary hover:gap-4 transition-all uppercase">
                                                                READ FULL FEATURE
                                                                <ArrowUpRight className="size-4" />
                                                            </Link>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <Link href={`/blog/${post.slug}`} className="block">
                                                        <div className="relative aspect-[4/5] mb-8 overflow-hidden rounded-lg bg-surface-container-low group-hover:shadow-2xl transition-all duration-500">
                                                            <img 
                                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                                                src={post.featured_image || '/images/placeholder-blog.jpg'} 
                                                                alt={post.title} 
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                                            <div className="absolute top-6 right-6 flex flex-col items-end gap-3">
                                                                {[
                                                                    post.category,
                                                                    ...(post.additionalCategories || post.additional_categories || [])
                                                                ].filter((cat): cat is Category => Boolean(cat)).map((cat, ci) => {
                                                                    const slug = cat?.slug || '';

                                                                    return (
                                                                        <Tooltip key={ci}>
                                                                            <TooltipTrigger asChild>
                                                                                <div className="category-icon-wrapper size-10 rounded-full bg-surface/90 backdrop-blur-md shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-help"
                                                                                     data-category={slug}>
                                                                                    <CategoryIcon 
                                                                                        category={slug} 
                                                                                        icon={cat?.icon}
                                                                                        size={18} 
                                                                                        glow={true} 
                                                                                    />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="left">
                                                                                <p className="font-bold tracking-wider [font-variant-caps:small-caps]">{cat?.name}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    );
                                                                })}
                                                            </div>
                                                            <div className="absolute bottom-6 left-6 flex gap-2 items-center">
                                                                {post.podcast && (
                                                                    <span className="bg-primary/90 backdrop-blur-md text-on-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                                                        🎙️ Podcast
                                                                    </span>
                                                                )}
                                                                {post.festival && (
                                                                    <span className="bg-tertiary/90 backdrop-blur-md text-on-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                                                        🎪 Festival
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="space-y-4">
                                                             <div className="flex flex-wrap gap-2">
                                                                {[
                                                                    post.category,
                                                                    ...(post.additionalCategories || post.additional_categories || [])
                                                                ].filter((cat): cat is Category => Boolean(cat)).map((cat, ci) => {
                                                                    const slug = cat?.slug || '';
                                                                    return (
                                                                        <Tooltip key={ci}>
                                                                            <TooltipTrigger asChild>
                                                                                <div className="category-icon-wrapper size-8 rounded-lg" data-category={slug}>
                                                                                    <CategoryIcon category={slug} icon={cat?.icon} size={16} glow={false} />
                                                                                </div>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent side="top">
                                                                                <p className="font-bold tracking-wider [font-variant-caps:small-caps] text-[10px]">{cat?.name}</p>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    );
                                                                })}
                                                            </div>
                                                            <h3 className="font-display font-bold text-2xl group-hover:text-primary transition-colors leading-tight tracking-tight">
                                                                {post.title}
                                                            </h3>
                                                            <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed font-light">
                                                                {post.excerpt}
                                                            </p>
                                                            <div className="pt-2 flex items-center justify-between">
                                                                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">
                                                                    {post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                                                                </span>
                                                                <ArrowRight className="size-5 text-primary group-hover:translate-x-2 transition-transform duration-500" />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )}
                                            </AnimatedSection>
                                        );
                                    })}
                                </div>
                            </TooltipProvider>

                            {/* Sentinel for Infinite Scroll */}
                            <div ref={observerTarget} className="h-20 flex items-center justify-center mt-20">
                                {loadingMore && (
                                    <div className="flex flex-col items-center gap-4">
                                        <Loader2 className="size-8 text-primary animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Scanning deeper coordinates...</span>
                                    </div>
                                )}
                                {!insights.next_page_url && allPosts.length > 0 && (
                                    <div className="text-center opacity-40">
                                        <div className="w-12 h-px bg-on-surface mx-auto mb-6" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">End of the Journal</p>
                                    </div>
                                )}
                            </div>

                            {/* Empty State */}
                            {allPosts.length === 0 && (
                                <div className="py-32 text-center">
                                    <div className="inline-block p-12 rounded-full bg-surface-container-low mb-8 opacity-20">
                                        <Search className="size-20" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tight mb-4">No chronicles found</h3>
                                    <p className="text-on-surface-variant max-w-md mx-auto font-light">
                                        The map remains blank for this category. Explore other coordinates or search for hidden paths.
                                    </p>
                                </div>
                            )}
                        </section>

                        {/* Newsletter Section */}
                        <section className="container mx-auto px-6 mt-32">
                            <AnimatedSection animation="fade-in" className="bg-tertiary-container/20 rounded-xl p-12 lg:p-24 text-center relative overflow-hidden border border-tertiary/10">
                                <div className="absolute -top-20 -left-20 w-80 h-80 bg-tertiary/5 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
                                <div className="relative z-10 max-w-2xl mx-auto">
                                    <Mail className="size-16 text-tertiary mx-auto mb-8 opacity-80" />
                                    <h2 className="font-display font-black text-4xl lg:text-6xl mb-8 tracking-tighter">
                                        Letters from the <span className="text-tertiary italic">Edge</span>
                                    </h2>
                                    <p className="text-on-surface-variant mb-12 text-lg lg:text-xl font-light leading-relaxed">
                                        Receive weekly coordinates to hidden corners of the world, curated stories, and slow travel wisdom delivered to your vessel.
                                    </p>
                                    
                                    {newsletterSubmitted ? (
                                        <div className="flex items-center justify-center gap-4 p-8 rounded-full bg-tertiary/10 border border-tertiary/20">
                                            <CheckCircle2 className="size-8 text-tertiary" />
                                            <p className="text-tertiary font-black text-sm uppercase tracking-widest">Entry confirmed. Welcome aboard.</p>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4">
                                            <input 
                                                className="flex-1 bg-surface border-none rounded-full px-10 py-5 text-on-surface shadow-inner focus:ring-2 focus:ring-tertiary/30 placeholder:text-on-surface-variant/40" 
                                                placeholder="Your destination email..." 
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                required
                                            />
                                            <button 
                                                className="bg-tertiary text-on-tertiary font-black text-xs tracking-widest px-12 py-5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-tertiary/20 disabled:opacity-50"
                                                disabled={processing}
                                            >
                                                SUBSCRIBE
                                            </button>
                                        </form>
                                    )}
                                    <p className="mt-8 text-[10px] text-on-surface-variant font-black tracking-widest uppercase opacity-40">
                                        No noise. Only the signal. Unsubscribe anytime.
                                    </p>
                                </div>
                            </AnimatedSection>
                        </section>
                    </>
                )}
            </main>

            {/* Custom Footer for "The Journal" aesthetic */}
            <footer className="w-full px-8 lg:px-12 py-24 flex flex-col md:flex-row justify-between gap-16 border-t border-on-surface/5 bg-surface rounded-t-[4rem] mt-20 font-body text-sm tracking-wide relative overflow-hidden">
                <div className="flex flex-col gap-8 max-w-sm relative z-10">
                    <h3 className="font-display font-black text-2xl tracking-tighter uppercase italic">Ottoman <span className="text-primary not-italic">Entity</span></h3>
                    <p className="text-on-surface-variant font-light leading-relaxed">
                        A sanctuary for slow travel, conscious exploration, and human connection across global territories.
                    </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Expeditions</p>
                        <Link href="/blog?category=festival-fever" className="text-on-surface-variant hover:text-primary transition-colors font-light">Festival Fever</Link>
                        <Link href="/blog?category=glocal-gems" className="text-on-surface-variant hover:text-primary transition-colors font-light">Glocal Gems</Link>
                        <Link href="/blog?category=solo-travel" className="text-on-surface-variant hover:text-primary transition-colors font-light">Solo Exploration</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Philosophy</p>
                        <Link href="/manifesto" className="text-on-surface-variant hover:text-primary transition-colors font-light">The Manifesto</Link>
                        <Link href="/about" className="text-on-surface-variant hover:text-primary transition-colors font-light">Our Journey</Link>
                        <Link href="/impact" className="text-on-surface-variant hover:text-primary transition-colors font-light">Global Impact</Link>
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Coordinates</p>
                        <span className="text-on-surface-variant font-light">London, UK</span>
                        <span className="text-on-surface-variant font-light">Bali, Indonesia</span>
                        <a href="mailto:hello@ottoman.com" className="text-on-surface-variant hover:text-primary transition-colors font-light">Contact Vessel</a>
                    </div>
                </div>
            </footer>
        </MainLayout>
    );
}
