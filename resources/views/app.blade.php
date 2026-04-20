<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark']) data-appearance="{{ $appearance ?? 'system' }}" style="color-scheme: {{ ($appearance ?? 'system') == 'dark' ? 'dark' : (($appearance ?? 'system') == 'light' ? 'light' : 'normal') }};">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        {{-- Web Core Vitals: Preconnect to external domains for better LCP --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com">
        <link rel="dns-prefetch" href="https://fonts.gstatic.com">

        {{-- Web Core Vitals: Critical CSS inlined to prevent render blocking --}}
        <style>
            /* Critical CSS for LCP optimization */
            html {
                background-color: transparent;
                font-family: 'Instrument Sans', 'Inter', ui-sans-serif, system-ui, sans-serif;
            }

            html.dark {
                background-color: transparent;
            }

            body {
                margin: 0;
                padding: 0;
                font-family: inherit;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            /* Prevent layout shift during font loading */
            .font-loading {
                font-display: swap;
                size-adjust: 100%;
            }

            /* Critical navigation styles to prevent CLS */
            nav {
                height: 80px; /* Matched to h-20 in Navigation.tsx to prevent layout shift */
            }

            /* Loading shimmer matching the app components */
            .loading-skeleton {
                position: relative;
                overflow: hidden;
                background-color: oklch(0.9341 0.0153 90.239 / 0.5);
            }

            .loading-skeleton::after {
                position: absolute;
                inset: 0;
                transform: translateX(-100%);
                background-image: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                animation: shimmer 2s infinite;
                content: '';
            }

            @keyframes shimmer {
                100% { transform: translateX(100%); }
            }

            /* Prevent layout shift for images */
            img {
                max-width: 100%;
                height: auto;
            }
        </style>

        {{-- Robust Polyfills: Defined synchronously to ensure third-party scripts (Grammarly, etc.) don't crash --}}
        <script nonce="{{ Vite::cspNonce() }}">
            (function() {
                // Polyfill for crypto.randomUUID in non-secure contexts or older browsers
                try {
                    if (typeof window !== 'undefined' && (!window.crypto || !window.crypto.randomUUID)) {
                        if (!window.crypto) window.crypto = {};
                        if (!window.crypto.getRandomValues) {
                            window.crypto.getRandomValues = function(array) {
                                for (var i = 0, l = array.length; i < l; i++) {
                                    array[i] = Math.floor(Math.random() * 256);
                                }
                                return array;
                            };
                        }
                        window.crypto.randomUUID = function() {
                            return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(c) {
                                return (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
                            });
                        };
                    }
                } catch (e) {
                    console.warn('Crypto polyfill failure:', e);
                }

                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                        document.documentElement.style.colorScheme = 'dark';
                    } else {
                        document.documentElement.style.colorScheme = 'light';
                    }
                }

                // Web Core Vitals: Mark critical timing point
                if ('performance' in window) {
                    performance.mark('app-start');
                }
            })();
        </script>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        {{-- Web Core Vitals: Optimized favicon and manifest loading --}}
        <link rel="icon" href="{{ asset('favicon.ico') }}" sizes="32x32">
        <link rel="icon" href="{{ asset('favicon.svg') }}" type="image/svg+xml">
        <link rel="apple-touch-icon" href="{{ asset('apple-touch-icon.png') }}">
        <link rel="manifest" href="/manifest.webmanifest">

        {{-- Web Core Vitals: Non-render-blocking font loading (consolidated into a single request) --}}
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Epilogue:ital,wght@0,100..900;1,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Epilogue:ital,wght@0,100..900;1,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" media="print" onload="this.media='all'" />
        <noscript>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Epilogue:ital,wght@0,100..900;1,100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" />
        </noscript>

        @viteReactRefresh
        @routes(nonce: Vite::cspNonce())
        @vite(['resources/js/app.tsx'])

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        {{-- Web Core Vitals: Loading indicator to prevent CLS --}}
        <div id="app-loading" class="loading-skeleton" style="position: fixed; top: 0; left: 0; width: 100%; height: 4px; z-index: 9999;"></div>
        
        @inertia

        {{-- Web Core Vitals: Remove loading indicator when app is ready --}}
        <script nonce="{{ Vite::cspNonce() }}">
            document.addEventListener('DOMContentLoaded', function() {
                const loadingIndicator = document.getElementById('app-loading');
                if (loadingIndicator) {
                    setTimeout(() => {
                        loadingIndicator.style.opacity = '0';
                        setTimeout(() => loadingIndicator.remove(), 300);
                    }, 100);
                }
                performance.mark('app-ready');
            });
        </script>
    </body>
</html>
