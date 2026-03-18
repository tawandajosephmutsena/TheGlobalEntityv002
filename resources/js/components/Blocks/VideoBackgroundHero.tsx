import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { InfiniteSlider } from '@/components/motion-primitives/infinite-slider';
import { ProgressiveBlur } from '@/components/motion-primitives/progressive-blur';
import { ChevronRight } from 'lucide-react';


interface VideoBackgroundHeroProps {
    title?: string;
    subtitle?: string;
    ctaText1?: string;
    ctaLink1?: string;
    ctaText2?: string;
    ctaLink2?: string;
    videoUrl?: string;
    logos?: Array<{ name: string; url: string }>;
    trustedByText?: string;
    showLogoSlider?: boolean;
}

const DEFAULT_LOGOS = [
    { name: "Nvidia", url: "https://cdn.simpleicons.org/nvidia/000000" },
    { name: "Vercel", url: "https://cdn.simpleicons.org/vercel/000000" },
    { name: "GitHub", url: "https://cdn.simpleicons.org/github/000000" },
    { name: "Nike", url: "https://cdn.simpleicons.org/nike/000000" },
    { name: "LemonSqueezy", url: "https://cdn.simpleicons.org/lemonsqueezy/000000" },
    { name: "Laravel", url: "https://cdn.simpleicons.org/laravel/000000" },
    { name: "Supabase", url: "https://cdn.simpleicons.org/supabase/000000" },
    { name: "OpenAI", url: "https://cdn.simpleicons.org/openai/000000" }
];

const getYouTubeId = (url: string): string | null => {
    if (url.includes("youtu.be")) {
        return url.split("youtu.be/")[1]?.split(/[?&#]/)[0] || null;
    }
    if (url.includes("youtube.com")) {
        const match = url.match(/[?&]v=([^&#]+)/);
        return match?.[1] || null;
    }
    return null;
};

const getVideoType = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (url.includes("vimeo.com")) return "vimeo";
    return "direct";
};

/**
 * Get a YouTube thumbnail URL from YouTube's image CDN.
 * This is a plain image request and does NOT trigger bot checks.
 */
const getYouTubeThumbnail = (videoId: string): string =>
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

export default function VideoBackgroundHero({
    title = "Build 10x Faster with NS",
    subtitle = "Highly customizable components for building modern websites and applications you mean it.",
    ctaText1 = "Start Building",
    ctaLink1 = "#",
    ctaText2 = "Request a demo",
    ctaLink2 = "#",
    videoUrl = "https://videos.pexels.com/video-files/30333849/13003128_2560_1440_25fps.mp4",
    logos = [],
    trustedByText = "Trusted by industry leaders",
    showLogoSlider = true
}: VideoBackgroundHeroProps) {
    const activeLogos = logos && logos.length > 0 ? logos : DEFAULT_LOGOS;
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoType = getVideoType(videoUrl);
    const ytId = getYouTubeId(videoUrl);

    useEffect(() => {
        if (videoType === "direct" && videoRef.current) {
            videoRef.current.play().catch(err => console.error("[VideoHero] Play failed:", err));
        }
    }, [videoUrl, videoType]);

    return (
        <section className="relative w-full min-h-screen overflow-hidden flex flex-col justify-between bg-black">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                {videoType === "direct" ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-60 transition-opacity duration-1000"
                        src={videoUrl}
                        poster={videoType === 'youtube' && ytId ? getYouTubeThumbnail(ytId) : undefined}
                        onError={(e) => console.error("[VideoHero] Source error:", e)}
                        loading="lazy"
                    />
                ) : videoType === "youtube" && ytId ? (
                    /* YouTube: use a static thumbnail image instead of iframe to avoid bot checks */
                    <img
                        src={getYouTubeThumbnail(ytId)}
                        alt="Video background"
                        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"
                    />
                ) : (
                    /* Vimeo or other: show a dark gradient fallback rather than risk bot check */
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-80" />
                )}
                {/* Gradient Overlay for better readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 z-10" />
            </div>

            {/* Content Layer */}
            <div className="relative z-20 flex-grow flex items-center px-6 md:px-12">
                <div className="max-w-7xl mx-auto w-full pt-20">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                            {title}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/70 max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-8 delay-150 duration-700">
                            {subtitle}
                        </p>
                        <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 delay-300 duration-700">
                            <Button
                                asChild
                                size="lg"
                                className="h-14 px-8 rounded-full text-lg font-bold group bg-primary hover:bg-primary/90 text-primary-foreground border-none"
                            >
                                <Link href={ctaLink1 || '#'}>
                                    {ctaText1}
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="h-14 px-8 rounded-full text-lg font-bold border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black hover:border-white transition-all"
                            >
                                <Link href={ctaLink2 || '#'}>
                                    {ctaText2}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Logo Cloud - conditionally rendered */}
            {showLogoSlider && (
                <div className="relative z-30 bg-black/40 backdrop-blur-md border-t border-white/10 py-12">
                    <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center gap-8">
                        <div className="shrink-0 px-4">
                            <p className="text-white/40 text-sm font-medium uppercase tracking-widest whitespace-nowrap">
                                {trustedByText}
                            </p>
                        </div>
                        <div className="flex-grow overflow-hidden relative">
                            <InfiniteSlider duration={25} gap={100}>
                                {activeLogos.map((logo, idx) => (
                                    <img
                                        key={`${logo.name}-${idx}`}
                                        src={logo.url}
                                        alt={logo.name}
                                        className="h-6 md:h-8 w-auto invert opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                                    />
                                ))}
                            </InfiniteSlider>
                            <ProgressiveBlur
                                className="pointer-events-none absolute left-0 top-0 h-full w-32 z-10"
                                direction="left"
                                blurIntensity={1.5}
                            />
                            <ProgressiveBlur
                                className="pointer-events-none absolute right-0 top-0 h-full w-32 z-10"
                                direction="right"
                                blurIntensity={1.5}
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
