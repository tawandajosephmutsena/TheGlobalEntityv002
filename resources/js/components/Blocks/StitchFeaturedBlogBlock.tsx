"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Tag, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StitchFeaturedBlogBlock } from '@/types/page-blocks';
import AnimatedSection from '@/Components/AnimatedSection';

export default function StitchFeaturedBlogBlockRenderer({
    title = "Latest Stories.",
    subtitle = "Deep dives into culture, sustainability, and the raw beauty of unfiltered exploration.",
    posts = [
        {
            title: "The Art of Slow Travel in 2024",
            excerpt: "Why staying longer in one place is the ultimate revolutionary act for the modern traveler.",
            image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2670&auto=format&fit=crop",
            author: "Maya Silva",
            date: "Mar 15, 2024"
        },
        {
            title: "Beyond the Main Stage: Secret Festival Hubs",
            excerpt: "Discovering the grassroots movements that are redefining collective joy across the globe.",
            image: "https://images.unsplash.com/photo-1514525253361-bee8a48740ad?q=80&w=2564&auto=format&fit=crop",
            author: "Jack Rivers",
            date: "Mar 12, 2024"
        },
        {
            title: "Sustainable Souls: The Eco-Revolution",
            excerpt: "How local communities are preserving their culture while embracing a greener future.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop",
            author: "Elena Moon",
            date: "Mar 10, 2024"
        }
    ]
}: StitchFeaturedBlogBlock['content']) {
    return (
        <section className="py-24 md:py-32 px-6 bg-surface theme-stitch overflow-hidden">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
                    <div className="max-w-3xl">
                        <AnimatedSection animation="fade-up" textReveal>
                            <h2 className="font-display font-black text-5xl md:text-8xl tracking-tighter leading-[0.9] mb-8">
                                {title.split(' ').map((word, i, arr) => (
                                    <span key={i} className={cn(
                                        "inline-block mr-3",
                                        i >= arr.length - 1 && "text-primary italic font-serif font-light"
                                    )}>
                                        {word}
                                    </span>
                                ))}
                            </h2>
                        </AnimatedSection>
                        <AnimatedSection animation="fade-up" delay={200}>
                            <p className="text-xl md:text-2xl text-on-surface-variant font-medium leading-relaxed opacity-70">
                                {subtitle}
                            </p>
                        </AnimatedSection>
                    </div>
                    
                    <AnimatedSection animation="fade-left" delay={300}>
                        <motion.button 
                            whileHover={{ x: 10 }}
                            className="flex items-center gap-4 py-4 px-8 bg-surface-container rounded-full border border-outline-variant/30 font-black text-[10px] tracking-[0.4em] uppercase text-primary transition-all group shadow-lg"
                        >
                            View All Stories 
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </AnimatedSection>
                </div>

                <div className="asymmetric-grid-container gap-10">
                    {posts.slice(0, 3).map((post, index) => (
                        <AnimatedSection 
                            key={index}
                            animation={index === 0 ? "fade-right" : index === 1 ? "fade-up" : "fade-left"}
                            delay={index * 150 + 400}
                            className={cn(
                                "flex flex-col",
                                index === 0 ? "lg:col-span-12 xl:col-span-7" : "lg:col-span-6 xl:col-span-5"
                            )}
                        >
                            <div className={cn(
                                "group bg-surface-container-low rounded-[3rem] overflow-hidden hover:shadow-2xl transition-all duration-700 border border-outline-variant/30 flex flex-col h-full relative",
                                index === 0 && "md:flex-row md:min-h-[500px]"
                            )}>
                                {/* Image Section */}
                                <div className={cn(
                                    "aspect-[16/10] overflow-hidden relative",
                                    index === 0 ? "md:aspect-auto md:w-1/2" : "w-full"
                                )}>
                                    <img 
                                        src={post.image || "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2670&auto=format&fit=crop"} 
                                        alt={post.title || ""} 
                                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                                    />
                                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                    
                                    <div className="absolute top-6 left-6">
                                        <div className="glass px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2 border-white/20">
                                            <Tag className="w-3 h-3 text-primary" />
                                            Exploration
                                        </div>
                                    </div>
                                    
                                    {index === 0 && (
                                        <div className="absolute bottom-6 right-6 md:hidden">
                                            <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-2xl">
                                                <ArrowUpRight className="w-6 h-6" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Content Section */}
                                <div className={cn(
                                    "p-10 md:p-12 flex flex-col justify-center",
                                    index === 0 ? "md:w-1/2" : "flex-grow"
                                )}>
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-8 border-b border-outline-variant/10 pb-6">
                                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {post.date}</span>
                                        <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {post.author}</span>
                                    </div>
                                    
                                    <h3 className={cn(
                                        "font-display font-black mb-6 group-hover:text-primary transition-colors leading-[1.1] tracking-tighter",
                                        index === 0 ? "text-4xl md:text-5xl" : "text-3xl"
                                    )}>
                                        {post.title}
                                    </h3>
                                    
                                    <p className="text-on-surface-variant text-lg font-medium leading-relaxed mb-10 line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                        {post.excerpt}
                                    </p>
                                    
                                    <div className="mt-auto">
                                        <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary group-hover:gap-6 transition-all duration-500 cursor-pointer">
                                            Read Narrative
                                            <div className="w-12 h-px bg-primary/30 group-hover:bg-primary transition-all group-hover:w-20"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
