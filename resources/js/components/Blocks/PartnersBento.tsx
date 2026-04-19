import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import DynamicIcon from '@/components/DynamicIcon';
import type { PartnersBentoBlock } from '@/types/page-blocks';

export default function PartnersBento({ 
    title, 
    cards = [], 
    showCollaborateButton = true,
    averageResponseLabel = "Average Response",
    averageResponseValue = "24-48 Moons"
}: PartnersBentoBlock['content']) {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container px-4 mx-auto relative z-10">
                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 px-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-display font-light leading-tight"
                    >
                        {title || "Partnership Ecosystem"}
                    </motion.h2>
                </div>

                {/* Bento Grid */}
                <div className="flex flex-wrap justify-center gap-6">
                    {cards.map((card, index) => {
                        const isWide = index === 0 || index === 3;
                        const variant = card.variant || 'glass';
                        
                        return (
                            <motion.div
                                key={card.id || index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "relative group rounded-[2.5rem] overflow-hidden p-8 flex flex-col justify-between transition-all duration-500 hover:scale-[1.02] min-h-[400px]",
                                    "w-full",
                                    isWide ? "md:w-[calc(50%-12px)]" : "md:w-[calc(33.333%-16px)]",
                                    variant === 'primary' && "bg-primary text-primary-foreground shadow-xl shadow-primary/20",
                                    variant === 'secondary' && "bg-secondary text-secondary-foreground",
                                    variant === 'tertiary' && "bg-accent text-accent-foreground",
                                    variant === 'glass' && "liquid-glass border border-primary/10 hover:border-primary/30"
                                )}
                            >
                                <div className="relative z-10 w-full">
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110",
                                        variant === 'primary' ? "bg-white/20" : "bg-primary/10"
                                    )}>
                                        <DynamicIcon 
                                            icon={card.icon} 
                                            type={card.iconType || 'lucide'} 
                                            size={24} 
                                            className={cn(
                                                variant === 'primary' ? "text-white" : "text-primary"
                                            )}
                                        />
                                    </div>
                                    
                                    <h3 className="text-2xl md:text-3xl font-display font-medium mb-4 leading-tight">
                                        {card.title}
                                    </h3>
                                    <p className={cn(
                                        "text-lg font-light leading-relaxed max-w-[90%]",
                                        variant === 'primary' ? "text-white/80" : "text-muted-foreground"
                                    )}>
                                        {card.description}
                                    </p>
                                </div>

                                <div className="mt-8 flex items-center justify-between relative z-10">
                                    {showCollaborateButton && card.link && (
                                        <motion.a
                                            href={card.link}
                                            whileHover={{ x: 5 }}
                                            className={cn(
                                                "flex items-center gap-2 text-sm font-medium tracking-wider uppercase group/link",
                                                variant === 'primary' ? "text-white" : "text-primary"
                                            )}
                                        >
                                            Collaborate
                                            <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
                                        </motion.a>
                                    )}
                                    
                                    {!isWide && (
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border",
                                            variant === 'primary' ? "border-white/20 text-white" : "border-primary/10 text-primary/40"
                                        )}>
                                            <ArrowRight size={16} className="-rotate-45" />
                                        </div>
                                    )}
                                </div>

                                {/* Background Accents */}
                                {variant === 'primary' && (
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                                )}
                                {variant === 'glass' && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Response Meta Footer */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-16 pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-center gap-6"
                >
                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/5 border border-primary/10 backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <MessageSquare size={16} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                                {averageResponseLabel}
                            </span>
                            <span className="text-sm font-display font-medium text-primary">
                                {averageResponseValue}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
