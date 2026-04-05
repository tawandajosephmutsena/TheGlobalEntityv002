import AnimatedSection from '@/components/AnimatedSection';
import { cn } from '@/lib/utils';
import React from 'react';

interface StatItem {
    value: string;
    label: string;
    suffix?: string;
}

interface StatsSectionProps {
    stats?: StatItem[] | {
        projects_completed?: number;
        services_offered?: number;
        insights_published?: number;
        years_experience?: number;
    };
    title?: string;
    subtitle?:string;
    className?: string;
}

const defaultStats: StatItem[] = [
    { value: '150', label: 'Projects Completed', suffix: '+' },
    { value: '50', label: 'Happy Clients', suffix: '+' },
    { value: '5', label: 'Years Experience', suffix: '+' },
    { value: '24/7', label: 'Support' },
];

/**
 * Stats Section component with animated counters
 * Displays key statistics with scroll-triggered animations
 */
export const StatsSection: React.FC<StatsSectionProps> = ({
    stats = [],
    title = 'By The Numbers',
    subtitle = 'Our Impact',
    className,
}) => {
    // Convert stats object to array if needed
    const statsArray: StatItem[] = Array.isArray(stats) 
        ? stats 
        : [
            { value: String(stats?.projects_completed || 0), label: 'Projects Completed', suffix: '+' },
            { value: String(stats?.services_offered || 0), label: 'Services Offered', suffix: '+' },
            { value: String(stats?.insights_published || 0), label: 'Insights Published', suffix: '+' },
            { value: String(stats?.years_experience || 5), label: 'Years Experience', suffix: '+' },
          ];

    // Ensure we have 4 stats by merging with defaults
    const displayStats = [
        ...statsArray,
        ...defaultStats.slice(statsArray.length)
    ].slice(0, 4);
    return (
        <section className={cn('gradient-aurora py-32', className)}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <header className="mb-16">
                    <span className="theme-gradient-text font-bold uppercase tracking-widest text-sm mb-2 block animate-[bloom_1s_ease-out_0.2s_both]">
                        {subtitle}
                    </span>
                    <h2 className="text-5xl md:text-7xl font-bold text-foreground dark:text-white animate-[bloom_1s_ease-out_0.4s_both]">
                        {title} <br/>
                        <span className="opacity-40">defined by data.</span>
                    </h2>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                    {/* Large Stat Box */}
                    <AnimatedSection 
                        animation="scale"
                        className="lg:col-span-7 gradient-accent-card bg-white dark:bg-[#161616] border border-current/5 p-8 md:p-12 rounded-3xl flex flex-col justify-between min-h-[300px] md:min-h-[400px] relative overflow-hidden group cursor-default"
                    >
                        <div className="relative z-10">
                            <div className="size-16 rounded-full flex items-center justify-center mb-8 theme-gradient-animated text-white shadow-lg">
                                <span className="material-symbols-outlined text-4xl">groups</span>
                            </div>
                            <h3 className="text-xl uppercase tracking-widest opacity-40 font-bold mb-4">{displayStats[0].label}</h3>
                            <div className="text-7xl md:text-9xl font-black text-foreground dark:text-white group-hover:scale-110 transition-transform origin-left duration-700">
                                {displayStats[0].value}<span className="theme-gradient-text">{displayStats[0].suffix || '+'}</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-1/2 h-full pointer-none" style={{ background: 'linear-gradient(to left, color-mix(in oklch, var(--gradient-start) 8%, transparent), transparent)' }}></div>
                    </AnimatedSection>

                    {/* Accent Stat Box */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <AnimatedSection 
                            animation="scale"
                            delay={200}
                            className="flex-1 theme-gradient-animated text-white p-8 md:p-12 rounded-3xl flex flex-col justify-between min-h-[200px] md:min-h-[250px] group transition-transform hover:-translate-y-2 cursor-default shadow-xl theme-gradient-glow"
                        >
                            <div>
                                <span className="material-symbols-outlined text-4xl mb-4">bolt</span>
                                <h3 className="text-xl uppercase tracking-widest opacity-80 font-bold">{displayStats[1].label}</h3>
                            </div>
                            <div className="text-6xl md:text-8xl font-black">{displayStats[1].value}{displayStats[1].suffix || '%'}</div>
                        </AnimatedSection>

                        <div className="grid grid-cols-2 gap-6">
                            <AnimatedSection 
                                animation="scale"
                                delay={400}
                                className="bg-white dark:bg-[#161616] border border-current/5 p-6 md:p-8 rounded-3xl group hover:shadow-2xl transition-all cursor-default"
                            >
                                <h3 className="text-xs md:text-sm uppercase tracking-widest opacity-40 font-bold mb-4 leading-tight">{displayStats[2].label}</h3>
                                <div className="text-4xl md:text-5xl font-black text-foreground dark:text-white group-hover:text-primary transition-colors">
                                    {displayStats[2].value}<span className="text-primary">{displayStats[2].suffix || '+'}</span>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection 
                                animation="scale"
                                delay={600}
                                className="gradient-mesh p-6 md:p-8 rounded-3xl group hover:scale-105 transition-all cursor-default gradient-dot-grid"
                            >
                                <h3 className="text-xs md:text-sm uppercase tracking-widest opacity-60 font-bold mb-4 leading-tight">{displayStats[3].label}</h3>
                                <div className="text-4xl md:text-5xl font-black">{displayStats[3].value}</div>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
