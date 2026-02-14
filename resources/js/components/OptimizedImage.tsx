import React from 'react';
import { cn } from '@/lib/utils';

interface ImageConversions {
    sizes?: Record<string, string>;
    webp_sizes?: Record<string, string>;
    placeholder?: string;
    conversions?: Record<string, Record<string, string>>;
}

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    conversions?: ImageConversions;
    className?: string;
    aspectRatio?: 'video' | 'square' | 'auto' | string;
    objectFit?: 'cover' | 'contain' | 'fill';
    priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    conversions,
    className,
    aspectRatio = 'auto',
    objectFit = 'cover',
    priority = false,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);

    // Build WebP srcset
    const webpSrcset = React.useMemo(() => {
        if (!conversions?.webp_sizes) return null;
        return Object.entries(conversions.webp_sizes)
            .map(([size, path]) => {
                const width = size.match(/\d+/)?.[0];
                return width ? `${window.location.origin}/storage/${path} ${width}w` : null;
            })
            .filter(Boolean)
            .join(', ');
    }, [conversions]);

    // Build standard srcset (JPEG/PNG)
    const standardSrcset = React.useMemo(() => {
        if (!conversions?.sizes) return null;
        return Object.entries(conversions.sizes)
            .map(([size, path]) => {
                const width = size.match(/\d+/)?.[0];
                return width ? `${window.location.origin}/storage/${path} ${width}w` : null;
            })
            .filter(Boolean)
            .join(', ');
    }, [conversions]);

    return (
        <div 
            className={cn(
                'relative overflow-hidden bg-muted/20',
                aspectRatio === 'video' && 'aspect-video',
                aspectRatio === 'square' && 'aspect-square',
                className
            )}
        >
            {conversions?.placeholder && !isLoaded && (
                <div 
                    className="absolute inset-0 z-0 scale-110 blur-2xl transition-opacity duration-700 bg-cover bg-center"
                    style={{ '--placeholder-url': `url(${conversions.placeholder})` } as React.CSSProperties}
                >
                    <div className="absolute inset-0 bg-[image:var(--placeholder-url)]" />
                </div>
            )}

            <picture>
                {webpSrcset && (
                    <source 
                        type="image/webp" 
                        srcSet={webpSrcset} 
                        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} 
                    />
                )}
                {standardSrcset && (
                    <source 
                        srcSet={standardSrcset} 
                        sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"} 
                    />
                )}
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    onLoad={() => setIsLoaded(true)}
                    onError={() => setHasError(true)}
                    className={cn(
                        'h-full w-full transition-all duration-700 ease-in-out',
                        objectFit === 'cover' ? 'object-cover' : 
                        objectFit === 'contain' ? 'object-contain' : 'object-fill',
                        isLoaded ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-sm',
                        hasError && 'hidden'
                    )}
                    {...props}
                />
            </picture>

            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/30 text-muted-foreground">
                    <span className="text-xs font-mono uppercase tracking-widest">Image Error</span>
                </div>
            )}
        </div>
    );
};
