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
        <section className="py-32 bg-background text-foreground overflow-hidden">
            <div className="container mx-auto px-4">
                <AnimatedSection animation="fade-up" className="text-center mb-20">
                    <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter text-on-surface mb-4 leading-none">
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
                                    "h-full rounded-[2.5rem] p-10 md:p-14 transition-all duration-700 overflow-hidden group border-none flex flex-col justify-between",
                                    index === 3 
                                        ? "bg-primary text-on-primary" 
                                        : "bg-surface-container hover:bg-surface-container-high transition-colors"
                                )}>
                                    {/* Abstract background pattern for cards */}
                                    <div className={cn(
                                        "absolute top-0 right-0 w-80 h-80 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000 pointer-events-none opacity-20",
                                        index === 3 ? "bg-on-primary" : "bg-primary/10"
                                    )} />

                                    <div className="relative z-10">
                                        <div className={cn(
                                            "w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-sea-mist",
                                            index === 3 
                                                ? "bg-secondary text-on-secondary" 
                                                : "bg-surface text-secondary shadow-inner"
                                        )}>
                                            <Icon size={40} strokeWidth={1} />
                                        </div>
                                        <h3 className="font-display text-4xl font-black uppercase tracking-tighter mb-6 leading-tight">
                                            {card.title}
                                        </h3>
                                        <p className={cn(
                                            "text-xl leading-relaxed max-w-xl",
                                            index === 3 ? "text-on-primary/80" : "text-on-surface-variant"
                                        )}>
                                            {card.description}
                                        </p>
                                    </div>

                                    <div className="mt-14 relative z-10">
                                        <a 
                                            href={card.link} 
                                            className={cn(
                                                "inline-flex items-center gap-3 font-black uppercase tracking-[0.2em] text-xs group/link py-2",
                                                index === 3 ? "text-on-primary" : "text-primary"
                                            )}
                                        >
                                            <span className="relative">
                                                Collaborate
                                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-current transform scale-x-0 transition-transform duration-500 origin-left group-hover/link:scale-x-100" />
                                            </span>
                                            <ArrowRight size={20} className="transition-transform duration-500 group-hover/link:translate-x-3" />
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
