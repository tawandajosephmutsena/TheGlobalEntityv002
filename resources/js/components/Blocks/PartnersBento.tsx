import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { Map, Store, PartyPopper, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartnersBentoProps {
    title?: string;
    subtitle?: string;
    cards?: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
        link?: string;
    }>;
}

const iconMap: Record<string, React.ElementType> = {
    map: Map,
    storefront: Store,
    festival: PartyPopper,
    shield: ShieldCheck,
};

const PartnersBento: React.FC<PartnersBentoProps> = ({
    title = "For the Ethereal Cartographers",
    cards = [
        {
            id: '1',
            title: 'Tourism Boards',
            description: 'Put your region on the map through authentic storytelling that goes beyond the brochure. We focus on slow travel and hidden gems that define your heritage.',
            icon: 'map',
            link: '#'
        },
        {
            id: '2',
            title: 'Local Artisans',
            description: 'From boutique stays to local craft workshops, we connect you with travelers seeking the real heart of a place.',
            icon: 'storefront',
            link: '#'
        },
        {
            id: '3',
            title: 'Festivals & Events',
            description: 'Turn transient visitors into lifelong advocates. We map the energy of your events into digital narratives.',
            icon: 'festival',
            link: '#'
        },
        {
            id: '4',
            title: 'The Authenticity Ledger',
            description: 'Every partnership must adhere to our \'Pirate Code\'—a commitment to zero-waste travel, fair-wage experiences, and cultural preservation.',
            icon: 'shield',
            link: '#'
        }
    ]
}) => {
    return (
        <section className="relative py-32 overflow-visible">
            
            <div className="container mx-auto px-4 relative z-10">
                <AnimatedSection animation="fade-up" className="text-center mb-20">
                    <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter text-on-surface mb-4 leading-none">
                        {title.split(' ').map((word, i) => (
                            <span key={i} className={cn(i === 2 ? "text-primary italic font-serif font-light" : "")}>
                                {word}{' '}
                            </span>
                        ))}
                    </h2>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {cards.map((card, index) => {
                        const Icon = iconMap[card.icon] || Map;
                        const isLarge = index === 0 || index === 3;
                        
                        return (
                            <AnimatedSection 
                                key={card.id} 
                                animation="fade-up" 
                                delay={index * 150}
                                className={cn(
                                    "relative h-full",
                                    isLarge ? "md:col-span-2" : "md:col-span-1"
                                )}
                            >
                                <div className={cn(
                                    "h-full rounded-[3rem] p-10 md:p-14 transition-all duration-700 overflow-hidden group border-none flex flex-col justify-between shadow-sea-mist hover:shadow-2xl liquid-glass",
                                    index === 0 ? "border-secondary/20" : index === 3 ? "border-tertiary/20" : "border-primary/10"
                                )}>
                                    {/* Abstract background pattern for cards */}
                                    <div className={cn(
                                        "absolute top-0 right-0 w-80 h-80 rounded-full -mr-32 -mt-32 group-hover:scale-125 transition-transform duration-1000 pointer-events-none opacity-20",
                                        index === 0 ? "bg-primary" : index === 3 ? "bg-on-primary" : index === 1 ? "bg-secondary" : "bg-primary/10"
                                    )} />

                                    <div className="relative z-10">
                                        <div className={cn(
                                            "w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-sea-mist",
                                            index === 0
                                                ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                                                : index === 3 
                                                ? "bg-secondary text-on-secondary" 
                                                : index === 1
                                                ? "bg-secondary text-on-secondary"
                                                : "liquid-glass text-secondary shadow-inner"
                                        )}>
                                            <Icon size={40} strokeWidth={1} />
                                        </div>
                                        <h3 className="font-display text-4xl font-black tracking-tighter mb-6 leading-tight">
                                            {card.title}
                                        </h3>
                                        <p className="text-xl leading-relaxed max-w-xl font-medium italic text-on-surface-variant">
                                            {card.description}
                                        </p>
                                    </div>

                                    <div className="mt-14 relative z-10">
                                        <a 
                                            href={card.link} 
                                            className={cn(
                                                "inline-flex items-center gap-4 px-8 py-3 rounded-full font-black tracking-tighter text-[10px] group/link transition-all",
                                                index === 0
                                                    ? "bg-primary text-on-primary hover:bg-white hover:text-secondary"
                                                    : index === 3 
                                                    ? "bg-on-primary text-primary hover:bg-secondary hover:text-on-secondary" 
                                                    : index === 1
                                                    ? "bg-secondary text-on-secondary hover:bg-primary hover:text-on-primary"
                                                    : "bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary"
                                            )}
                                        >
                                            Collaborate
                                            <ArrowRight size={18} className="transition-transform duration-500 group-hover/link:translate-x-2" />
                                        </a>
                                    </div>
                                </div>
                            </AnimatedSection>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default PartnersBento;
