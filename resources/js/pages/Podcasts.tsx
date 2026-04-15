import React from 'react';
import { usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import { SeoHead } from '@/components/SeoHead';
import PodcastArchiveBlock from '@/components/Blocks/PodcastArchiveBlock';

interface Podcast {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    thumbnail_url: string | null;
    media_type: 'audio' | 'video';
    formatted_duration: string;
    play_count: number;
    category: { id: number; name: string; color: string } | null;
}

interface PodcastCategory {
    id: number;
    name: string;
    slug: string;
    color: string;
    podcasts_count: number;
}

interface Props {
    podcasts: {
        data: Podcast[];
        current_page: number;
        last_page: number;
        total: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    featured: Podcast[];
    categories: PodcastCategory[];
    filters: {
        search?: string;
        category?: string;
    };
}

export default function PodcastsIndex({ podcasts, featured, categories, filters }: Props) {
    const page = usePage<{ settings?: Record<string, string> }>();
    const siteName = page.props.settings?.site_name || 'Our';

    return (
        <MainLayout title={`Podcasts - ${siteName}`} className="bg-transparent">
            <SeoHead
                title="Podcasts"
                description="Explore our collection of episodes — from engaging conversations to insightful deep dives."
            />

            <PodcastArchiveBlock 
                podcasts={podcasts}
                featured={featured}
                categories={categories}
                filters={filters}
                content={{
                    title: "Signal Archive",
                    subtitle: "Immersive audio journeys through the forgotten trails and vibrant subcultures of the modern cartographer's world.",
                    discoveryLayout: 'list',
                    featuredLimit: 3
                }}
            />
        </MainLayout>
    );
}
