import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react({
            babel: {
                plugins: [['babel-plugin-react-compiler', { target: '19' }]],
            },
        }),
        tailwindcss(),
        wayfinder({
            formVariants: true,
        }),
    ],
    esbuild: {
        jsx: 'automatic',
        drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
        // Web Core Vitals optimization: Tree shaking and dead code elimination
        treeShaking: true,
        legalComments: 'none',
    },
    optimizeDeps: {
        include: [
            'gsap', 
            'lenis', 
            'react', 
            'react-dom', 
        ],
        exclude: ['@vite/client', '@vite/env'],
    },
    build: {
        target: 'es2020',
        minify: 'esbuild',
        cssMinify: true,
        sourcemap: process.env.NODE_ENV !== 'production',
        // Web Core Vitals: Optimize chunk sizes for better LCP
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // 1. Icons & Large Media/UI Libraries (Check specifically first)
                        if (id.includes('lucide-react') || id.includes('@tabler/icons-react')) return 'icons';
                        if (id.includes('react-player')) return 'media-vendor';
                        if (id.includes('yet-another-react-lightbox')) return 'lightbox-vendor';
                        if (id.includes('recharts')) return 'charts';
                        if (id.includes('jspdf')) return 'pdf-vendor';
                        if (id.includes('@tsparticles')) return 'particles-vendor';
                        
                        // Video & Streaming Libraries (Typically very large)
                        if (id.includes('dashjs')) return 'dashjs-vendor';
                        if (id.includes('hls.js')) return 'hls-vendor';
                        if (id.includes('@mux')) return 'mux-vendor';
                        if (id.includes('video.js')) return 'videojs-vendor';
                        
                        // 2. Core React (Specifically match to avoid catching 'lucide-react')
                        if (id.includes('node_modules/react/') || 
                            id.includes('node_modules/react-dom/') || 
                            id.includes('node_modules/scheduler/')) {
                            return 'react-core';
                        }
                        
                        // 3. Inertia & Routing
                        if (id.includes('@inertiajs') || id.includes('ziggy-js')) {
                            return 'inertia-vendor';
                        }

                        // 4. Specific Vendor Groups
                        // Three.js and React Three Fiber go into a dedicated on-demand chunk (Req 1.1, 1.3)
                        if (id.includes('three') || id.includes('@react-three')) return 'three-vendor';
                        if (id.includes('gsap')) return 'gsap';
                        if (id.includes('framer-motion') || id.includes('motion')) return 'animations';
                        if (id.includes('@radix-ui')) return 'radix-vendor';
                        if (id.includes('@tiptap') || id.includes('prosemirror')) return 'editor';
                        if (id.includes('date-fns') || id.includes('dompurify')) return 'utils-vendor';

                        // Catch-all for other node_modules
                        return 'vendor';
                    }
                },
                // Optimize chunk file names for caching
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name?.split('.') || [];
                    const ext = info[info.length - 1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
                        return `images/[name]-[hash][extname]`;
                    }
                    if (/css/i.test(ext || '')) {
                        return `css/[name]-[hash][extname]`;
                    }
                    if (/woff2?|eot|ttf|otf/i.test(ext || '')) {
                        return `fonts/[name]-[hash][extname]`;
                    }
                    return `assets/[name]-[hash][extname]`;
                },
            },
        },
        // Web Core Vitals: Reduce chunk size for better performance
        chunkSizeWarningLimit: 1000, // Balanced limit for large SaaS applications
    },
    server: {
        host: '127.0.0.1',
        hmr: {
            host: '127.0.0.1',
            overlay: false,
        },
    },
    // CSS optimization for better LCP
    css: {
        devSourcemap: true,
        // Note: CSS optimization is handled by Tailwind CSS and esbuild minification
        // Additional PostCSS plugins can be added in postcss.config.js if needed
    },
});
