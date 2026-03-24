import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import AnimatedSection from '@/components/AnimatedSection';
import { ArrowUpRight, Search, Play, Zap, Mail, ArrowRight } from 'lucide-react';
import axios from 'axios';

interface BentoItem {
    id: string;
    type: 'festival' | 'stat' | 'feature' | 'signup';
    festivalId?: number;
    title: string;
    subtitle?: string;
    image?: string;
    location?: string;
    rating?: string;
    tags?: string[];
    size: 'sm' | 'md' | 'lg' | 'wide' | 'tall';
    link?: string;
}

interface FestivalData {
    id: number;
    title: string;
    description: string;
    category: string;
    image: string;
    date: string;
    locationAddress: string;
    url: string;
    rating?: string;
    social_tags: string[];
}

interface FestivalBentoGridProps {
    title?: string;
    subtitle?: string;
    useDynamicFestivals?: boolean;
    dynamicLimit?: number;
    items?: BentoItem[];
}

const sizeClasses: Record<string, string> = {
    sm: 'col-span-1 row-span-1',
    md: 'md:col-span-1 md:row-span-1',
    lg: 'md:col-span-2 md:row-span-2',
    wide: 'md:col-span-2 md:row-span-1',
    tall: 'md:col-span-1 md:row-span-2',
};

const FestivalBentoGrid: React.FC<FestivalBentoGridProps> = ({
    title = "The Ethereal Collection",
    subtitle = "EXPLORE THE ARCHIVE",
    useDynamicFestivals = false,
    dynamicLimit = 3,
    items: manualItems = [
        {
            id: '1',
            type: 'festival',
            title: 'GLASTONBURY // WOODLANDS',
            location: 'PILTON, UK',
            rating: '4.9',
            tags: ['FAIRY', 'FOLK'],
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop',
            size: 'lg',
            link: '#'
        },
        {
            id: '2',
            type: 'stat',
            title: '42',
            subtitle: 'ARCHIVED FESTIVALS',
            size: 'md'
        },
        {
            id: '3',
            type: 'festival',
            title: 'BURNING MAN // DUST',
            location: 'NEVADA, USA',
            rating: '4.8',
            tags: ['NOMADIC'],
            image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop',
            size: 'tall',
            link: '#'
        },
        {
            id: '4',
            type: 'feature',
            title: 'AUTHENTIC REVELRY',
            subtitle: 'Verified by the Cartographer Council',
            size: 'md'
        },
        {
            id: '5',
            type: 'signup',
            title: 'JOIN THE NOMAD LIST',
            subtitle: 'Get notified of new map drops.',
            size: 'wide'
        }
    ]
}) => {
    const [dynamicFestivals, setDynamicFestivals] = useState<FestivalData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (useDynamicFestivals) {
            const fetchFestivals = async () => {
                try {
                    setIsLoading(true);
                    const response = await axios.get(`/api/collections/festivals?limit=${dynamicLimit}`);
                    setDynamicFestivals(response.data.data || []);
                } catch (error) {
                    console.error("Failed to fetch dynamic festivals", error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchFestivals();
        }
    }, [useDynamicFestivals, dynamicLimit]);

    // Merge logic: Replace 'festival' type manual items with dynamic ones if enabled
    const items = React.useMemo(() => {
        if (!useDynamicFestivals || dynamicFestivals.length === 0) return manualItems;

        let dynamicIndex = 0;
        return manualItems.map(item => {
            // Only replace 'festival' type manual items that don't have a specific festivalId assigned
            if (item.type === 'festival' && !item.festivalId && dynamicIndex < dynamicFestivals.length) {
                const festival = dynamicFestivals[dynamicIndex++];
                return {
                    ...item,
                    title: festival.title.toUpperCase(),
                    location: festival.locationAddress.toUpperCase(),
                    image: festival.image,
                    link: festival.url,
                    rating: festival.rating || '4.5',
                    tags: festival.social_tags?.slice(0, 2) || []
                };
            }
            return item;
        });
    }, [manualItems, dynamicFestivals, useDynamicFestivals]);
    return (
        <section className="py-32 bg-agency-surface">
            <div className="container mx-auto px-6">
                <AnimatedSection animation="fade-up" className="mb-20">
                    <div className="flex flex-col items-center text-center">
                        <span className="text-[10px] font-mono tracking-[0.5em] text-agency-accent mb-4 uppercase">{subtitle}</span>
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-agency-primary leading-none">
                            {title}
                        </h2>
                    </div>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[300px] gap-6">
                    {items.map((item, index) => (
                        <AnimatedSection 
                            key={item.id} 
                            animation="fade-up" 
                            delay={index * 100}
                            className={cn("relative group", sizeClasses[item.size])}
                        >
                            <div className={cn(
                                "h-full w-full relative overflow-hidden transition-all duration-700",
                                "border border-agency-primary/10 bg-agency-primary/[0.02] backdrop-blur-md",
                                "group-hover:border-agency-accent/30 group-hover:shadow-[0_0_50px_rgba(var(--agency-accent-rgb),0.1)]",
                                isLoading && item.type === 'festival' && "animate-pulse"
                            )}>
                                {item.type === 'festival' && (
                                    <>
                                        <div className="absolute inset-0 z-0">
                                            <img 
                                                src={item.image} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-agency-surface via-transparent to-transparent opacity-80" />
                                        </div>
                                        <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end h-full">
                                            <div className="flex items-center gap-2 mb-4">
                                                {item.tags?.map(tag => (
                                                    <span key={tag} className="px-3 py-1 bg-agency-accent text-agency-surface text-[8px] font-black tracking-widest uppercase">
                                                        {tag}
                                                    </span>
                                                ))}
                                                <a
                                                    href="#"
                                                    className="group/btn inline-flex items-center gap-2 text-sm font-medium text-agency-accent/80 hover:text-agency-accent transition-colors ml-auto"
                                                    title="View gallery"
                                                >
                                                    <Search size={10} fill="currentColor" />
                                                    <span className="text-[10px] font-mono">{item.rating}</span>
                                                </a>
                                            </div>
                                            <h3 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-agency-primary leading-none mb-2">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-agency-primary/40 font-mono text-[10px]">
                                                    <Play size={10} />
                                                    {item.location}
                                                </div>
                                                <a href={item.link} className="w-10 h-10 rounded-full border border-agency-primary/20 flex items-center justify-center text-agency-primary group-hover:bg-agency-primary group-hover:text-agency-surface transition-all duration-500" title={`Learn more about ${item.title}`}>
                                                    <ArrowUpRight size={16} />
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {item.type === 'stat' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-agency-accent/5">
                                        <span className="text-7xl md:text-9xl font-black text-agency-accent leading-none mb-4 italic">
                                            {item.title}
                                        </span>
                                        <span className="text-[10px] font-mono tracking-[0.4em] text-agency-primary/40 uppercase">
                                            {item.subtitle}
                                        </span>
                                        <div className="absolute top-6 right-6 opacity-20">
                                            <Zap size={24} className="text-agency-accent" />
                                        </div>
                                    </div>
                                )}

                                {item.type === 'feature' && (
                                    <div className="absolute inset-0 flex flex-col justify-between p-10 border-l-4 border-l-agency-accent">
                                        <div className="w-12 h-12 bg-agency-primary text-agency-surface rounded-none flex items-center justify-center">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black uppercase tracking-tighter text-agency-primary mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-agency-primary/40 font-mono leading-relaxed uppercase tracking-wider">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {item.type === 'signup' && (
                                    <div className="absolute inset-0 p-10 flex flex-col justify-center">
                                        <Mail className="text-agency-accent mb-6" size={32} />
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-agency-primary mb-4">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-agency-primary/60 mb-8 font-serif italic">
                                            {item.subtitle}
                                        </p>
                                        <div className="flex gap-2">
                                            <input 
                                                type="email" 
                                                placeholder="EMAIL ADDRESS"
                                                className="flex-1 bg-agency-primary/5 border border-agency-primary/10 px-4 py-4 text-[10px] font-mono tracking-widest outline-none focus:border-agency-accent/40"
                                            />
                                            <button 
                                                className="bg-agency-primary text-agency-surface p-4 hover:bg-agency-accent transition-colors duration-500"
                                                title="Subscribe to newsletter"
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FestivalBentoGrid;
