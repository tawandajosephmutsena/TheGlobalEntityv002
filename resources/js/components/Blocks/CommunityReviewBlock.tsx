import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CommunityReviewBlock as CommunityReviewBlockType } from '@/types/page-blocks';

const CommunityReviewBlock: React.FC<CommunityReviewBlockType['content']> = ({
    title = "Community Voices",
    subtitle = "What fellow travelers are saying",
    description,
    showRatings = true,
    layout = 'grid',
    limit = 3,
    reviews = []
}) => {
    // If no dynamic reviews provided, we could show an empty message or nothing
    // For now we'll take the passed reviews and slice by the limit set in editor
    const displayReviews = reviews.slice(0, limit);

    return (
        <section className="py-24 relative overflow-hidden bg-background">
            {/* Dreamy watercolor background effect using theme variables */}
            <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[140px]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-secondary/15 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Badge variant="outline" className="mb-4 font-mono uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                            Community Feedback
                        </Badge>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display mb-6 text-foreground tracking-tight">
                            {title}
                        </h2>
                        {subtitle && <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">{subtitle}</p>}
                        {description && <p className="mt-6 text-lg text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">{description}</p>}
                    </motion.div>
                </div>

                {displayReviews.length > 0 ? (
                    <div className={cn(
                        "grid gap-8 auto-rows-fr",
                        layout === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"
                    )}>
                        {displayReviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
                            >
                                <Card className="h-full border-primary/10 bg-white/30 dark:bg-black/20 backdrop-blur-xl shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 group overflow-hidden flex flex-col">
                                    <CardContent className="p-10 relative flex-1 flex flex-col">
                                        <Quote className="absolute top-6 right-8 w-16 h-16 text-primary/5 group-hover:text-primary/10 group-hover:scale-110 transition-all duration-700 ease-out" />
                                        
                                        <div className="flex items-center gap-5 mb-8">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center border border-white/20 shadow-inner group-hover:rotate-3 transition-transform duration-500">
                                                <span className="font-display text-primary text-2xl drop-shadow-sm">
                                                    {review.user.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{review.user}</h4>
                                                <p className="text-xs text-muted-foreground font-mono font-medium tracking-tight opacity-70 italic">{review.date}</p>
                                            </div>
                                        </div>

                                        {showRatings && (
                                            <div className="flex flex-wrap gap-6 mb-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-primary/70">Vibe</span>
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={cn("w-3.5 h-3.5 transition-all duration-300", i < review.vibe ? "text-primary fill-primary scale-110" : "text-primary/20")} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-accent/70">Safety</span>
                                                    <div className="flex gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={cn("w-3.5 h-3.5 transition-all duration-300", i < review.safety ? "text-accent fill-accent scale-110" : "text-accent/20")} />
                                                        ))}
                                                    </div>
                                                </div>
                                                {review.sustainability !== undefined && (
                                                    <div className="flex flex-col gap-1.5">
                                                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#2ecc71]/70">Sustainability</span>
                                                        <div className="flex gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={cn("w-3.5 h-3.5 transition-all duration-300", i < review.sustainability! ? "text-[#2ecc71] fill-[#2ecc71] scale-110" : "text-[#2ecc71]/20")} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="relative flex-1">
                                            <p className="text-lg text-foreground/80 leading-relaxed italic font-serif">
                                                "{review.body}"
                                            </p>
                                        </div>
                                        
                                        <div className="mt-8 pt-6 border-t border-primary/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Verified Guest</span>
                                            <Badge variant="secondary" className="text-[10px] h-5 bg-primary/5 text-primary hover:bg-primary/10">Slow Travel</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/10 rounded-[40px] border border-dashed border-primary/20 backdrop-blur-sm">
                        <p className="text-muted-foreground font-medium italic">No reviews found yet. Be the first to share your journey!</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CommunityReviewBlock;
