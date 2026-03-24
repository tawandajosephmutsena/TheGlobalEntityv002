"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AboutOriginStoryBlock } from '@/types/page-blocks';

export default function AboutOriginStoryBlockRenderer({
    title = "The Origin Story",
    description = "It started with a backpack, a broken compass, and a realization: the world is far more interesting when you stop looking for the 'perfect' photo and start looking for the truth.",
    image = "https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=2574&auto=format&fit=crop",
    timeline = [
        { year: "2018", event: "The first solo journey into the heart of the Amazon." },
        { year: "2020", event: "The Global Entity was born as a small blog." },
        { year: "2022", event: "Expanded into community reviews and festival guides." },
        { year: "2024", event: "Launching the immersive audio podcast series." }
    ]
}: AboutOriginStoryBlock['content']) {
    return (
        <section className="py-32 px-8 bg-background overflow-hidden">
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-surface-container">
                        <img src={image} alt="Origin Story" className="w-full h-auto object-cover" />
                    </div>
                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0"></div>
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-tertiary/10 rounded-full blur-3xl z-0"></div>
                </motion.div>

                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="font-headline font-bold text-5xl mb-6">
                            {title}
                        </h2>
                        <p className="text-xl text-on-surface-variant leading-relaxed">
                            {description}
                        </p>
                    </motion.div>

                    <div className="relative pl-8 border-l-2 border-primary/20 space-y-12">
                        {timeline.map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="absolute -left-[41px] top-1.5 w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(175,4,122,0.5)]"></div>
                                <span className="font-headline font-black text-2xl text-primary mb-2 block">
                                    {item.year}
                                </span>
                                <p className="text-on-surface-variant font-medium">
                                    {item.event}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
