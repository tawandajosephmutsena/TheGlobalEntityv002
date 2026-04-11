import React, { useState, useEffect } from 'react';
import { AnimatedSection } from '@/components/AnimatedSection';
import { Play, Headphones, Video, Clock, ArrowRight } from 'lucide-react';


interface Podcast {
    id: number;
    title: string;
    slug: string;
    thumbnail_url?: string;
    description?: string;
    duration?: string;
    category?: { name: string };
    published_at: string;
}

interface PodcastFeaturedBlockProps {
    title?: string;
    subtitle?: string;
    description?: string;
    limit?: number;
    layout?: 'hero' | 'cards' | 'list' | 'bento';
    showPlayButton?: boolean;
    ctaText?: string;
    ctaHref?: string;
}

export default function PodcastFeaturedBlock({
    title = "Featured Episodes",
    subtitle = "Don't miss these",
    description,
    limit = 3,
    layout = 'hero',
    showPlayButton = true,
    ctaText = "Browse All Episodes",
    ctaHref = "/podcasts"
}: PodcastFeaturedBlockProps) {
    const [podcasts, setPodcasts] = useState<Podcast[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/collections/podcasts?limit=${limit}&featured=1`)
            .then(res => res.json())
            .then(data => {
                setPodcasts(data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [limit]);

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (podcasts.length === 0) return null;

    const featured = podcasts[0];
    const rest = podcasts.slice(1);

    return (
        <section className="relative py-20 overflow-visible">

            <div className="container px-4 mx-auto relative">
                <div className="max-w-3xl mb-12">
                    {subtitle && (
                        <div className="text-primary font-bold lowercase [font-variant-caps:small-caps] tracking-widest text-xs mb-3">
                            {subtitle}
                        </div>
                    )}
                    <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        {title}
                    </h2>
                    {description && (
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {layout === 'hero' && featured && (
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <AnimatedSection animation="fade-right" className="relative group">
                            <a href={`/podcasts/${featured.slug}`} className="block relative aspect-video rounded-3xl overflow-hidden bg-muted shadow-2xl">
                                {featured.thumbnail_url ? (
                                    <img 
                                        src={featured.thumbnail_url} 
                                        alt={featured.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                        <Headphones className="size-20 text-primary/20" />
                                    </div>
                                )}
                                
                                {showPlayButton && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="size-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-500">
                                            <Play className="size-8 fill-white text-white translate-x-1" />
                                        </div>
                                    </div>
                                )}

                                <div className="absolute top-4 left-4">
                                     <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] font-black lowercase [font-variant-caps:small-caps] tracking-wider">
                                        Featured Episode
                                     </div>
                                </div>
                            </a>

                            {/* Decorative accent */}
                            <div className="absolute -z-10 -bottom-4 -right-4 size-40 bg-primary/20 rounded-full blur-2xl" />
                        </AnimatedSection>

                        <div className="space-y-8">
                            <AnimatedSection animation="fade-left" delay={200}>
                                <a href={`/podcasts/${featured.slug}`} className="block group">
                                    <div className="flex items-center gap-3 text-primary mb-4">
                                        <span className="text-xs font-black lowercase [font-variant-caps:small-caps] tracking-widest">{featured.category?.name || 'Latest Episode'}</span>
                                        <span className="size-1 rounded-full bg-primary/30" />
                                        <span className="text-xs font-bold text-muted-foreground">{featured.duration || '45 mins'}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                                        {featured.title}
                                    </h3>
                                    <p className="text-muted-foreground line-clamp-2">{featured.description}</p>
                                </a>
                            </AnimatedSection>

                            {/* Side Episodes */}
                            {rest.length > 0 && (
                                <div className="space-y-4">
                                    {rest.map((podcast, index) => (
                                        <AnimatedSection key={podcast.id} animation="fade-up" delay={200 + index * 100}>
                                            <a href={`/podcasts/${podcast.slug}`} className="group flex gap-4 p-4 rounded-2xl liquid-glass border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                                <div className="size-20 rounded-xl overflow-hidden bg-muted shrink-0 relative">
                                                    {podcast.thumbnail_url ? (
                                                        <img src={podcast.thumbnail_url} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                            <Headphones className="size-8 text-primary/20" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 py-1">
                                                    <div className="text-[10px] font-bold text-primary lowercase [font-variant-caps:small-caps] tracking-widest mb-1">{podcast.category?.name || 'Up Next'}</div>
                                                    <h4 className="font-black text-sm line-clamp-2 group-hover:text-primary transition-colors">{podcast.title}</h4>
                                                    <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-muted-foreground">
                                                        <span className="flex items-center gap-1"><Clock className="size-3" /> {podcast.duration || '30m'}</span>
                                                        <span className="flex items-center gap-1 lowercase [font-variant-caps:small-caps] tracking-tighter hover:text-primary transition-colors">Listen Now</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </AnimatedSection>
                                    )) }
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {layout === 'cards' && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {podcasts.map((podcast, index) => (
                            <AnimatedSection key={podcast.id} animation="fade-up" delay={100 + index * 80}>
                                <a href={`/podcasts/${podcast.slug}`} className="group block rounded-2xl overflow-hidden liquid-glass border border-border shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                    <div className="aspect-video relative overflow-hidden bg-muted">
                                        {podcast.thumbnail_url ? (
                                            <img src={podcast.thumbnail_url} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                <Headphones className="size-12 text-primary/20" />
                                            </div>
                                        )}
                                        {showPlayButton && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-90 group-hover:scale-100 transition-all">
                                                    <Play className="size-5 fill-white text-white translate-x-0.5" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="text-[10px] font-black lowercase [font-variant-caps:small-caps] tracking-widest text-primary mb-2">
                                            {podcast.category?.name || 'Podcast'}
                                        </div>
                                        <h3 className="font-black text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {podcast.title}
                                        </h3>
                                        <div className="flex items-center justify-between mt-4 pb-1">
                                            <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                                                <Clock className="size-3.5" /> {podcast.duration || '40 min'}
                                            </span>
                                            <span className="text-xs font-black lowercase [font-variant-caps:small-caps] text-primary tracking-tighter flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Play <ArrowRight className="size-3" />
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            </AnimatedSection>
                        ))}
                    </div>
                )}

                {layout === 'list' && (
                    <div className="space-y-4">
                        {podcasts.map((podcast, index) => (
                            <AnimatedSection key={podcast.id} animation="fade-up" delay={100 + index * 60}>
                                <a href={`/podcasts/${podcast.slug}`} className="group flex items-center gap-6 p-5 rounded-2xl liquid-glass border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                                    <div className="size-24 rounded-xl overflow-hidden bg-muted shrink-0 relative">
                                        {podcast.thumbnail_url ? (
                                            <img src={podcast.thumbnail_url} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                                <Headphones className="size-10 text-primary/20" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="text-[10px] font-black lowercase [font-variant-caps:small-caps] tracking-widest text-primary">
                                                {podcast.category?.name || 'Latest'}
                                            </div>
                                            <span className="text-xs text-muted-foreground/60 font-bold">• {podcast.duration || '30m'}</span>
                                        </div>
                                        <h3 className="font-black text-xl group-hover:text-primary transition-colors">
                                            {podcast.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-1 mt-1">
                                            {podcast.description}
                                        </p>
                                    </div>
                                    <ArrowRight className="size-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                                </a>
                            </AnimatedSection>
                        ))}
                    </div>
                )}

                {layout === 'bento' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 grid-rows-none md:grid-rows-4 lg:grid-rows-2 gap-4 h-auto md:h-[800px] lg:h-[600px]">
                        {podcasts.slice(0, 4).map((podcast, index) => {
                            // 1. Feature Card (Large)
                            if (index === 0) {
                                return (
                                    <AnimatedSection 
                                        key={podcast.id} 
                                        animation="fade-right" 
                                        className="relative md:col-span-4 lg:col-span-3 md:row-span-2 rounded-2xl md:rounded-3xl overflow-hidden group shadow-2xl"
                                    >
                                        <a href={`/podcasts/${podcast.slug}`} className="block h-full relative">
                                            {podcast.thumbnail_url ? (
                                                <img src={podcast.thumbnail_url} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                            ) : (
                                                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                    <Headphones className="size-32 text-primary/20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
                                                <div className="mb-4">
                                                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-black lowercase [font-variant-caps:small-caps] tracking-widest">Featured Series</span>
                                                </div>
                                                <h3 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight group-hover:text-primary transition-colors">{podcast.title}</h3>
                                                <p className="text-white/70 line-clamp-2 max-w-xl mb-6 text-sm md:text-base">{podcast.description}</p>
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg transform group-hover:scale-110 transition-transform">
                                                        <Play className="size-6 fill-current translate-x-0.5" />
                                                    </div>
                                                    <span className="text-white font-black lowercase [font-variant-caps:small-caps] tracking-tighter text-sm">Listen to episode</span>
                                                </div>
                                            </div>
                                        </a>
                                    </AnimatedSection>
                                );
                            }

                            // 2. Vertical Card (Standard)
                            if (index === 1) {
                                return (
                                    <AnimatedSection 
                                        key={podcast.id} 
                                        animation="fade-up" 
                                        delay={150}
                                        className="relative md:col-span-2 lg:col-span-1 md:row-span-2 rounded-2xl md:rounded-3xl overflow-hidden group border border-border liquid-glass shadow-xl"
                                    >
                                        <a href={`/podcasts/${podcast.slug}`} className="flex flex-col h-full">
                                            <div className="h-2/3 relative overflow-hidden">
                                                {podcast.thumbnail_url ? (
                                                    <img src={podcast.thumbnail_url} alt={podcast.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                                        <Video className="size-12 text-muted-foreground/30" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 right-4">
                                                    <div className="size-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                                                        <Play className="size-4 fill-current translate-x-0.5" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 flex-1 flex flex-col justify-center">
                                                <div className="text-[10px] font-black tracking-widest lowercase [font-variant-caps:small-caps] text-primary mb-2">Editor's Pick</div>
                                                <h3 className="text-lg font-black leading-tight group-hover:text-primary transition-colors line-clamp-3">
                                                    {podcast.title}
                                                </h3>
                                            </div>
                                        </a>
                                    </AnimatedSection>
                                );
                            }

                            // 3. Wide Card (Standard)
                            if (index === 2) {
                                return (
                                    <AnimatedSection 
                                        key={podcast.id} 
                                        animation="fade-left" 
                                        delay={250}
                                        className="relative md:col-span-2 lg:col-span-2 md:row-span-1 rounded-2xl md:rounded-3xl overflow-hidden group bg-primary p-1 shadow-xl"
                                    >
                                        <a href={`/podcasts/${podcast.slug}`} className="flex h-full liquid-glass rounded-xl md:rounded-2xl overflow-hidden relative group">
                                            <div className="flex-1 p-6 flex flex-col justify-center pr-24">
                                                <div className="text-[10px] font-black tracking-widest lowercase [font-variant-caps:small-caps] text-primary mb-2">TGE Original</div>
                                                <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                    {podcast.title}
                                                </h3>
                                                <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground lowercase [font-variant-caps:small-caps]">
                                                    <Clock className="size-3" /> {podcast.duration || '24m'}
                                                    <span className="mx-1">•</span>
                                                    <span>Play Now</span>
                                                </div>
                                            </div>
                                            {podcast.thumbnail_url && (
                                                <div className="absolute right-0 top-0 bottom-0 w-24 overflow-hidden">
                                                    <img src={podcast.thumbnail_url} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100" />
                                                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                                                </div>
                                            )}
                                        </a>
                                    </AnimatedSection>
                                );
                            }

                            // 4. The Spotlight (Small Glassmorphic)
                            return (
                                <AnimatedSection 
                                    key={podcast.id} 
                                    animation="fade-up" 
                                    delay={350}
                                    className="group relative flex lg:col-span-1 lg:row-span-1 rounded-2xl md:rounded-3xl overflow-hidden liquid-glass shadow-inner"
                                >
                                    <a href={`/podcasts/${podcast.slug}`} className="flex-1 p-5 flex flex-col group">
                                        <div className="relative size-12 rounded-lg overflow-hidden mb-4 border border-white/20">
                                            {podcast.thumbnail_url ? (
                                                <img src={podcast.thumbnail_url} alt={podcast.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                                                    <Headphones className="size-6 text-primary" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-auto">
                                            <div className="text-[10px] font-black tracking-widest lowercase [font-variant-caps:small-caps] text-primary mb-1">
                                                {podcast.category?.name || 'New Spotlight'}
                                            </div>
                                            <h3 className="text-sm font-black leading-snug line-clamp-3 group-hover:text-primary transition-colors">
                                                {podcast.title}
                                            </h3>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-muted-foreground/60">
                                            <span className="flex items-center gap-1 lowercase [font-variant-caps:small-caps]">Spotlight Series</span>
                                            <div className="flex gap-1">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="size-1 rounded-full bg-primary/30 group-hover:bg-primary transition-colors" style={{ transitionDelay: `${i * 100}ms` }} />
                                                ))}
                                            </div>
                                        </div>
                                    </a>
                                </AnimatedSection>
                            );
                        })}
                    </div>
                )}

                {/* CTA */}
                {ctaText && ctaHref && (
                    <AnimatedSection animation="fade-up" delay={400} className="text-center mt-6">
                        <a
                            href={ctaHref}
                            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {ctaText}
                            <ArrowRight className="size-4" />
                        </a>
                    </AnimatedSection>
                )}
            </div>
        </section>
    );
}
