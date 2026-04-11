import AdminLayout from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useForm, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Save, ImagePlus, X, RotateCcw, Check, Palette } from 'lucide-react';
import { toast } from 'sonner';
import MediaLibrary from '@/components/admin/MediaLibrary';
import { LinkManager } from '@/components/admin/LinkManager';
import { MediaAsset } from '@/types';
import { cn } from '@/lib/utils';

interface SettingItem {
    id?: number;
    key: string;
    value: string | string[] | null;
    type: 'text' | 'json' | 'boolean' | 'number' | 'color';
    group_name: string;
}

interface ThemeColors {
    background?: string;
    foreground?: string;
    primary?: string;
    'primary-foreground'?: string;
    secondary?: string;
    accent?: string;
    muted?: string;
    destructive?: string;
    border?: string;
    ring?: string;
    [key: string]: string | undefined;
}

interface ThemePreset {
    name: string;
    description: string;
    fonts: { sans: string; serif: string; mono: string };
    radius: string;
    light: ThemeColors;
    dark: ThemeColors;
}

interface ThemePresetsConfig {
    default: string;
    themes: Record<string, ThemePreset>;
}

interface Page {
    id: number;
    title: string;
    slug: string;
}

interface Props {
    settings: Record<string, SettingItem[]>;
    themePresets?: ThemePresetsConfig;
    pages?: Page[];
}

// Define the known settings structure to auto-generate default values if missing
interface StructItem {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'color' | 'email' | 'links' | 'boolean' | 'select';
    placeholder: string;
    description?: string;
    options?: Array<{ value: string; label: string }>;
}

const SETTINGS_STRUCT: Record<string, StructItem[]> = {
    general: [
        { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'Website Name' },
        { key: 'site_tagline', label: 'Site Tagline', type: 'text', placeholder: 'Digital Innovation Redefined' },
        { key: 'site_logo', label: 'Site Logo', type: 'image', placeholder: '/logo.svg' },
        { key: 'site_description', label: 'Site Description', type: 'textarea', placeholder: 'A Digital Innovation Agency' },
        { key: 'footer_heading_line1', label: 'Footer Heading (Line 1)', type: 'text', placeholder: "Let's create" },
        { key: 'footer_heading_line2', label: 'Footer Heading (Line 2)', type: 'text', placeholder: 'digital legacy' },
        { key: 'footer_heading_line3', label: 'Footer Heading (Line 3)', type: 'text', placeholder: 'juntos.' },
        { key: 'footer_resources_title', label: 'Footer Resources Column Title', type: 'text', placeholder: 'Resources' },
        { key: 'footer_resources_links', label: 'Footer Resources Links', type: 'links', placeholder: '', description: 'Manage footer resources column links' },
        { key: 'footer_nav_title', label: 'Footer Navigation Title', type: 'text', placeholder: 'Navigation' },
        { key: 'footer_office_title', label: 'Footer Office Title', type: 'text', placeholder: 'Office' },
        { key: 'footer_back_to_top', label: 'Back to Top Text', type: 'text', placeholder: 'Back to top' },
        { key: 'footer_copyright_suffix', label: 'Copyright Suffix', type: 'text', placeholder: 'AGY' },
    ],
    branding: [
        { 
            key: 'brand_logo_dynamic', 
            label: 'Use Dynamic SVG Logo', 
            type: 'boolean', 
            placeholder: 'false',
            description: 'If enabled, the site will use a theme-aware dynamic SVG logo instead of the uploaded image.'
        },
        { 
            key: 'brand_logo_primary', 
            label: 'Main Logo - Primary Color', 
            type: 'color', 
            placeholder: '#041766',
            description: 'The main color for the main logo. Defaults to site primary color if empty.'
        },
        { 
            key: 'brand_logo_secondary', 
            label: 'Main Logo - Secondary Color', 
            type: 'color', 
            placeholder: '#d13091',
            description: 'The secondary color for the main logo. Defaults to site secondary color if empty.'
        },
        { 
            key: 'brand_logo_accent', 
            label: 'Main Logo - Accent Color', 
            type: 'color', 
            placeholder: '#d03691',
            description: 'The accent color for the main logo (used for highlights/overlays).'
        },
        { 
            key: 'brand_logo_primary_dark', 
            label: 'Main Logo - Primary Color (Dark)', 
            type: 'color', 
            placeholder: '#ADFFFE',
            description: 'The primary color for the main logo when in dark mode.'
        },
        { 
            key: 'brand_logo_secondary_dark', 
            label: 'Main Logo - Secondary Color (Dark)', 
            type: 'color', 
            placeholder: '#d13091',
            description: 'The secondary color for the main logo when in dark mode.'
        },
        { 
            key: 'brand_logo_accent_dark', 
            label: 'Main Logo - Accent Color (Dark)', 
            type: 'color', 
            placeholder: '#d03691',
            description: 'The accent color for the main logo when in dark mode.'
        },
        { 
            key: 'brand_secondary_primary', 
            label: 'Decorative Logo - Primary Color', 
            type: 'color', 
            placeholder: '#041766',
            description: 'Main color for the secondary branding (e.g. Artboard-8). Defaults to logo primary if empty.'
        },
        { 
            key: 'brand_secondary_secondary', 
            label: 'Decorative Logo - Secondary Color', 
            type: 'color', 
            placeholder: '#d13091',
            description: 'Secondary color for the secondary branding.'
        },
        { 
            key: 'brand_secondary_accent', 
            label: 'Decorative Logo - Accent Color', 
            type: 'color', 
            placeholder: '#d03691',
            description: 'Accent color for the secondary branding.'
        },
        { 
            key: 'brand_secondary_primary_dark', 
            label: 'Decorative Logo - Primary Color (Dark)', 
            type: 'color', 
            placeholder: '#ADFFFE',
            description: 'Primary color for the secondary branding in dark mode.'
        },
        { 
            key: 'brand_secondary_secondary_dark', 
            label: 'Decorative Logo - Secondary Color (Dark)', 
            type: 'color', 
            placeholder: '#d13091',
            description: 'Secondary color for the secondary branding in dark mode.'
        },
        { 
            key: 'brand_secondary_accent_dark', 
            label: 'Decorative Logo - Accent Color (Dark)', 
            type: 'color', 
            placeholder: '#d03691',
            description: 'Accent color for the secondary branding in dark mode.'
        },
    ],
    contact: [
        { key: 'contact_email', label: 'Contact Email', type: 'text', placeholder: 'hello@example.com' },
        { key: 'contact_phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 000-0000' },
        { key: 'contact_address', label: 'Physical Address', type: 'textarea', placeholder: '123 Innovation Dr...' },
        { key: 'contact_hours', label: 'Office Hours', type: 'textarea', placeholder: 'Mon - Fri: 9:00 AM - 6:00 PM\nWeekend: By Appointment' },
        { key: 'contact_hero_title', label: 'Contact Hero Title', type: 'text', placeholder: 'Start a Conversation.' },
        { key: 'contact_hero_subtitle', label: 'Contact Hero Subtitle', type: 'text', placeholder: "Let's Connect" },
        { key: 'contact_hero_description', label: 'Contact Hero Description', type: 'textarea', placeholder: "Ready to transform your vision into reality? We're here to listen, collaborate, and create something extraordinary together." },
        { key: 'contact_form_title', label: 'Contact Form Title', type: 'text', placeholder: 'Send us a Message' },
        { key: 'google_maps_url', label: 'Google Maps Embed URL', type: 'text', placeholder: 'https://www.google.com/maps/embed?pb=...', description: 'Go to Google Maps > Share > Embed a Map > Copy the src URL from the iframe code' },
        { key: 'show_contact_map', label: 'Show Map Section', type: 'boolean', placeholder: 'true' },
    ],
    social: [
        { key: 'facebook_url', label: 'Facebook URL', type: 'text', placeholder: 'https://facebook.com/...' },
        { key: 'show_facebook', label: 'Show Facebook Icon', type: 'boolean', placeholder: 'true' },
        { key: 'linkedin_url', label: 'LinkedIn URL', type: 'text', placeholder: 'https://linkedin.com/company/...' },
        { key: 'show_linkedin', label: 'Show LinkedIn Icon', type: 'boolean', placeholder: 'true' },
        { key: 'twitter_url', label: 'Twitter / X URL', type: 'text', placeholder: 'https://x.com/...' },
        { key: 'show_twitter', label: 'Show Twitter Icon', type: 'boolean', placeholder: 'true' },
        { key: 'github_url', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
        { key: 'show_github', label: 'Show GitHub Icon', type: 'boolean', placeholder: 'true' },
        { key: 'instagram_url', label: 'Instagram URL', type: 'text', placeholder: 'https://instagram.com/...' },
        { key: 'show_instagram', label: 'Show Instagram Icon', type: 'boolean', placeholder: 'true' },
        { key: 'whatsapp_url', label: 'WhatsApp URL / Number', type: 'text', placeholder: 'https://wa.me/263771234567' },
        { key: 'show_whatsapp', label: 'Show WhatsApp Icon', type: 'boolean', placeholder: 'true' },
        { key: 'show_floating_socials', label: 'Show Floating Social Icons (Fixed Right)', type: 'boolean', placeholder: 'true' },
    ],
    seo: [
        { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'text', placeholder: 'G-XXXXXXXXXX', description: 'Your Google Analytics Measurement ID (e.g. G-XXXXXXXXXX). Also requires enabling Analytics in the Compliance tab.' },
        { key: 'google_tag_id', label: 'Google Tag ID (gtag.js)', type: 'text', placeholder: 'AW-XXXXXXXXXX', description: 'Your Google Tag ID (e.g. AW-XXXXXXXXXX or G-XXXXXXXXXX). This is used for Google Ads and unified tracking.' },
        { key: 'google_conversion_id', label: 'Google Ads Conversion ID', type: 'text', placeholder: 'AW-XXXXXXXXXX/YYYYYYYYYYYYYY', description: 'Your Google Ads Conversion ID (Send to). Used to track conversions like form submissions.' },
    ],
    compliance: [
        { key: 'cookie_consent_enabled', label: 'Enable Cookie Consent Banner', type: 'boolean', placeholder: 'false', description: 'Show a GDPR/POPIA-compliant cookie consent banner to all visitors.' },
        { key: 'cookie_consent_message', label: 'Cookie Banner Message', type: 'textarea', placeholder: 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.', description: 'The main message displayed in the cookie consent banner.' },
        { key: 'cookie_consent_accept_text', label: 'Accept Button Text', type: 'text', placeholder: 'Accept All' },
        { key: 'cookie_consent_reject_text', label: 'Reject Button Text', type: 'text', placeholder: 'Reject Non-Essential' },
        { 
            key: 'cookie_consent_style', 
            label: 'Banner Position', 
            type: 'select', 
            placeholder: 'bottom-bar',
            description: 'Where the cookie consent banner appears on the page.',
            options: [
                { value: 'bottom-bar', label: 'Bottom Bar (Full Width)' },
                { value: 'top-bar', label: 'Top Bar (Full Width)' },
                { value: 'bottom-left', label: 'Bottom Left (Card)' },
                { value: 'bottom-right', label: 'Bottom Right (Card)' },
            ]
        },
        { key: 'analytics_enabled', label: 'Enable Google Analytics', type: 'boolean', placeholder: 'false', description: 'Load Google Analytics tracking. Requires a valid GA Measurement ID in the SEO tab. Analytics will only load after the visitor accepts analytics cookies.' },
        { key: 'privacy_policy_page', label: 'Privacy Policy URL', type: 'text', placeholder: '/privacy', description: 'Path to your privacy policy page. Used in the cookie banner and footer.' },
        { key: 'terms_page', label: 'Terms of Service URL', type: 'text', placeholder: '/terms', description: 'Path to your terms of service page. Used in the footer.' },
        { key: 'cookie_policy_page', label: 'Cookie Policy URL', type: 'text', placeholder: '/cookies', description: 'Path to your cookie policy page. Used in the cookie banner and footer.' },
    ],
    theme: [
        { 
            key: 'brand_primary', 
            label: 'Primary Color', 
            type: 'color', 
            placeholder: '#1a1a1a',
            description: 'Used for main backgrounds, navigation bars, and footer content. It defines the core mood of your site.'
        },
        { 
            key: 'brand_secondary', 
            label: 'Secondary Color', 
            type: 'color', 
            placeholder: '#666666',
            description: 'Used for section separators, subtle backgrounds, and secondary UI elements like card borders.'
        },
        { 
            key: 'brand_accent', 
            label: 'Accent Color', 
            type: 'color', 
            placeholder: '#ff6b35',
            description: 'Used for buttons, links, icons, and highlight elements that need to stand out. This is your brand\'s "pop" color.'
        },
        { 
            key: 'brand_neutral', 
            label: 'Neutral Color', 
            type: 'color', 
            placeholder: '#f5f5f5',
            description: 'Used for light backgrounds, input fields, and subtle text contrast on dark backgrounds.'
        },
        { 
            key: 'brand_dark', 
            label: 'Dark Color', 
            type: 'color', 
            placeholder: '#0a0a0a',
            description: 'The foundation for themes with Dark Mode enabled. Affects body backgrounds and high-contrast text elements.'
        },
        { 
            key: 'brand_background', 
            label: 'Background Color', 
            type: 'color', 
            placeholder: '#ffffff',
            description: 'The main page background color for light mode.'
        },
        { 
            key: 'brand_foreground', 
            label: 'Foreground Color', 
            type: 'color', 
            placeholder: '#0a0a0a',
            description: 'Primary text color used for headings and body content.'
        },
        { 
            key: 'brand_border', 
            label: 'Border Color', 
            type: 'color', 
            placeholder: '#e5e5e5',
            description: 'Default border color for cards, inputs, and dividers.'
        },
        { 
            key: 'brand_ring', 
            label: 'Ring Color (Focus)', 
            type: 'color', 
            placeholder: '#3b82f6',
            description: 'Focus ring color for interactive elements like buttons and inputs.'
        },
        { key: 'font_display', label: 'Display Font', type: 'text', placeholder: 'Inter', description: 'Used for headings and titles.' },
        { key: 'font_body', label: 'Body Font', type: 'text', placeholder: 'Inter', description: 'Used for body text and paragraphs.' },
        { 
            key: 'font_weight', 
            label: 'Default Font Weight', 
            type: 'select', 
            placeholder: '400',
            description: 'Base font weight for body text.',
            options: [
                { value: '300', label: 'Light (300)' },
                { value: '400', label: 'Normal (400)' },
                { value: '500', label: 'Medium (500)' },
                { value: '600', label: 'Semibold (600)' },
                { value: '700', label: 'Bold (700)' },
            ]
        },
        { 
            key: 'font_weight_heading', 
            label: 'Heading Font Weight', 
            type: 'select', 
            placeholder: '700',
            description: 'Font weight for headings and titles.',
            options: [
                { value: '400', label: 'Normal (400)' },
                { value: '500', label: 'Medium (500)' },
                { value: '600', label: 'Semibold (600)' },
                { value: '700', label: 'Bold (700)' },
                { value: '800', label: 'Extra Bold (800)' },
                { value: '900', label: 'Black (900)' },
            ]
        },
        { 
            key: 'border_radius', 
            label: 'Border Radius', 
            type: 'select', 
            placeholder: 'md',
            description: 'Default corner rounding for UI elements.',
            options: [
                { value: '0', label: 'None (0px)' },
                { value: '0.125rem', label: 'SM (2px)' },
                { value: '0.375rem', label: 'MD (6px)' },
                { value: '0.5rem', label: 'LG (8px)' },
                { value: '0.75rem', label: 'XL (12px)' },
                { value: '1rem', label: '2XL (16px)' },
                { value: '9999px', label: 'Full (Pill)' },
            ]
        },
        { key: 'theme_preset', label: 'Active Theme Preset', type: 'text', placeholder: 'ottostart_default' },
        { 
            key: 'default_appearance', 
            label: 'Default Site Appearance', 
            type: 'select', 
            placeholder: 'system',
            description: 'The default theme for visitors. Users can still change their individual preference.',
            options: [
                { value: 'system', label: 'System (Respects visitor\'s OS settings)' },
                { value: 'light', label: 'Light Mode (Forced)' },
                { value: 'dark', label: 'Dark Mode (Forced)' },
            ]
        },
    ],
};

/**
 * Convert OKLCH color strings to hex format for HTML color inputs.
 * Falls back to the original value if not OKLCH format.
 */
function oklchToHex(colorStr: string): string {
    if (!colorStr) return '#000000';
    
    const trimmed = colorStr.trim();
    if (trimmed.startsWith('#')) return trimmed;
    
    // Improved regex to handle different spacing, optional commas, and percentage/deg units
    // Matches oklch(L C H) or oklch(L, C, H) or oklch(L C H / A)
    const oklchMatch = trimmed.match(/oklch\(([\d.%]+)[\s,]+([\d.]+)?[\s,]+([\d.deg]+)?(?:[\s/]+([\d.%]+))?\)/i);
    
    if (oklchMatch) {
        let [, lStr, cStr, hStr] = oklchMatch;
        
        // Handle defaults if some values are missing in a partial match (rare)
        if (!cStr) cStr = "0";
        if (!hStr) hStr = "0";

        // Parse Lightness (0-1 or 0-100%)
        let l = 0;
        if (lStr.endsWith('%')) {
            l = parseFloat(lStr) / 100;
        } else {
            l = parseFloat(lStr);
            // If it's > 1, assume it's 0-100 scale
            if (l > 1) l /= 100;
        }

        // Parse Chroma (0-0.4)
        let c = parseFloat(cStr);

        // Parse Hue (0-360)
        let h = parseFloat(hStr.replace('deg', ''));

        // Clamp values
        l = Math.max(0, Math.min(1, l));
        c = Math.max(0, Math.min(0.4, c));
        h = ((h % 360) + 360) % 360;

        // Convert OKLCH to approximate hex
        // For grayscale (chroma = 0), return gray hex
        if (c < 0.001) {
            const gray = Math.round(l * 255).toString(16).padStart(2, '0');
            return `#${gray}${gray}${gray}`;
        }

        // Approximation for chromatic colors via HSL
        const hue = h;
        const saturation = Math.min(c * 2.5, 1);
        return hslToHex(hue, saturation, l);
    }
    
    // Fallback for RGB
    if (trimmed.startsWith('rgb')) {
        const match = trimmed.match(/rgba?\((\d+)[\s,]+(\d+)[\s,]+(\d+)/);
        if (match) {
            const [, r, g, b] = match;
            return `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
        }
    }
    
    return '#000000'; // Default fallback instead of returning invalid string
}

function hslToHex(h: number, s: number, l: number): string {
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * Math.max(0, Math.min(1, color))).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export default function SettingsIndex({ settings, themePresets, pages = [] }: Props) {
    // Flatten settings for easier access
    const flatSettings = Object.values(settings).flat();

    const getSettingValue = (key: string) => {
        const item = flatSettings.find(s => s.key === key);
        // If it's stored as an array (JSON cast), take the first item if it's text
        if (item) {
            if (item.type === 'boolean') {
                const val = String(item.value);
                return val === 'true' || val === '1';
            }
            if (Array.isArray(item.value)) return item.value[0] || '';
            return item.value || '';
        }
        return '';
    };

    const getLinksValue = (key: string): Array<{ name: string; href: string; type?: 'page' | 'custom' }> => {
        const item = flatSettings.find(s => s.key === key);
        if (item && item.value) {
            try {
                const parsed = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                if (Array.isArray(parsed)) {
                    return parsed.map((link: { name: string; href: string }) => ({
                        ...link,
                        type: link.href.startsWith('/') && !link.href.startsWith('http') ? 'page' : 'custom'
                    }));
                }
            } catch (e) {
                console.warn('Failed to parse links:', e);
            }
        }
        return [];
    };

    // Initialize form data based on SETTINGS_STRUCT
    const initialData = Object.entries(SETTINGS_STRUCT).reduce((acc, [, items]) => {
        items.forEach(item => {
            if (item.type === 'links') {
                acc[item.key] = getLinksValue(item.key);
            } else {
                acc[item.key] = getSettingValue(item.key);
            }
        });
        // Add theme_preset to form data
        acc['theme_preset'] = getSettingValue('theme_preset') || themePresets?.default || 'ottostart_default';
        return acc;
    }, {} as Record<string, string | number | boolean | unknown[] | null>);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, setData: _setData } = useForm<Record<string, any>>(initialData);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setData = _setData as (key: string, value: any) => void;
    const [processing, setProcessing] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState<string>(String(initialData['theme_preset'] || 'ottostart_default'));

    const getInitialTab = () => {
        if (typeof window === 'undefined') return 'general';
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && Object.keys(SETTINGS_STRUCT).includes(tab)) {
            return tab;
        }
        return 'general';
    };

    const [currentTab, setCurrentTab] = useState(getInitialTab);

    const handleTabChange = (value: string) => {
        setCurrentTab(value);
        const url = new URL(window.location.href);
        url.searchParams.set('tab', value);
        window.history.pushState({}, '', url);
    };

    // Apply theme preview when preset changes - respects current dark/light mode
    // Apply theme preview when preset OR data changes
    useEffect(() => {
        if (typeof document === 'undefined') return;
        
        const root = document.documentElement;
        // Detect current theme mode to apply correct overrides for preview
        const isDark = root.classList.contains('dark');

        const applyVar = (name: string, value: string) => {
            if (!value) {
                root.style.removeProperty(name);
                return;
            }
            // Use oklchToHex if it's not already oklch/rgb
            const finalValue = (value.startsWith('oklch') || value.startsWith('rgb') || value.startsWith('var')) ? value : oklchToHex(value);
            root.style.setProperty(name, finalValue);
        };

        // If we have custom overrides, they will override CSS classes due to specificity.
        // We only apply them here for the "Live Preview" feel.
        if (data['brand_primary']) applyVar('--primary', data['brand_primary'] as string);
        else root.style.removeProperty('--primary');

        if (data['brand_secondary']) applyVar('--secondary', data['brand_secondary'] as string);
        else root.style.removeProperty('--secondary');

        if (data['brand_accent']) applyVar('--accent', data['brand_accent'] as string);
        else root.style.removeProperty('--accent');

        if (data['brand_neutral']) applyVar('--muted', data['brand_neutral'] as string);
        else root.style.removeProperty('--muted');

        if (data['brand_background']) applyVar('--background', data['brand_background'] as string);
        else root.style.removeProperty('--background');

        if (data['brand_foreground']) applyVar('--foreground', data['brand_foreground'] as string);
        else root.style.removeProperty('--foreground');

        if (data['brand_border']) applyVar('--border', data['brand_border'] as string);
        else root.style.removeProperty('--border');

        if (data['brand_ring']) applyVar('--ring', data['brand_ring'] as string);
        else root.style.removeProperty('--ring');

        // Branding Preview logic
        // We evaluate fallbacks for preview just like ThemeStyles.tsx does
        const logoPrimary = isDark 
            ? (data['brand_logo_primary_dark'] || data['brand_logo_primary'] || 'var(--primary)')
            : (data['brand_logo_primary'] || 'var(--primary)');
            
        const logoSecondary = isDark 
            ? (data['brand_logo_secondary_dark'] || data['brand_logo_secondary'] || 'var(--secondary)')
            : (data['brand_logo_secondary'] || 'var(--secondary)');
            
        const logoAccent = isDark 
            ? (data['brand_logo_accent_dark'] || data['brand_logo_accent'] || 'var(--accent)')
            : (data['brand_logo_accent'] || 'var(--accent)');

        // Apply Logo Colors
        applyVar('--logo-primary', logoPrimary as string);
        applyVar('--logo-secondary', logoSecondary as string);
        applyVar('--logo-accent', logoAccent as string);

        // Secondary Branding (Decorative Logo)
        const secondaryPrimary = isDark
            ? (data['brand_secondary_primary_dark'] || data['brand_secondary_primary'] || '--logo-primary-placeholder')
            : (data['brand_secondary_primary'] || '--logo-primary-placeholder');

        const secondarySecondary = isDark
            ? (data['brand_secondary_secondary_dark'] || data['brand_secondary_secondary'] || '--logo-secondary-placeholder')
            : (data['brand_secondary_secondary'] || '--logo-secondary-placeholder');

        const secondaryAccent = isDark
            ? (data['brand_secondary_accent_dark'] || data['brand_secondary_accent'] || '--logo-accent-placeholder')
            : (data['brand_secondary_accent'] || '--logo-accent-placeholder');

        // Note: For preview, we explicitly resolve the placeholders to the logo variables 
        // to match the fallback behavior in ThemeStyles.tsx
        applyVar('--logo-secondary-primary', secondaryPrimary === '--logo-primary-placeholder' ? 'var(--logo-primary)' : secondaryPrimary as string);
        applyVar('--logo-secondary-secondary', secondarySecondary === '--logo-secondary-placeholder' ? 'var(--logo-secondary)' : secondarySecondary as string);
        applyVar('--logo-secondary-accent', secondaryAccent === '--logo-accent-placeholder' ? 'var(--logo-accent)' : secondaryAccent as string);
        
        // Gradient system preview
        const presetColors = isDark ? themePresets?.themes[data.theme_preset]?.dark : themePresets?.themes[data.theme_preset]?.light;
        const gradStart = (data['brand_primary'] as string) || (presetColors as any)?.['gradient-start'] || (presetColors as any)?.primary || 'oklch(0.55 0.13 43)';
        const gradEnd = (data['brand_accent'] as string) || (presetColors as any)?.['gradient-end'] || (presetColors as any)?.accent || 'oklch(0.88 0.03 93)';
        const gradAccent = (data['brand_accent'] as string) || (presetColors as any)?.['gradient-accent'] || (presetColors as any)?.accent || 'oklch(0.70 0.10 200)';

        applyVar('--gradient-start', gradStart);
        applyVar('--gradient-end', gradEnd);
        applyVar('--gradient-accent', gradAccent);
        
        // Complex computed variables for gradients
        root.style.setProperty('--theme-gradient', `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))`);
        root.style.setProperty('--theme-gradient-subtle', `linear-gradient(135deg, color-mix(in oklch, var(--gradient-start) 8%, var(--background)), color-mix(in oklch, var(--gradient-end) 8%, var(--background)))`);
        root.style.setProperty('--theme-gradient-radial', `radial-gradient(ellipse at 20% 50%, color-mix(in oklch, var(--gradient-start) 15%, transparent), color-mix(in oklch, var(--gradient-end) 10%, transparent), transparent 70%)`);
        root.style.setProperty('--theme-gradient-animated', `linear-gradient(135deg, var(--gradient-start), var(--gradient-accent), var(--gradient-end), var(--gradient-start))`);

        if (data['border_radius']) root.style.setProperty('--radius', data['border_radius'] as string);
        else root.style.removeProperty('--radius');

        return () => {
             // Clean up on unmount to restore site defaults
             const vars = [
                '--primary', '--secondary', '--accent', '--muted', 
                '--background', '--foreground', '--border', '--ring', 
                '--radius', '--logo-primary', '--logo-secondary', '--logo-accent',
                '--logo-secondary-primary', '--logo-secondary-secondary', '--logo-secondary-accent',
                '--gradient-start', '--gradient-end', '--gradient-accent',
                '--theme-gradient', '--theme-gradient-subtle', '--theme-gradient-radial', '--theme-gradient-animated'
             ];
             vars.forEach(v => root.style.removeProperty(v));
        };
    }, [data]);


    const handlePresetSelect = (presetKey: string) => {
        setSelectedPreset(presetKey);
        setData(prev => ({
            ...prev,
            theme_preset: presetKey,
            // Clear overrides to follow preset defaults (restores dark mode)
            brand_primary: '',
            brand_secondary: '',
            brand_accent: '',
            brand_neutral: '',
            brand_dark: '', // dark background
            brand_background: '', // light background
            brand_foreground: '',
            brand_border: '',
            brand_ring: '',
            // Clear branding overrides
            brand_logo_primary: '',
            brand_logo_secondary: '',
            brand_logo_accent: '',
            brand_logo_primary_dark: '',
            brand_logo_secondary_dark: '',
            brand_logo_accent_dark: '',
            brand_secondary_primary: '',
            brand_secondary_secondary: '',
            brand_secondary_accent: '',
            brand_secondary_primary_dark: '',
            brand_secondary_secondary_dark: '',
            brand_secondary_accent_dark: '',
            // Font settings
            font_display: themePresets?.themes[presetKey]?.fonts.sans || '',
            font_body: themePresets?.themes[presetKey]?.fonts.sans || '',
            border_radius: themePresets?.themes[presetKey]?.radius || ''
        }));
        toast.success(`Theme "${themePresets?.themes[presetKey]?.name}" applied. Click Save to persist.`);
    };
    
    const handleReset = (group: keyof typeof SETTINGS_STRUCT) => {
        if (confirm(`Are you sure you want to reset ${group} settings to default values?`)) {
            const groupItems = SETTINGS_STRUCT[group];
            if (groupItems) {
                groupItems.forEach((item) => {
                    // Special case for theme colors: reset to empty to allow falling back to preset defaults
                    // which correctly handle both light and dark mode.
                    if (group === 'theme' && item.type === 'color') {
                        setData(item.key, '');
                    } else {
                        setData(item.key, item.placeholder);
                    }
                });
                
                if (group === 'theme') {
                    setSelectedPreset(themePresets?.default || 'ottostart_default');
                    setData('theme_preset', themePresets?.default || 'ottostart_default');
                }
                
                toast.info(`${group.charAt(0).toUpperCase() + group.slice(1)} settings reset to defaults. Don't forget to save!`);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        
        // Transform data back to array format for backend
        const settingsToSave = Object.entries(data).map(([key, value]) => {
            // Find which group and type this key belongs to
            let group = 'general';
            let type = 'text';
            
            for (const [g, items] of Object.entries(SETTINGS_STRUCT)) {
                const found = items.find(i => i.key === key);
                if (found) {
                    group = g;
                    // Handle links type - save as JSON
                    if (found.type === 'links') {
                        type = 'json';
                        // Keep as array, the backend/Eloquent cast will handle serialization
                        const cleanedLinks = Array.isArray(value) 
                            ? value.map(({ name, href }: { name: string; href: string }) => ({ name, href }))
                            : [];
                        return {
                            key,
                            value: cleanedLinks,
                            type,
                            group_name: group
                        };
                    }
                    type = found.type === 'textarea' ? 'text' : found.type === 'image' ? 'text' : found.type;
                    break;
                }
            }

            return {
                key,
                value, // The backend handles array wrapping for simple text
                type: type === 'image' ? 'text' : type,
                group_name: group
            };
        });

        router.post('/admin/settings', {
            settings: settingsToSave,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Settings saved successfully");
                setProcessing(false);
                
                // Force page reload to apply theme changes
                // This ensures the new theme preset is loaded from the server
                // and applied via ThemeStyles.tsx without any stale cache
                // UPDATE: Inertia handling is sufficient, reload removed for smoother UX
                // setTimeout(() => {
                //     window.location.reload();
                // }, 500);
            },
            onError: () => {
                setProcessing(false);
                toast.error("Failed to save settings");
            }
        });
    };

    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Settings', href: '/admin/settings' },
    ];

    return (
        <AdminLayout title="Site Settings" breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                <div>
                     <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                     <p className="text-muted-foreground">Manage your global site configuration</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="branding">Branding</TabsTrigger>
                            <TabsTrigger value="contact">Contact Info</TabsTrigger>
                            <TabsTrigger value="social">Social Media</TabsTrigger>
                            <TabsTrigger value="seo">SEO & Analytics</TabsTrigger>

                            <TabsTrigger value="theme">Theme & Visuals</TabsTrigger>
                            <TabsTrigger value="compliance">Compliance</TabsTrigger>
                        </TabsList>

                        {Object.entries(SETTINGS_STRUCT).map(([group, items]) => (
                            <TabsContent key={group} value={group}>
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="capitalize">{group} Settings</CardTitle>
                                                <CardDescription>
                                                    {group === 'theme' 
                                                        ? "Customize your brand's visual identity. These settings are applied globally." 
                                                        : `Configure your ${group} preferences.`}
                                                </CardDescription>
                                            </div>
                                            {(group === 'theme') && (
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => handleReset(group)}
                                                    className="text-xs"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5 mr-2" />
                                                    Reset to Defaults
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-6">
                                        {/* Global branding overrides header - only in theme tab */}
                                        {group === 'theme' && (
                                            <div className="flex justify-between items-center mb-6 px-1">
                                                <h3 className="font-semibold">Custom Overrides</h3>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => {
                                                        if (confirm("Clear all custom color overrides? This will restore the theme's automatic Light/Dark mode behavior.")) {
                                                            const overrides = [
                                                                'brand_primary', 'brand_secondary', 'brand_accent', 
                                                                'brand_neutral', 'brand_dark', 'brand_background', 
                                                                'brand_foreground', 'brand_border', 'brand_ring'
                                                            ];
                                                            overrides.forEach(key => setData(key as any, ''));
                                                            toast.info("Custom overrides cleared. Save to apply.");
                                                        }
                                                    }}
                                                >
                                                    <X className="w-3 h-3 mr-1.5" />
                                                    Clear All Overrides
                                                </Button>
                                            </div>
                                        )}
                                        {/* Theme Presets Grid - only shown in theme tab */}
                                        {group === 'theme' && themePresets && (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-2">
                                                    <Palette className="w-5 h-5 text-primary" />
                                                    <Label className="text-base font-semibold">Choose a Theme Preset</Label>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Select a pre-designed theme to instantly change your site's look. Changes preview immediately.
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {Object.entries(themePresets.themes).map(([key, preset]) => (
                                                        <button
                                                            key={key}
                                                            type="button"
                                                            onClick={() => handlePresetSelect(key)}
                                                            className={cn(
                                                                "relative rounded-lg border-2 p-3 text-left transition-all hover:shadow-md",
                                                                selectedPreset === key
                                                                    ? "border-primary ring-2 ring-primary/20 bg-accent/50"
                                                                    : "border-border hover:border-primary/50"
                                                            )}
                                                        >
                                                            {selectedPreset === key && (
                                                                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                                                                    <Check className="w-3 h-3" />
                                                                </div>
                                                            )}
                                                            {/* Color swatches */}
                                                            <div className="flex gap-1 mb-2">
                                                                <div 
                                                                    className="w-6 h-6 rounded-full border border-border/50"
                                                                    style={{ '--bg-color': preset.light.primary } as React.CSSProperties}
                                                                    title="Primary"
                                                                >
                                                                    <div className="w-full h-full rounded-full bg-[var(--bg-color)]" />
                                                                </div>
                                                                <div 
                                                                    className="w-6 h-6 rounded-full border border-border/50"
                                                                    style={{ '--bg-color': preset.light.accent || preset.light.secondary } as React.CSSProperties}
                                                                    title="Accent"
                                                                >
                                                                    <div className="w-full h-full rounded-full bg-[var(--bg-color)]" />
                                                                </div>
                                                                <div 
                                                                    className="w-6 h-6 rounded-full border border-border/50"
                                                                    style={{ '--bg-color': preset.light.foreground } as React.CSSProperties}
                                                                    title="Foreground"
                                                                >
                                                                    <div className="w-full h-full rounded-full bg-[var(--bg-color)]" />
                                                                </div>
                                                            </div>
                                                            <p className="font-medium text-sm truncate">{preset.name}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
                                                        </button>
                                                    ))}
                                                </div>
                                                <hr className="my-4" />
                                                <p className="text-xs text-muted-foreground italic">
                                                    Or customize individual colors below to create your own theme.
                                                </p>
                                            </div>
                                        )}
                                        
                                        {/* Individual Settings Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                                        {items.filter(i => i.key !== 'theme_preset').map((item) => {
                                            const isColor = item.type === 'color';
                                            
                                            // Layout logic for grid spans
                                            let colSpan = "";
                                            if (item.type === 'textarea') {
                                                colSpan = "md:col-span-2 lg:col-span-3";
                                            } else if (item.type === 'links') {
                                                colSpan = "md:col-span-2 lg:col-span-2";
                                            } else if (item.type === 'image') {
                                                // Make site_logo take 1 col on LG, but full-width if we ever add other images that need more space
                                                colSpan = item.key === 'site_logo' ? "" : "md:col-span-2 lg:col-span-3";
                                            }
                                            
                                            return (
                                                <div 
                                                    key={item.key} 
                                                    className={cn(
                                                        "grid gap-1.5",
                                                        colSpan,
                                                        isColor ? "bg-muted/30 p-2 rounded-md border border-border/50" : ""
                                                    )}
                                                >
                                                    {item.type !== 'links' && (
                                                        <div className="flex items-center justify-between">
                                                            <Label htmlFor={item.key} className="text-[13px] font-semibold text-foreground/80">{item.label}</Label>
                                                            {isColor && (
                                                                <span className="text-[10px] font-mono uppercase text-muted-foreground mr-1">{data[item.key]}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    
                                                    {item.type === 'links' ? (
                                                        <LinkManager
                                                            value={(data[item.key] as unknown) as Array<{ name: string; href: string }>}
                                                            onChange={(links) => setData(item.key, links)}
                                                            pages={pages}
                                                            label={item.label}
                                                            description={item.description}
                                                        />
                                                    ) : item.type === 'textarea' ? (
                                                        <Textarea
                                                            id={item.key}
                                                            value={data[item.key]}
                                                            onChange={(e) => setData(item.key, e.target.value)}
                                                            placeholder={item.placeholder}
                                                            className="min-h-[80px] text-sm"
                                                        />
                                                    ) : item.type === 'image' ? (
                                                        <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted/20">
                                                            <MediaLibrary 
                                                                type="image"
                                                                onSelect={(asset: MediaAsset) => setData(item.key, asset.url)}
                                                                trigger={
                                                                    <div className="w-16 h-16 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted transition-colors relative overflow-hidden bg-background shrink-0">
                                                                        {data[item.key] ? (
                                                                            <img src={data[item.key]} alt="Logo" className="w-full h-full object-contain p-1" />
                                                                        ) : (
                                                                            <ImagePlus className="w-6 h-6 text-muted-foreground" />
                                                                        )}
                                                                    </div>
                                                                }
                                                            />
                                                            <div className="flex-1 space-y-1">
                                                                <Input 
                                                                    value={data[item.key]} 
                                                                    onChange={(e) => setData(item.key, e.target.value)}
                                                                    placeholder="/logo.svg"
                                                                    className="h-8 text-xs"
                                                                />
                                                                <p className="text-[10px] text-muted-foreground">Select from library or enter URL</p>
                                                            </div>
                                                            {data[item.key] && (
                                                                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => setData(item.key, '')}>
                                                                    <X className="w-3 h-3" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    ) : item.type === 'boolean' ? (
                                                        <div className="flex items-center space-x-2 py-2">
                                                            <Switch
                                                                id={item.key}
                                                                checked={data[item.key] === true || data[item.key] === 'true'}
                                                                onCheckedChange={(checked) => setData(item.key, checked)}
                                                            />
                                                            <Label htmlFor={item.key} className="text-xs font-normal text-muted-foreground">
                                                                {data[item.key] ? 'Enabled' : 'Disabled'}
                                                            </Label>
                                                        </div>
                                                    ) : item.type === 'select' && item.options ? (
                                                        <select
                                                            aria-label={item.label}
                                                            id={item.key}
                                                            value={data[item.key] || item.placeholder}
                                                            onChange={(e) => setData(item.key, e.target.value)}
                                                            className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                                        >
                                                            {item.options.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            {isColor && (
                                                                <div className="flex flex-col gap-2 w-full">
                                                                    <div className="flex justify-between items-center px-1">
                                                                        {data[item.key] && (
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => setData(item.key as any, '')}
                                                                                className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                                                                            >
                                                                                <X className="w-2.5 h-2.5" />
                                                                                Reset to Default
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="relative flex-1">
                                                                            <Input
                                                                                id={item.key}
                                                                                value={(data[item.key as keyof typeof data] as string) || (themePresets?.themes[data.theme_preset]?.light as any)?.[item.key.replace('brand_', '')] || ''}
                                                                                onChange={(e) => setData(item.key as any, e.target.value)}
                                                                                className="h-9 text-[11px] font-mono pl-9"
                                                                                placeholder={item.placeholder}
                                                                            />
                                                                            <div 
                                                                                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-border"
                                                                                style={{ 
                                                                                    backgroundColor: (data[item.key as keyof typeof data] as string || (themePresets?.themes[data.theme_preset]?.light as any)?.[item.key.replace('brand_', '')] || '#000000')
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="shrink-0">
                                                                            <Input
                                                                                type="color"
                                                                                value={oklchToHex(data[item.key as keyof typeof data] as string || (themePresets?.themes[data.theme_preset]?.light as any)?.[item.key.replace('brand_', '')] || '#000000')}
                                                                                onChange={(e) => setData(item.key as any, e.target.value)}
                                                                                className="w-10 h-9 p-1 bg-transparent border rounded-md cursor-pointer"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {!isColor && (
                                                                <Input
                                                                    id={item.key}
                                                                    type={item.type === 'email' ? 'email' : 'text'}
                                                                    className="h-8 text-sm"
                                                                    value={data[item.key as keyof typeof data] as string}
                                                                    onChange={(e) => setData(item.key as any, e.target.value)}
                                                                    placeholder={item.placeholder}
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                    {item.description && (
                                                        <p className="text-[10px] text-muted-foreground leading-snug mt-1">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        ))}
                    </Tabs>

                    <div className="mt-6 flex justify-end">
                        <Button type="submit" disabled={processing} size="lg">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
