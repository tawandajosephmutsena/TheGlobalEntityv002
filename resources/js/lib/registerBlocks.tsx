import React from 'react';
import { blockRegistry } from './BlockRegistry';
import { Layout, Sparkles } from 'lucide-react';

// Dynamic imports for better performance
const CarouselBlock = React.lazy(() => import('@/components/Blocks/CarouselBlock'));
const CarouselEditor = React.lazy(() => import('@/components/admin/PageBuilder/editors/CarouselEditor'));
const KimiHeroSection = React.lazy(() => import('@/components/Blocks/KimiHeroSection'));

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

    blockRegistry.register({
        type: 'kimi_hero',
        label: 'Kimi Hero Section',
        icon: <Sparkles className="h-4 w-4" />,
        desc: 'A premium hero with 3D scrolling image carousel and dual-font headline.',
        category: 'Heroes',
        renderer: (props) => (
            <React.Suspense fallback={<div className="h-screen bg-muted animate-pulse" />}>
                <KimiHeroSection {...props} />
            </React.Suspense>
        ),
        editor: (props) => {
            const { block, onUpdate } = props;
            const updateContent = (updates: Record<string, unknown>) => {
                onUpdate({ ...block, content: { ...block.content, ...updates } });
            };
            const content = block.content as Record<string, unknown>;
            const images = (content.images as string[]) || [];

            return (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Headline (Italic)</label>
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={String(content.title || '')}
                            onChange={(e) => updateContent({ title: e.target.value })}
                            placeholder="Streamline Your Team,"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Headline (Bold)</label>
                        <input
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            value={String(content.subtitle || '')}
                            onChange={(e) => updateContent({ subtitle: e.target.value })}
                            placeholder="Supercharge Your Workflow"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="w-full rounded-md border px-3 py-2 text-sm"
                            rows={3}
                            value={String(content.description || '')}
                            onChange={(e) => updateContent({ description: e.target.value })}
                            placeholder="All-in-one platform to plan, collaborate, and deliver..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CTA Text</label>
                            <input
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={String(content.ctaText || '')}
                                onChange={(e) => updateContent({ ctaText: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">CTA Link</label>
                            <input
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={String(content.ctaLink || '')}
                                onChange={(e) => updateContent({ ctaLink: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Secondary CTA Text</label>
                            <input
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={String(content.ctaSecondaryText || '')}
                                onChange={(e) => updateContent({ ctaSecondaryText: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Secondary CTA Link</label>
                            <input
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={String(content.ctaSecondaryLink || '')}
                                onChange={(e) => updateContent({ ctaSecondaryLink: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Background Color</label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    className="w-10 h-10 rounded border cursor-pointer"
                                    value={String(content.backgroundColor || '#FFF8F0')}
                                    onChange={(e) => updateContent({ backgroundColor: e.target.value })}
                                />
                                <input
                                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                                    value={String(content.backgroundColor || '#FFF8F0')}
                                    onChange={(e) => updateContent({ backgroundColor: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Scroll Speed (seconds)</label>
                            <input
                                type="number"
                                className="w-full rounded-md border px-3 py-2 text-sm"
                                value={Number(content.scrollSpeed || 30)}
                                onChange={(e) => updateContent({ scrollSpeed: Number(e.target.value) })}
                                min={5}
                                max={120}
                            />
                        </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                        <label className="text-sm font-bold uppercase tracking-wider">Carousel Images</label>
                        <p className="text-xs text-muted-foreground">Add image URLs for the scrolling carousel. Leave empty to use default team images.</p>
                        {images.map((img: string, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center">
                                <input
                                    className="flex-1 rounded-md border px-3 py-2 text-sm"
                                    value={img}
                                    onChange={(e) => {
                                        const updated = [...images];
                                        updated[idx] = e.target.value;
                                        updateContent({ images: updated });
                                    }}
                                    placeholder="https://..."
                                />
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 text-sm px-2"
                                    onClick={() => {
                                        const updated = images.filter((_: string, i: number) => i !== idx);
                                        updateContent({ images: updated });
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="text-sm text-blue-600 hover:text-blue-800"
                            onClick={() => updateContent({ images: [...images, ''] })}
                        >
                            + Add Image
                        </button>
                    </div>
                </div>
            );
        }
    });
}

