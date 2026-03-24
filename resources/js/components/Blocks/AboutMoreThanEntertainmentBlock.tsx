"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import type { AboutMoreThanEntertainmentBlock } from '@/types/page-blocks';

export default function AboutMoreThanEntertainmentBlockRenderer({
    title = "More Than Entertainment",
    description = "We believe that shared moments of joy, music, and art are transformative. It's not just about the show; it's about the connection.",
    cards = [
        {
            image: "https://images.unsplash.com/photo-1459749411177-042180ceae19?q=80&w=2670&auto=format&fit=crop",
            title: "Festivals",
            subtitle: "Sacred spaces of collective joy.",
            link: "#"
        },
        {
            image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2670&auto=format&fit=crop",
            title: "Community",
            subtitle: "Finding your tribe in the wild.",
            link: "#"
        },
        {
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2670&auto=format&fit=crop",
            title: "Art & Soul",
            subtitle: "Exploration beyond the surface.",
            link: "#"
        }
    ]
}: AboutMoreThanEntertainmentBlock['content']) {
    return (
        <section className="py-32 px-8 bg-surface-container-lowest overflow-hidden text-on-surface">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-headline font-bold text-5xl mb-6"
                    >
                        {title}
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-on-surface-variant leading-relaxed"
                    >
                        {description}
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {cards.map((card, index) => (
                        <AboutMoreThanEntertainmentCard 
                            key={index}
                            image={card.image || ""}
                            title={card.title || ""}
                            subtitle={card.subtitle || ""}
                            link={card.link || "#"}
                            delay={index * 0.1 + 0.2}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function AboutMoreThanEntertainmentCard({ image, title, subtitle, link, delay }: { image: string, title: string, subtitle: string, link: string, delay: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            className="group relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl hover:shadow-2xl transition-all duration-500 bg-surface-container"
        >
            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="font-headline font-black text-3xl mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    {title}
                </h3>
                <p className="text-white/80 text-sm mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    {subtitle}
                </p>
                <motion.a 
                    href={link}
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center gap-2 text-white font-bold group/btn"
                >
                    Learn More 
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </motion.a>
            </div>
        </motion.div>
    );
}
