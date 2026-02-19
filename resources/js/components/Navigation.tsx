import AppLogo from '@/components/app-logo';
import { useMagneticEffect } from '@/hooks/useAnimations';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface NavigationProps {
    className?: string;
}

// Extracted NavLink component for magnetic effect on individual items
const NavLink = ({
    item,
    isActive,
}: {
    item: { name: string; href: string };
    isActive: boolean;
}) => {
    const linkRef = useRef<HTMLAnchorElement>(null);

    useMagneticEffect(linkRef as React.RefObject<HTMLElement>, {
        strength: 0.3,
        speed: 0.3,
    });

    return (
        <Link
            ref={linkRef}
            href={item.href}
            className={cn(
                'relative overflow-hidden rounded-full px-4 py-2 text-[12px] font-bold tracking-widest [font-variant-caps:all-small-caps] transition-all duration-500',
                isActive
                    ? 'bg-agency-accent text-primary-foreground shadow-lg shadow-agency-accent/20'
                    : 'text-agency-primary/80 hover:bg-agency-accent/5 hover:text-agency-accent dark:text-white/60',
            )}
        >
            <span className="relative z-10">{item.name.toLowerCase()}</span>
        </Link>
    );
};

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { url, props } = usePage<SharedData>();
    const { auth, menus } = props;
    
    const navRef = useRef<HTMLElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    // Fallback if no menu data
    const menuItems =
        menus?.main && menus.main.length > 0
            ? menus.main
            : [
                  { name: 'Home', href: '/', target: '_self' },
                  { name: 'Services', href: '/services', target: '_self' },
                  { name: 'Portfolio', href: '/portfolio', target: '_self' },
                  { name: 'Team', href: '/team', target: '_self' },
                  { name: 'Blog', href: '/blog', target: '_self' },
                  { name: 'Contact', href: '/contact', target: '_self' },
              ];

    // Add magnetic effect to logo
    useMagneticEffect(logoRef as React.RefObject<HTMLElement>, {
        strength: 0.2,
        speed: 0.4,
    });

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle menu body lock
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [isMenuOpen]);

    // Handle scroll effects
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Use ScrollTrigger to detect scroll for the glassy transition
        const scrollTrigger = ScrollTrigger.create({
            start: 'top -20',
            onUpdate: (self) => {
                const scrolled = self.scroll() > 20;
                setIsScrolled(scrolled);
            },
        });

        // Create scroll trigger for navigation hide/show (smart sticky)
        const showAnim = gsap.fromTo(
            navRef.current,
            { yPercent: -120 },
            { yPercent: 0, duration: 0.4, ease: 'power3.out', paused: true },
        );

        const hideAnim = gsap.fromTo(
            navRef.current,
            { yPercent: 0 },
            { yPercent: -120, duration: 0.4, ease: 'power3.in', paused: true },
        );

        const mainTrigger = ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 99999,
            onUpdate: (self) => {
                // Skip hiding logic if menu is open
                if (isMenuOpen) return;

                if (self.direction === -1) {
                    showAnim.play();
                    hideAnim.pause();
                } else if (self.direction === 1 && self.progress > 0.05) {
                    hideAnim.play();
                    showAnim.pause();
                }
            },
        });

        return () => {
            scrollTrigger.kill();
            mainTrigger.kill();
            showAnim.kill();
            hideAnim.kill();
        };
    }, [isMenuOpen]);

    return (
        <>
            {/* Main Navigation */}
            <nav
                ref={navRef}
                className={cn(
                    'fixed right-0 left-0 z-[100] transition-all duration-500 will-change-transform',
                    isScrolled 
                        ? 'top-0 px-0 md:top-0' 
                        : 'top-0 px-4 pt-6 md:px-8',
                    className,
                )}
            >
                <div
                    className={cn(
                        'relative mx-auto flex h-20 items-center justify-between px-6 transition-all duration-500',
                        isScrolled
                            ? 'max-w-full rounded-none border-b border-border bg-white shadow-sm dark:border-white/10 dark:bg-black md:rounded-none'
                            : 'max-w-7xl rounded-full border border-border bg-white shadow-2xl dark:border-white/5 dark:bg-black',
                        // On mobile, even when scrolled, we want a bit of breathing room if it's not meant to be full-width
                        // but the user said "navigation should have more padding so its not on the edges"
                        isScrolled && 'max-md:px-4'
                    )}
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="group relative z-[110] flex items-center !bg-transparent overflow-visible font-display"
                    >
                        <AppLogo
                            ref={logoRef as React.RefObject<HTMLDivElement>}
                            className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[5deg]"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-1 lg:flex">
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.name}
                                item={item}
                                isActive={
                                    url === item.href ||
                                    (item.href !== '/' &&
                                        url.startsWith(item.href))
                                }
                            />
                        ))}
                    </div>

                    {/* Auth & Menu */}
                    <div className="flex items-center gap-3">
                        <div className="mr-2 hidden items-center gap-2 md:flex">
                            {auth?.user ? (
                                <Link
                                    href="/admin"
                                    className="inline-flex h-10 items-center gap-2 rounded-full border border-agency-accent/20 bg-agency-accent/15 px-5 text-[10px] font-bold tracking-widest text-agency-accent uppercase transition-all hover:bg-agency-accent hover:text-primary-foreground dark:bg-agency-accent/10 dark:text-agency-accent"
                                >
                                    <LayoutDashboard className="size-3" />{' '}
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="inline-flex h-10 items-center gap-2 rounded-full px-5 text-[12px] font-bold tracking-widest text-agency-primary/80 [font-variant-caps:all-small-caps] transition-all hover:text-agency-accent dark:text-white/60"
                                    >
                                        <LogIn className="size-3" /> sign in
                                    </Link>
                                    <Link
                                        href="/registration"
                                        className="inline-flex h-10 items-center gap-2 rounded-full bg-agency-primary px-5 text-[12px] font-bold tracking-widest text-white [font-variant-caps:all-small-caps] shadow-lg transition-all hover:scale-105 dark:bg-white dark:text-agency-neutral"
                                    >
                                        <UserPlus className="size-3" /> sign up
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Burger menu toggler */}
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
                            className="relative z-[110] flex size-12 items-center justify-center rounded-full bg-agency-accent/10 text-agency-accent hover:bg-agency-accent hover:text-white transition-all lg:hidden"
                        >
                            <div className="flex flex-col gap-1.5 w-6 items-end">
                                <span className={cn("h-0.5 bg-current transition-all duration-300", isMenuOpen ? "w-6 rotate-45 translate-y-2" : "w-6")}></span>
                                <span className={cn("h-0.5 bg-current transition-all duration-300", isMenuOpen ? "opacity-0" : "w-4")}></span>
                                <span className={cn("h-0.5 bg-current transition-all duration-300", isMenuOpen ? "w-6 -rotate-45 -translate-y-2" : "w-5")}></span>
                            </div>
                        </button>
                    </div>
                </div>

            </nav>

            {/* Fullscreen Mobile Menu - Moved outside nav for cleaner stacking context */}
            <div 
                className={cn(
                    "fixed inset-0 z-[105] transition-all duration-700 ease-in-out lg:hidden",
                    isMenuOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"
                )}
            >
                {/* Background layers to ensure full opacity */}
                <div className="absolute inset-0 bg-white dark:bg-black"></div>
                
                {/* Background Blobs for Visual Interest */}
                <div className="absolute inset-0 z-0 opacity-40 dark:opacity-60">
                    <div className="absolute -top-[10%] -left-[10%] size-96 rounded-full bg-agency-accent blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-[10%] -right-[10%] size-80 rounded-full bg-primary blur-[120px] animation-delay-2000"></div>
                </div>

                <div className="relative z-10 flex h-full flex-col p-8 pt-32">
                    <div className="flex flex-col gap-6">
                        {menuItems.map((item, i) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={cn(
                                    "text-5xl font-black [font-variant-caps:all-small-caps] tracking-tighter transition-all duration-500 hover:translate-x-4 inline-block",
                                    url === item.href ? "text-agency-accent" : "text-agency-primary/60 dark:text-white/60 hover:text-agency-accent"
                                )}
                                style={{ transitionDelay: `${i * 50}ms` }}
                            >
                                {item.name.toLowerCase()}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto space-y-4 pt-12 border-t border-border">
                        {!auth?.user && (
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex h-14 items-center justify-center rounded-2xl border border-border font-bold [font-variant-caps:all-small-caps] tracking-widest text-lg"
                                >
                                    log in
                                </Link>
                                <Link
                                    href="/registration"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex h-14 items-center justify-center rounded-2xl bg-agency-accent text-agency-primary font-bold [font-variant-caps:all-small-caps] tracking-widest text-lg"
                                >
                                    sign up
                                </Link>
                            </div>
                        )}
                        {auth?.user && (
                            <Link
                                href="/admin"
                                onClick={() => setIsMenuOpen(false)}
                                className="flex h-14 items-center justify-center rounded-2xl bg-agency-accent text-agency-primary font-bold [font-variant-caps:all-small-caps] tracking-widest text-lg"
                            >
                                dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navigation;
