import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

import { BrandingLogo } from './Branding/BrandingLogo';

interface AppLogoProps {
    className?: string;
    logoClassName?: string;
}

const AppLogo = React.forwardRef<HTMLDivElement, AppLogoProps>(({ className, logoClassName }, ref) => {
    const { props } = usePage<SharedData>();
    const site = props.site || { name: import.meta.env.VITE_APP_NAME || 'Website', logo: '', tagline: '' };
    
    // Find dynamic setting
    const settings = props.settings ? Object.values(props.settings).flat() : [];
    const dynamicSetting = settings.find(s => s.key === 'brand_logo_dynamic');
    const val = dynamicSetting?.value;
    const isDynamic = val === true || val === 'true' || (Array.isArray(val) && (val[0] === true || val[0] === 'true'));

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
            {isDynamic ? (
                <BrandingLogo 
                    className={cn(
                        "h-[40px] w-auto max-w-full", 
                        logoClassName?.replace(/fill-[^ ]+/g, '')?.replace(/text-[^ ]+/g, '')
                    )} 
                />
            ) : (
                <>
                    {site.logo && !imgError ? (
                        <img 
                            src={site.logo} 
                            alt={site.name} 
                            className={cn(
                                "h-auto w-auto max-h-[50px] object-contain block",
                                site.logo.endsWith('.svg') && "min-w-[120px]",
                                logoClassName
                            )} 
                            loading="eager"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className={cn(
                            "flex aspect-square h-[40px] items-center justify-center rounded-lg bg-agency-accent text-agency-primary shadow-sm shrink-0",
                            logoClassName
                        )}>
                            <span className="text-xs font-black italic leading-none">{site.name?.charAt(0) || 'A'}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
});

AppLogo.displayName = 'AppLogo';

export default AppLogo;

