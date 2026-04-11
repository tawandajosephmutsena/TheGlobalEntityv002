"use client";

import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Mail, CheckCircle2 } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';
import WatercolorBackground from '@/components/WatercolorBackground';
import type { JournalNewsletterBlock } from '@/types/page-blocks';

interface Props {
    content: JournalNewsletterBlock['content'];
}

export default function JournalNewsletterBlock({ content }: Props) {
    const { 
        title = "Letters from the Edge", 
        description = "Receive weekly coordinates to hidden corners of the world, curated stories, and slow travel wisdom delivered to your vessel.", 
        placeholder = "Your destination email...", 
        buttonText = "SUBSCRIBE" 
    } = content;

    const [submitted, setSubmitted] = useState(false);
    
    const { data, setData, post, processing } = useForm({
        email: '',
        form_title: 'Newsletter Subscription',
    });
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                setSubmitted(true);
                setData('email', '');
                setTimeout(() => setSubmitted(false), 5000);
            },
        });
    };

    return (
        <section className="container mx-auto px-6 mt-32">
            <AnimatedSection animation="fade-in" className="relative group overflow-hidden rounded-[2rem] p-12 lg:p-24 text-center gradient-mesh-journal-newsletter border border-tertiary/10">
                <WatercolorBackground variant="journalNewsletter" />
                
                <div className="relative z-10 max-w-2xl mx-auto">
                    <Mail className="size-16 text-tertiary mx-auto mb-8 opacity-80" />
                    <h2 className="font-display font-black text-4xl lg:text-6xl mb-8 tracking-tighter text-on-surface">
                        {title.includes('Edge') ? (
                            <>Letters from the <span className="text-tertiary italic">Edge</span></>
                        ) : title}
                    </h2>
                    <p className="text-on-surface-variant mb-12 text-lg lg:text-xl font-light leading-relaxed">
                        {description}
                    </p>
                    
                    {submitted ? (
                        <div className="flex items-center justify-center gap-4 p-8 rounded-full bg-tertiary/10 border border-tertiary/20">
                            <CheckCircle2 className="size-8 text-tertiary" />
                            <p className="text-tertiary font-black text-sm tracking-widest">Entry confirmed. Welcome aboard.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                            <input 
                                className="flex-1 bg-surface border-none rounded-full px-10 py-5 text-on-surface shadow-inner focus:ring-2 focus:ring-tertiary/30 placeholder:text-on-surface-variant/40" 
                                placeholder={placeholder} 
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                required
                            />
                            <button 
                                className="bg-tertiary text-on-tertiary font-black text-xs tracking-widest px-12 py-5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-xl shadow-tertiary/20 disabled:opacity-50"
                                disabled={processing}
                            >
                                {buttonText}
                            </button>
                        </form>
                    )}
                    <p className="mt-8 text-[10px] text-on-surface-variant font-black tracking-widest opacity-40">
                        No noise. Only the signal. Unsubscribe anytime.
                    </p>
                </div>
            </AnimatedSection>
        </section>
    );
}
