import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

interface AppLogoProps {
    className?: string;
    logoClassName?: string;
}

const AppLogo = React.forwardRef<HTMLDivElement, AppLogoProps>(({ className, logoClassName }, ref) => {
    const { props } = usePage<SharedData>();
    const site = props.site || { name: import.meta.env.VITE_APP_NAME || 'Website', logo: '', tagline: '' };
    const [imgError, setImgError] = useState(false);
    const [prevLogo, setPrevLogo] = useState(site.logo);

    if (site.logo !== prevLogo) {
        setPrevLogo(site.logo);
        setImgError(false);
    }
    
    return (
        <div 
            ref={ref} 
            className={cn("flex items-center justify-start shrink-0 !bg-transparent !bg-none overflow-visible border-none shadow-none h-auto w-auto max-w-[300px]", className)}
        >
            {site.logo && !imgError ? (
                <img 
                    src={site.logo} 
                    alt={site.name} 
                    className={cn(
                        "h-auto w-auto max-h-[50px] object-contain block",
                        // Ensure SVGs have at least some width if w-auto is failing
                        site.logo.endsWith('.svg') && "min-w-[120px]",
                        logoClassName
                    )} 
                    loading="eager"
                    decoding="async"
                    data-critical="true"
                    onError={() => setImgError(true)}
                />
            ) : null}
            {(!site.logo || site.logo === '' || imgError) ? (
                <div className={cn(
                    "flex aspect-square h-full items-center justify-center rounded-lg bg-agency-accent text-agency-primary shadow-sm shrink-0",
                    logoClassName
                )}>
                    <span className="text-xs font-black italic leading-none">{site.name?.charAt(0) || 'A'}</span>
                </div>
            ) : null}
        </div>
    );
});

AppLogo.displayName = 'AppLogo';

export default AppLogo;

