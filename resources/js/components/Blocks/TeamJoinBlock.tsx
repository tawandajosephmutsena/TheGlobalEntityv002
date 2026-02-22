import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';

interface TeamJoinBlockProps {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaHref?: string;
}

const TeamJoinBlock: React.FC<TeamJoinBlockProps> = ({
    title = 'Be Part of The Movement.',
    subtitle = 'Careers',
    ctaText = 'JOIN OUR TEAM',
    ctaHref = '/contact'
}) => {
    return (
        <section className="bg-agency-primary dark:bg-black py-40 relative">
            <div className="mx-auto max-w-5xl px-4 text-center">
                <AnimatedSection animation="scale">
                    <span className="text-agency-accent font-bold uppercase tracking-[0.4em] text-xs mb-8 block">{subtitle}</span>
                    <h2 className="text-5xl md:text-8xl font-black text-agency-secondary dark:text-white uppercase tracking-tighter mb-12">
                        {title.includes('Movement.') ? (
                            <>
                                {title.replace('The Movement.', '')} <br/>
                                <span className="text-agency-accent italic">The Movement.</span>
                            </>
                        ) : title}
                    </h2>
                    <a href={ctaHref} className="inline-flex h-20 px-12 items-center justify-center rounded-full bg-agency-secondary dark:bg-white text-agency-primary font-black text-lg uppercase tracking-widest hover:bg-agency-accent transition-all shadow-2xl">
                        {ctaText}
                    </a>
                </AnimatedSection>
            </div>
        </section>
    );
};

export default TeamJoinBlock;
