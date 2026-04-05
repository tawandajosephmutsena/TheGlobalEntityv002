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
    variant?: 'icon-only' | 'badge';
    wrapperClassName?: string;
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
    variant = 'icon-only',
    wrapperClassName = '',
}) => {
    let iconFile = icon;

    const catSlug = (typeof category === 'string' ? category.toLowerCase() : category)
        .replace(/\s+/g, '-');

    if (!iconFile) {
        const mapping = categoryMapping[catSlug] || categoryMapping[category.toLowerCase().replace(/-/g, ' ')];
        
        if (mapping) {
            iconFile = mapping.icon;
        }
    }

    if (!iconFile) {
        return null;
    }

    const iconUrl = `/images/stitch/icons/${iconFile}`;

    const iconElement = (
        <div
            role="img"
            aria-label={`${category} icon`}
            className={cn(
                "category-icon-mask",
                !variant || variant === 'icon-only' ? (glow && "category-icon-glow") : "",
                className
            )}
            style={{
                '--icon-size': `${size}px`,
                '--icon-url': `url('${iconUrl}')`,
            } as React.CSSProperties}
        />
    );

    if (variant === 'badge') {
        const badgeSize = size <= 20 ? (size + 12) : (size + 16);
        return (
            <div 
                className={cn(
                    "category-icon-wrapper",
                    glow && "glow",
                    wrapperClassName
                )}
                data-category={catSlug}
                style={{
                    width: `${badgeSize}px`,
                    height: `${badgeSize}px`,
                } as React.CSSProperties}
            >
                {iconElement}
            </div>
        );
    }

    return iconElement;
};


export default CategoryIcon;
