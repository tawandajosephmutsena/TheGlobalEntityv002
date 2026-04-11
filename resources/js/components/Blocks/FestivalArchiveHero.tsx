import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import AnimatedSection from '@/components/AnimatedSection';

interface MarginaliaItem {
    id: string;
    type: 'text' | 'image' | 'stamp';
    content: string;
    position: { x: string; y: string };
    rotation?: number;
    parallaxSpeed?: number;
}

interface WatercolorBlur {
    color: string;
    position: { x: string; y: string };
    size: string;
}

interface FestivalArchiveHeroProps {
    badge?: string;
    title?: string;
    description?: string;
    watercolorBlurs?: WatercolorBlur[];
    marginalia?: MarginaliaItem[];
}

const FestivalArchiveHero: React.FC<FestivalArchiveHeroProps> = ({
    badge = "Ethereal Archive",
    title = "Festival\nMap Archive",
    description = "Step into the shifting corridors of sound and light. A repository of ethereal cartography for the modern nomad.",
    watercolorBlurs = [
        { color: 'bg-agency-primary/20', position: { x: '10%', y: '10%' }, size: 'w-96 h-96' },
        { color: 'bg-agency-accent/20', position: { x: '70%', y: '40%' }, size: 'w-[30rem] h-[30rem]' },
        { color: 'bg-agency-secondary/10', position: { x: '30%', y: '70%' }, size: 'w-80 h-80' },
    ],
    marginalia = [
        { id: '1', type: 'text', content: 'VOL. 018 // SHIFTING SANDS', position: { x: '15%', y: '25%' }, rotation: -12, parallaxSpeed: 1.5 },
        { id: '2', type: 'stamp', content: 'AUTHENTIC REVELRY', position: { x: '80%', y: '15%' }, rotation: 8, parallaxSpeed: 2 },
        { id: '3', type: 'text', content: 'COORDINATES: LAT 51.5, LONG 0.12', position: { x: '10%', y: '75%' }, rotation: 5, parallaxSpeed: 1.2 },
    ]
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const marginaliaRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Floating animation for marginalia
        marginaliaRefs.current.forEach((el, i) => {
            if (!el) return;
            const item = marginalia[i];
            gsap.to(el, {
                y: `-=${20 * (item.parallaxSpeed || 1)}`,
                x: `+=${10 * (item.parallaxSpeed || 1)}`,
                rotation: `+=${5 * (item.parallaxSpeed || 1)}`,
                duration: 4 + i,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: i * 0.5
            });
        });

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            const xMove = (clientX / innerWidth - 0.5) * 30;
            const yMove = (clientY / innerHeight - 0.5) * 30;

            gsap.to(".watercolor-blur", {
                x: xMove,
                y: yMove,
                duration: 2,
                ease: "power2.out",
                stagger: 0.1
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [marginalia]);

    return (
        <section 
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-visible pt-64 pb-32"
        >

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Marginalia */}
            <div className="absolute inset-0 pointer-events-none z-10 select-none">
                {marginalia.map((item, i) => (
                    <div 
                        key={item.id}
                        ref={el => { marginaliaRefs.current[i] = el; }}
                        className={cn("absolute", `left-[${item.position.x}] top-[${item.position.y}]`)}
                    >
                        <div 
                            className={cn(
                                "px-4 py-2 border border-agency-primary/10 rounded-sm liquid-glass",
                                "text-[10px] font-mono tracking-[0.3em] [font-variant-caps:small-caps] transition-colors duration-500",
                                item.type === 'stamp' ? "bg-agency-accent/5 border-agency-accent/20 text-agency-accent rotate-12" : "text-agency-primary/40",
                                `rotate-[${item.rotation || 0}deg]`
                            )}
                        >
                            {item.content}
                        </div>
                    </div>
                ))}
            </div>

            <div className="container relative z-20 mx-auto px-4">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <AnimatedSection animation="fade-up" delay={200}>
                        <div className="flex items-center gap-4 mb-12">
                            <span className="w-12 h-[1px] bg-agency-primary/20" />
                            <span className="text-xs font-bold [font-variant-caps:small-caps] tracking-[0.4em] text-agency-primary/60">
                                {badge}
                            </span>
                            <span className="w-12 h-[1px] bg-agency-primary/20" />
                        </div>
                    </AnimatedSection>

                    <div className="relative text-center">
                        <AnimatedSection animation="fade-up" delay={400} textReveal textRevealType="words">
                            <h1 className="text-7xl md:text-[10rem] lg:text-[12rem] font-black tracking-tighter leading-[0.8] text-agency-primary whitespace-pre-line mb-8">
                                {title}
                            </h1>
                        </AnimatedSection>

                        <AnimatedSection animation="fade-up" delay={600} className="relative z-10">
                            <p className="text-lg md:text-2xl text-agency-primary/60 max-w-2xl mx-auto font-serif italic leading-relaxed">
                                {description}
                            </p>
                        </AnimatedSection>

                        {/* Floating elements behind/around text */}
                        <div className="absolute -top-10 -right-20 w-40 h-40 bg-agency-accent/10 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-10 -left-20 w-32 h-32 bg-agency-primary/5 rounded-full blur-2xl -z-10 animate-pulse [animation-delay:1s]" />
                    </div>
                </div>
            </div>

            {/* Scroll Indicator Trail (Partial) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40 z-20">
                <span className="text-[10px] font-mono tracking-[0.5em] [font-variant-caps:small-caps] vertical-text">Scroll to Unravel</span>
                <div className="w-[1px] h-20 bg-gradient-to-b from-agency-primary to-transparent" />
            </div>
        </section>
    );
};

export default FestivalArchiveHero;
