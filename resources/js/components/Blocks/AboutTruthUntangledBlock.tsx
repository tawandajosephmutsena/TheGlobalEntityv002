"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AboutTruthUntangledBlock } from '@/types/page-blocks';

export default function AboutTruthUntangledBlockRenderer({
    title = "Truth Untangled",
    description = "We peel back the layers of the polished travel industry to reveal the raw, honest, and truly transformative experiences underneath.",
    items = [
        {
            icon: "visibility",
            title: "Unfiltered Perspectives",
            description: "No filters, no sponsored fluff. Just the raw truth about the places we visit and the cultures we encounter."
        },
        {
            icon: "auto_awesome",
            title: "Soulful Experiences",
            description: "We look for the magic in the mundane and the extraordinary in the everyday."
        },
        {
            icon: "explore",
            title: "Hidden Gems",
            description: "Discover the places that don't make it onto the typical tourist maps."
        }
    ]
}: AboutTruthUntangledBlock['content']) {
    return (
        <section className="py-32 px-8 max-w-7xl mx-auto overflow-hidden">
            <div className="grid md:grid-cols-2 gap-20 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="rounded-2xl overflow-hidden shadow-2xl relative group bg-surface-container">
                        <img 
                            className="w-full h-[600px] object-cover transition-transform duration-700 group-hover:scale-110" 
                            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2670&auto=format&fit=crop" 
                            alt="Truth Untangled" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="absolute -bottom-10 -right-10 w-48 h-48 bg-secondary-container rounded-full p-8 flex items-center justify-center text-center shadow-lg border-4 border-surface z-20"
                    >
                        <p className="font-headline font-black text-on-secondary-container leading-none uppercase">
                            REAL STORIES<br/>
                            <span className="text-xs tracking-tighter opacity-80">No Filters</span>
                        </p>
                    </motion.div>
                </motion.div>

                <div className="flex flex-col gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-headline font-bold text-5xl mb-6">
                            {title}
                        </h2>
                        <p className="text-xl text-on-surface-variant leading-relaxed">
                            {description}
                        </p>
                    </motion.div>

                    <div className="grid gap-8">
                        {items.map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                                className="flex gap-6 items-start p-6 rounded-2xl hover:bg-surface-container transition-colors group cursor-default"
                            >
                                <div className="p-4 bg-tertiary/10 rounded-xl text-tertiary group-hover:scale-110 transition-all duration-300 group-hover:bg-tertiary group-hover:text-on-tertiary">
                                    <span className="material-symbols-outlined text-3xl">
                                        {item.icon}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-headline font-bold text-lg mb-2">{item.title}</h4>
                                    <p className="text-on-surface-variant text-sm leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
