import { useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

const CONSENT_KEY = 'cookie_consent';

declare global {
    interface Window {
        dataLayer: unknown[];
        gtag: (...args: unknown[]) => void;
    }
}

interface ConsentPreferences {
    analytics: boolean;
    [key: string]: unknown;
}

function getStoredConsent(): ConsentPreferences | null {
    try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (!stored) return null;
        return JSON.parse(stored) as ConsentPreferences;
    } catch {
        return null;
    }
}

function hasAnalyticsConsent(): boolean {
    const consent = getStoredConsent();
    return consent?.analytics === true;
}

function initGoogleTags(measurementIds: string[]): void {
    if (measurementIds.length === 0) return;
    if (typeof document === 'undefined') return;

    // Set default consent mode (denied until user accepts) BEFORE loading the script
    if (!window.dataLayer) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag(){window.dataLayer.push(arguments);}

        // Default consent is denied
        window.gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied',
            'wait_for_update': 500
        });

        // Initialize Data Layer date
        window.gtag('js', new Date());

        // Configure each ID
        measurementIds.forEach(id => {
            window.gtag('config', id, {
                cookie_flags: 'SameSite=Lax;Secure'
            });
        });
    }

    // Use the first ID as the main ID for the script source
    const mainId = measurementIds[0];

    // Create and inject the gtag.js script if not already loaded
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${mainId}"]`)) {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${mainId}`;
        script.async = true;
        document.head.appendChild(script);
    }
}

function updateConsent(granted: boolean): void {
    if (typeof window === 'undefined' || !window.gtag) return;
    
    if (granted) {
        window.gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
        });
    }
}

/**
 * GoogleAnalytics component — consent-aware GA4/Gtag integration.
 * 
 * Implements proper Google Consent Mode v2.
 * The script is always loaded so crawlers can verify its presence,
 * but it functions in a privacy-safe mode (denied) until consent is granted.
 */
export function GoogleAnalytics() {
    const { props } = usePage<SharedData>();
    const compliance = props.site?.compliance;

    const analyticsEnabled = compliance?.analytics_enabled === true;
    const measurementId = compliance?.google_analytics_id;
    const googleTagId = compliance?.google_tag_id;
    
    const isValidGA = measurementId && measurementId.startsWith('G-');
    const isValidTag = googleTagId && (googleTagId.startsWith('AW-') || googleTagId.startsWith('G-'));

    useEffect(() => {
        if (!analyticsEnabled || (!isValidGA && !isValidTag)) return;

        const tagsToLoad = [];
        if (isValidGA && measurementId) tagsToLoad.push(measurementId);
        if (isValidTag && googleTagId) tagsToLoad.push(googleTagId);

        if (tagsToLoad.length > 0) {
            // ALWAYS initialize tags so Google can see them, but default consent denies cookies
            initGoogleTags(tagsToLoad);
            
            // If user already granted consent, update it immediately
            if (hasAnalyticsConsent()) {
                updateConsent(true);
            }
        }

        // Listen for consent updates from CookieConsent component
        const handleConsentUpdate = (event: Event) => {
            const detail = (event as CustomEvent<ConsentPreferences>).detail;
            if (detail?.analytics) {
                updateConsent(true);
            }
        };

        window.addEventListener('cookie-consent-updated', handleConsentUpdate);
        return () => {
            window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
        };
    }, [analyticsEnabled, isValidGA, measurementId, isValidTag, googleTagId]);

    // This component renders nothing — it's purely a side-effect component
    return null;
}

export default GoogleAnalytics;
