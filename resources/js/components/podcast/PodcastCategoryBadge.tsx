import React from 'react';
import { cn } from '@/lib/utils';
import CategoryIcon from '../CategoryIcon';

interface PodcastCategoryBadgeProps {
    category: {
        name: string;
        color: string;
    };
    size?: 'sm' | 'md';
    className?: string;
}

export function PodcastCategoryBadge({ category, size = 'md', className }: PodcastCategoryBadgeProps) {
    return (
        <span
            className={cn(
                'podcast-category-badge',
                size === 'sm' ? 'podcast-category-badge-sm' : 'podcast-category-badge-md',
                className
            )}
            style={{
                // @ts-expect-error - CSS custom property
                '--badge-color': category.color,
                backgroundColor: `var(--badge-color)15`,
                color: 'var(--badge-color)',
            }}
        >
            <CategoryIcon category={category.name} size={size === 'sm' ? 12 : 14} glow={false} className="mr-1.5" />
            {category.name}
        </span>
    );
}
