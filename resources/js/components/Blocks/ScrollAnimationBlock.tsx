import React from 'react';
import { ContainerScroll } from '../ui/container-scroll-animation';
import { ScrollAnimationBlock as ScrollAnimationBlockType } from '@/types/page-blocks';

export default function ScrollAnimationBlock({ title, highlightTitle, image, highlightColor }: ScrollAnimationBlockType['content']) {
    return (
        <section className="bg-background overflow-hidden">
            <ContainerScroll
                titleComponent={
                    <div className="flex flex-col items-center">
                        {title && (
                            <h2 className="text-4xl font-semibold text-foreground">
                                {title}
                            </h2>
                        )}
                        {highlightTitle && (
                            <span 
                                className="text-4xl md:text-[6rem] font-bold mt-1 leading-none"
                                style={{ 
                                    fontFamily: 'var(--font-display, sans-serif)',
                                    color: highlightColor || 'var(--foreground)'
                                }}
                            >
                                {highlightTitle}
                            </span>
                        )}
                    </div>
                }
            >
                {image ? (
                    <img
                        src={image}
                        alt={highlightTitle || title || "Scroll Animation"}
                        className="mx-auto rounded-2xl object-cover h-full object-left-top w-full"
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center rounded-2xl">
                        <p className="text-muted-foreground">Add an image to see the animation</p>
                    </div>
                )}
            </ContainerScroll>
        </section>
    );
}
