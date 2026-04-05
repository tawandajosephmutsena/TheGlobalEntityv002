import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { PageBlock } from './page-blocks';

export type { PageBlock } from './page-blocks';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    site?: {
        name?: string;
        description?: string;
        url?: string;
        logo?: string;
        tagline?: string;
        social?: {
            github?: string;
            twitter?: string;
            linkedin?: string;
            instagram?: string;
            facebook?: string;
            whatsapp?: string;
        };
        contact?: {
            address?: string;
            phone?: string;
            email?: string;
            hours?: string;
            hero_title?: string;
            hero_subtitle?: string;
            hero_description?: string;
            form_title?: string;
            google_maps_url?: string;
            show_map?: boolean;
        };
        footer?: {
            heading_line1?: string;
            heading_line2?: string;
            heading_line3?: string;
            resources_title?: string;
            resources_links?: string | Array<{ name: string; href: string }>;
            nav_title?: string;
            office_title?: string;
            back_to_top?: string;
            copyright_suffix?: string;
        };
        compliance?: {
            cookie_consent_enabled?: boolean;
            cookie_consent_message?: string;
            cookie_consent_accept_text?: string;
            cookie_consent_reject_text?: string;
            cookie_consent_style?: 'bottom-bar' | 'top-bar' | 'bottom-left' | 'bottom-right';
            analytics_enabled?: boolean;
            google_analytics_id?: string;
            google_tag_id?: string;
            privacy_policy_url?: string;
            terms_url?: string;
            cookie_policy_url?: string;
        };
    };
    breadcrumbs?: Array<{
        title: string;
        url?: string | null;
        active?: boolean;
    }>;
    breadcrumbStructuredData?: Record<string, unknown>;
    menus?: {
        main: Array<{
            name: string;
            href: string;
            target: string;
            children: Array<{
                name: string;
                href: string;
                target: string;
            }>;
        }>;
        logo?: {
            href: string;
            target: string;
        } | null;
    };
    ai?: {
        citationPreference: string;
        contentRating: string;
        llmsTxtUrl: string;
    };
    flash: {
        success: string | null;
        error: string | null;
        warning: string | null;
        info: string | null;
    };
    settings?: Record<string, SettingItem[]>;
    [key: string]: unknown;
}

export interface SettingItem {
    id?: number;
    key: string;
    value: string | string[] | boolean | null;
    type: 'text' | 'json' | 'boolean' | 'number' | 'color';
    group_name: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    is_super_admin?: boolean;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}
export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
export interface PortfolioItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: {
        overview?: string;
        challenge?: string;
        solution?: string;
        results?: string;
    } | null;
    featured_image: string | null;
    gallery: string[] | null;
    client: string | null;
    project_date: string | null;
    project_url: string | null;
    technologies: string[] | null;
    stats?: Array<{ value: string; label: string }>;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    category_id: number | null;
    created_at: string;
    updated_at: string;
    category?: Category;
}


export interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: Record<string, unknown> | null;
    icon: string | null;
    featured_image: string | null;
    price_range: string | null;
    is_featured: boolean;
    is_published: boolean;
    sort_order: number;
    category_id: number | null;
    created_at: string;
    updated_at: string;
    category?: Category;
}


export interface Insight {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: Record<string, unknown> | null;
    featured_image: string | null;
    author_id: number;
    category_id: number | null;
    tags: string[] | null;
    reading_time: number | null;
    is_featured: boolean;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
    author?: User;
    category?: Category;
    additionalCategories?: Category[];
    podcast?: Podcast | null;
    festival?: Festival | null;
}

export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful';

export interface Reaction {
    id: number;
    user_id: number;
    type: ReactionType;
    reactable_id: number;
    reactable_type: string;
    created_at: string;
    user?: User;
}

export interface Comment {
    id: number;
    user_id: number;
    insight_id: number;
    parent_id: number | null;
    body: string;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
    replies?: Comment[];
    reactions?: Reaction[];
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    type: 'insight' | 'service' | 'portfolio' | 'festival';
    icon?: string | null;
}

export interface Review {
    id: number;
    user_id: number;
    rating: number;
    comment: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
    user?: User;
}

export interface Activity {
    id: number;
    name: string;
    slug: string;
    description: string;
    category: string;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

export interface Festival {
    id: number;
    name: string;
    slug: string;
    location: {
        address?: string;
        lat?: number;
        lng?: number;
    } | string | null;
    start_date: string;
    end_date: string | null;
    social_tags: string[] | null;
    is_published: boolean;
    author_id: number | null;
    category_id: number | null;
    created_at: string;
    updated_at: string;
    author?: User;
    category?: Category;
    reviews?: Review[];
    activities?: Activity[];
}


export interface TeamMember {
    id: number;
    name: string;
    position: string;
    bio: string;
    avatar: string | null;
    email: string | null;
    social_links: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        website?: string;
    } | null;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}
export interface MediaAsset {
    id: number;
    filename: string;
    original_name: string;
    mime_type: string;
    size: number;
    path: string;
    url: string;
    alt_text: string | null;
    caption: string | null;
    folder: string;
    tags: string[] | null;
    is_image: boolean;
    is_video: boolean;
    created_at: string;
    updated_at: string;
}

export interface Page {
    id: number;
    title: string;
    slug: string;
    meta_title: string | null;
    meta_description: string | null;
    content: { blocks?: PageBlock[] } | null;
    template: 'default' | 'home' | 'contact';
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface PodcastCategory {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    color: string;
    icon: string | null;
    sort_order: number;
    is_active: boolean;
    podcasts_count?: number;
}

export interface Podcast {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    content: string | null;
    media_url: string;
    media_full_url: string;
    media_type: 'audio' | 'video';
    thumbnail: string | null;
    thumbnail_url: string | null;
    duration: number;
    formatted_duration: string;
    file_size: number;
    formatted_file_size: string;
    podcast_category_id: number | null;
    author_id: number | null;
    season_number: number | null;
    episode_number: number | null;
    tags: string[] | null;
    is_published: boolean;
    is_featured: boolean;
    published_at: string | null;
    play_count: number;
    share_count: number;
    created_at: string;
    updated_at: string;
    category?: PodcastCategory | null;
    author?: User | null;
}

export interface PodcastPlay {
    id: number;
    podcast_id: number;
    ip_address: string | null;
    user_agent: string | null;
    played_at: string;
    duration_listened: number;
}

// Global Ziggy route function
declare global {
    function route(
        name?: string,
        params?: Record<string, unknown> | string | number | (string | number)[],
        absolute?: boolean,
        config?: Record<string, unknown>
    ): string;
}

