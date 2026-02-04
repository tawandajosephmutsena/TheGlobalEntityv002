import React from 'react';
import { blockRegistry } from './BlockRegistry';
import { Layout } from 'lucide-react';

// Dynamic imports for better performance
const CarouselBlock = React.lazy(() => import('@/components/Blocks/CarouselBlock'));
const CarouselEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/CarouselEditor'));

export function registerBlocks() {
    blockRegistry.register({
        type: 'carousel',
        label: 'Dynamic Carousel',
        icon: <Layout className="h-4 w-4" />,
        desc: 'A stunning 3D parallax carousel for your featured works.',
        category: 'Showcase',
        renderer: (props) => (
            <React.Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-2xl" />}>
                <CarouselBlock {...props} />
            </React.Suspense>
        ),
        editor: (props) => (
            <React.Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Editor...</div>}>
                <CarouselEditor {...props} />
            </React.Suspense>
        )
    });
}
