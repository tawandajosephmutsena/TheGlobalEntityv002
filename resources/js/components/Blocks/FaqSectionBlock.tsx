import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';
import AnimatedSection from '@/components/AnimatedSection';
import { FaqSectionBlock } from '@/types/page-blocks';

export default function FaqSectionBlockRenderer(props: FaqSectionBlock['content']) {
    const {
        heading = 'Frequently Asked Questions',
        description = `Can't find what you're looking for? Contact our <a href="#" class="text-primary font-medium hover:underline">customer support team</a>`,
        faqs = [
            {
                id: 'item-1',
                icon: 'clock',
                question: 'What are your business hours?',
                answer: 'Our customer service team is available Monday through Friday from 9:00 AM to 8:00 PM EST.',
            },
            {
                id: 'item-2',
                icon: 'credit-card',
                question: 'How do subscription payments work?',
                answer: 'Subscription payments are automatically charged to your default payment method.',
            }
        ]
    } = props || {};

    return (
        <AnimatedSection className="py-20 overflow-visible">
            {/* Gradient section divider */}
            <div className="gradient-divider-glow mb-20" aria-hidden="true" />
            <div className="mx-auto max-w-5xl px-4 md:px-6 relative z-10">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            {heading && <h2 className="mt-4 text-3xl font-bold">{heading}</h2>}
                            
                            {description && (
                                <div 
                                    className="text-muted-foreground mt-4 prose prose-sm dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            )}
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {faqs.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="liquid-glass border border-white/10 rounded-lg px-4 last:border-b"
                                >
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline text-foreground">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6 shrink-0 theme-gradient-text">
                                                {/* Fallback pattern if DynamicIcon isn't available: render generic icon or nothing */}
                                                {item.icon ? (
                                                    <DynamicIcon name={item.icon as IconName} className="m-auto size-4" />
                                                ) : null}
                                            </div>
                                            <span className="text-base text-left">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <p className="text-base text-muted-foreground">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </AnimatedSection>
    );
}
