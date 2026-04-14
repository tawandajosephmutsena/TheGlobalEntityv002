import AnimatedSection from '@/components/AnimatedSection';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    Download, 
    Facebook, 
    Twitter, 
    MessageCircle as WhatsApp 
} from 'lucide-react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

import { OptimizedImage } from '@/components/OptimizedImage';

interface ImageConversions {
    sizes?: Record<string, string>;
    webp_sizes?: Record<string, string>;
    placeholder?: string;
}

interface ProjectItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    featured_image?: string | null;
    conversions?: ImageConversions;
    client?: string | null;
    technologies?: string[] | null;
}

const defaultProjects: ProjectItem[] = [
    {
        id: 1,
        title: 'E-Commerce Platform',
        slug: 'ecommerce-platform',
        description: 'Modern shopping experience with advanced features',
        client: 'TechCorp',
        technologies: ['React', 'Node.js', 'MongoDB'],
    },
    {
        id: 2,
        title: 'Analytics Dashboard',
        slug: 'analytics-dashboard',
        description: 'Data visualization tool for business insights',
        client: 'DataFlow Inc',
        technologies: ['Vue.js', 'Python', 'PostgreSQL'],
    },
    {
        id: 3,
        title: 'Music Streaming App',
        slug: 'music-streaming-app',
        description: 'Next-gen audio experience with social features',
        client: 'SoundWave',
        technologies: ['React Native', 'GraphQL', 'AWS'],
    },
];

interface FeaturedProjectsProps {
    projects?: ProjectItem[];
    title?: string;
    subtitle?: string;
    description?: string;
    className?: string;
    showViewAll?: boolean;
}

/**
 * Featured Projects Section component
 * Displays a grid of featured portfolio items with sticky sidebar and social actions
 */
export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({
    projects = defaultProjects,
    title = 'Featured Work',
    subtitle = 'Case Studies',
    description = 'Defining digital experiences for forward-thinking brands across the globe.',
    className,
    showViewAll = true,
}) => {
    const sectionRef = React.useRef<HTMLElement>(null);

    // GSAP Fade transition for the entire section
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const ctx = gsap.context(() => {
            gsap.fromTo(sectionRef.current, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play reverse play reverse'
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleDownload = (project: ProjectItem) => {
        if (project.featured_image) {
            const link = document.createElement('a');
            link.href = project.featured_image;
            link.download = `${project.slug || project.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleShare = (platform: string, project: ProjectItem) => {
        const url = encodeURIComponent(window.location.origin + '/portfolio/' + project.slug);
        const text = encodeURIComponent(`Check out ${project.title} on our portfolio!`);
        
        let shareUrl = '';
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank');
        }
    };

    return (
        <section 
            ref={sectionRef}
            className={cn('relative bg-agency-secondary dark:bg-agency-dark overflow-hidden', className)}
        >
            <div className="flex flex-col lg:flex-row max-w-[1920px] mx-auto min-h-screen">
                {/* Left column - Sticky Sidebar */}
                <div className="lg:w-[40%] relative lg:border-r border-agency-primary/5 dark:border-white/5">
                    <aside className="lg:sticky lg:top-0 lg:h-screen p-6 lg:p-24 flex flex-col justify-center gap-8">
                        <header className="space-y-4">
                            <span className="text-agency-accent font-bold uppercase tracking-widest text-sm block">
                                {subtitle}
                            </span>
                            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter text-agency-primary dark:text-white leading-[0.85]">
                                {title.split(' ')[0]} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-current to-transparent opacity-30">
                                    {title.split(' ').slice(1).join(' ') || 'Projects'}
                                </span>
                            </h2>
                        </header>
                        
                        <div className="w-20 h-1 bg-agency-accent"></div>
                        
                        <p className="text-lg lg:text-xl text-agency-primary/60 dark:text-white/60 max-w-sm leading-relaxed">
                            {description}
                        </p>

                        {showViewAll && (
                            <Link
                                href="/portfolio"
                                className="group inline-flex items-center gap-4 text-agency-primary dark:text-white font-bold text-lg hover:text-agency-accent transition-colors underline decoration-agency-accent/30 cursor-pointer w-fit"
                            >
                                <span>View All Projects</span>
                                <div className="size-10 rounded-full border border-current flex items-center justify-center group-hover:bg-agency-accent group-hover:border-transparent group-hover:text-agency-primary transition-all">
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </div>
                            </Link>
                        )}
                    </aside>
                </div>

                <main className="lg:w-[60%] lg:ml-auto p-6 lg:p-20 lg:py-40 flex flex-col gap-12 lg:gap-48 border-l border-agency-primary/5 dark:border-white/5">
                {projects.map((project: ProjectItem, index: number) => (
                    <AnimatedSection
                        key={project.id}
                        animation="slide-up"
                        delay={100}
                        className="group"
                    >
                        <div className="block">
                            {/* Image Container - Square Aspect Ratio */}
                            <div className="aspect-square rounded-[40px] overflow-hidden mb-8 relative shadow-2xl">
                                {project.featured_image ? (
                                    <OptimizedImage 
                                        src={project.featured_image} 
                                        alt={project.title}
                                        conversions={project.conversions}
                                        priority={index === 0}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-agency-accent/5 flex items-center justify-center text-8xl">
                                        🚀
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex items-center gap-4 mb-8">
                                <button 
                                    onClick={() => handleDownload(project)}
                                    className="flex items-center gap-2 bg-agency-accent text-agency-primary px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95"
                                >
                                    <Download className="size-4" />
                                    Download
                                </button>
                                
                                <div className="h-4 w-px bg-agency-primary/10 dark:bg-white/10 mx-2"></div>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleShare('facebook', project)}
                                        className="size-10 rounded-full border border-agency-primary/10 dark:border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-transparent hover:text-white transition-all shadow-sm group/btn"
                                        title="Share on Facebook"
                                    >
                                        <Facebook className="size-4 group-hover/btn:scale-110" />
                                    </button>
                                    <button 
                                        onClick={() => handleShare('twitter', project)}
                                        className="size-10 rounded-full border border-agency-primary/10 dark:border-white/10 flex items-center justify-center hover:bg-[#000000] hover:border-transparent hover:text-white transition-all shadow-sm group/btn"
                                        title="Share on X (Twitter)"
                                    >
                                        <Twitter className="size-4 group-hover/btn:scale-110" />
                                    </button>
                                    <button 
                                        onClick={() => handleShare('whatsapp', project)}
                                        className="size-10 rounded-full border border-agency-primary/10 dark:border-white/10 flex items-center justify-center hover:bg-[#25D366] hover:border-transparent hover:text-white transition-all shadow-sm group/btn"
                                        title="Share on WhatsApp"
                                    >
                                        <WhatsApp className="size-4 group-hover/btn:scale-110" />
                                    </button>
                                </div>
                            </div>

                            {/* Project Info */}
                            <div className="flex justify-between items-end border-b border-agency-primary/10 dark:border-white/10 pb-10">
                                <div className="max-w-md">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-xs font-mono opacity-40 uppercase tracking-widest">0{index + 1}</span>
                                        <div className="h-px w-8 bg-current opacity-20"></div>
                                        <span className="text-xs font-bold text-agency-accent uppercase tracking-widest">{project.client || 'Client'}</span>
                                    </div>
                                    <Link href={`/portfolio/${project.slug}`}>
                                        <h3 className="text-4xl md:text-5xl font-black text-agency-primary dark:text-white group-hover:text-agency-accent transition-colors duration-300 tracking-tighter cursor-pointer">
                                            {project.title}
                                        </h3>
                                    </Link>
                                    <p className="mt-4 text-agency-primary/60 dark:text-white/60 text-lg leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <div className="flex flex-wrap justify-end gap-2">
                                        {project.technologies?.slice(0, 3).map((tech: string, i: number) => (
                                            <span key={i} className="text-[10px] font-bold uppercase tracking-widest border border-current/20 px-3 py-1 rounded-full opacity-60">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                ))}
            </main>
            </div>
        </section>
    );
};

export default FeaturedProjects;
