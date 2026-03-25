"use client";

import React from 'react';
import { motion } from 'framer-motion';
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
        <section className="theme-stitch py-32 px-8 max-w-7xl mx-auto overflow-hidden text-on-surface">
            <div className="grid md:grid-cols-2 gap-20 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative"
                >
                    <div className="rounded-[2.5rem] overflow-hidden shadow-sea-mist relative group bg-surface-container-low border border-primary/5">
                        <img 
                            className="w-full h-[600px] object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2670&auto=format&fit=crop" 
                            alt="Truth Untangled" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                        whileInView={{ scale: 1, opacity: 1, rotate: 6 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                        className="absolute -bottom-10 -right-10 w-56 h-56 bg-secondary text-on-secondary rounded-full p-8 flex flex-col items-center justify-center text-center shadow-sea-mist border-8 border-background z-20"
                    >
                        <p className="font-display font-black text-2xl leading-none tracking-tighter">
                            REAL<br/>STORIES
                        </p>
                        <span className="text-[10px] font-black tracking-[0.3em] opacity-70 mt-2">No Filters</span>
                    </motion.div>
                </motion.div>

                <div className="flex flex-col gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="font-display font-black text-5xl md:text-7xl mb-8 tracking-tighter leading-[0.85]">
                            {title}
                        </h2>
                        <p className="text-xl md:text-2xl text-on-surface-variant leading-relaxed font-semibold italic">
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
                                <div className="p-4 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-all duration-700 group-hover:bg-primary group-hover:text-on-primary shadow-inner">
                                    <span className="material-symbols-outlined text-4xl">
                                        {item.icon}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-display font-black text-xl mb-2 tracking-tighter">{item.title}</h4>
                                    <p className="text-on-surface-variant text-base leading-relaxed italic">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
