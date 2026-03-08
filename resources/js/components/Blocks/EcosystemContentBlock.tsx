import React from 'react';
import { EcosystemContentBlock } from '@/types/page-blocks';

const sanitizeImageUrl = (url: string | undefined, fallback: string) => {
    if (!url || typeof url !== 'string' || url.startsWith('/') || url.includes('placeholder') || url.includes('.png') || url.includes('.jpg')) {
        if (url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('https')) && !url.includes('placeholder')) {
             return url;
        }
        return fallback;
    }
    return url;
};
import AnimatedSection from '@/components/AnimatedSection';

export default function EcosystemContentBlockRenderer(props: EcosystemContentBlock['content']) {
    const {
        heading = 'The Lyra ecosystem brings together our models.',
        imageDarkSrc,
        imageLightSrc,
        description1 = 'Gemini is evolving to be more than just the models. <span class="text-accent-foreground font-bold">It supports an entire ecosystem</span> — from products innovate.',
        description2 = 'It supports an entire ecosystem — from products to the APIs and platforms helping developers and businesses innovate',
        quoteText = "Using TailsUI has been like unlocking a secret design superpower. It's the perfect fusion of simplicity and versatility, enabling us to create UIs that are as stunning as they are user-friendly.",
        quoteAuthor = 'John Doe, CEO',
    } = props || {};

    const sanitizedDark = sanitizeImageUrl(imageDarkSrc, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2864&auto=format&fit=crop');
    const sanitizedLight = sanitizeImageUrl(imageLightSrc, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2944&auto=format&fit=crop');
    
    return (
        <AnimatedSection className="py-16 md:py-32 bg-background text-foreground">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                {heading && (
                    <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
                        {heading}
                    </h2>
                )}
                <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
                    <div className="relative mb-6 sm:mb-0">
                        <div className="bg-linear-to-b aspect-76/59 relative rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                            <img
                                src={sanitizedDark}
                                className="hidden rounded-[15px] dark:block object-cover w-full h-full"
                                alt="ecosystem illustration dark"
                            />
                            <img
                                src={sanitizedLight}
                                className="block rounded-[15px] dark:hidden object-cover w-full h-full"
                                alt="ecosystem illustration light"
                            />
                        </div>
                    </div>

                    <div className="relative space-y-4">
                        {description1 && (
                            <div
                                className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: description1 }}
                            />
                        )}
                        {description2 && (
                            <div
                                className="text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: description2 }}
                            />
                        )}

                        <div className="pt-6">
                            <blockquote className="border-l-4 pl-4 border-primary">
                                {quoteText && <p className="italic">{quoteText}</p>}

                                <div className="mt-6 space-y-3">
                                    {quoteAuthor && (
                                        <cite className="block font-medium not-italic text-sm">
                                            {quoteAuthor}
                                        </cite>
                                    )}
                                </div>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
