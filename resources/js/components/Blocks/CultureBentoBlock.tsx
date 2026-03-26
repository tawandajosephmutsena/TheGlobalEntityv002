import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

interface CultureBentoBlockProps {
    title?: string;
    description?: string;
    statValue?: string;
    statLabel?: string;
}

const CultureBentoBlock: React.FC<CultureBentoBlockProps> = ({
    title = 'We Value Quality Above Everything.',
    description = 'Our culture is built on mutual respect, continuous learning, and a relentless pursuit of excellence.',
    statValue = '100%',
    statLabel = 'Human Centered'
}) => {
    return (
        <section className="bg-white dark:bg-agency-dark py-40 border-t border-agency-primary/5 dark:border-white/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <AnimatedSection 
                        animation="slide-right"
                        className="md:col-span-8 p-16 rounded-[60px] bg-agency-accent text-agency-primary flex flex-col justify-between min-h-[400px]"
                    >
                        <h2 className="text-5xl md:text-7xl font-black lowercase [font-variant-caps:small-caps] tracking-tighter leading-none">
                            {title.includes('Everything.') ? (
                                <>
                                    {title.replace('Everything.', '')} <br/>
                                    <span className="italic">Everything.</span>
                                </>
                            ) : title}
                        </h2>
                        <div className="flex justify-between items-end">
                            <p className="max-w-md font-bold lowercase [font-variant-caps:small-caps] tracking-tight opacity-70">
                                {description}
                            </p>
                            <div className="size-20 rounded-full border border-agency-primary/20 flex items-center justify-center">
                                <ArrowUpRight className="size-10" />
                            </div>
                        </div>
                    </AnimatedSection>
                    
                    <AnimatedSection 
                        animation="slide-left"
                        className="md:col-span-4 p-12 rounded-[60px] bg-agency-primary dark:bg-white/5 text-agency-secondary dark:text-white flex flex-col justify-center text-center dark:border dark:border-white/10"
                    >
                        <span className="text-6xl font-black mb-4 text-agency-secondary dark:text-white">{statValue}</span>
                        <span className="text-xs font-bold lowercase [font-variant-caps:small-caps] tracking-widest text-agency-secondary dark:text-white opacity-70 dark:opacity-90">{statLabel}</span>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default CultureBentoBlock;
