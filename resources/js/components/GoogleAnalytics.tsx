import { useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

const CONSENT_KEY = 'cookie_consent';

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

let gaLoaded = false;

function loadGoogleAnalytics(measurementId: string): void {
    if (gaLoaded) return;
    if (typeof document === 'undefined') return;

    // Create and inject the gtag.js script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    const gtagScript = document.createElement('script');
    gtagScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('consent', 'update', {
            'analytics_storage': 'granted'
        });
        gtag('config', '${measurementId}', {
            send_page_view: true,
            cookie_flags: 'SameSite=Lax;Secure'
        });
    `;
    document.head.appendChild(gtagScript);

    gaLoaded = true;
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
    const isValidId = measurementId && measurementId.startsWith('G-');

    const attemptLoad = useCallback(() => {
        if (!analyticsEnabled || !isValidId || !measurementId) return;
        if (hasAnalyticsConsent()) {
            loadGoogleAnalytics(measurementId);
        }
    }, [analyticsEnabled, isValidId, measurementId]);

    useEffect(() => {
        if (!analyticsEnabled || !isValidId) return;

        // Set default consent mode immediately
        setDefaultConsent();

        // Attempt to load if consent already exists
        attemptLoad();

        // Listen for consent updates from CookieConsent component
        const handleConsentUpdate = (event: Event) => {
            const detail = (event as CustomEvent<ConsentPreferences>).detail;
            if (detail?.analytics && measurementId) {
                loadGoogleAnalytics(measurementId);
            }
        };

        window.addEventListener('cookie-consent-updated', handleConsentUpdate);
        return () => {
            window.removeEventListener('cookie-consent-updated', handleConsentUpdate);
        };
    }, [analyticsEnabled, isValidId, measurementId, attemptLoad]);

    // This component renders nothing — it's purely a side-effect component
    return null;
}

export default GoogleAnalytics;
