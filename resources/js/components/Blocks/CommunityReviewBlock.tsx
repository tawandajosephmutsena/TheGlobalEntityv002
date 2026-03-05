import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CommunityReviewBlock as CommunityReviewBlockType } from '@/types/page-blocks';

const CommunityReviewBlock: React.FC<CommunityReviewBlockType['content']> = ({
    title = "Community Voices",
    subtitle = "What fellow travelers are saying",
    description,
    showRatings = true,
    layout = 'grid',
    limit = 3
}) => {
    // Mock reviews for now - in production this would fetch from the backend
    const mockReviews = [
        {
            id: 1,
            user: "Aria Thorne",
            body: "The festival was absolutely magical! The sustainable practices were impressive and the vibe was pure fairy pirate.",
            vibe: 5,
            safety: 4,
            sustainability: 5,
            date: "2 days ago"
        },
        {
            id: 2,
            user: "Leo Captain",
            body: "Great experience overall. Loved the community feel and the focus on slow travel. Highly recommended.",
            vibe: 4,
            safety: 5,
            sustainability: 4,
            date: "1 week ago"
        },
        {
            id: 3,
            user: "Mira Moon",
            body: "A dreamy adventure that stays true to its values. The local engagement was heart-warming.",
            vibe: 5,
            safety: 5,
            sustainability: 5,
            date: "3 weeks ago"
        }
    ].slice(0, limit);

    return (
        <section className="py-24 relative overflow-hidden bg-background">
            {/* Dreamy watercolor background effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[oklch(0.52_0.20_334)] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[oklch(0.68_0.12_210)] rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Badge variant="outline" className="mb-4 font-mono uppercase tracking-wider text-primary border-primary/20 bg-primary/5">
                            Reviews
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-display mb-4 text-foreground">
                            {title}
                        </h2>
                        {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
                        {description && <p className="mt-4 text-muted-foreground">{description}</p>}
                    </motion.div>
                </div>

                <div className={cn(
                    "grid gap-8",
                    layout === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}>
                    {mockReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full border-primary/10 bg-white/40 backdrop-blur-md shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                                <CardContent className="p-8 relative">
                                    <Quote className="absolute top-4 right-8 w-12 h-12 text-primary/5 -mt-2 -mr-2 group-hover:scale-110 transition-transform duration-500" />
                                    
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
                                            <span className="font-display text-primary text-xl">
                                                {review.user.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground">{review.user}</h4>
                                            <p className="text-xs text-muted-foreground font-mono">{review.date}</p>
                                        </div>
                                    </div>

                                    {showRatings && (
                                        <div className="flex flex-wrap gap-4 mb-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Vibe</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={cn("w-3 h-3", i < review.vibe ? "text-primary fill-primary" : "text-muted")} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] uppercase font-bold text-muted-foreground">Safety</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={cn("w-3 h-3", i < review.safety ? "text-secondary fill-secondary" : "text-muted")} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <p className="text-foreground/80 leading-relaxed italic">
                                        "{review.body}"
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Simple helper function for class merging if cn is not imported correctly, though OttoStart uses it
function cn(...inputs: (string | boolean | undefined | null)[]) {
    return inputs.filter(Boolean).join(" ");
}

export default CommunityReviewBlock;
