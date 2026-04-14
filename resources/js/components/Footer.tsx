import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import {
    Github,
    Instagram,
    Linkedin,
    Twitter,
    Facebook,
} from 'lucide-react';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import React from 'react';
import { SharedData, SettingItem } from '@/types';
import AppLogo from '@/components/app-logo';

interface FooterProps {
    className?: string;
}

const footerLinks = {
    company: [
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Team', href: '/team' },
    ],
    resources: [
        { name: 'Blog', href: '/blog' },
        { name: 'Case Studies', href: '/portfolio' },
        { name: 'Contact', href: '/contact' },
        { name: 'Careers', href: '/careers' },
    ],
};

export const Footer: React.FC<FooterProps> = ({ className }) => {
    const { props } = usePage<SharedData>();
    const site = props.site || { name: 'Ottomate', logo: '', tagline: 'High-Performance Website Platform' };
    const menuItems = props.menus?.main || [];
    const compliance = props.site?.compliance;
    const footerType = site.footer?.type || 'enterprise';

    // Build legal links dynamically from compliance settings
    const legalLinks = [
        { name: 'Privacy Policy', href: compliance?.privacy_policy_url || '/privacy' },
        { name: 'Terms of Service', href: compliance?.terms_url || '/terms' },
        { name: 'Cookie Policy', href: compliance?.cookie_policy_url || '/cookies' },
    ];

    // Helper to check social visibility
    const isSocialVisible = (key: string) => {
        const item = props.settings?.social?.find((s: SettingItem) => s.key === `show_${key}`);
        if (!item) return true; // Default to true if not found in DB

        const val = item.value;
        const checkValue = Array.isArray(val) ? val[0] : val;

        return (
            checkValue === true ||
            checkValue === 'true' ||
            checkValue === '1' ||
            checkValue === 'on' ||
            checkValue === 'yes'
        );
    };

    // Map social links from settings
    const socialLinks = [
        { name: 'Github', href: site.social?.github, icon: Github, visible: isSocialVisible('github') },
        { name: 'Twitter', href: site.social?.twitter, icon: Twitter, visible: isSocialVisible('twitter') },
        { name: 'Facebook', href: site.social?.facebook, icon: Facebook, visible: isSocialVisible('facebook') },
        { name: 'WhatsApp', href: site.social?.whatsapp, icon: IconBrandWhatsapp, visible: isSocialVisible('whatsapp') },
        { name: 'LinkedIn', href: site.social?.linkedin, icon: Linkedin, visible: isSocialVisible('linkedin') },
        { name: 'Instagram', href: site.social?.instagram, icon: Instagram, visible: isSocialVisible('instagram') },
    ].filter(link => link.href && link.visible);

    // Get footer content from settings with fallbacks
    const footerHeadingLine1 = site.footer?.heading_line1 || "Let's create";
    const footerHeadingLine2 = site.footer?.heading_line2 || 'digital legacy';
    const footerHeadingLine3 = site.footer?.heading_line3 || 'juntos.';
    const footerResourcesTitle = site.footer?.resources_title || 'Resources';
    
    // Parse resources links from JSON or use defaults
    let resourcesLinks = footerLinks.resources;
    if (site.footer?.resources_links) {
        try {
            const parsed = typeof site.footer.resources_links === 'string' 
                ? JSON.parse(site.footer.resources_links) 
                : site.footer.resources_links;
            if (Array.isArray(parsed) && parsed.length > 0) {
                resourcesLinks = parsed;
            }
        } catch (e) {
            console.warn('Failed to parse footer resources links:', e);
        }
    }
    const footerNavTitle = site.footer?.nav_title || 'Navigation';
    const footerOfficeTitle = site.footer?.office_title || 'Office';
    const footerBackToTop = site.footer?.back_to_top || 'Back to top';
    const footerCopyrightSuffix = site.footer?.copyright_suffix || 'AGY';

    // Minimalistic Footer Design
    if (footerType === 'minimalistic') {
        return (
            <footer className={cn('relative py-12 md:py-20 overflow-hidden border-t border-border/10 text-center', className)}>
                {/* Extra Thick Texture Overlay - Very Small Grains */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 dark:opacity-30 mix-blend-overlay"
                    style={{
                        backgroundImage: `var(--bg-noise-grain)`
                    }}
                />
                
                <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-8">
                    {/* Brand Logo */}
                    <div>
                        {props.menus?.logo ? (
                            <Link 
                                href={props.menus.logo.href} 
                                target={props.menus.logo.target}
                                className="inline-flex items-center group overflow-visible bg-transparent"
                            >
                                <AppLogo 
                                    className="transition-transform duration-500 group-hover:rotate-[5deg] group-hover:scale-110" 
                                />
                            </Link>
                        ) : (
                            <div className="inline-flex items-center group overflow-visible bg-transparent">
                                <AppLogo 
                                    className="transition-transform duration-500 group-hover:rotate-[5deg] group-hover:scale-110" 
                                />
                            </div>
                        )}
                    </div>

                    {/* Minimalist Heading (Text from left side) */}
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] max-w-3xl mx-auto">
                        {footerHeadingLine1} <br/>
                        <span className="text-agency-accent">{footerHeadingLine2}</span> {footerHeadingLine3}
                    </h2>

                    {/* Social Icons - Clean Row */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {socialLinks.map((social) => (
                            <a 
                                key={social.name} 
                                href={social.href} 
                                aria-label={social.name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="size-14 rounded-full border border-border/40 flex items-center justify-center hover:theme-gradient-bg hover:text-white hover:border-transparent transition-all duration-500 hover:scale-110 shadow-sm hover:shadow-xl theme-gradient-glow backdrop-blur-sm"
                            >
                                <social.icon className="size-6" />
                            </a>
                        ))}
                    </div>

                    {/* Bottom Metadata */}
                    <div className="flex flex-col items-center gap-4 pt-8 border-t border-border/20 w-full">
                        <div className="flex items-center gap-8 group cursor-pointer mb-2" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <span className="text-xs font-bold tracking-[0.2em] group-hover:theme-gradient-text transition-colors">{footerBackToTop}</span>
                            <div className="size-8 rounded-full border border-border/40 flex items-center justify-center group-hover:theme-gradient-bg group-hover:border-transparent group-hover:text-white transition-all transform group-hover:-translate-y-1">
                                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                            <span className="text-sm opacity-40 font-medium tracking-wide">
                                © {new Date().getFullYear()} {site.name || 'Ottomate'} {footerCopyrightSuffix}
                            </span>
                            <div className="flex gap-6">
                                {legalLinks.map((link) => (
                                    <Link key={link.name} href={link.href} className="text-[10px] opacity-30 hover:opacity-100 transition-opacity tracking-widest font-bold">
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }

    // Default Enterprise Footer (Original Design)
    return (
        <footer className={cn('relative pt-16 md:pt-32 pb-12 overflow-visible liquid-glass border-t border-border/10', className)}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-16 md:mb-32">
                    {/* Massive Brand Side */}
                    <div className="lg:col-span-6 flex flex-col justify-between">
                        <div>
                            {props.menus?.logo ? (
                                <Link 
                                    href={props.menus.logo.href} 
                                    target={props.menus.logo.target}
                                    className="inline-flex items-center mb-12 group overflow-visible bg-transparent"
                                >
                                    <AppLogo 
                                        className="transition-transform duration-500 group-hover:rotate-[5deg] group-hover:scale-105" 
                                    />
                                </Link>
                            ) : (
                                <div className="inline-flex items-center mb-12 group overflow-visible bg-transparent">
                                    <AppLogo 
                                        className="transition-transform duration-500 group-hover:rotate-[5deg] group-hover:scale-105" 
                                    />
                                </div>
                            )}
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
                                {footerHeadingLine1} <br/>
                                <span className="text-agency-accent">{footerHeadingLine2}</span> {footerHeadingLine3}
                            </h2>
                        </div>
                        
                        <div className="flex gap-6">
                            {socialLinks.map((social) => (
                                <a 
                                    key={social.name} 
                                    href={social.href} 
                                    aria-label={social.name}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="size-12 rounded-full border border-border flex items-center justify-center hover:theme-gradient-bg hover:text-white hover:border-transparent transition-all duration-500 hover:shadow-lg theme-gradient-glow"
                                >
                                    <social.icon className="size-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xs font-bold tracking-[0.2em] text-agency-accent mb-8">{footerNavTitle}</h3>
                            <ul className="space-y-4">
                                {menuItems.length > 0 ? (
                                    menuItems.map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} target={link.target} className="text-xl font-bold opacity-40 hover:opacity-100 transition-opacity">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    footerLinks.company.map((link) => (
                                        <li key={link.name}>
                                            <Link href={link.href} className="text-xl font-bold opacity-40 hover:opacity-100 transition-opacity">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold tracking-[0.2em] text-agency-accent mb-8">{footerResourcesTitle}</h3>
                            <ul className="space-y-4">
                                {resourcesLinks.map((link) => {
                                    const isExternal = link.href.startsWith('http://') || link.href.startsWith('https://');
                                    const linkClassName = "text-xl font-bold opacity-40 hover:opacity-100 transition-opacity";
                                    
                                    return (
                                        <li key={link.name}>
                                            {isExternal ? (
                                                <a 
                                                    href={link.href} 
                                                    className={linkClassName}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {link.name}
                                                </a>
                                            ) : (
                                                <Link href={link.href} className={linkClassName}>
                                                    {link.name}
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h3 className="text-xs font-bold tracking-[0.2em] text-agency-accent mb-8">{footerOfficeTitle}</h3>
                            <address className="not-italic space-y-4">
                                <p className="text-lg md:text-xl font-bold opacity-40 leading-tight whitespace-pre-line">
                                    {site.contact?.address || '123 Creative Studio\nMarket Street 456\nSan Francisco, CA'}
                                </p>
                                {site.contact?.email && (
                                    <a 
                                        href={`mailto:${site.contact.email}`} 
                                        className="block text-agency-accent font-bold hover:underline transition-all"
                                    >
                                        {site.contact.email}
                                    </a>
                                )}
                                {site.contact?.phone && (
                                    <a 
                                        href={`tel:${site.contact.phone.replace(/\s+/g, '')}`} 
                                        className="block text-agency-accent font-bold hover:underline transition-all"
                                    >
                                        {site.contact.phone}
                                    </a>
                                )}
                            </address>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-8 order-2 md:order-1">
                        <span className="text-sm opacity-30 font-medium">© {new Date().getFullYear()} {site.name || 'Ottomate'} {footerCopyrightSuffix}</span>
                        <div className="hidden md:flex gap-6">
                            {legalLinks.map((link) => (
                                <Link key={link.name} href={link.href} className="text-xs opacity-30 hover:opacity-100 transition-opacity tracking-widest font-bold">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 order-1 md:order-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <span className="text-xs font-bold tracking-widest group-hover:theme-gradient-text transition-colors">{footerBackToTop}</span>
                        <div className="size-10 rounded-full border border-border flex items-center justify-center group-hover:theme-gradient-bg group-hover:border-transparent group-hover:text-white transition-all">
                            <span className="material-symbols-outlined">arrow_upward</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Massive Text */}
            <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 pointer-events-none select-none opacity-[0.03] whitespace-nowrap">
                <span className="text-[25vw] font-black leading-none">{site.name || 'Ottomate'}</span>
            </div>
        </footer>
    );
};

export default Footer;
