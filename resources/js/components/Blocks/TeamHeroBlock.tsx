import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';

interface TeamHeroBlockProps {
    title?: string;
    subtitle?: string;
    description?: string;
    marqueeText?: string;
}

const TeamHeroBlock: React.FC<TeamHeroBlockProps> = ({ 
    title = 'The Dream Team.', 
    subtitle = 'Who We Are', 
    description = 'A diverse collective of thinkers, designers, and builders dedicated to pushing the boundaries of what\'s possible in the digital realm.', 
    marqueeText = 'COLLECTIVE GENIUS' 
}) => {
    return (
        <section className="bg-white dark:bg-agency-dark pt-48 pb-20 relative overflow-hidden">
            <div className="absolute top-20 right-0 w-full overflow-hidden opacity-[0.03] select-none pointer-events-none text-right">
                <span className="text-[25vw] font-black whitespace-nowrap leading-none block marquee-reverse">
                    {marqueeText} {marqueeText}
                </span>
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl">
                    <AnimatedSection animation="fade-up">
                        <span className="text-agency-accent font-bold tracking-widest text-xs mb-8 block [font-variant-caps:small-caps]">{subtitle}</span>
                        <h1 className="font-display text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-agency-primary dark:text-white mb-12 [font-variant-caps:small-caps]">
                            {title.split(' ')[0]} <br/>
                            <span className="opacity-30 italic">{title.split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-agency-primary/60 dark:text-white/60 leading-relaxed font-light">
                            {description}
                        </p>
                    </AnimatedSection>
                </div>
            </div>
        </section>
    );
};

export default TeamHeroBlock;
