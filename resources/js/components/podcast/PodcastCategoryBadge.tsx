import React from 'react';
import { cn } from '@/lib/utils';

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
                'inline-flex items-center rounded-full font-bold transition-colors',
                size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
                className
            )}
            style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
            }}
        >
            {category.name}
        </span>
    );
}
