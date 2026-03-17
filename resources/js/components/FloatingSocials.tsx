import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import React from 'react';
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

const FloatingSocials: React.FC<FloatingSocialsProps> = ({ settings, social }) => {
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

    if (!isFloatingVisible()) {
        console.log('Floating socials disabled by setting or missing setting');
        return null;
    }

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

    if (socialLinks.length === 0) {
        console.log('No social links with URLs found to display in floating bar');
        return null;
    }

    console.log('Rendering floating social links:', socialLinks.map(l => l.name));

    return (
        <div className="fixed right-0 md:right-2 inset-y-0 flex flex-col justify-center gap-2 p-2 pointer-events-none z-[9999]">
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
                        className="pointer-events-auto size-9 md:size-12 flex items-center justify-center rounded-l-lg md:rounded-l-xl shadow-lg hover:pr-4 md:hover:pr-6 transition-all duration-300 group overflow-visible relative text-white"
                        style={{ backgroundColor: link.color }}
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
};

export default FloatingSocials;
