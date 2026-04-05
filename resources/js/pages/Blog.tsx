import AnimatedSection from '@/components/AnimatedSection';
import MainLayout from '@/layouts/MainLayout';
import { Insight, PaginatedData, Category, Page } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import { SeoHead } from '@/components/SeoHead';
import { cn } from '@/lib/utils';
import { Search, ArrowRight, ArrowUpRight, CheckCircle2, Edit3, Mail } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import BlockRenderer from '@/components/Blocks/BlockRenderer';

import CategoryIcon from '@/components/CategoryIcon';

interface Props {
    insights: PaginatedData<Insight>;
    categories: Category[];
    page?: Page;
    filters?: { category?: string; search?: string };
}

export default function Blog({ insights, categories, page, filters }: Props) {
    const activeCategoryId = filters?.category || 'all';
    const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        form_title: 'Newsletter Subscription',
    });
    
    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                setNewsletterSubmitted(true);
                setData('email', '');
                setTimeout(() => setNewsletterSubmitted(false), 5000);
            },
        });
    };

    const posts = insights.data;

    const featuredPost = posts[0];
    const gridPosts = posts.slice(1);

    const appName = import.meta.env.VITE_APP_NAME || 'The Global Entity';

    return (
        <MainLayout 
            title={page?.title ? `${page.title} - ${appName}` : `Blog Archive - ${appName}`}
            showNavigation={false}
            showFooter={false}
        >
            <SeoHead
                title={page?.title || "Blog Archive | The Global Entity"}
                description={page?.meta_description || "A sanctuary for the ethereal cartographer. We document the world not as it is seen, but as it is felt."}
            />

            {/* Custom Navigation for "The Journal" aesthetic */}
            <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-6 max-w-none bg-surface/70 backdrop-blur-xl z-50 shadow-[0_20px_40px_rgba(45,48,39,0.06)] border-b border-on-surface/5">
                <div className="text-2xl font-black text-primary uppercase tracking-widest font-display">
                    {appName}
                </div>
                <div className="hidden md:flex items-center gap-10 font-display font-bold tracking-tight">
                    <Link className="text-on-surface/80 hover:scale-105 hover:text-primary transition-all duration-500 ease-in-out" href="/podcasts">Podcast</Link>
                    <Link className="text-primary border-b-2 border-primary pb-1 hover:scale-105 transition-all duration-500 ease-in-out" href="/blog">Blog</Link>
                    <Link className="text-on-surface/80 hover:scale-105 hover:text-primary transition-all duration-500 ease-in-out" href="/festivals">Festivals</Link>
                    <Link className="text-on-surface/80 hover:scale-105 hover:text-primary transition-all duration-500 ease-in-out" href="/team">Authors</Link>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative hidden lg:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant size-4" />
                        <input 
                            className="bg-surface-variant/30 border-none rounded-full py-2 pl-10 pr-6 text-sm focus:ring-2 focus:ring-primary/20 w-64 placeholder:text-on-surface-variant/50" 
                            placeholder="Search chronicles..." 
                            type="text"
                        />
                    </div>
                    <Link 
                        href="/contact"
                        className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                        Contact
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-20 watercolor-bleed min-h-screen">
                {page?.content?.blocks && page.content.blocks.length > 0 ? (
                    <BlockRenderer 
                        blocks={page.content.blocks} 
                        recentInsights={posts}
                    />
                ) : (
                    <>
                        {/* Hero Featured Section */}
                        {featuredPost && (
                            <section className="container mx-auto px-6 mb-24">
                                <AnimatedSection animation="fade-in" className="relative group cursor-pointer overflow-hidden rounded-xl">
                                    <div className="asymmetric-grid items-center">
                                        <div className="col-span-12 lg:col-span-7 relative z-10 lg:pr-12 py-12">
                                            <span className="inline-block py-1 px-4 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-black tracking-widest uppercase mb-6 shadow-sm">
                                                Featured Story
                                            </span>
                                            <h1 className="font-display font-black text-5xl lg:text-7xl text-on-surface leading-[1.1] mb-8 tracking-tighter">
                                                {featuredPost.title.split(' ').map((word, i) => (
                                                    <span key={i} className={i % 4 === 3 ? "text-primary italic" : ""}>{word} </span>
                                                ))}
                                            </h1>
                                            <p className="text-on-surface-variant text-lg lg:text-xl max-w-xl mb-10 leading-relaxed font-light line-clamp-3">
                                                {featuredPost.excerpt}
                                            </p>
                                            <Link href={`/blog/${featuredPost.slug}`} className="flex items-center gap-4 group/author">
                                                <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-high border-2 border-primary/10">
                                                    {featuredPost.author?.avatar ? (
                                                        <img className="w-full h-full object-cover" src={featuredPost.author.avatar} alt={featuredPost.author.name} />
                                                    ) : (
                                                        <div className="w-full h-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                                            {featuredPost.author?.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm group-hover/author:text-primary transition-colors">By {featuredPost.author?.name || 'Anonymous'}</p>
                                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">
                                                        {featuredPost.reading_time || 5} Min Read • {featuredPost.published_at ? new Date(featuredPost.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : 'Recently'}
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="col-span-12 lg:col-span-5 relative h-[400px] lg:h-[600px]">
                                            <div className="absolute inset-0 bg-surface-container-low rounded-lg transform translate-x-4 translate-y-4 -z-10 opacity-50"></div>
                                            <div className="w-full h-full overflow-hidden rounded-lg shadow-2xl">
                                                <img 
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                                    src={featuredPost.featured_image || '/images/placeholder-blog.jpg'} 
                                                    alt={featuredPost.title} 
                                                />
                                            </div>
                                            {/* Decorative Watercolor Overlap */}
                                            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </section>
                        )}

                        {/* Category Filter Bar */}
                        <section className="container mx-auto px-6 mb-16">
                            <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-4">
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
                        </section>

                        {/* Article Grid */}
                        <section className="container mx-auto px-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                                {gridPosts.map((post, i) => {
                                    // Special handle for bento-style card (every 4th item if it would be at the end of a row or similar)
                                    const isBento = i === 3; // Let's make the 4th item (index 3) a bento card like the design

                                    return (
                                        <AnimatedSection 
                                            key={post.id} 
                                            animation="fade-up" 
                                            delay={i * 100}
                                            className={cn(
                                                "group relative",
                                                isBento && "md:col-span-2 bg-surface-container-low p-8 rounded-xl flex flex-col md:flex-row gap-8 items-center",
                                                !isBento && i % 3 === 1 && "lg:mt-12" // Staggered offset for the middle column
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
                                                        <p className="text-tertiary font-black text-[10px] tracking-widest uppercase">Editorial Feature</p>
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
                                                        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                                                            {post.category && (
                                                                <span className="bg-surface/90 backdrop-blur-md text-on-surface text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                                                    {post.category.icon && <CategoryIcon category={post.category.slug} icon={post.category.icon} size={12} glow={false} />}
                                                                    {post.category.name}
                                                                </span>
                                                            )}
                                                            {/* @ts-ignore */}
                                                            {post.additional_categories && post.additional_categories.map((additionalCat: any) => (
                                                                <span key={additionalCat.id} className="bg-surface/90 backdrop-blur-md text-on-surface text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                                                                    {additionalCat.icon && <CategoryIcon category={additionalCat.slug} icon={additionalCat.icon} size={12} glow={false} />}
                                                                    {additionalCat.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="absolute bottom-6 left-6 flex gap-2 items-center">
                                                            {/* @ts-ignore */}
                                                            {post.podcast && (
                                                                <span className="bg-primary/90 backdrop-blur-md text-on-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                                                    🎙️ Podcast
                                                                </span>
                                                            )}
                                                            {/* @ts-ignore */}
                                                            {post.festival && (
                                                                <span className="bg-tertiary/90 backdrop-blur-md text-on-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                                                    🎪 Festival
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <p className="text-secondary font-black text-[10px] tracking-widest uppercase">
                                                            {post.category?.name || 'Journal'}
                                                        </p>
                                                        <h3 className="font-display font-bold text-2xl group-hover:text-primary transition-colors leading-tight tracking-tight">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-on-surface-variant line-clamp-2 text-sm leading-relaxed font-light">
                                                            {post.excerpt}
                                                        </p>
                                                        <div className="pt-2 flex items-center justify-between">
                                                            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest opacity-60">
                                                                {post.published_at ? new Date(post.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Oct 2024'}
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

                            {/* Empty State */}
                            {posts.length === 0 && (
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

                            {/* Pagination */}
                            {insights.links.length > 3 && (
                                <div className="mt-32 flex justify-center gap-4">
                                    {insights.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={cn(
                                                "px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                                                link.active 
                                                    ? "bg-primary text-on-primary shadow-xl scale-105" 
                                                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:scale-105",
                                                !link.url && "opacity-30 cursor-not-allowed hidden"
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
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
                    <div className="font-display font-black text-primary text-3xl uppercase tracking-widest">
                        {appName}
                    </div>
                    <p className="text-on-surface-variant leading-relaxed font-light text-base">
                        A sanctuary for the ethereal cartographer. We document the world not as it is seen, but as it is felt.
                    </p>
                    <p className="text-on-surface-variant/40 text-[10px] font-black uppercase tracking-widest">
                        © {new Date().getFullYear()} {appName}. <br/>An Ethereal Cartographer Production.
                    </p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-16 relative z-10">
                    <div className="flex flex-col gap-6">
                        <span className="font-black text-on-surface uppercase text-[10px] tracking-[0.3em]">Explore</span>
                        <div className="flex flex-col gap-4">
                            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="/blog">Journal</Link>
                            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="/about">Manifesto</Link>
                            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="/festivals">Expeditions</Link>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <span className="font-black text-on-surface uppercase text-[10px] tracking-[0.3em]">Connect</span>
                        <div className="flex flex-col gap-4">
                            <a className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="#">Instagram</a>
                            <a className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="#">Spotify</a>
                            <a className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="#">Pinterest</a>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <span className="font-black text-on-surface uppercase text-[10px] tracking-[0.3em]">Utility</span>
                        <div className="flex flex-col gap-4">
                            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="/privacy">Privacy Policy</Link>
                            <Link className="text-on-surface-variant hover:text-primary transition-colors duration-300 font-medium" href="/terms">Terms of Service</Link>
                        </div>
                    </div>
                </div>

                {/* Background Large Text Decor */}
                <div className="absolute -bottom-10 -right-20 opacity-[0.02] select-none pointer-events-none whitespace-nowrap hidden lg:block">
                    <span className="text-[20vw] font-black uppercase tracking-tighter">JOURNAL</span>
                </div>
            </footer>

            {/* Floating Action Button */}
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary rounded-full shadow-[0_20px_40px_rgba(175,4,122,0.3)] flex items-center justify-center group hover:scale-110 active:scale-95 transition-all z-40 border-2 border-white/20">
                <Edit3 className="size-6 transition-transform group-hover:rotate-12" />
                <span className="absolute right-20 bg-on-surface text-surface text-[10px] font-black px-6 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none uppercase tracking-[0.2em] shadow-2xl translate-x-4 group-hover:translate-x-0">
                    Write Note
                </span>
            </button>
        </MainLayout>
    );
}
