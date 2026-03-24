import React from 'react';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Star, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ReviewFormProps {
    festivalId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const RatingSelector = ({ 
    label, 
    value, 
    onChange 
}: { 
    label: string, 
    value: number, 
    onChange: (val: number) => void 
}) => {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                        key={star}
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onChange(star)}
                        className="p-1"
                    >
                        <Star
                            size={24}
                            className={star <= value ? "fill-primary text-primary" : "text-muted-foreground/20"}
                        />
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

declare function route(name: string, params?: Record<string, unknown> | number | string): string;

export const ReviewForm: React.FC<ReviewFormProps> = ({ festivalId, onSuccess, onCancel }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        body: '',
        vibe_rating: 5,
        safety_rating: 5,
        sustainability_rating: 5,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('festivals.reviews.store', festivalId), {
            onSuccess: () => {
                reset();
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
        >
            <form onSubmit={handleSubmit} className="p-8 rounded-[32px] bg-secondary/10 border border-primary/20 space-y-8 mb-12 relative">
                <button 
                    type="button" 
                    onClick={onCancel}
                    title="Cancel Review"
                    aria-label="Cancel Review"
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-muted-foreground transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <RatingSelector 
                        label="Vibe" 
                        value={data.vibe_rating} 
                        onChange={(val) => setData('vibe_rating', val)} 
                    />
                    <RatingSelector 
                        label="Safety" 
                        value={data.safety_rating} 
                        onChange={(val) => setData('safety_rating', val)} 
                    />
                    <RatingSelector 
                        label="Earth" 
                        value={data.sustainability_rating} 
                        onChange={(val) => setData('sustainability_rating', val)} 
                    />
                </div>

                <div className="space-y-3">
                    <Label htmlFor="body" className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Experience</Label>
                    <Textarea
                        id="body"
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder="Tell the community about your journey..."
                        className="min-h-[150px] rounded-2xl bg-black/20 border-white/10 focus:border-primary/50 transition-colors text-lg"
                    />
                    {errors.body && <p className="text-sm text-red-500">{errors.body}</p>}
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-6 rounded-2xl bg-primary text-black hover:bg-primary/90 font-bold text-lg flex items-center gap-3"
                    >
                        {processing ? 'Sharing...' : 'Share the Magic'}
                        <Send size={20} />
                    </Button>
                </div>
            </form>
        </motion.div>
    );
};
