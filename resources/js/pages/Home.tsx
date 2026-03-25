import { StructuredData } from '@/components/StructuredData';
import MainLayout from '@/layouts/MainLayout';
import { SeoHead } from '@/components/SeoHead';
import BlockRenderer from '@/components/Blocks/BlockRenderer';
import { SharedData } from '@/types';
import { HomePageProps } from '@/types/page-props';
import { usePage, Link, Deferred } from '@inertiajs/react';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import ServicesSection from '@/components/ServicesSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import RecentInsights from '@/components/RecentInsights';

export default function Home() {
    // Get page props with typed data
    const { 
        page, 
        featuredProjects = [], 
        featuredServices = [], 
        recentInsights = [], 
        stats: defaultStats, 
        structuredData,
        reviews = []
    } = usePage<SharedData & HomePageProps>().props;

    const blocks = page?.content?.blocks || [];

    // Fallback if no blocks defined
    if (blocks.length === 0) {
        return (
            <MainLayout>
                <SeoHead 
                    title={page?.meta_title || "High-Performance Website Platform"}
                    description={page?.meta_description || "Ottomate: Professional, SEO-ready digital presences that prioritize speed, complete ownership, and offline capabilities."}
                    type="website"
                    structuredData={structuredData}
                />
                <HeroSection
                    title="Digital Presence Redefined"
                    subtitle="Ottomate Platform"
                    description="Professional, SEO-ready websites that prioritize speed, complete ownership, and offline capabilities. Developed by Mhondoro Inc. for the African market."
                    ctaText="Learn More"
                    ctaHref="/about"
                />
                
                <Deferred data="stats" fallback={<div className="h-40 bg-muted/20 animate-pulse rounded-3xl mx-4 my-8" />}>
                    <StatsSection stats={defaultStats} />
                </Deferred>

                <ServicesSection services={featuredServices} />
                <FeaturedProjects projects={featuredProjects} />

                <Deferred data="recentInsights" fallback={<div className="h-96 bg-muted/10 animate-pulse rounded-3xl mx-4 my-8" />}>
                    <RecentInsights insights={recentInsights} />
                </Deferred>
                <section className="bg-white dark:bg-[#0a0a0a] py-40 relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-agency-primary/10 to-transparent"></div>
                    <div className="mx-auto max-w-7xl px-4 flex flex-col items-center text-center relative z-10">
                        <span className="text-agency-accent font-bold uppercase tracking-[0.4em] text-xs mb-8 block">Start a Project</span>
                        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-agency-primary dark:text-white leading-[0.8] mb-12">
                            Build the <br/>
                            <span className="italic opacity-30">future.</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <Link href="/contact" className="group relative inline-flex items-center justify-center size-48 md:size-64 rounded-full bg-agency-accent text-agency-primary font-black text-xl tracking-tighter hover:scale-105 transition-all shadow-2xl shadow-agency-accent/30">
                                <span className="relative z-10">GET STARTED</span>
                            </Link>
                            <div className="text-left">
                                <p className="text-agency-primary/60 dark:text-white/60 mb-2 font-mono uppercase tracking-widest text-xs">Email us at</p>
                                <a href="mailto:hello@otto-mate.space" className="text-2xl md:text-3xl font-bold dark:text-white hover:text-agency-accent transition-colors">hello@otto-mate.space</a>
                            </div>
                        </div>
                    </div>
                </section>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <SeoHead 
                title={page.meta_title ?? undefined}
                description={page.meta_description ?? undefined}
                type="website"
                structuredData={structuredData}
            />
            
            {structuredData && <StructuredData data={structuredData} />}

            <Deferred data={["recentInsights", "stats"]} fallback={<div className="min-h-screen animate-pulse bg-muted/5 rounded-3xl mx-4 my-8" />}>
                <BlockRenderer 
                    blocks={blocks}
                    featuredServices={featuredServices}
                    featuredProjects={featuredProjects}
                    recentInsights={recentInsights}
                    reviews={reviews}
                />
            </Deferred>
        </MainLayout>
    );
}
