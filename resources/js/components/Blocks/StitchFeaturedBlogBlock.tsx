"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import type { StitchFeaturedBlogBlock } from '@/types/page-blocks';
import AnimatedSection from '@/components/AnimatedSection';
import CategoryIcon from '../CategoryIcon';

interface FetchedPost {
    title?: string;
    description?: string;
    excerpt?: string;
    image?: string;
    featured_image?: string;
    author?: { name?: string } | string;
    date?: string;
    url?: string;
    link?: string;
    [key: string]: unknown;
}

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
    ],
    useDynamicPosts = false,
    collection = 'insights',
    limit = 3
}: StitchFeaturedBlogBlock['content']) {
    const [dynamicPosts, setDynamicPosts] = useState<FetchedPost[]>([]);
    const [loading, setLoading] = useState(useDynamicPosts);

    useEffect(() => {
        if (!useDynamicPosts) return;

        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/collections/${collection}?limit=${limit}`);
                setDynamicPosts(response.data.data || []);
            } catch (error) {
                console.error('Failed to fetch dynamic posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [useDynamicPosts, collection, limit]);

    // Determine the active posts to display
    const activePosts = useDynamicPosts ? 
        dynamicPosts.map(post => ({
            title: post.title || '',
            excerpt: post.description || post.excerpt || '',
            image: post.image || post.featured_image || '',
            author: typeof post.author === 'object' && post.author !== null ? post.author.name || '' : String(post.author || ''),
            date: post.date || '',
            link: post.url || post.link
        })) 
        : posts;

    return (
        <section className="py-24 md:py-32 px-6 gradient-aurora theme-stitch overflow-hidden">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
                    <div className="max-w-3xl">
                        <AnimatedSection animation="fade-up" textReveal>
                        <h2 className="font-display font-black text-5xl md:text-8xl tracking-tighter leading-[0.9] mb-8 [font-variant-caps:small-caps]">
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
                            className="flex items-center gap-4 py-4 px-8 theme-gradient-animated text-white rounded-full font-black text-[10px] tracking-tighter [font-variant-caps:small-caps] transition-all group shadow-lg theme-gradient-glow"
                        >
                            view all stories 
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </AnimatedSection>
                </div>

                <div className="asymmetric-grid-container gap-10">
                    {loading ? (
                        <div className="w-full col-span-full h-96 flex items-center justify-center">
                            <div className="animate-pulse flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-primary/40 animate-bounce" />
                                <div className="w-4 h-4 rounded-full bg-primary/60 animate-bounce [animation-delay:-.15s]" />
                                <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:-.3s]" />
                            </div>
                        </div>
                    ) : (
                        activePosts.slice(0, 3).map((post, index) => (
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
                                        <div className="absolute inset-0 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-1000" style={{ background: 'var(--theme-gradient)' }} />
                                        
                                        <div className="absolute top-6 left-6">
                                            <div className="gradient-glass px-4 py-1.5 rounded-full text-[10px] font-black [font-variant-caps:small-caps] tracking-tighter text-white flex items-center gap-2">
                                                <CategoryIcon category="festival-fever" size={14} glow />
                                                exploration
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
                                        <div className="flex items-center gap-6 text-[10px] font-black [font-variant-caps:small-caps] tracking-tighter text-on-surface-variant/40 mb-8 border-b border-outline-variant/10 pb-6">
                                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {post.date}</span>
                                            <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {post.author}</span>
                                        </div>
                                        
                                        {post.link ? (
                                            <a href={post.link} className="hover:underline">
                                                <h3 className={cn(
                                                    "font-display font-black mb-6 group-hover:text-primary transition-colors leading-[1.1] tracking-tighter [font-variant-caps:small-caps]",
                                                    index === 0 ? "text-4xl md:text-5xl" : "text-3xl"
                                                )}>
                                                    {post.title}
                                                </h3>
                                            </a>
                                        ) : (
                                            <h3 className={cn(
                                                "font-display font-black mb-6 group-hover:text-primary transition-colors leading-[1.1] tracking-tighter [font-variant-caps:small-caps]",
                                                index === 0 ? "text-4xl md:text-5xl" : "text-3xl"
                                            )}>
                                                {post.title}
                                            </h3>
                                        )}
                                        
                                        <p className="text-on-surface-variant text-lg font-medium leading-relaxed mb-10 line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity">
                                            {post.excerpt}
                                        </p>
                                        
                                        <div className="mt-auto">
                                            {post.link ? (
                                                <a href={post.link} className="inline-flex items-center gap-3 text-[10px] font-black [font-variant-caps:small-caps] tracking-tighter text-primary group-hover:gap-6 transition-all duration-500 cursor-pointer">
                                                    read narrative
                                                    <div className="w-12 h-px bg-primary/30 group-hover:bg-primary transition-all group-hover:w-20"></div>
                                                </a>
                                            ) : (
                                                <div className="inline-flex items-center gap-3 text-[10px] font-black [font-variant-caps:small-caps] tracking-tighter text-primary group-hover:gap-6 transition-all duration-500 cursor-pointer">
                                                    read narrative
                                                    <div className="w-12 h-px bg-primary/30 group-hover:bg-primary transition-all group-hover:w-20"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
