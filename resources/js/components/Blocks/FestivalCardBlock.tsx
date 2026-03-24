import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Sparkles, User, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import type { FestivalCardBlock as FestivalCardBlockType } from '@/types/page-blocks';

interface FestivalData {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    date: string;
    locationAddress: string;
    url: string;
    host?: string;
    tags?: string[];
    activities?: string[];
}

const FestivalCardBlock: React.FC<FestivalCardBlockType['content']> = ({
    festivalId,
    variant = 'dreamy',
    showActivities = true,
    showTags = true,
    ctaText = "Join the Magic"
}) => {
    const [festival, setFestival] = useState<FestivalData | null>(null);
    const [loading, setLoading] = useState(!!festivalId);

    useEffect(() => {
        if (!festivalId) return;

        const fetchFestival = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/collections/festivals/${festivalId}`);
                setFestival(response.data.data);
            } catch (error) {
                console.error("Failed to fetch festival for card", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFestival();
    }, [festivalId]);

    // Fallback if no festival selected or not found
    if (!festivalId || (!festival && !loading)) {
        return (
            <div className="py-12 flex justify-center">
                <div className="p-8 rounded-3xl border border-dashed text-muted-foreground text-center max-w-md w-full">
                    <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p className="text-sm italic">No festival selected. Link a festival in the editor.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <div className="p-8 rounded-3xl border border-dashed flex items-center justify-center max-w-xl w-full aspect-[16/10] bg-muted animate-pulse">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (!festival) return null;

    // Normalize data (backend might have different field names)
    const activeFestival = {
        name: festival.title,
        location: festival.locationAddress,
        date: festival.date,
        url: festival.url,
        host: festival.host || "Wildroots Collective",
        tags: festival.tags || ["SUSTAINABLE", "VEGAN", "WILDLIFE"],
        activities: festival.activities || ["Dawn Yoga", "Permaculture 101", "Acoustic Nights"],
        image: festival.image
    };

    if (variant === 'compact') {
        return (
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 group hover:border-primary/30 transition-all duration-500">
                <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                        <img src={activeFestival.image} alt={activeFestival.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-display font-medium mb-1 group-hover:text-primary transition-colors">{activeFestival.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <MapPin className="w-3 h-3" />
                            {activeFestival.location}
                        </div>
                        <Badge variant="outline" className="text-[10px] font-mono text-primary border-primary/20">{activeFestival.date}</Badge>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-12 flex justify-center">
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={cn(
                    "relative max-w-xl w-full rounded-[2rem] overflow-hidden group shadow-2xl",
                    variant === 'dreamy' ? "bg-slate-950 text-white" : "bg-white text-black border shadow-lg"
                )}
            >
                {/* Hero Image Section */}
                <div className="aspect-[16/10] relative overflow-hidden">
                    <img 
                        src={activeFestival.image} 
                        alt={activeFestival.name} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-6 left-6">
                        <Badge className="bg-primary/90 text-white backdrop-blur-md border-none px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                            Upcoming
                        </Badge>
                    </div>

                    <div className="absolute bottom-6 left-8 right-8">
                        <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-2">
                            {activeFestival.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 items-center text-sm font-medium opacity-90">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                {activeFestival.date}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-accent" />
                                {activeFestival.location}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-10 space-y-8">
                    {/* Host Info */}
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-0.5">Hosted by</p>
                            <p className="text-sm font-bold">{activeFestival.host}</p>
                        </div>
                        <Sparkles className="w-4 h-4 text-primary ml-auto animate-pulse" />
                    </div>

                    {showTags && (
                        <div className="flex flex-wrap gap-2">
                            {activeFestival.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-[10px] font-mono tracking-widest border-white/10 bg-white/5 px-3 py-1">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {showActivities && (
                        <div className="space-y-4">
                            <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <span className="w-8 h-px bg-primary/30" />
                                What to expect
                            </h5>
                            <div className="grid grid-cols-2 gap-3">
                                {activeFestival.activities.map(activity => (
                                    <div key={activity} className="flex items-center gap-3 text-sm group/item">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span className="group-hover/item:text-primary transition-colors">{activity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex items-center gap-4">
                        <Button className="flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-primary/20" asChild>
                            <Link href={activeFestival.url}>
                                <Ticket className="w-5 h-5 mr-3" />
                                {ctaText}
                            </Link>
                        </Button>
                        <Button variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-white/10 hover:bg-white/5">
                            <Sparkles className="w-5 h-5 text-accent" />
                        </Button>
                    </div>
                </div>

                {/* Aesthetic background glow */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none opacity-50" />
            </motion.div>
        </section>
    );
};

export default FestivalCardBlock;
