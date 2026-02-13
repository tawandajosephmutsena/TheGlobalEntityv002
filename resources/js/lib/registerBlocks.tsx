import React from 'react';
import { blockRegistry } from './BlockRegistry';
import { Layout, Sparkles } from 'lucide-react';

// Dynamic imports for better performance
const CarouselBlock = React.lazy(() => import('@/components/Blocks/CarouselBlock'));
const CarouselEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/CarouselEditor'));
const KimiHeroSection = React.lazy(() => import('@/components/Blocks/KimiHeroSection'));
const KimiHeroEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/KimiHeroEditor'));

export function registerBlocks() {
    blockRegistry.register({
        type: 'carousel',
        label: 'Image Carousel / Marquee',
        icon: <Layout className="h-4 w-4" />,
        desc: 'Auto-scrolling marquee carousel with customizable speed and direction.',
        category: 'Media',
        renderer: (props) => (
            <React.Suspense fallback={<div className="h-48 bg-muted animate-pulse" />}>
                <CarouselBlock {...props} />
            </React.Suspense>
        ),
        editor: (props) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <CarouselEditor {...props} />
            </React.Suspense>
        )
    });

    blockRegistry.register({
        type: 'kimi_hero',
        label: 'Kimi Hero Section',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'A premium hero with 3D scrolling image carousel — automatically uses your active theme.',
        category: 'Heroes',
        renderer: (props) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <KimiHeroSection {...props} />
            </React.Suspense>
        ),
        editor: (props) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <KimiHeroEditor {...props} />
            </React.Suspense>
        )
    });
}
