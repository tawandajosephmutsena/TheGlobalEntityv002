import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Clock, User as UserIcon, ArrowUpRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

interface BaseCollectionItem {
    id: number;
    title: string;
    slug: string;
    featured_image?: string | null;
    description?: string | null;
    excerpt?: string | null;
    content?: string | null;
}

interface PortfolioItem extends BaseCollectionItem {
    category?: string | null;
    client?: string | null;
    technologies?: string[] | null;
}

interface Insight extends BaseCollectionItem {
    category?: { name: string; slug: string } | string | null;
    author?: { name: string; avatar?: string | null };
    published_at: string | null;
    reading_time?: number | null;
}

interface CreativeGridBlockProps {
    title?: string;
    subtitle?: string;
    feedSource?: 'manual' | 'services' | 'portfolio' | 'insights';
    maxItems?: number;
    sourceCategory?: string;
    items?: {
        category: string;
        title: string;
        image: string;
        description?: string;
        link?: string;
    }[];
    // Collection data passed from BlockRenderer
    services?: BaseCollectionItem[];
    portfolio?: PortfolioItem[];
    insights?: Insight[];
}

const CreativeGridBlock: React.FC<CreativeGridBlockProps> = ({
    title,
    subtitle,
    feedSource = 'insights',
    maxItems = 6,
    sourceCategory = 'all',
    items = [],
    services = [],
    portfolio = [],
    insights = []
}) => {
    // Determine which items to show
    let displayItems: {
        id: string | number;
        category: string;
        title: string;
        image: string;
        description: string;
        link: string;
        author?: string;
        readingTime?: number;
    }[] = [];

    if (feedSource === 'manual') {
        displayItems = items.map((item, idx) => ({
            id: `manual-${idx}`,
            category: item.category,
            title: item.title,
            image: item.image,
            description: item.description || '',
            link: item.link || '#'
        }));
    } else {
        let sourceData: (BaseCollectionItem | PortfolioItem | Insight)[] = [];
        if (feedSource === 'services') sourceData = services;
        else if (feedSource === 'portfolio') sourceData = portfolio;
        else if (feedSource === 'insights') sourceData = insights;

        displayItems = sourceData.map((item) => {
            let category = 'Service';
            let author = 'Anonymous';
            let readingTime = 5;

            if (feedSource === 'insights') {
                const insight = item as Insight;
                category = (insight.category && typeof insight.category === 'object') ? insight.category.name : (typeof insight.category === 'string' ? insight.category : 'Insight');
                author = insight.author?.name || 'Anonymous';
                readingTime = insight.reading_time || 5;
            } else if (feedSource === 'portfolio') {
                category = (item as PortfolioItem).category || 'Project';
            }

            return {
                id: item.id,
                category,
                title: item.title,
                image: item.featured_image || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=3556&auto=format&fit=crop',
                description: item.description || item.excerpt || (item as BaseCollectionItem).content || '',
                link: `/${feedSource === 'insights' ? 'blog' : feedSource}/${item.slug}`,
                author,
                readingTime
            };
        });

        // Filter by category if specified
        if (sourceCategory && sourceCategory !== 'all') {
            displayItems = displayItems.filter(item => 
                item.category.toLowerCase().includes(sourceCategory.toLowerCase())
            );
        }

        // Limit items
        displayItems = displayItems.slice(0, maxItems);
    }

    if (displayItems.length === 0) {
        return (
            <div className="w-full py-20 bg-background text-center border-dashed border-2 rounded-xl my-4">
                <p className="text-muted-foreground">Creative Grid: No items found for the current configuration ({feedSource}).</p>
            </div>
        );
    }

    return (
        <section className="bg-agency-secondary dark:bg-[#0a0a0a] py-40 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {(title || subtitle) && (
                    <div className="mb-24 text-center">
                        {subtitle && (
                            <span className="lowercase text-agency-accent font-black [font-variant-caps:small-caps] tracking-tighter text-xs mb-8 block">
                                {subtitle}
                            </span>
                        )}
                        {title && (
                            <h2 className="lowercase text-6xl md:text-8xl font-black [font-variant-caps:small-caps] tracking-tighter leading-[0.85] text-agency-primary dark:text-white">
                                {title.split(' ')[0]} <br/>
                                <span className="opacity-30 italic">{title.split(' ').slice(1).join(' ')}</span>
                            </h2>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-24">
                    {displayItems.map((item, i) => (
                        <AnimatedSection 
                            key={item.id} 
                            animation="slide-up" 
                            delay={i * 100}
                            className={cn(
                                'group flex flex-col h-full transform transition-all duration-500 hover:-translate-y-2',
                                i % 3 === 0 ? 'lg:col-span-8' : 'lg:col-span-4',
                                i % 2 !== 0 ? 'lg:translate-y-24' : ''
                            )}
                        >
                            <Link href={item.link} className="block relative h-full flex flex-col">
                                <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden mb-8 shadow-2xl bg-agency-primary/5 dark:bg-white/5">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
                                    />
                                    <div className="absolute top-6 left-6 z-10">
                                        <span className="lowercase px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black [font-variant-caps:small-caps] tracking-tighter shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-2 group-hover:translate-y-0">
                                            {item.category}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                                        <div className="size-16 rounded-full bg-white dark:bg-agency-accent flex items-center justify-center text-agency-primary shadow-xl">
                                            <ArrowUpRight className="size-6 transform group-hover:rotate-45 transition-transform duration-500" />
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </div>

                                <div className="px-2 flex-grow">
                                    <div className="lowercase flex items-center gap-6 mb-6 opacity-40 text-[10px] font-black [font-variant-caps:small-caps] tracking-tighter group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="size-3" /> {item.author || 'Anonymous'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="size-3" /> {item.readingTime || 5} min read
                                        </div>
                                    </div>
                                    <h2 className={cn(
                                        'lowercase font-black [font-variant-caps:small-caps] tracking-tighter text-agency-primary dark:text-white mb-6 group-hover:text-agency-accent transition-colors duration-500',
                                        i % 3 === 0 ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'
                                    )}>
                                        {item.title}
                                    </h2>
                                    <p className="text-lg text-agency-primary/60 dark:text-white/60 leading-relaxed max-w-2xl font-light line-clamp-3 group-hover:text-agency-primary/80 dark:group-hover:text-white/80 transition-colors duration-500">
                                        {item.description}
                                    </p>
                                </div>
                            </Link>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CreativeGridBlock;
