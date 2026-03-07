'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Changed from 'motion/react' to 'framer-motion'
import { BorderBeam } from '@/components/ui/border-beam';
import AnimatedSection from '@/components/AnimatedSection';
import { AiFeaturesBlock } from '@/types/page-blocks';

const sanitizeImageUrl = (url: string | undefined, fallback: string) => {
    if (!url || typeof url !== 'string' || url.startsWith('/') || url.includes('placeholder') || url.includes('.png') || url.includes('.jpg')) {
        if (url && typeof url === 'string' && (url.startsWith('http') || url.startsWith('https')) && !url.includes('placeholder')) {
             return url;
        }
        return fallback;
    }
    return url;
};

export default function AiFeaturesBlockRenderer(props: AiFeaturesBlock['content']) {
    const {
        heading = 'The foundation for AI',
        description = 'Lyra is evolving to be more than just the models. It supports an entire to the APIs and platforms helping developers and businesses innovate.',
        features = [
            {
                id: 'item-1',
                icon: 'database',
                title: 'Real-time Ecosystem Sync',
                description: 'Sync your models and data across the entire Lyra ecosystem with sub-millisecond latency.',
                imageSrc: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2940&auto=format&fit=crop',
            },
            {
                id: 'item-2',
                icon: 'fingerprint',
                title: 'Biometric AI Security',
                description: 'Enterprise-grade security powered by our advanced biometric model for every user interaction.',
                imageSrc: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop',
            }
        ]
    } = props || {};

    const [activeItem, setActiveItem] = useState<string>(features[0]?.id || 'item-1');

    const activeFeatureObject = features.find(f => f.id === activeItem) || features[0];

    return (
        <AnimatedSection className="py-12 md:py-20 lg:py-32">
            <div className="bg-gradient-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]"></div>
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
                <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
                    {heading && <h2 className="text-balance text-4xl font-semibold lg:text-6xl text-foreground">{heading}</h2>}
                    {description && <p className="text-muted-foreground">{description}</p>}
                </div>

                <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
                    {features.length > 0 && (
                        <Accordion
                            type="single"
                            value={activeItem}
                            onValueChange={(value) => setActiveItem(value)}
                            className="w-full">
                            {features.map((feature) => (
                                <AccordionItem key={feature.id} value={feature.id}>
                                    <AccordionTrigger>
                                        <div className="flex items-center gap-2 text-base text-foreground">
                                            {feature.icon ? (
                                                <DynamicIcon name={feature.icon as IconName} className="size-4" />
                                            ) : null}
                                            {feature.title}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {feature.description}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}

                    {activeFeatureObject && (
                        <div className="bg-background relative flex overflow-hidden rounded-3xl border border-border p-2">
                            <div className="w-15 absolute inset-0 right-0 ml-auto border-l border-border bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>
                            <div className="aspect-[76/59] bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${activeItem}-id`}
                                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                        className="size-full overflow-hidden rounded-2xl border border-border bg-zinc-900 shadow-md">
                                        <img
                                            src={sanitizeImageUrl(activeFeatureObject.imageSrc, `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`)}
                                            className="size-full object-cover object-left-top dark:mix-blend-lighten"
                                            alt={activeFeatureObject.title}
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <BorderBeam
                                duration={6}
                                size={200}
                                className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
                            />
                        </div>
                    )}
                </div>
            </div>
        </AnimatedSection>
    );
}
