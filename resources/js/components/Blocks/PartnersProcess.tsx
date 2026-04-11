import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedSection from '@/components/AnimatedSection';
import WatercolorBackground from '@/components/WatercolorBackground';

interface PartnersProcessProps {
    title?: string;
    subtitle?: string;
    steps?: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
    }>;
}

const PartnersProcess: React.FC<PartnersProcessProps> = ({
    title = "The Pirate's Trail to Success",
    steps = [
        { id: '1', title: 'The Signal', description: 'Reach out and share your vision.', icon: '1' },
        { id: '2', title: 'The Parley', description: 'Customizing the strategy.', icon: '2' },
        { id: '3', title: 'The Voyage', description: 'Execute and amplify content.', icon: '3' },
        { id: '4', title: 'The Bounty', description: 'Measure impact and growth.', icon: '4' },
    ]
}) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!pathRef.current) return;

        const path = pathRef.current;
        const length = path.getTotalLength();

        // Set initial dash properties
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
        });

        // Animate strokeDashoffset on scroll
        const scrollTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1.5,
            onUpdate: (self) => {
                const progress = self.progress;
                gsap.set(path, {
                    strokeDashoffset: length * (1 - progress),
                });
            },
        });

        return () => {
            if (scrollTrigger) scrollTrigger.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative py-32 overflow-hidden gradient-mesh-partners-process text-foreground theme-stitch">
            <WatercolorBackground variant="partnersProcess" />
            
            <div className="container mx-auto px-4 relative z-10">
                <AnimatedSection animation="fade-up" className="text-center mb-24">
                    <h2 className="font-display text-5xl md:text-7xl font-black [font-variant-caps:small-caps] tracking-tighter text-on-surface">
                        {title}
                    </h2>
                </AnimatedSection>

                <div className="relative max-w-5xl mx-auto">
                    {/* Animated Path (Desktop Only) */}
                    <div className="absolute inset-0 top-8 left-0 w-full h-full -z-10 pointer-events-none hidden md:block opacity-60">
                        <svg className="w-full h-32 overflow-visible" viewBox="0 0 1000 100" preserveAspectRatio="none">
                            <path 
                                ref={pathRef}
                                d="M0 50C150 50 250 10 400 10C550 10 650 90 800 90C950 90 1000 50 1000 50" 
                                fill="none" 
                                stroke="var(--primary)" 
                                strokeWidth="4" 
                                strokeDasharray="12 12"
                            />
                        </svg>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <AnimatedSection key={step.id} animation="fade-up" delay={index * 200} className="text-center group">
                                <div className="relative mb-8">
                                    <div className="w-16 h-16 bg-secondary text-on-secondary rounded-full flex items-center justify-center mx-auto shadow-sea-mist ring-8 ring-background transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg] z-20 relative">
                                        <span className="text-2xl font-black">{step.id}</span>
                                    </div>
                                    {/* Pulsing indicator background */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/5 -z-10 scale-0 group-hover:scale-100 transition-transform duration-1000 ease-out" />
                                </div>
                                <h4 className="font-display text-2xl font-black [font-variant-caps:small-caps] tracking-tighter text-on-surface mb-3 transition-colors duration-500 group-hover:text-primary">
                                    {step.title}
                                </h4>
                                <p className="text-on-surface-variant font-medium text-sm leading-relaxed max-w-[200px] mx-auto">
                                    {step.description}
                                </p>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default PartnersProcess;
