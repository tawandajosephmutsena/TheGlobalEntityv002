import React from 'react';
import AnimatedSection from '@/components/AnimatedSection';
import { Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { TeamMember } from '@/types';

interface TeamGridBlockProps {
    title?: string;
    subtitle?: string;
    feedSource?: 'manual' | 'team';
    maxItems?: number;
    items?: Array<{
        name: string;
        position: string;
        avatar?: string;
        bio?: string;
        social_links?: {
            linkedin?: string;
            github?: string;
            twitter?: string;
            website?: string;
        };
    }>;
    teamMembers?: TeamMember[];
}

const TeamGridBlock: React.FC<TeamGridBlockProps> = ({
    title,
    subtitle,
    feedSource = 'team',
    maxItems = 12,
    items = [],
    teamMembers = []
}) => {
    // Determine which items to show
    let displayMembers: Array<{
        id?: number;
        name: string;
        position: string;
        avatar?: string | null;
        bio?: string;
        social_links?: {
            linkedin?: string;
            github?: string;
            twitter?: string;
            website?: string;
        } | null;
    }> = [];
    
    if (feedSource === 'manual') {
        displayMembers = items;
    } else {
        displayMembers = teamMembers.map(member => ({
            id: member.id,
            name: member.name,
            position: member.position,
            avatar: member.avatar,
            bio: member.bio,
            social_links: member.social_links
        }));
    }

    displayMembers = displayMembers.slice(0, maxItems);

    return (
        <section className="bg-agency-secondary dark:bg-black/40 py-40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {(title || subtitle) && (
                    <div className="mb-24 text-center">
                        {subtitle && (
                            <span className="text-agency-accent font-black [font-variant-caps:small-caps] tracking-tighter text-xs mb-4 block">
                                {subtitle}
                            </span>
                        )}
                        {title && (
                            <h2 className="text-5xl md:text-7xl font-black [font-variant-caps:small-caps] tracking-tighter text-agency-primary dark:text-white">
                                {title}
                            </h2>
                        )}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {displayMembers.map((member, i) => (
                        <AnimatedSection key={member.id || i} animation="slide-up" delay={i * 100} className="group flex flex-col items-center">
                            {/* Large Typography Portrait Card */}
                            <div className="relative w-full aspect-[3/4] rounded-[60px] overflow-hidden mb-12 shadow-2xl bg-agency-primary/5 dark:bg-white/5 group-hover:-translate-y-4 transition-all duration-700">
                                {member.avatar ? (
                                    <img 
                                        src={member.avatar} 
                                        alt={member.name} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-agency-accent/10 flex items-center justify-center opacity-40">
                                        <span className="text-9xl font-black">{member.name ? member.name.charAt(0) : '?'}</span>
                                    </div>
                                )}
                                
                                {/* Overlay content on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-agency-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="absolute inset-0 flex flex-col justify-end p-12 translate-y-20 group-hover:translate-y-0 transition-transform duration-700">
                                    <div className="flex space-x-4 mb-6">
                                        {member.social_links?.linkedin && <a href={member.social_links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="text-white hover:text-agency-accent transition-colors"><Linkedin className="size-6" /></a>}
                                        {member.social_links?.github && <a href={member.social_links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="text-white hover:text-agency-accent transition-colors"><Github className="size-6" /></a>}
                                        {member.social_links?.twitter && <a href={member.social_links.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" className="text-white hover:text-agency-accent transition-colors"><Twitter className="size-6" /></a>}
                                        {member.social_links?.website && <a href={member.social_links.website} target="_blank" rel="noopener noreferrer" aria-label="Personal Website" className="text-white hover:text-agency-accent transition-colors"><Globe className="size-6" /></a>}
                                    </div>
                                    <p className="text-white/70 text-sm leading-relaxed mb-4">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>

                            {/* Base Content */}
                            <div className="text-center w-full px-4">
                                <span className="text-[10px] font-black [font-variant-caps:small-caps] tracking-tighter text-agency-accent mb-2 block">{member.position}</span>
                                <h3 className="text-3xl md:text-5xl font-black [font-variant-caps:small-caps] tracking-tighter text-agency-primary dark:text-white group-hover:italic group-hover:translate-x-2 transition-all duration-500">
                                    {member.name ? member.name.split(' ')[0] : ''} <br/>
                                    <span className="opacity-30">{member.name ? member.name.split(' ').slice(1).join(' ') : ''}</span>
                                </h3>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamGridBlock;
