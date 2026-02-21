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

function loadGoogleTags(measurementIds: string[]): void {
    if (measurementIds.length === 0) return;
    if (typeof document === 'undefined') return;

    // Use the first ID as the main ID for the script source
    const mainId = measurementIds[0];

    // Create and inject the gtag.js script if not already loaded
    if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${mainId}"]`)) {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${mainId}`;
        script.async = true;
        document.head.appendChild(script);
    }

    // Initialize/Update gtag
    if (!window.dataLayer) {
        const gtagScript = document.createElement('script');
        gtagScript.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'update', {
                'analytics_storage': 'granted',
                'ad_storage': 'granted'
            });
        `;
        document.head.appendChild(gtagScript);
    }

    // Configure each ID
    measurementIds.forEach(id => {
        const configScript = document.createElement('script');
        configScript.textContent = `gtag('config', '${id}', {
            send_page_view: true,
            cookie_flags: 'SameSite=Lax;Secure'
        });`;
        document.head.appendChild(configScript);
    });
}

function setDefaultConsent(): void {
    if (typeof document === 'undefined') return;

    // Set default consent mode (denied until user accepts)
    const consentScript = document.createElement('script');
    consentScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
        });
    `;
    document.head.appendChild(consentScript);
}

/**
 * GoogleAnalytics component — consent-aware GA4 integration.
 * 
 * Only loads analytics scripts when:
 * 1. analytics_enabled is true in admin settings
 * 2. A valid google_analytics_id is configured
 * 3. User has accepted analytics cookies via the consent banner
 * 
 * Listens for 'cookie-consent-updated' events to respond to
 * real-time consent changes without page reload.
 */
export function GoogleAnalytics() {
    const { props } = usePage<SharedData>();
    const compliance = props.site?.compliance;

    const analyticsEnabled = compliance?.analytics_enabled === true;
    const measurementId = compliance?.google_analytics_id;
    const googleTagId = compliance?.google_tag_id;
    
    const isValidGA = measurementId && measurementId.startsWith('G-');
    const isValidTag = googleTagId && (googleTagId.startsWith('AW-') || googleTagId.startsWith('G-'));

    const attemptLoad = useCallback(() => {
        if (!analyticsEnabled) return;
        
        const tagsToLoad = [];
        if (isValidGA && measurementId) tagsToLoad.push(measurementId);
        if (isValidTag && googleTagId) tagsToLoad.push(googleTagId);

        if (tagsToLoad.length > 0 && hasAnalyticsConsent()) {
            loadGoogleTags(tagsToLoad);
        }
    }, [analyticsEnabled, isValidGA, measurementId, isValidTag, googleTagId]);

    useEffect(() => {
        if (!analyticsEnabled || (!isValidGA && !isValidTag)) return;

        // Set default consent mode immediately
        setDefaultConsent();

        // Attempt to load if consent already exists
        attemptLoad();

        // Listen for consent updates from CookieConsent component
        const handleConsentUpdate = (event: Event) => {
            const detail = (event as CustomEvent<ConsentPreferences>).detail;
            if (detail?.analytics) {
                const tagsToLoad = [];
                if (isValidGA && measurementId) tagsToLoad.push(measurementId);
                if (isValidTag && googleTagId) tagsToLoad.push(googleTagId);
                
                if (tagsToLoad.length > 0) {
                    loadGoogleTags(tagsToLoad);
                }
            }
        };

        window.addEventListener('cookie-consent-updated', handleConsentUpdate);
        return () => {
            window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
        };
    }, [analyticsEnabled, isValidGA, measurementId, isValidTag, googleTagId, attemptLoad]);

    // This component renders nothing — it's purely a side-effect component
    return null;
}

export default GoogleAnalytics;
