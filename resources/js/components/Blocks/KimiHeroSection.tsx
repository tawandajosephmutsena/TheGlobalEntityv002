import React, { useRef, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

export interface KimiHeroProps {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaLink?: string;
    ctaSecondaryText?: string;
    ctaSecondaryLink?: string;
    images?: string[];
    backgroundColor?: string;
    scrollSpeed?: number;
}

const DEFAULT_IMAGES = [
    '/team-1.jpg',
    '/team-2.jpg',
    '/team-3.jpg',
    '/team-4.jpg',
    '/team-5.jpg',
    '/team-6.jpg',
    '/team-7.jpg',
    '/team-8.jpg',
];

export default function KimiHeroSection({
    title = 'Streamline Your Team,',
    subtitle = 'Supercharge Your Workflow',
    description = 'All-in-one platform to plan, collaborate, and deliver — faster and smarter.',
    ctaText = 'Get started for Free',
    ctaLink = '#',
    ctaSecondaryText,
    ctaSecondaryLink,
    images,
    backgroundColor = '#FFF8F0',
    scrollSpeed = 30,
}: KimiHeroProps) {
    const carouselImages = images && images.length > 0 ? images : DEFAULT_IMAGES;
    // Triple the images for a seamless infinite loop
    const allImages = [...carouselImages, ...carouselImages, ...carouselImages];

    const trackRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>(0);
    const positionRef = useRef<number>(0);

    const animate = useCallback(() => {
        if (!trackRef.current) return;

        // Speed: pixels per frame (60fps baseline)
        const speed = 1.5 * (30 / scrollSpeed);
        positionRef.current -= speed;

        // Get scroll width of one set of images
        const singleSetWidth = trackRef.current.scrollWidth / 3;

        // Reset position seamlessly when we've scrolled past one full set
        if (Math.abs(positionRef.current) >= singleSetWidth) {
            positionRef.current += singleSetWidth;
        }

        trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
        animationRef.current = requestAnimationFrame(animate);
    }, [scrollSpeed]);

    useEffect(() => {
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [animate]);

    return (
        <section
            className="kimi-hero-section overflow-hidden flex flex-col justify-center"
            style={{
                backgroundColor,
                minHeight: '100vh',
            }}
        >
            {/* Main Content */}
            <div className="pt-32 sm:pt-40 pb-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Headline */}
                    <h1 className="mb-4">
                        <span
                            className="block text-4xl sm:text-5xl lg:text-6xl mb-1"
                            style={{
                                fontFamily: "'Playfair Display', 'Georgia', serif",
                                fontStyle: 'italic',
                                color: '#111827',
                            }}
                        >
                            {title}
                        </span>
                        <span
                            className="block font-bold text-4xl sm:text-5xl lg:text-6xl"
                            style={{
                                fontFamily: "'Inter', sans-serif",
                                color: '#111827',
                            }}
                        >
                            {subtitle}
                        </span>
                    </h1>

                    {/* Description */}
                    <p
                        className="text-base sm:text-lg max-w-xl mx-auto mb-8"
                        style={{ color: '#4B5563' }}
                    >
                        {description}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <a
                            href={ctaLink}
                            className="group kimi-hero-cta inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-colors"
                            style={{
                                backgroundColor: '#111827',
                                color: '#FFFFFF',
                            }}
                        >
                            {ctaText}
                            <span
                                className="kimi-hero-cta-arrow inline-flex items-center justify-center w-6 h-6 rounded-full"
                                style={{ backgroundColor: '#374151' }}
                            >
                                <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </a>
                        {ctaSecondaryText && (
                            <a
                                href={ctaSecondaryLink || '#'}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm border-2 transition-colors"
                                style={{
                                    borderColor: '#111827',
                                    color: '#111827',
                                }}
                            >
                                {ctaSecondaryText}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* 3D Carousel Section */}
            <div className="relative py-12 overflow-hidden flex-1 flex items-center">
                {/* Gradient Masks */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-32 sm:w-48 lg:w-64 z-10 pointer-events-none"
                    style={{
                        background: `linear-gradient(to right, ${backgroundColor}, transparent)`,
                    }}
                />
                <div
                    className="absolute right-0 top-0 bottom-0 w-32 sm:w-48 lg:w-64 z-10 pointer-events-none"
                    style={{
                        background: `linear-gradient(to left, ${backgroundColor}, transparent)`,
                    }}
                />

                {/* Carousel Container */}
                <div className="kimi-carousel-container relative w-full overflow-hidden">
                    <div
                        ref={trackRef}
                        className="flex gap-6 sm:gap-8 lg:gap-10"
                        style={{ width: 'max-content', willChange: 'transform' }}
                    >
                        {allImages.map((src, index) => {
                            const position = index % carouselImages.length;
                            const centerIndex = carouselImages.length / 2;
                            const offset = position - centerIndex + 0.5;
                            const rotation = offset * 8;
                            const translateZ = Math.abs(offset) * -30;
                            const scale = 1 - Math.abs(offset) * 0.05;

                            return (
                                <div
                                    key={index}
                                    className="flex-shrink-0"
                                    style={{
                                        transform: `perspective(1000px) rotateY(${rotation}deg) translateZ(${translateZ}px) scale(${scale})`,
                                        transformStyle: 'preserve-3d',
                                    }}
                                >
                                    <div className="relative w-48 h-64 sm:w-64 sm:h-80 lg:w-80 lg:h-[28rem] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                                        <img
                                            src={src}
                                            alt={`Team member ${(position % carouselImages.length) + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
