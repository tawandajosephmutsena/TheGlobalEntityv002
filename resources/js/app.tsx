import '../css/app.css';
import '../css/category-icons.css';

// Polyfill for crypto.randomUUID in non-secure contexts
if (typeof window !== 'undefined' && !window.crypto?.randomUUID) {
    if (!window.crypto) {
        (window as Window & { crypto: Crypto }).crypto = {} as Crypto;
    }
    window.crypto.randomUUID = function() {
        return ("10000000-1000-4000-8000-100000000000").replace(/[018]/g, (cString: string) => {
            const c = Number(cString);
            return (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
        }) as `${string}-${string}-${string}-${string}-${string}`;
    };
}

import { createInertiaApp } from '@inertiajs/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { setupCsrfProtection } from './lib/csrf';
import { initPerformanceMonitoring } from './lib/performanceMonitor';
import { registerServiceWorker, showUpdateAvailableNotification } from './lib/serviceWorker';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { registerBlocks } from './lib/registerBlocks';
import { PodcastPlayerProvider } from '@/contexts/PodcastPlayerContext';

// Initialize GSAP and animation system
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Initialize link prefetching for near-instant navigation
import { initPrefetching, prefetchCriticalRoutes } from './lib/prefetchLinks';

// Register GSAP plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Set GSAP defaults for the avant-garde theme
    gsap.defaults({
        ease: 'power2.out',
        duration: 0.6,
    });

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
        toggleActions: 'play none none reverse',
        scroller: window,
    });

    // Set up CSRF protection for all requests
    setupCsrfProtection();
    
    // Initialize link prefetching
    initPrefetching();
    // Prefetch critical routes that users commonly visit
    prefetchCriticalRoutes(['/portfolio', '/services', '/contact', '/blog']);
    // Initialize behavioral analytics
    import('./lib/analytics').then(({ analytics }) => {
        analytics.init();
    });

    // Register Dynamic blocks for the Page Builder
    registerBlocks();
}

const appName = import.meta.env.VITE_APP_NAME || 'Website';

// Initialize performance monitoring
const performanceMonitor = initPerformanceMonitoring();

// Register service worker in production
if (import.meta.env.PROD) {
    registerServiceWorker({
        onUpdate: (registration) => {
            showUpdateAvailableNotification(
                () => {
                    // Skip waiting and reload
                    if (registration.waiting) {
                        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                        window.location.reload();
                    }
                },
                () => {
                    console.log('Update dismissed by user');
                }
            );
        },
        onSuccess: () => {
            console.log('Service worker registered successfully');
        },
        onError: (error) => {
            console.error('Service worker registration failed:', error);
        },
    });
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        // Lazy load page components for better code splitting
        const pages = import.meta.glob('./pages/**/*.tsx');
        const page = pages[`./pages/${name}.tsx`];
        
        if (!page) {
            throw new Error(`Page not found: ${name}`);
        }
        
        return page().then((module: unknown) => (module as { default: React.ComponentType }).default);
    },

    setup({ el, App, props }) {
        const root = createRoot(el);

        // Mark performance milestone
        performanceMonitor.mark('app-render-start');

        root.render(
            <ErrorBoundary>
                <PodcastPlayerProvider>
                    <StrictMode>
                        <App {...props} />
                    </StrictMode>
                </PodcastPlayerProvider>
            </ErrorBoundary>,
        );

        // Mark performance milestone after render
        setTimeout(() => {
            performanceMonitor.mark('app-render-end');
            performanceMonitor.measure('app-render-time', 'app-render-start', 'app-render-end');
            
            // Log performance metrics in development
            if (import.meta.env.DEV) {
                setTimeout(() => {
                    const metrics = performanceMonitor.getMetrics();
                    const score = performanceMonitor.getCoreWebVitalsScore();
                    console.log('Performance Metrics:', metrics);
                    console.log('Core Web Vitals Score:', score);
                }, 2000);
            }
        }, 0);
    },
    progress: {
        color: 'oklch(0.65 0.15 45)', // Agency accent color
        showSpinner: true,
    },
});

// Initialize theme system
initializeTheme();

