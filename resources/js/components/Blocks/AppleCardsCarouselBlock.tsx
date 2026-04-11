import React from 'react';
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';
import DOMPurify from 'dompurify';

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
}

interface Insight extends BaseCollectionItem {
    category?: { name: string; slug: string } | string | null;
    author?: { name: string; avatar?: string | null };
    published_at: string | null;
}

interface AppleCardsCarouselBlockProps {
    title?: string;
    feedSource?: 'manual' | 'services' | 'portfolio' | 'insights';
    maxItems?: number;
    sourceCategory?: string;
    items?: {
        category: string;
        title: string;
        subtitle?: string;
        description?: string;
        categoryIcon?: string;
        image: string;
        content?: string;
        link?: string;
    }[];
    // Collection data passed from BlockRenderer
    services?: BaseCollectionItem[];
    portfolio?: PortfolioItem[];
    insights?: Insight[];
}

const AppleCardsCarouselBlock: React.FC<AppleCardsCarouselBlockProps> = ({
    title,
    feedSource = 'manual',
    maxItems = 6,
    sourceCategory = 'all',
    items = [],
    services = [],
    portfolio = [],
    insights = []
}) => {
    // Determine which items to show
    let displayItems = [...items].map(item => ({
        ...item,
        subtitle: item.subtitle || '',
        description: item.description || '',
        categoryIcon: item.categoryIcon || 'Layout'
    }));

    if (feedSource !== 'manual') {
        let sourceData: (BaseCollectionItem | PortfolioItem | Insight)[] = [];
        if (feedSource === 'services') sourceData = services;
        else if (feedSource === 'portfolio') sourceData = portfolio;
        else if (feedSource === 'insights') sourceData = insights;

        displayItems = sourceData.map((item) => {
            let category = 'Service';
            let categoryIcon = 'Layout';
            
            if (feedSource === 'insights') {
                const insight = item as Insight;
                category = (insight.category && typeof insight.category === 'object') ? insight.category.name : (typeof insight.category === 'string' ? insight.category : 'Insight');
                categoryIcon = 'BookOpen';
            } else if (feedSource === 'portfolio') {
                category = (item as PortfolioItem).category || 'Project';
                categoryIcon = 'Briefcase';
            } else if (feedSource === 'services') {
                categoryIcon = 'Cog';
            }

            return {
                category,
                categoryIcon,
                title: item.title,
                subtitle: '', // Not available directly in shared schema easily
                description: item.excerpt || '',
                image: item.featured_image || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop&q=75',
                content: item.description || item.excerpt || item.content || '',
                link: `/${feedSource === 'insights' ? 'blog' : feedSource}/${item.slug}`
            };
        });

        // Filter by category if specified (Initial source filtering)
        if (sourceCategory && sourceCategory !== 'all') {
            displayItems = displayItems.filter(item => 
                item.category.toLowerCase().includes(sourceCategory.toLowerCase())
            );
        }

        // Limit items
        displayItems = displayItems.slice(0, maxItems);
    }

    const cardsData = displayItems.map((card) => ({
        src: card.image,
        title: card.title,
        subtitle: card.subtitle,
        description: card.description,
        category: card.category,
        categoryIcon: card.categoryIcon,
        link: card.link,
        content: <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card.content || '') }} className="prose dark:prose-invert max-w-none text-base md:text-xl font-sans" />
    }));

    const cards = cardsData.map((card, index) => (
        <Card 
            key={`${card.src}-${index}`} 
            card={card} 
            index={index} 
            layout={true} 
        />
    ));

    if (displayItems.length === 0) {
        return (
            <div className="w-full py-10 liquid-glass text-center border-dashed border-2 rounded-xl my-4">
                <p className="text-muted-foreground">Apple Cards Carousel: No items found for the current configuration ({feedSource}).</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full py-10 overflow-visible relative">
             <div className="relative z-10">
                 {title && (
                     <h2 className="max-w-7xl pl-4 mx-auto text-3xl md:text-5xl font-black tracking-tighter text-foreground font-sans mb-4 [font-variant-caps:small-caps]">
                        {title}
                     </h2>
                 )}
                 <Carousel items={cards} cardsData={cardsData} />
             </div>
        </div>
    );
};

export default AppleCardsCarouselBlock;

