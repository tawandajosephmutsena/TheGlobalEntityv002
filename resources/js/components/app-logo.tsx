import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import React, { memo, useEffect, useState } from 'react';

import { BrandingLogo } from './Branding/BrandingLogo';

interface AppLogoProps {
    className?: string;
    logoClassName?: string;
}

const AppLogoComponent = React.forwardRef<HTMLDivElement, AppLogoProps>(({ className, logoClassName }, ref) => {
    const { props } = usePage<SharedData>();
    const site = props.site || { name: import.meta.env.VITE_APP_NAME || 'Website', logo: '', tagline: '' };
    
    // Hydration safety
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    // Find dynamic setting logic (safe check)
    const settings = props.settings ? Object.values(props.settings).flat() : [];
    const dynamicSetting = settings.find(s => s.key === 'brand_logo_dynamic');
    const val = dynamicSetting?.value;
    const isDynamic = val === true || val === 'true' || val === '1' || (Array.isArray(val) && (val[0] === true || val[0] === 'true' || val[0] === '1'));

    const [imgError, setImgError] = useState(false);
    const [prevLogo, setPrevLogo] = useState(site.logo);

    if (site.logo !== prevLogo) {
        setPrevLogo(site.logo);
        setImgError(false);
    }

    if (!isMounted) {
        return <div className={cn("h-10 w-32 bg-gray-100/10 animate-pulse rounded", className)} />;
    }
    
    return (
        <div 
            ref={ref} 
            className={cn(
                "flex items-center justify-start shrink-0 !bg-transparent !bg-none overflow-visible border-none shadow-none h-10 w-auto max-w-[240px]", 
                className
            )}
        >
            {isDynamic ? (
                <div className="relative h-full w-auto flex items-center justify-start group">
                    <BrandingLogo 
                        className={cn(
                            "h-full w-auto block fill-current transition-transform duration-500 group-hover:scale-105", 
                            logoClassName?.replace(/fill-[^ ]+/g, '')?.replace(/text-[^ ]+/g, '')
                        )} 
                        primaryColor="var(--logo-primary)"
                        secondaryColor="var(--logo-secondary)"
                        accentColor="var(--logo-accent)"
                        width="200"
                        height="40"
                    />
                </div>
            ) : (
                <>
                    {site.logo && !imgError ? (
                        <div className="relative h-full w-auto flex items-center justify-start group">
                            <img 
                                src={site.logo} 
                                alt={site.name} 
                                className={cn(
                                    "h-full w-auto object-contain block transition-transform duration-500 group-hover:scale-105",
                                    logoClassName
                                )} 
                                width="200"
                                height="40"
                                loading="eager"
                                fetchPriority="high"
                                onError={() => setImgError(true)}
                            />
                        </div>
                    ) : (
                        <div className={cn(
                            "flex aspect-square h-full items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shrink-0",
                            logoClassName
                        )}>
                            <span className="text-sm font-black italic leading-none">{site.name?.charAt(0) || 'A'}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
});

AppLogoComponent.displayName = 'AppLogo';

export const AppLogo = memo(AppLogoComponent);
export default AppLogo;


