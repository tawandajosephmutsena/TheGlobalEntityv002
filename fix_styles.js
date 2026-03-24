const fs = require('fs');

const file1 = 'resources/js/components/Blocks/AboutWhoAreYouBlock.tsx';
let content1 = fs.readFileSync(file1, 'utf8');

// The file was truncated. Let's restore the whole render function.
const correctContent1 = `"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AboutWhoAreYouBlock } from '@/types/page-blocks';

export default function AboutWhoAreYouBlockRenderer({
    title = "Who Are You?",
    items = [
        {
            title: "The Seeker",
            description: "You don't just want a vacation; you want an encounter. You are chasing the rhythm of a place, not just its coordinates.",
            colorClass: "text-primary"
        },
        {
            title: "The Dancer",
            description: "Festivals are your temples. You understand that collective joy is a revolutionary act in a disconnected world.",
            colorClass: "text-secondary"
        },
        {
            title: "The Curiously Brave",
            description: "You prefer the unfiltered truth over the curated postcard. You're ready to see the world as it breathes, messy and all.",
            colorClass: "text-tertiary"
        }
    ]
}: AboutWhoAreYouBlock['content']) {
    return (
        <section className="bg-surface-container-low py-32 px-8 text-on-surface">
            <div className="max-w-4xl mx-auto text-center">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-headline font-bold text-5xl mb-12"
                >
                    {title.includes('You?') ? (
                        <>Who Are <span className="text-tertiary">You?</span></>
                    ) : title}
                </motion.h2>
                
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    {items.map((item, index) => (
                        <AboutWhoAreYouCard 
                            key={index}
                            title={item.title || ""} 
                            description={item.description || ""}
                            colorClass={item.colorClass || "text-primary"}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function AboutWhoAreYouCard({ title, description, colorClass, delay }: { title: string, description: string, colorClass: string, delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            className="p-8 bg-surface-container-lowest rounded-2xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-surface-variant group"
        >
            <h3 className={cn("font-headline font-bold text-xl mb-4 transition-transform origin-left group-hover:scale-105", colorClass)}>
                {title}
            </h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}
`;
fs.writeFileSync(file1, correctContent1);

const file2 = 'resources/js/components/Blocks/AboutMoreThanEntertainmentBlock.tsx';
let content2 = fs.readFileSync(file2, 'utf8');

// In my previous replace, I broke the closing tag. I'll just restore the correct block.
content2 = content2.replace(`                    <motion.h2 \n                        initial={{ opacity: 0, y: 20 }}\n                        whileInView={{ opacity: 1, y: 0 }}\n                        viewport={{ once: true }}\n\n                    >`, `                    <motion.h2 \n                        initial={{ opacity: 0, y: 20 }}\n                        whileInView={{ opacity: 1, y: 0 }}\n                        viewport={{ once: true }}\n                        className="font-headline font-bold text-5xl mb-6 text-on-surface"\n                    >`);

// Also fix the text-on-background if it still exists.
content2 = content2.replace('text-on-background', 'text-on-surface');
fs.writeFileSync(file2, content2);
console.log('Fixed both components');
