import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthEditorialLayoutProps {
    title: string;
    description: string;
    editorialTitle?: string;
    editorialSubtitle?: string;
    editorialDescription?: string;
}

export default function AuthEditorialLayout({
    children,
    title,
    description,
    editorialTitle: propsEditorialTitle,
    editorialSubtitle: propsEditorialSubtitle,
    editorialDescription: propsEditorialDescription,
}: PropsWithChildren<AuthEditorialLayoutProps>) {
    const { site } = usePage().props as any;
    const authContent = site.auth_content;

    const editorialTitle = propsEditorialTitle || authContent?.editorial_title || "Charting the";
    const editorialSubtitle = propsEditorialSubtitle || authContent?.editorial_subtitle || "Unseen Path.";
    const editorialDescription = propsEditorialDescription || authContent?.editorial_description || "Return to your journal. Your adventures across the ethereal landscapes are waiting to be documented.";

    return (
        <div className="bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Layer: Drifting Watercolor Map Concept */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none watercolor-gradient-auth"></div>
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none">
                <img 
                    alt="Soft vintage map texture" 
                    className="w-full h-full object-cover filter contrast-75 brightness-110" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFqaxyt0wjycQefT7AtT3aSdxTwvh2GeATd3l4S68LBFgPB4O1PoRJ5SnfSrNEjHyic1Yq9l6LSKOHhhmVkD9aJ5IzosyI0zGu4bi7DSa0JGj94FvolHUgof9C1rOXtxvM9pXxbgv8MG-smp-QHIFg9AOSPfP56ey95ZD9feJfaEBkqjPSpwPAqPXYZB76CzBjn3mL870EVEs8CbLSqww-8Yt_YHOkx_3oASAAqV48PKSVFRhG_NVw-0WkdCc5T2YxZg1XvaXlFAWl"
                />
            </div>

            {/* Main Content Canvas */}
            <main className="relative z-10 flex-grow flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(45,48,39,0.06)] relative">
                    
                    {/* Left Side: Editorial Branding */}
                    <div className="hidden md:flex flex-col justify-between p-16 bg-surface-container-low relative overflow-hidden">
                        <div className="relative z-10">
                            <Link href="/" className="font-headline text-2xl font-black italic text-primary tracking-tighter">The Global Entity</Link>
                            <div className="mt-20">
                                <h1 className="font-headline text-5xl font-extrabold text-on-surface leading-[1.1] tracking-tight">
                                    {editorialTitle} <br/>
                                    <span className="text-primary italic">{editorialSubtitle}</span>
                                </h1>
                                <p className="mt-8 text-on-surface-variant text-lg leading-relaxed max-w-sm">
                                    {editorialDescription}
                                </p>
                            </div>
                        </div>
                        <div className="relative z-10 mt-auto">
                            <div className="flex items-center gap-4 text-secondary">
                                <span className="material-symbols-outlined">explore</span>
                                <span className="font-bold tracking-widest text-xs uppercase">Est. MMXXIV</span>
                            </div>
                        </div>
                        
                        {/* Abstract Decorative Elements */}
                        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 -left-20 w-40 h-40 bg-tertiary-container/30 rounded-full blur-2xl"></div>
                    </div>

                    {/* Right Side: Form Container */}
                    <div className="p-8 md:p-16 flex flex-col justify-center bg-surface-container-lowest relative">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="font-headline text-3xl font-bold text-on-background mb-2">{title}</h2>
                            <p className="text-on-surface-variant">{description}</p>
                        </div>
                        
                        {children}

                        {/* Hand-drawn style decorative path (pirate trail) */}
                        <div className="absolute bottom-8 right-8 opacity-20 hidden md:block">
                            <svg fill="none" height="40" viewBox="0 0 120 40" width="120" xmlns="http://www.w3.org/2000/svg">
                                <path className="text-secondary" d="M5 35C20 35 30 5 55 5C80 5 90 35 115 35" stroke="currentColor" strokeDasharray="6 6" strokeWidth="2"></path>
                                <circle className="text-primary" cx="115" cy="35" fill="currentColor" r="4"></circle>
                            </svg>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-transparent border-t border-outline-variant/10">
                <p className="font-body text-xs tracking-wide text-on-surface/50">© 2024 The Global Entity. Navigating the Ethereal.</p>
                <div className="flex flex-wrap justify-center gap-6">
                    <a className="font-body text-xs tracking-wide text-on-surface/50 hover:text-primary transition-colors" href="#">Sustainability Manifesto</a>
                    <a className="font-body text-xs tracking-wide text-on-surface/50 hover:text-primary transition-colors" href="#">Eco-Travel Credits</a>
                    <a className="font-body text-xs tracking-wide text-on-surface/50 hover:text-primary transition-colors" href="#">Privacy Scroll</a>
                </div>
            </footer>

            {/* Decorative Watercolor Corner */}
            <div className="fixed -top-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none"></div>
        </div>
    );
}
