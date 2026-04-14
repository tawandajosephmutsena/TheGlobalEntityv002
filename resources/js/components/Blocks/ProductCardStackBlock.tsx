'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AnimatedSection from '@/components/AnimatedSection';
import { ProductCardStackBlock } from '@/types/page-blocks';

interface CardProps {
    product: NonNullable<ProductCardStackBlock['content']['cards']>[0];
    index: number;
    totalCards: number;
    isExpanded: boolean;
}

const sanitizeImageUrl = (url: string | undefined, fallback: string) => {
    if (!url || typeof url !== 'string' || url.startsWith('/') || url.includes('placeholder') || url.includes('.png') || url.includes('.jpg')) {
        if (url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('https')) && !url.includes('placeholder')) {
             return url;
        }
        return fallback;
    }
    return url;
};

const Card = ({ product, index, totalCards, isExpanded }: CardProps) => {
    const centerOffset = (totalCards - 1) * 5;
    const defaultX = index * 10 - centerOffset;
    const defaultY = index * 2;
    const defaultRotate = index * 1.5;
    const defaultScale = 1;

    const cardWidth = 320;
    const cardOverlap = 240;
    const totalExpandedWidth = cardWidth + (totalCards - 1) * (cardWidth - cardOverlap);
    const expandedCenterOffset = totalExpandedWidth / 2;

    const spreadX = index * (cardWidth - cardOverlap) - expandedCenterOffset + cardWidth / 2;
    const spreadY = 0;
    const spreadRotate = index * 5 - (totalCards - 1) * 2.5;
    const spreadScale = 1;

    return (
        <motion.div
            animate={{
                x: isExpanded ? spreadX : defaultX,
                y: isExpanded ? spreadY : defaultY,
                rotate: isExpanded ? spreadRotate : defaultRotate,
                scale: isExpanded ? spreadScale : defaultScale,
                zIndex: totalCards - index,
            }}
            className={cn(
                "absolute inset-y-0 left-1/2 -ml-40 w-full max-w-[320px] rounded-[2rem] p-8",
                "bg-surface/30 dark:bg-surface-container-high/30",
                "border border-white/10 dark:border-white/5",
                "backdrop-blur-2xl backdrop-saturate-150",
                "shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                "hover:scale-[1.02] hover:shadow-[0_40px_80px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)]",
                "transition-all duration-700 ease-out italic-not-really",
                "transform-gpu overflow-hidden"
            )}
            initial={{
                x: defaultX,
                y: defaultY,
                rotate: defaultRotate,
                scale: defaultScale,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                mass: 0.8,
            }}
        >
            <div className="relative z-10 flex flex-col h-full">
                <div className={cn(
                    "aspect-[4/5] w-full overflow-hidden rounded-2xl mb-8",
                    "bg-neutral-100 dark:bg-neutral-900 shadow-inner"
                )}>
                    <img
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                        loading="lazy"
                        src={sanitizeImageUrl(product.imageSrc, 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2940&auto=format&fit=crop')}
                        sizes="320px"
                    />
                </div>

                <div className="flex-1 flex flex-col justify-end text-left">
                    <div className="space-y-1">
                        <h2 className="font-display font-black text-3xl text-on-surface tracking-tighter leading-none [font-variant-caps:small-caps] italic-not-really">
                            {product.title}
                        </h2>
                        {product.subtitle && (
                            <span className="block italic text-on-surface-variant font-medium text-lg leading-tight tracking-tight">
                                {product.subtitle}
                            </span>
                        )}
                    </div>
                    
                    {product.specs && product.specs.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-primary/10 grid grid-cols-2 gap-4">
                            {product.specs.slice(0, 2).map((spec: { label: string; value: string }, i: number) => (
                                <div key={i} className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{spec.label}</span>
                                    <span className="text-sm font-bold text-on-surface">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default function ProductCardStackBlockRenderer(props: ProductCardStackBlock['content']) {
    const { cards = [] } = props || {};
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => setIsExpanded(!isExpanded);

    // Aggressive check for malformed or empty data:
    const isEmpty = !cards || !Array.isArray(cards) || cards.length === 0;
    const isPlaceholder = !isEmpty && cards.length > 0 && (cards[0].title === 'New Product 01' || (!cards[0].title && !cards[0].imageSrc));
    
    const displayCards = (isEmpty || isPlaceholder) ? [
        {
            id: 'demo-1',
            title: 'Vision Pro',
            subtitle: 'The Future of VR',
            imageSrc: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2940&auto=format&fit=crop',
            specs: [{ label: 'Resolution', value: '8K' }, { label: 'Field of View', value: '110°' }]
        },
        {
            id: 'demo-2',
            title: 'Mac Studio',
            subtitle: 'Extreme Power',
            imageSrc: 'https://images.unsplash.com/photo-1647416447544-770335832a7b?q=80&w=2940&auto=format&fit=crop',
            specs: [{ label: 'Chip', value: 'M2 Ultra' }, { label: 'RAM', value: '128GB' }]
        },
        {
            id: 'demo-3',
            title: 'Studio Display',
            subtitle: 'Stunning Visuals',
            imageSrc: 'https://images.unsplash.com/photo-1647427017067-8f33cb04094d?q=80&w=2940&auto=format&fit=crop',
            specs: [{ label: 'Size', value: '27-inch' }, { label: 'Contrast', value: '1M:1' }]
        }
    ] : cards;

    return (
        <AnimatedSection className="py-20 flex flex-col items-center overflow-x-hidden p-6">
            <button
                aria-label="Toggle card stack"
                className={cn(
                    "relative mx-auto cursor-pointer",
                    "min-h-[440px] w-full max-w-[90vw]",
                    "md:max-w-[1200px]",
                    "appearance-none border-0 bg-transparent p-0",
                    "flex items-center justify-center"
                )}
                onClick={handleToggle}
                type="button"
            >
                {displayCards.map((product, index) => (
                    <Card
                        index={index}
                        isExpanded={isExpanded}
                        key={product.id || index}
                        product={product as NonNullable<ProductCardStackBlock['content']['cards']>[0]}
                        totalCards={displayCards.length}
                    />
                ))}
            </button>
        </AnimatedSection>
    );
}
