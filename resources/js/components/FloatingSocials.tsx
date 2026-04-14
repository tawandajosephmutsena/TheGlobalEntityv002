import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { SettingItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingSocialsProps {
    settings?: Record<string, SettingItem[]>;
    social?: {
        github?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
        facebook?: string;
        whatsapp?: string;
    };
}

// Evaluated once at module load — stable for the lifetime of the page
const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

const FloatingSocials: React.FC<FloatingSocialsProps> = ({ settings, social }) => {
    const mountedRef = useRef(false);

    // 8.1 — hide on viewports narrower than 640 px; false on SSR, true after hydration if wide enough
    const [isWideEnough, setIsWideEnough] = useState(
        () => typeof window !== 'undefined' && window.innerWidth >= 640,
    );

    useEffect(() => {
        const handleResize = () => setIsWideEnough(window.innerWidth >= 640);
        window.addEventListener('resize', handleResize);

        return () => {
            mountedRef.current = false;
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isSocialVisible = (key: string) => {
        const item = settings?.social?.find((s: SettingItem) => s.key === `show_${key}`);
        if (!item) return true;

        const val = item.value;
        const checkValue = Array.isArray(val) ? val[0] : val;

        return (
            checkValue === true ||
            checkValue === 'true' ||
            checkValue === 'on' ||
            checkValue === 'yes'
        );
    };

    const isFloatingVisible = () => {
        const item = settings?.social?.find((s: SettingItem) => s.key === 'show_floating_socials');
        if (!item) return true; // Default to true so it shows up after deployment without requiring a save

        const val = item.value;
        const checkValue = Array.isArray(val) ? val[0] : val;

        return (
            checkValue === true ||
            checkValue === 'true' ||
            checkValue === 'on' ||
            checkValue === 'yes'
        );
    };

    const socialLinks = [
        { 
            name: 'Facebook', 
            href: social?.facebook, 
            icon: Facebook, 
            color: '#1877F2',
            visible: isSocialVisible('facebook') 
        },
        { 
            name: 'WhatsApp', 
            href: social?.whatsapp, 
            icon: IconBrandWhatsapp, 
            color: '#25D366',
            visible: isSocialVisible('whatsapp') 
        },
        { 
            name: 'Twitter', 
            href: social?.twitter, 
            icon: Twitter, 
            color: '#000000',
            visible: isSocialVisible('twitter') 
        },
        { 
            name: 'Instagram', 
            href: social?.instagram, 
            icon: Instagram, 
            color: '#E4405F',
            visible: isSocialVisible('instagram') 
        },
        { 
            name: 'LinkedIn', 
            href: social?.linkedin, 
            icon: Linkedin, 
            color: '#0077B5',
            visible: isSocialVisible('linkedin') 
        },
        { 
            name: 'Github', 
            href: social?.github, 
            icon: Github, 
            color: '#181717',
            visible: isSocialVisible('github') 
        },
    ].filter(link => link.href && link.visible);

    // 8.1 — return null before mount (isWideEnough starts false) or when viewport is too narrow
    if (!isWideEnough || !isFloatingVisible() || socialLinks.length === 0) {
        return null;
    }

    // 8.3 — on touch devices skip AnimatePresence and motion.a entirely
    const content = isTouch ? (
        // Plain anchors — no Framer Motion, no AnimatePresence
        <div
            className="fixed right-0 md:right-2 inset-y-0 flex flex-col justify-center gap-2 p-2 z-[99999]"
            style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)', pointerEvents: 'none' }}
        >
            {socialLinks.map((link) => (
                <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="size-9 md:size-12 flex items-center justify-center rounded-l-lg md:rounded-l-xl shadow-lg group overflow-visible relative text-white"
                    style={{ backgroundColor: link.color, pointerEvents: 'auto' }}
                    aria-label={link.name}
                >
                    <link.icon className="size-5 md:size-6" />
                    <span className="absolute right-full mr-2 bg-white text-black px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border border-border pointer-events-none">
                        {link.name}
                    </span>
                </a>
            ))}
        </div>
    ) : (
        // 8.2 — pointer-events: none on container, pointer-events: auto on each anchor
        <div
            className="fixed right-0 md:right-2 inset-y-0 flex flex-col justify-center gap-2 p-2 z-[99999]"
            style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)', pointerEvents: 'none' }}
        >
            <AnimatePresence>
                {socialLinks.map((link, index) => (
                    <motion.a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5, ease: "backOut" }}
                        className="size-9 md:size-12 flex items-center justify-center rounded-l-lg md:rounded-l-xl shadow-lg hover:pr-4 md:hover:pr-6 transition-all duration-300 group overflow-visible relative text-white"
                        style={{ backgroundColor: link.color, pointerEvents: 'auto' }}
                        aria-label={link.name}
                    >
                        <link.icon className="size-5 md:size-6" />
                        <span className="absolute right-full mr-2 bg-white text-black px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border border-border pointer-events-none">
                            {link.name}
                        </span>
                    </motion.a>
                ))}
            </AnimatePresence>
        </div>
    );

    return createPortal(content, document.body);
};

export default FloatingSocials;
