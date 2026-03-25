import React, { useRef, useEffect } from 'react';
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
    cta1 = { text: "Propose a Partnership", href: "#contact" },
    cta2 = { text: "View Mission Ledger", href: "#mission" },
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

    return (
        <section 
            ref={containerRef}
            className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background text-foreground py-32 theme-stitch"
        >
            {/* Watercolor Background Effect */}
            <div className="absolute inset-0 z-0 watercolor-bg pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] rounded-full bg-secondary/10 blur-[140px] mix-blend-multiply dark:mix-blend-soft-light opacity-60" />
                <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-primary/15 blur-[120px] mix-blend-multiply dark:mix-blend-soft-light opacity-50" />
                <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-[100px] mix-blend-overlay opacity-30" />
            </div>

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Floating Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-[2]">
                <div className="absolute top-[15%] left-[10%] opacity-20 dark:opacity-40">
                    <Wind ref={floatRef1} className="text-secondary w-20 h-20 -rotate-12" />
                </div>
                <div className="absolute bottom-[20%] left-[8%] opacity-20 dark:opacity-40">
                    <Anchor ref={floatRef2} className="text-secondary w-28 h-28 rotate-12" />
                </div>
                <div className="absolute top-[25%] right-[10%] opacity-20 dark:opacity-40">
                    <Compass ref={floatRef3} className="text-secondary w-24 h-24 rotate-45" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <AnimatedSection animation="fade-up" delay={100}>
                        <div className="flex justify-center mb-8">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                {badgeText}
                            </span>
                        </div>
                    </AnimatedSection>

                    <AnimatedSection animation="fade-up" delay={300} textReveal textRevealType="words">
                        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-on-surface leading-[0.85] italic-not-really">
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

                    <AnimatedSection animation="fade-up" delay={900} className="mt-16 flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Button 
                            size="lg" 
                            className="rounded-full px-10 h-16 text-base font-black uppercase tracking-widest bg-primary text-on-primary hover:scale-105 transition-transform duration-500 group relative overflow-hidden" 
                            asChild
                        >
                            <a href={cta1.href}>
                                <span className="relative z-10 flex items-center">
                                    {cta1.text}
                                    <Ship className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-2" />
                                </span>
                            </a>
                        </Button>
                        <Button 
                            variant="outline" 
                            size="lg" 
                            className="rounded-full px-10 h-16 text-base font-black uppercase tracking-widest border-primary/20 bg-transparent hover:bg-primary/5 hover:border-primary transition-all duration-500" 
                            asChild
                        >
                            <a href={cta2.href}>
                                {cta2.text}
                            </a>
                        </Button>
                    </AnimatedSection>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
        </section>
    );
};

export default PartnersHero;
