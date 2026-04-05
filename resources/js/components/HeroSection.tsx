import { Button } from '@/components/ui/button';
import { useHeroParallax, useTextReveal } from '@/hooks/useAnimations';
import { cn } from '@/lib/utils';
import { accessibilityManager } from '@/lib/accessibilityManager';
import { ArrowRight } from 'lucide-react';
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    ctaHref?: string;
    backgroundImages?: string[];
    marqueeText?: string;
    showFloatingImages?: boolean;
    secondaryCtaText?: string;
    secondaryCtaHref?: string;
    className?: string;
}

/**
 * Hero Section component with parallax effects and text animations
 * Demonstrates the animation system capabilities
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
    title = 'Create Digital Experiences That Inspire',
    subtitle = 'Creative Agency',
    description = 'We push the boundaries of design and technology to create extraordinary digital experiences that captivate and convert.',
    ctaText = 'Start Your Project',
    ctaHref = '/contact',
    backgroundImages = [],
    marqueeText = 'Innovate Create Elevate Innovate Create Elevate',
    showFloatingImages = true,
    secondaryCtaText,
    secondaryCtaHref,
    className,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const image1Ref = useRef<HTMLDivElement>(null);
    const image2Ref = useRef<HTMLDivElement>(null);
    const image3Ref = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    // Check for reduced motion preference
    const reducedMotion = accessibilityManager.prefersReducedMotion();

    // Detect mobile - SSR safe check
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const checkMobile = () => {
                const mobile = window.innerWidth < 768;
                setIsMobile(prev => prev !== mobile ? mobile : prev);
            };

            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }
    }, []);

    // Apply parallax effects to background images - disabled on mobile for performance
    useHeroParallax(
        containerRef as React.RefObject<HTMLElement>,
        [
            image1Ref as React.RefObject<HTMLElement>,
            image2Ref as React.RefObject<HTMLElement>,
            image3Ref as React.RefObject<HTMLElement>,
        ],
        {
            mouseParallax: !reducedMotion && !isMobile,
            scrollParallax: !reducedMotion && !isMobile,
            intensity: (reducedMotion || isMobile) ? 0 : 1.2,
        },
    );

    // Apply text reveal animations - simplified on mobile
    useTextReveal(containerRef, {
        splitType: 'words',
        stagger: (reducedMotion || isMobile) ? 0 : 0.08,
    });

    // Robust GSAP Marquee for Hero Background
    useEffect(() => {
        if (!marqueeRef.current) return;
        
        const el = marqueeRef.current;
        
        // Ensure starting position
        gsap.set(el, { xPercent: 0 });

        const tween = gsap.to(el, {
            xPercent: -50,
            duration: window.innerWidth < 768 ? 60 : 40, // Slower on mobile
            ease: 'none',
            repeat: -1,
            overwrite: 'auto'
        });

        return () => {
            tween.kill();
        };
    }, [marqueeText]);

    return (
        <section
            ref={containerRef}
            className={cn(
                'relative flex min-h-[100dvh] flex-col items-center overflow-hidden',
                'theme-gradient-bg-subtle pt-20',
                className,
            )}
        >
            {/* Animated gradient background orbs */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div
                    className="absolute -top-[20%] -left-[15%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 dark:opacity-50 animate-gradient-pulse"
                    style={{ background: 'var(--gradient-start)' }}
                />
                <div
                    className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-25 dark:opacity-40 animate-gradient-pulse"
                    style={{ background: 'var(--gradient-end)', animationDelay: '2s' }}
                />
                <div
                    className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-20 dark:opacity-35 animate-gradient-pulse"
                    style={{ background: 'var(--gradient-accent)', animationDelay: '4s' }}
                />
            </div>
            {/* Infinite Background Marquee */}
            <div className="absolute inset-0 z-0 flex items-center justify-start opacity-[0.03] dark:opacity-[0.08] pointer-events-none select-none overflow-hidden">
                <div 
                    ref={marqueeRef}
                    className="whitespace-nowrap flex flex-none will-change-transform"
                >
                    <span className="text-[20vw] font-black uppercase leading-none px-4 font-display">
                        {marqueeText}
                    </span>
                    <span className="text-[20vw] font-black uppercase leading-none px-4 font-display">
                        {marqueeText}
                    </span>
                    <span className="text-[20vw] font-black uppercase leading-none px-4 font-display">
                        {marqueeText}
                    </span>
                    <span className="text-[20vw] font-black uppercase leading-none px-4 font-display">
                        {marqueeText}
                    </span>
                </div>
            </div>

            {/* Floating Image Cards with Parallax */}
            {/* Hidden and pointer-events-none on mobile to prevent interference */}
            {showFloatingImages && (
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden select-none touch-none md:pointer-events-auto md:select-auto md:touch-auto">
                    {/* Image 1: Top Left */}
                    <div 
                        ref={image1Ref}
                        className="absolute top-[18%] left-[5%] md:left-[10%] hidden md:block"
                    >
                        <div className="relative w-40 md:w-56 aspect-[3/4] rounded-brand overflow-hidden shadow-2xl transition-transform duration-500 ease-out hover:scale-105 pointer-events-auto -rotate-6">
                            <img 
                                src={backgroundImages[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'} 
                                alt=""
                                loading="lazy"
                                fetchPriority="auto"
                                className="absolute inset-0 !w-full !h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Image 2: Middle Right */}
                    <div 
                        ref={image2Ref}
                        className="absolute top-[35%] right-[5%] md:right-[12%] hidden md:block"
                    >
                        <div className="relative w-48 md:w-64 aspect-square rounded-brand overflow-hidden shadow-2xl transition-transform duration-500 ease-out hover:scale-105 pointer-events-auto rotate-3">
                            <img 
                                src={backgroundImages[1] || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2670&auto=format&fit=crop'} 
                                alt=""
                                loading="lazy"
                                fetchPriority="auto"
                                className="absolute inset-0 !w-full !h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                    </div>

                    {/* Image 3: Bottom Left */}
                    <div 
                        ref={image3Ref}
                        className="absolute bottom-[10%] left-[15%] md:left-[20%] hidden lg:block"
                    >
                        <div className="relative w-36 md:w-48 aspect-[4/3] rounded-brand overflow-hidden shadow-2xl transition-transform duration-500 ease-out hover:scale-105 pointer-events-auto rotate-6">
                            <img 
                                src={backgroundImages[2] || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop'} 
                                alt=""
                                loading="lazy"
                                fetchPriority="auto"
                                width="224"
                                height="168"
                                role="presentation"
                                aria-hidden="true"
                                className="absolute inset-0 !w-full !h-full object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Content Container */}
            <div className="relative z-20 max-w-[90vw] md:max-w-5xl px-4 flex flex-col items-center text-center flex-grow justify-center">
                {/* Floating Tag */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-current/10 bg-current/5 backdrop-blur-sm mb-8 animate-[bloom_1s_ease-out_0.2s_both]">
                    <div className="size-2 rounded-full bg-agency-accent animate-pulse"></div>
                    <span className="text-xs font-bold tracking-widest uppercase opacity-80">{subtitle}</span>
                </div>

                {/* Title with Gradient and Custom Typography */}
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.9] text-agency-primary dark:text-white mb-8">
                    <div className="overflow-visible">
                        <span className="block animate-[bloom_1s_cubic-bezier(0.2,0,0.2,1)_0.4s_both]">
                           {(title || '').split(' ').slice(0, 2).join(' ')} 
                        </span>
                    </div>
                    <div className="overflow-visible mt-2">
                        <span className="block animate-[bloom_1s_cubic-bezier(0.2,0,0.2,1)_0.6s_both] theme-gradient-text italic pr-4">
                            {(title || '').split(' ').slice(2).join(' ')}
                        </span>
                    </div>
                </h1>

                {/* Description */}
                {(description || '').length > 0 && (
                    <p className="max-w-lg text-lg md:text-xl text-agency-primary/70 dark:text-white/70 font-light leading-relaxed mb-10 animate-[bloom_1s_ease-out_0.8s_both]">
                        {description}
                    </p>
                )}

                {/* CTA Actions */}
                <div className="flex flex-wrap items-center justify-center gap-6 animate-[bloom_1s_ease-out_1s_both]">
                    <Button
                        asChild
                        size="lg"
                        className="group h-14 px-10 rounded-full theme-gradient-animated text-white font-bold text-lg hover:scale-105 transition-all shadow-xl theme-gradient-glow border-none btn-magnetic"
                    >
                        <a href={ctaHref}>
                            {ctaText}
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                    
                    {secondaryCtaText && (
                        <button 
                            onClick={() => secondaryCtaHref && (window.location.href = secondaryCtaHref)}
                            className="group relative flex items-center gap-2 h-14 px-8 rounded-full border-2 border-primary/30 text-foreground font-bold hover:bg-primary/10 hover:border-primary transition-all dark:text-white dark:border-primary/50 btn-magnetic"
                        >
                            <span>{secondaryCtaText}</span>
                            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </button>
                    )}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="relative z-20 flex flex-col items-center gap-2 opacity-40 animate-bounce pb-10 mt-8">
                <span className="text-[10px] uppercase tracking-widest font-bold">Scroll Down</span>
                <div className="w-[1px] h-10 bg-current"></div>
            </div>

            {/* Decorative Grid Overlay */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05] agency-grid-overlay"></div>
        </section>
    );
};

export default HeroSection;
