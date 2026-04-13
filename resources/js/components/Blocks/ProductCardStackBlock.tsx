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
                "absolute inset-y-0 left-1/2 -ml-40 w-full max-w-[320px] rounded-2xl p-6",
                "bg-gradient-to-br from-white/40 via-neutral-50/30 to-neutral-100/20",
                "dark:from-neutral-800/40 dark:via-neutral-900/30 dark:to-black/20",
                "border border-white/20 dark:border-neutral-800/20",
                "before:absolute before:inset-0 before:rounded-2xl",
                "before:bg-gradient-to-b before:from-white/20 before:via-neutral-100/10 before:to-transparent",
                "dark:before:from-white/5 dark:before:via-neutral-500/5 dark:before:to-transparent",
                "before:opacity-100 before:transition-opacity before:duration-500",
                "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br",
                "after:from-white/80 after:to-neutral-100/70 dark:after:from-neutral-900/80 dark:after:to-black/70",
                "after:z-[-1] after:blur-xl",
                "backdrop-blur-xl backdrop-saturate-150",
                "shadow-[0_8px_20px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_20px_rgb(0,0,0,0.3)]",
                "hover:border-white/30 dark:hover:border-neutral-700/30",
                "hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] dark:hover:shadow-[0_12px_40px_rgb(0,0,0,0.4)]",
                "hover:backdrop-blur-2xl",
                "hover:bg-gradient-to-br hover:from-white/50 hover:via-neutral-50/40 hover:to-neutral-100/30",
                "dark:hover:from-neutral-800/50 dark:hover:via-neutral-900/40 dark:hover:to-black/30",
                "transition-all duration-500 ease-out",
                "transform-gpu overflow-hidden [transform-style:preserve-3d] [perspective:2000px]"
            )}
            initial={{
                x: defaultX,
                y: defaultY,
                rotate: defaultRotate,
                scale: defaultScale,
            }}
            style={{
                transform: isExpanded ? "" : `
                    translateY(${index * 10}px)
                    translateX(${index * 1}px)
                    rotate(${index * 3}deg)
                    scale(${1 - index * 0.02})
                `,
                zIndex: totalCards - index,
            }}
            transition={{
                type: "spring",
                stiffness: 350,
                damping: 30,
                mass: 0.8,
                restDelta: 0.001,
                restSpeed: 0.001,
            }}
        >
            <div className="absolute inset-1 rounded-xl border border-neutral-200/50 bg-neutral-50/50 backdrop-blur-sm dark:border-neutral-700/50 dark:bg-neutral-900/50" />

            <div className="relative z-10">
                {product.specs && product.specs.length > 0 && (
                    <dl className="mb-4 grid grid-cols-4 justify-center gap-2">
                        {product.specs.map((spec: { label: string; value: string }, i: number) => (
                            <div className="flex flex-col items-start text-left text-[10px] backdrop-blur-sm" key={i}>
                                <dd className="w-full text-left font-medium text-gray-500 dark:text-gray-400">
                                    {spec.value}
                                </dd>
                                <dt className="mb-0.5 w-full text-left text-gray-900 dark:text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis">
                                    {spec.label}
                                </dt>
                            </div>
                        ))}
                    </dl>
                )}

                <div className={cn(
                    "aspect-[16/11] w-full overflow-hidden rounded-lg",
                    "bg-neutral-100 dark:bg-neutral-900",
                    "transition-transform duration-300 ease-out",
                    "group-hover:scale-[1.02]",
                    "border border-neutral-200/50 dark:border-neutral-700/50",
                    "shadow-inner"
                )}>
                    <img
                        alt={product.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        src={sanitizeImageUrl(product.imageSrc, 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2940&auto=format&fit=crop')}
                    />
                </div>

                <div className="mt-4">
                    <div className="space-y-1">
                        <h2 className="text-left font-bold text-3xl text-gray-900 tracking-tight dark:text-white">
                            {product.title}
                        </h2>
                        <span className="block bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text text-left font-semibold text-3xl text-transparent tracking-tight dark:from-gray-200 dark:via-white dark:to-gray-300">
                            {product.subtitle}
                        </span>
                    </div>
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
