"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AboutHeroBlock } from '@/types/page-blocks';
import CategoryIcon from '@/components/CategoryIcon';

export default function AboutHeroBlockRenderer({
    title = "The Global… What?",
    subtitle = "Identity & Soul",
    description = "Your brutally honest travel guide, your happy festival connoisseur, and the map for the souls who refuse to walk the paved path.",
    backgroundImage,
    ctaText = "Join Journey",
    ctaLink = "#"
}: AboutHeroBlock['content']) {
    return (
        <section className="relative px-8 pt-56 pb-20 overflow-visible text-on-background">
            
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10"
                >
                    <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 rotate-12 shadow-2xl z-20 bg-surface-container-high flex items-center justify-center">
                        {backgroundImage ? (
                            <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <CategoryIcon 
                                category="travel-trouble" 
                                size={48} 
                                glow={true} 
                                variant="badge" 
                            />

                        )}
                    </div>
                    <span className="text-primary font-black tracking-[0.3em] text-xs mb-6 block italic [font-variant-caps:small-caps]">
                        {subtitle}
                    </span>
                    <h1 className="font-display font-black text-6xl md:text-8xl lg:text-9xl text-on-background leading-[0.8] mb-10 tracking-tighter [font-variant-caps:small-caps]">
                        {title.includes('…') ? (
                            <>
                                {title.split('…')[0]}… <br/>
                                <span className="text-secondary italic drop-shadow-sm">{title.split('…')[1] || 'What?'}</span>
                            </>
                        ) : title}
                    </h1>
                    <p className="text-xl md:text-2xl text-on-surface-variant max-w-xl leading-relaxed mb-12 font-medium italic font-sans">
                        {description}
                    </p>
                    
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-primary text-white px-10 py-5 rounded-full font-black text-xs [font-variant-caps:small-caps] tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center gap-3 group transition-all duration-500"
                    >
                        <a href={ctaLink}>{ctaText}</a>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                <div className="relative grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <AboutHeroIcon 
                        category="social-sustainability" 
                        label="Sustainability" 
                        className="transform -rotate-3 hover:rotate-0"
                    />
                    <AboutHeroIcon 
                        category="living-from-the-heart" 
                        label="Heart-Led" 
                        className="transform rotate-6 hover:rotate-0 mt-8 shadow-lg"
                    />
                    <AboutHeroIcon 
                        category="solo-travel" 
                        label="Solo Travel" 
                        className="transform -rotate-6 hover:rotate-0 ml-4"
                    />
                    <AboutHeroIcon 
                        category="festival-fever" 
                        label="Festivals" 
                        className="transform rotate-2 hover:rotate-0 mt-4"
                    />
                    <AboutHeroIcon 
                        category="glocal-gems" 
                        label="Hidden Gems" 
                        className="shadow-sm transform -rotate-12 hover:rotate-0"
                    />
                    <AboutHeroIcon 
                        category="travel-trouble" 
                        label="The Truth" 
                        className="transform rotate-12 hover:rotate-0 mt-12 shadow-md"
                    />
                </div>
            </div>
        </section>
    );
}

function AboutHeroIcon({ category, label, className }: { category: string, label: string, className: string }) {
    return (
        <motion.div 
            whileHover={{ scale: 1.1, rotate: 0 }}
            className={cn(
                "aspect-square rounded-[2.5rem] p-6 flex flex-col items-center justify-center transition-all duration-300 cursor-default border border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-2xl group liquid-glass",
                className
            )}
        >
            <CategoryIcon 
                category={category} 
                size={48} 
                glow={true} 
                variant="badge" 
                wrapperClassName="vibrant-badge scale-110 mb-2"
            />

            <span className="text-[10px] font-black tracking-widest text-on-surface text-center leading-tight [font-variant-caps:small-caps] opacity-80 group-hover:opacity-100 transition-opacity">
                {label}
            </span>
        </motion.div>
    );
}
