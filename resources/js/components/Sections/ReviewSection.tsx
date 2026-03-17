import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { ReviewForm } from './ReviewForm';

interface Review {
    id: number;
    user: {
        name: string;
        avatar: string;
    };
    body: string;
    vibe_rating: number;
    safety_rating: number;
    sustainability_rating: number;
    date: string;
}

interface ReviewSectionProps {
    reviews: Review[];
    festivalId: number;
}

const StarRating = ({ rating }: { rating: number }) => {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={14}
                    className={star <= rating ? "fill-primary text-primary" : "text-muted-foreground/30"}
                />
            ))}
        </div>
    );
};

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, festivalId }) => {
    const [showForm, setShowForm] = React.useState(false);

    return (
        <section className="py-24 border-t border-border/10 bg-black/20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div>
                        <h2 className="text-4xl font-display font-medium mb-4">Reviews</h2>
                        <p className="text-muted-foreground max-w-xl">
                            Hear from the community about their experiences at this festival.
                        </p>
                    </div>
                    
                    {!showForm && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowForm(true)}
                            className="px-8 py-4 bg-primary text-black font-medium rounded-full"
                        >
                            Write a Review
                        </motion.button>
                    )}
                </div>

                <AnimatePresence>
                    {showForm && (
                        <ReviewForm 
                            festivalId={festivalId} 
                            onSuccess={() => setShowForm(false)} 
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-3xl bg-secondary/10 border border-white/5 flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={review.user.avatar} 
                                        alt={review.user.name} 
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                                    />
                                    <div>
                                        <h4 className="font-medium text-lg leading-none mb-1">{review.user.name}</h4>
                                        <span className="text-xs text-muted-foreground">{review.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Vibe</span>
                                    <StarRating rating={review.vibe_rating} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Safety</span>
                                    <StarRating rating={review.safety_rating} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Earth</span>
                                    <StarRating rating={review.sustainability_rating} />
                                </div>
                            </div>

                            <p className="text-muted-foreground/80 leading-relaxed italic flex-grow">
                                "{review.body}"
                            </p>
                        </motion.div>
                    ))}

                    {reviews.length === 0 && (
                        <div className="col-span-full py-20 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
                            <p className="text-muted-foreground">No reviews yet. Be the first to share your magic!</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
