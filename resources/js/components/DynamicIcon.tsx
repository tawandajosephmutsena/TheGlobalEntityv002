import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import CategoryIcon, { CategorySlug } from '@/components/CategoryIcon';

export type IconType = 'lucide' | 'custom';

interface DynamicIconProps {
    icon: string;
    type?: IconType;
    size?: number;
    className?: string;
    glow?: boolean;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({
    icon,
    type = 'lucide',
    size = 24,
    className = '',
    glow = false,
}) => {
    if (!icon) return null;

    if (type === 'custom') {
        return (
            <CategoryIcon 
                category={icon as CategorySlug} 
                size={size} 
                className={className} 
                glow={glow} 
            />
        );
    }

    // Lucide Icon
    const IconComponent = (Icons as Record<string, any>)[icon];
    if (!IconComponent) {
        // Fallback or just return nothing if icon name is invalid
        return null;
    }

    return <IconComponent size={size} className={className} />;
};

export default DynamicIcon;
