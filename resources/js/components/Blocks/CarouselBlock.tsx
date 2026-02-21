import React from 'react';
import { Carousel } from '@/components/ui/carousel';

interface BaseCollectionItem {
    id: number;
    title: string;
    slug: string;
    featured_image?: string | null;
    description?: string | null;
    excerpt?: string | null;
    content?: string | null;
}

interface CarouselBlockProps {
    title?: string;
    feedSource?: 'manual' | 'services' | 'portfolio' | 'insights';
    maxItems?: number;
    slides?: Array<{
        title: string;
        button: string;
        src: string;
        link?: string;
    }>;
    // Collection data passed from BlockRenderer
    services?: BaseCollectionItem[];
    portfolio?: BaseCollectionItem[];
    insights?: BaseCollectionItem[];
}

export default function CarouselBlock({ 
    feedSource = 'manual', 
    maxItems = 6, 
    slides = [],
    services = [],
    portfolio = [],
    insights = []
}: CarouselBlockProps) {
    // Determine which items to show
    let displaySlides = [...slides];

    if (feedSource !== 'manual') {
        let sourceData: BaseCollectionItem[] = [];
        if (feedSource === 'services') sourceData = services;
        else if (feedSource === 'portfolio') sourceData = portfolio;
        else if (feedSource === 'insights') sourceData = insights;

        displaySlides = sourceData.map((item) => ({
            title: item.title,
            button: "View Details",
            src: item.featured_image || 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop&q=75',
            link: `/${feedSource === 'insights' ? 'blog' : feedSource}/${item.slug}`
        }));

        // Limit items
        displaySlides = displaySlides.slice(0, maxItems);
    }

    if (displaySlides.length === 0) return null;

    return (
        <section className="bg-transparent pb-20">
            <Carousel slides={displaySlides} />
        </section>
    );
}
