import React, { useState, useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { Link } from '@inertiajs/react';

const CONSENT_KEY = 'cookie_consent';
const CONSENT_VERSION = '1';

interface ConsentPreferences {
    version: string;
    essential: boolean;
    analytics: boolean;
    marketing: boolean;
    timestamp: number;
}

function getStoredConsent(): ConsentPreferences | null {
    try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (!stored) return null;
        const parsed = JSON.parse(stored) as ConsentPreferences;
        if (parsed.version !== CONSENT_VERSION) return null;
        return parsed;
    } catch {
        return null;
    }
}

function storeConsent(prefs: ConsentPreferences): void {
    try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
        // Also set a simple cookie for server-side detection
        document.cookie = `cookie_consent=accepted; max-age=${365 * 24 * 60 * 60}; path=/; SameSite=Lax`;
        // Dispatch event for other components (e.g. GoogleAnalytics)
        window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: prefs }));
    } catch {
        // Silently fail if storage is unavailable
    }
}

export function CookieConsent() {
    const { props } = usePage<SharedData>();
    const compliance = props.site?.compliance;

    const [visible, setVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
    const [marketingEnabled, setMarketingEnabled] = useState(false);

    useEffect(() => {
        if (!compliance?.cookie_consent_enabled) return;
        const existing = getStoredConsent();
        if (!existing) {
            // Small delay for smoother page load experience
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [compliance?.cookie_consent_enabled]);

    const handleAcceptAll = useCallback(() => {
        const prefs: ConsentPreferences = {
            version: CONSENT_VERSION,
            essential: true,
            analytics: true,
            marketing: true,
            timestamp: Date.now(),
        };
        storeConsent(prefs);
        setVisible(false);
    }, []);

    const handleRejectNonEssential = useCallback(() => {
        const prefs: ConsentPreferences = {
            version: CONSENT_VERSION,
            essential: true,
            analytics: false,
            marketing: false,
            timestamp: Date.now(),
        };
        storeConsent(prefs);
        setVisible(false);
    }, []);

    const handleSavePreferences = useCallback(() => {
        const prefs: ConsentPreferences = {
            version: CONSENT_VERSION,
            essential: true,
            analytics: analyticsEnabled,
            marketing: marketingEnabled,
            timestamp: Date.now(),
        };
        storeConsent(prefs);
        setVisible(false);
    }, [analyticsEnabled, marketingEnabled]);

    if (!compliance?.cookie_consent_enabled) return null;

    const style = compliance.cookie_consent_style || 'bottom-bar';
    const isBar = style.includes('bar');
    const isTop = style === 'top-bar';

    const analyticsChecked = analyticsEnabled ? "true" : "false";
    const marketingChecked = marketingEnabled ? "true" : "false";
    const message = compliance.cookie_consent_message || 'We use cookies to enhance your browsing experience.';
    const acceptText = compliance.cookie_consent_accept_text || 'Accept All';
    const rejectText = compliance.cookie_consent_reject_text || 'Reject Non-Essential';
    const privacyUrl = compliance.privacy_policy_url || '/privacy';
    const cookieUrl = compliance.cookie_policy_url || '/cookies';

    // Position & animation variants based on style

    const positionClasses = {
        'bottom-bar': 'bottom-0 left-0 right-0',
        'top-bar': 'top-0 left-0 right-0',
        'bottom-left': 'bottom-4 left-4 max-w-md',
        'bottom-right': 'bottom-4 right-4 max-w-md',
    }[style];

    const motionVariants = {
        initial: isTop
            ? { y: -100, opacity: 0 }
            : isBar
                ? { y: 100, opacity: 0 }
                : { y: 40, opacity: 0, scale: 0.95 },
        animate: { y: 0, opacity: 1, scale: 1 },
        exit: isTop
            ? { y: -100, opacity: 0 }
            : isBar
                ? { y: 100, opacity: 0 }
                : { y: 40, opacity: 0, scale: 0.95 },
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className={`fixed z-[9999] ${positionClasses}`}
                    initial={motionVariants.initial}
                    animate={motionVariants.animate}
                    exit={motionVariants.exit}
                    transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.5 }}
                >
                    <div
                        className={`
                            backdrop-blur-xl bg-background/90 border-border shadow-2xl
                            ${isBar
                                ? `border-${isTop ? 'b' : 't'} px-4 sm:px-6 py-4`
                                : 'border rounded-2xl p-5 m-2 shadow-black/10'
                            }
                        `}
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 rounded-xl bg-primary/10 shrink-0">
                                <Cookie className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-primary" />
                                    Cookie Preferences
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {message}
                                </p>
                                <p className="text-[10px] text-muted-foreground/70 mt-1">
                                    Learn more in our{' '}
                                    <Link href={privacyUrl} className="underline hover:text-foreground transition-colors">
                                        Privacy Policy
                                    </Link>{' '}
                                    and{' '}
                                    <Link href={cookieUrl} className="underline hover:text-foreground transition-colors">
                                        Cookie Policy
                                    </Link>.
                                </p>
                            </div>
                        </div>

                        {/* Granular Settings (Expandable) */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border rounded-xl p-3 mb-3 space-y-3 bg-muted/30">
                                        {/* Essential - always on */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-foreground">Essential Cookies</p>
                                                <p className="text-[10px] text-muted-foreground">Required for core site functionality</p>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={true}
                                                    disabled
                                                    className="sr-only peer"
                                                    id="cookie-essential"
                                                    title="Essential cookies are always enabled"
                                                    aria-label="Essential cookies (always enabled)"
                                                />
                                                <label
                                                    htmlFor="cookie-essential"
                                                    className="block w-9 h-5 rounded-full bg-primary cursor-not-allowed after:content-[''] after:block after:w-3.5 after:h-3.5 after:rounded-full after:bg-white after:mt-[3px] after:ml-[18px] after:transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* Analytics */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-foreground">Analytics Cookies</p>
                                                <p className="text-[10px] text-muted-foreground">Help us understand site usage</p>
                                            </div>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={analyticsChecked}
                                                aria-label="Toggle analytics cookies"
                                                title="Toggle analytics cookies"
                                                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                                                className={`relative w-9 h-5 rounded-full transition-colors ${analyticsEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                            >
                                                <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform mt-[3px] ${analyticsEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                                            </button>
                                        </div>

                                        {/* Marketing */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-foreground">Marketing Cookies</p>
                                                <p className="text-[10px] text-muted-foreground">Personalized ads and content</p>
                                            </div>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={marketingChecked}
                                                aria-label="Toggle marketing cookies"
                                                title="Toggle marketing cookies"
                                                onClick={() => setMarketingEnabled(!marketingEnabled)}
                                                className={`relative w-9 h-5 rounded-full transition-colors ${marketingEnabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                            >
                                                <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform mt-[3px] ${marketingEnabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <div className={`flex items-center gap-2 ${isBar ? 'flex-row flex-wrap' : 'flex-col'}`}>
                            <div className={`flex gap-2 ${isBar ? '' : 'w-full'}`}>
                                <button
                                    type="button"
                                    onClick={handleAcceptAll}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg active:scale-[0.98] ${isBar ? '' : 'flex-1'}`}
                                >
                                    {acceptText}
                                </button>
                                {showSettings ? (
                                    <button
                                        type="button"
                                        onClick={handleSavePreferences}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg border border-border bg-background hover:bg-muted transition-all duration-200 active:scale-[0.98] ${isBar ? '' : 'flex-1'}`}
                                    >
                                        Save Preferences
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleRejectNonEssential}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg border border-border bg-background hover:bg-muted transition-all duration-200 active:scale-[0.98] ${isBar ? '' : 'flex-1'}`}
                                    >
                                        {rejectText}
                                    </button>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowSettings(!showSettings)}
                                className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors py-1"
                            >
                                {showSettings ? (
                                    <>
                                        <ChevronUp className="w-3 h-3" /> Hide Settings
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="w-3 h-3" /> Cookie Settings
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CookieConsent;
