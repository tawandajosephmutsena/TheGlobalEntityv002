import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/AnimatedSection';
import { Ship, Anchor, Wind, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PartnersHeroProps {
    badgeText?: string;
    title?: string;
    description?: string;
    cta1?: { text: string; href: string };
    cta2?: { text: string; href: string };
}

const PartnersHero: React.FC<PartnersHeroProps> = ({
    badgeText = "Join Our Fleet",
    title = "Chart the Unseen with Us.",
    description = "We are not just a travel platform; we are the ink and parchment for modern explorers. By partnering with us, you join a legacy of ethereal storytelling and authentic discovery.",
    cta1,
    cta2,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const floatRef1 = useRef<SVGSVGElement>(null);
    const floatRef2 = useRef<SVGSVGElement>(null);
    const floatRef3 = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Floating animation for decorative elements using GSAP
        const floaters = [floatRef1.current, floatRef2.current, floatRef3.current].filter(Boolean);
        
        floaters.forEach((el, i) => {
            gsap.to(el, {
                y: -30,
                x: i % 2 === 0 ? 15 : -15,
                rotation: i % 2 === 0 ? 10 : -10,
                duration: 4 + i,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.7
            });
        });

        // Optional: Mouse parallax for the container background
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xMove = (clientX / innerWidth - 0.5) * 20;
            const yMove = (clientY / innerHeight - 0.5) * 20;

            gsap.to(".watercolor-bg", {
                x: xMove,
                y: yMove,
                duration: 2,
                ease: "power2.out"
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const hasCta1 = cta1?.text && cta1.text.trim() !== '';
    const hasCta2 = cta2?.text && cta2.text.trim() !== '';
    const showCtaArea = hasCta1 || hasCta2;

    return (
        <section 
            ref={containerRef}
            className="relative min-h-[90vh] flex items-center justify-center overflow-visible text-foreground pt-48 pb-32"
        >

            {/* Floating Decorative Elements (Static) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[1]">
                <div className="absolute top-[15%] left-[10%] opacity-20 dark:opacity-40">
                    <Wind className="text-secondary w-20 h-20 -rotate-12" />
                </div>
                <div className="absolute bottom-[20%] left-[8%] opacity-20 dark:opacity-40">
                    <Anchor className="text-secondary w-28 h-28 rotate-12" />
                </div>
                <div className="absolute top-[25%] right-[10%] opacity-20 dark:opacity-40">
                    <Compass className="text-secondary w-24 h-24 rotate-45" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <AnimatedSection animation="fade-up" delay={100}>
                        <div className="flex justify-center mb-8">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 text-primary text-xs font-bold tracking-widest liquid-glass">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {badgeText}
                            </span>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection animation="fade-up" delay={300} textReveal textRevealType="words">
                        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-on-surface leading-[0.85]">
                            {title.split(' ').map((word, i, arr) => (
                                <span key={i} className={cn(
                                    "inline-block",
                                    (i === 1 || i === arr.length - 1) && "text-primary italic font-serif font-light"
                                )}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection animation="fade-up" delay={600} className="mt-10">
                        <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed font-serif italic">
                            {description}
                        </p>
                    </AnimatedSection>

                    {showCtaArea && (
                        <AnimatedSection animation="fade-up" delay={900} className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
                            {hasCta1 && (
                                <Button 
                                    size="lg" 
                                    className="rounded-full px-10 h-16 text-base font-black tracking-widest bg-primary text-on-primary hover:scale-105 transition-transform duration-500 group relative overflow-hidden" 
                                    asChild
                                >
                                    <a href={cta1.href || '#'}>
                                        <span className="relative z-10 flex items-center">
                                            {cta1.text}
                                            <Ship className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />
                                        </span>
                                    </a>
                                </Button>
                            )}
                            {hasCta2 && (
                                <Button 
                                    variant="outline" 
                                    size="lg" 
                                    className="rounded-full px-10 h-16 text-base font-black tracking-widest border-primary/20 bg-transparent hover:bg-primary/5 hover:border-primary transition-all duration-500" 
                                    asChild
                                >
                                    <a href={cta2.href || '#'}>
                                        {cta2.text}
                                    </a>
                                </Button>
                            )}
                        </AnimatedSection>
                    )}
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-transparent z-[5]" />
        </section>
    );
};

export default PartnersHero;
