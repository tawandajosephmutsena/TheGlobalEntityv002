import React, { Suspense } from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import type { Globe3DBlock } from '@/types/page-blocks';
import type { GlobeMarker } from '@/components/ui/3d-globe';

const Globe3D = React.lazy(() =>
    import('@/components/ui/3d-globe').then((m) => ({ default: m.Globe3D }))
);

type Globe3DContent = Globe3DBlock['content'];

interface Props extends Globe3DContent {
    disableSectionPadding?: boolean;
}

const defaultMarkers: Globe3DBlock['content']['markers'] = [
    { id: '1', lat: 40.7128, lng: -74.006, label: 'New York', src: 'https://assets.aceternity.com/avatars/1.webp' },
    { id: '2', lat: 51.5074, lng: -0.1278, label: 'London', src: 'https://assets.aceternity.com/avatars/2.webp' },
    { id: '3', lat: 35.6762, lng: 139.6503, label: 'Tokyo', src: 'https://assets.aceternity.com/avatars/3.webp' },
    { id: '4', lat: -33.8688, lng: 151.2093, label: 'Sydney', src: 'https://assets.aceternity.com/avatars/4.webp' },
    { id: '5', lat: 48.8566, lng: 2.3522, label: 'Paris', src: 'https://assets.aceternity.com/avatars/5.webp' },
    { id: '6', lat: 28.6139, lng: 77.209, label: 'New Delhi', src: 'https://assets.aceternity.com/avatars/6.webp' },
    { id: '7', lat: -1.2921, lng: 36.8219, label: 'Nairobi', src: 'https://assets.aceternity.com/avatars/7.webp' },
    { id: '8', lat: 6.5244, lng: 3.3792, label: 'Lagos', src: 'https://assets.aceternity.com/avatars/8.webp' },
    { id: '9', lat: -33.9249, lng: 18.4241, label: 'Cape Town', src: 'https://assets.aceternity.com/avatars/9.webp' },
    { id: '10', lat: 30.0444, lng: 31.2357, label: 'Cairo', src: 'https://assets.aceternity.com/avatars/10.webp' },
];

export default function Globe3DBlockRenderer({
    markers,
    showAtmosphere = false,
    atmosphereColor = '#4da6ff',
    atmosphereIntensity = 0.5,
    ambientIntensity = 1.2,
    pointLightIntensity = 2.0,
    autoRotateSpeed = 0.3,
    bumpScale = 3,
    enableZoom = false,
    showWireframe = false,
    height = '500px',
    disableSectionPadding = false,
}: Props) {
    const activeMarkers = markers && markers.length > 0 ? markers : defaultMarkers;

    const globeMarkers: GlobeMarker[] = activeMarkers.map((m) => ({
        lat: m.lat,
        lng: m.lng,
        label: m.label || '',
        src: m.src || 'https://assets.aceternity.com/avatars/1.webp',
    }));

    const globeContent = (
        <div
            className="relative rounded-3xl overflow-hidden border border-border/30 bg-background/50 backdrop-blur-sm w-full"
            style={{ height, minHeight: '300px' }}
        >
            <Suspense
                fallback={
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                }
            >
                <Globe3D
                    markers={globeMarkers}
                    className="w-full h-full"
                    config={{
                        showAtmosphere,
                        atmosphereColor,
                        atmosphereIntensity,
                        ambientIntensity,
                        pointLightIntensity,
                        autoRotateSpeed,
                        bumpScale,
                        enableZoom,
                        enablePan: false,
                        showWireframe,
                        backgroundColor: null,
                        radius: 2,
                    }}
                />
            </Suspense>
        </div>
    );

    if (disableSectionPadding) {
        return globeContent;
    }

    return (
        <section className="py-12 md:py-20 px-4">
            <div className="max-w-5xl mx-auto">
                <AnimatedSection animation="fade-up">
                    {globeContent}
                </AnimatedSection>
            </div>
        </section>
    );
}
