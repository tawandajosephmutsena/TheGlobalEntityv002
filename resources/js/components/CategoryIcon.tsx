import React from 'react';
import { cn } from '@/lib/utils';

export type CategorySlug =
    | 'festival-fever'
    | 'glocal-gems'
    | 'living-from-the-heart'
    | 'social-sustainability'
    | 'solo-travel'
    | 'travel-trouble'
    | string;

interface CategoryIconProps {
    category: string | CategorySlug;
    icon?: string | null;
    size?: number;
    className?: string;
    glow?: boolean;
}

const categoryMapping: Record<string, { icon: string }> = {
    'festival-fever': { icon: 'festival-fever-icon.svg' },
    'festival fever': { icon: 'festival-fever-icon.svg' },
    'glocal-gems': { icon: 'glocal-gems-icon.svg' },
    'glocal gems': { icon: 'glocal-gems-icon.svg' },
    'living-from-the-heart': { icon: 'living-from-the-heart-icon.svg' },
    'living from the heart': { icon: 'living-from-the-heart-icon.svg' },
    'social-sustainability': { icon: 'social-sustainability-icon.svg' },
    'social sustainability': { icon: 'social-sustainability-icon.svg' },
    'solo-travel': { icon: 'solotravel-icon.svg' },
    'solo travel': { icon: 'solotravel-icon.svg' },
    'travel-trouble': { icon: 'travel-trouble-icon.svg' },
    'travel trouble': { icon: 'travel-trouble-icon.svg' },
};

const CategoryIcon: React.FC<CategoryIconProps> = ({
    category,
    icon,
    size = 24,
    className = '',
    glow = true,
}) => {
    let iconFile = icon;

    if (!iconFile) {
        const catLower = category?.toLowerCase() || '';
        const normalizedCategory = catLower.replace(/-/g, ' ');
        const mapping = categoryMapping[catLower] || categoryMapping[normalizedCategory];
        
        if (mapping) {
            iconFile = mapping.icon;
        }
    }

    if (!iconFile) {
        return null;
    }

    const iconUrl = `/images/stitch/icons/${iconFile}`;

    return (
        <div
            role="img"
            aria-label={`${category} icon`}
            className={cn(
                "category-icon-mask",
                glow && "category-icon-glow",
                className
            )}
            style={{
                '--icon-size': `${size}px`,
                '--icon-url': `url('${iconUrl}')`,
                width: 'var(--icon-size)',
                height: 'var(--icon-size)',
                maskImage: 'var(--icon-url)',
                WebkitMaskImage: 'var(--icon-url)',
                backgroundColor: 'currentColor'
            } as React.CSSProperties}
        />
    );
};

export default CategoryIcon;
