import React, { useState } from 'react';
import { FlipReveal, FlipRevealItem } from '@/components/ui/flip-reveal';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FlipRevealBlock } from '@/types/page-blocks';
import AnimatedSection from '@/components/AnimatedSection';

export default function FlipRevealBlockRenderer({ content }: { content: FlipRevealBlock['content'] }) {
    const { title, subtitle, categories = [], items = [] } = content;
    const [activeCategory, setActiveCategory] = useState<string>('all');

    return (
        <AnimatedSection className="py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-8">
                    {(title || subtitle) && (
                        <div className="text-center max-w-2xl mx-auto mb-8">
                            {title && <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{title}</h2>}
                            {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-8 w-full">
                        <ToggleGroup
                            type="single"
                            className="bg-background rounded-md border p-1"
                            value={activeCategory}
                            onValueChange={(val) => val && setActiveCategory(val)}
                        >
                            <ToggleGroupItem value="all" className="sm:px-4">
                                All
                            </ToggleGroupItem>
                            {categories.map((cat) => (
                                <ToggleGroupItem key={cat.id} value={cat.id} className="sm:px-4">
                                    {cat.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>

                        <FlipReveal
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
                            keys={[activeCategory]}
                            showClass="block"
                            hideClass="hidden"
                        >
                            {items.map((item) => (
                                <FlipRevealItem
                                    key={item.id}
                                    flipKey={item.category}
                                    className="relative aspect-square overflow-hidden rounded-xl bg-muted group"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title || ''}
                                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {item.title && (
                                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                            <h3 className="text-white font-medium">{item.title}</h3>
                                        </div>
                                    )}
                                </FlipRevealItem>
                            ))}
                        </FlipReveal>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
