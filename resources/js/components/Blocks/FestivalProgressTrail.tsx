import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import AnimatedSection from '@/components/AnimatedSection';

interface FestivalProgressTrailProps {
    steps: Array<{
        id: string;
        label: string;
        status: 'completed' | 'current' | 'upcoming';
    }>;
    scriptText?: string;
    pathType?: 'wave' | 'loop' | 'zigzag';
    color?: string;
}

const paths = {
    wave: "M -100 100 Q 250 0 500 100 T 1100 100",
    loop: "M -100 150 C 200 150 300 0 500 100 C 700 200 800 50 1100 50",
    zigzag: "M -100 50 L 200 150 L 500 50 L 800 150 L 1100 50"
};

const FestivalProgressTrail: React.FC<FestivalProgressTrailProps> = ({
    steps = [],
    scriptText = "FOLLOW THE RHYTHM",
    pathType = 'wave',
    color = "var(--agency-accent)"
}) => {
    return (
        <section className="relative h-64 md:h-96 w-full overflow-visible flex items-center justify-center">

            {/* SVG Path (Static) */}
            <svg 
                className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-0"
                viewBox="0 0 1000 200"
                preserveAspectRatio="none"
            >
                <path 
                    d={paths[pathType]}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeDasharray="12 12"
                />
            </svg>

            {/* Floating Text */}
            <div className="relative z-10 text-center px-6">
                <AnimatedSection animation="fade-up">
                    <h3 className="text-4xl md:text-7xl font-serif italic text-agency-accent/60 leading-none [font-variant-caps:small-caps]">
                        {scriptText}
                    </h3>
                    <div className="flex items-center justify-center gap-4 mt-8">
                        {steps.map((step, idx) => (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center">
                                    <div className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-500",
                                        step.status === 'completed' && "bg-agency-accent",
                                        step.status === 'current' && "bg-agency-accent animate-pulse shadow-[0_0_10px_rgba(var(--agency-accent-rgb),0.5)]",
                                        step.status === 'upcoming' && "bg-agency-primary/20"
                                    )} />
                                    <span className={cn(
                                        "text-[8px] font-mono tracking-widest mt-2 transition-opacity duration-500 [font-variant-caps:small-caps]",
                                        step.status === 'upcoming' ? "text-agency-primary/20" : "text-agency-primary/40"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="w-8 h-[1px] bg-agency-primary/10 mt-1" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </AnimatedSection>
            </div>


        </section>
    );
};

export default FestivalProgressTrail;
