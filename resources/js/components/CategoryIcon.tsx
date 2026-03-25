import React from 'react';
import { cn } from '@/lib/utils';

export type CategorySlug =
    | 'festival-fever'
    | 'glocal-gems'
    | 'living-from-the-heart'
    | 'social-sustainability'
    | 'solo-travel'
    | 'travel-trouble';

interface CategoryIconProps {
    category: string | CategorySlug;
    size?: number;
    className?: string;
    glow?: boolean;
}

const categoryMapping: Record<string, { icon: string; color: string }> = {
    'festival-fever': { icon: 'festival-fever-icon.svg', color: '#ff00ff' }, // Neon Pink
    'festival fever': { icon: 'festival-fever-icon.svg', color: '#ff00ff' },
    'glocal-gems': { icon: 'glocal-gems-icon.svg', color: '#00ffff' }, // Cyan
    'glocal gems': { icon: 'glocal-gems-icon.svg', color: '#00ffff' },
    'living-from-the-heart': { icon: 'living-from-the-heart-icon.svg', color: '#ff3131' }, // Neon Red
    'living from the heart': { icon: 'living-from-the-heart-icon.svg', color: '#ff3131' },
    'social-sustainability': { icon: 'social-sustainability-icon.svg', color: '#39ff14' }, // Neon Green
    'social sustainability': { icon: 'social-sustainability-icon.svg', color: '#39ff14' },
    'solo-travel': { icon: 'solotravel-icon.svg', color: '#ffff00' }, // Neon Yellow
    'solo travel': { icon: 'solotravel-icon.svg', color: '#ffff00' },
    'travel-trouble': { icon: 'travel-trouble-icon.svg', color: '#ffaa00' }, // Neon Orange
    'travel trouble': { icon: 'travel-trouble-icon.svg', color: '#ffaa00' },
};

const CategoryIcon: React.FC<CategoryIconProps> = ({
    category,
    size = 24,
    className = '',
    glow = true,
}) => {
    const normalizedCategory = category.toLowerCase().replace(/-/g, ' ');
    const mapping = categoryMapping[category.toLowerCase()] || categoryMapping[normalizedCategory];

    if (!mapping) {
        return null;
    }


    return (
        <img
            src={`/images/stitch/icons/${mapping.icon}`}
            alt={`${category} icon`}
            style={{
                width: size,
                height: size,
                // @ts-expect-error - CSS custom property
                "--glow-color": mapping.color,
            }}
            className={cn(
                "category-icon",
                glow && "category-icon-glow",
                className
            )}
        />
    );
};

export default CategoryIcon;
