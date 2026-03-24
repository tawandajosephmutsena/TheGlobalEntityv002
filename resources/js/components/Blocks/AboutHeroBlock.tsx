"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AboutHeroBlock } from '@/types/page-blocks';

export default function AboutHeroBlockRenderer({
    title = "The Global… What?",
    subtitle = "Identity & Soul",
    description = "Your brutally honest travel guide, your happy festival connoisseur, and the map for the souls who refuse to walk the paved path.",
    backgroundImage,
    ctaText = "Join Journey",
    ctaLink = "#"
}: AboutHeroBlock['content']) {
    return (
        <section className="relative px-8 py-20 overflow-hidden bg-background">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[60px] opacity-40"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-tertiary/20 rounded-full blur-[60px] opacity-40"></div>
            
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    {backgroundImage && (
                        <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 rotate-12 shadow-2xl z-20">
                            <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <span className="text-primary font-black tracking-[0.3em] uppercase text-xs mb-6 block italic">
                        {subtitle}
                    </span>
                    <h1 className="font-display font-black text-7xl md:text-9xl text-on-background leading-[0.8] mb-10 tracking-tighter uppercase">
                        {title.includes('…') ? (
                            <>
                                {title.split('…')[0]}… <br/>
                                <span className="text-secondary italic lowercase mix-blend-multiply dark:mix-blend-normal">{title.split('…')[1] || 'What?'}</span>
                            </>
                        ) : title}
                    </h1>
                    <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed mb-12 font-medium italic">
                        {description}
                    </p>
                    
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary text-on-primary px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center gap-3 group transition-all duration-500"
                    >
                        <a href={ctaLink}>{ctaText}</a>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                <div className="relative grid grid-cols-3 gap-4">
                    <AboutHeroIcon 
                        icon="eco" 
                        label="Sustainability" 
                        className="bg-surface-container-low transform -rotate-3 hover:rotate-0 text-tertiary"
                    />
                    <AboutHeroIcon 
                        icon="favorite" 
                        label="Living Through Heart" 
                        className="bg-surface-container-high transform rotate-6 hover:rotate-0 mt-8 text-primary shadow-lg"
                        fill
                    />
                    <AboutHeroIcon 
                        icon="person_pin_circle" 
                        label="Solo Travel" 
                        className="bg-surface-container-low transform -rotate-6 hover:rotate-0 text-secondary"
                    />
                    <AboutHeroIcon 
                        icon="festival" 
                        label="Adventures" 
                        className="bg-surface-container-high col-span-2 transform rotate-2 hover:rotate-0 text-primary-dim"
                    />
                    <AboutHeroIcon 
                        icon="diamond" 
                        label="Local Gems" 
                        className="bg-surface-container-lowest shadow-sm transform -rotate-12 hover:rotate-0 text-on-secondary-fixed-variant"
                    />
                </div>
            </div>
        </section>
    );
}

function AboutHeroIcon({ icon, label, className, fill = false }: { icon: string, label: string, className: string, fill?: boolean }) {
    return (
        <motion.div 
            whileHover={{ scale: 1.1, rotate: 0 }}
            className={cn(
                "aspect-square rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-300 cursor-default",
                className
            )}
        >
            <span 
                className={cn("material-symbols-outlined text-4xl mb-2", fill && "[font-variation-settings:'FILL'_1] fill-current")}
            >
                {icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center leading-tight">
                {label}
            </span>
        </motion.div>
    );
}
