'use client';

import React from 'react';
import { cn } from '@/lib/utils';
// Assuming the CLI installs this to @/components/fancy/blocks/stacking-cards or @/components/ui/stacking-cards
import StackingCards, { StackingCardItem } from '@/components/fancy/blocks/stacking-cards';
import AnimatedSection from '@/components/AnimatedSection';
import { StackingCardsBlock } from '@/types/page-blocks';

const sanitizeImageUrl = (url: string | undefined, fallback: string) => {
    if (!url || typeof url !== 'string' || url.startsWith('/') || url.includes('placeholder')) {
        return fallback;
    }
    return url;
};

export default function StackingCardsBlockRenderer(props: StackingCardsBlock['content']) {
    const {
        scrollText = 'Scroll down ↓',
        footerText = 'fancy',
        cards = [
            {
                bgColor: 'bg-[#f97316]',
                title: 'The Guiding Light',
                description: 'Lighthouses have stood as beacons of hope for centuries...',
                imageSrc: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop',
            }
        ]
    } = props || {};


    return (
        <AnimatedSection className="w-full">
            <div
                className="bg-background text-white w-full"
            >
                {cards.length > 0 ? (
                    <StackingCards
                        totalCards={cards.length}
                    >
                        {scrollText && (
                            <div className="relative font-calendas h-screen w-full z-10 text-2xl md:text-7xl font-bold lowercase [font-variant-caps:small-caps] flex justify-center items-center text-[#ff5941] whitespace-pre">
                                {scrollText}
                            </div>
                        )}
                        {cards.map(({ bgColor, description, imageSrc, title }, index) => {
                            return (
                                <StackingCardItem key={index} index={index} className="h-screen">
                                    <div
                                        className={cn(
                                            bgColor,
                                            "h-[80%] sm:h-[70%] flex-col sm:flex-row aspect-video px-8 py-10 flex w-11/12 rounded-3xl mx-auto relative shadow-2xl"
                                        )}
                                    >
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="font-bold text-2xl mb-5 lowercase [font-variant-caps:small-caps]">{title}</h3>
                                            <p>{description}</p>
                                        </div>

                                        <div className="w-full sm:w-1/2 rounded-xl aspect-video relative overflow-hidden">
                                            <img
                                                src={sanitizeImageUrl(imageSrc, `https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop`)}
                                                alt={title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </StackingCardItem>
                            );
                        })}

                        {footerText && (
                            <div className="w-full h-80 relative overflow-hidden">
                                <h2 className="absolute bottom-0 left-0 translate-y-1/3 sm:text-[192px] text-[80px] text-[#ff5941] font-calendas">
                                    {footerText}
                                </h2>
                            </div>
                        )}
                    </StackingCards>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground p-8">
                        Add cards to display the stacking effect.
                    </div>
                )}
            </div>
        </AnimatedSection>
    );
}
