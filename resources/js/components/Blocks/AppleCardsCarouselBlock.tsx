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

interface CollectionItem extends BaseCollectionItem {
    category?: { name: string; slug: string; icon?: string } | string | null;
    published_at?: string | null;
    author?: { name: string; avatar?: string | null };
    client?: string | null;
    price_range?: string | null;
}

const AppleCardsCarouselBlock: React.FC<any> = ({
    title,
    subtitle,
    description,
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
        let sourceData: CollectionItem[] = [];
        if (feedSource === 'services') sourceData = services as CollectionItem[];
        else if (feedSource === 'portfolio') sourceData = portfolio as CollectionItem[];
        else if (feedSource === 'insights') sourceData = insights as CollectionItem[];

        displayItems = sourceData.map((item) => {
            let category = 'Lifestyle';
            let categorySlug = 'lifestyle';
            let categoryIcon = null;
            let subtitle = '';
            
            // Extract category and icon
            if (item.category && typeof item.category === 'object') {
                category = item.category.name || 'Lifestyle';
                categorySlug = item.category.slug || 'lifestyle';
                categoryIcon = item.category.icon || null;
            } else if (typeof item.category === 'string' && item.category) {
                category = item.category;
                categorySlug = item.category.toLowerCase().replace(/\s+/g, '-');
            }

            // Enhanced subtitles and category defaults based on feed source
            if (feedSource === 'insights') {
                subtitle = item.published_at ? new Date(item.published_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '';
            } else if (feedSource === 'portfolio') {
                subtitle = item.client || '';
            } else if (feedSource === 'services') {
                subtitle = item.price_range || '';
            }

            return {
                category,
                categorySlug,
                categoryIcon,
                title: item.title,
                subtitle: subtitle,
                description: item.excerpt || item.description || '',
                image: item.featured_image || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop',
                content: item.content || item.description || item.excerpt || '',
                link: `/${feedSource === 'insights' ? 'blog' : feedSource}/${item.slug}`
            };
        });

        // Filter by category if specified (Initial source filtering)
        if (sourceCategory && sourceCategory !== 'all') {
            displayItems = displayItems.filter(item => 
                item.category.toLowerCase().includes(sourceCategory.toLowerCase())
            );
        }

        // We move slicing to the UI component level so that the filters show all available categories
        // displayItems = displayItems.slice(0, maxItems);
    }

    const cardsData = displayItems.map((card) => ({
        src: card.image,
        title: card.title,
        subtitle: card.subtitle,
        description: card.description,
        category: card.category,
        categorySlug: card.categorySlug,
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
                 <Carousel 
                    items={cards} 
                    cardsData={cardsData} 
                    title={title}
                    subtitle={subtitle}
                    description={description}
                    limit={maxItems}
                 />
             </div>
        </div>
    );
};

export default AppleCardsCarouselBlock;

