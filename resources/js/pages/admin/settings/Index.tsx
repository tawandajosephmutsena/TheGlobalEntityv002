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
        { key: 'site_name', label: 'Site Name', type: 'text', placeholder: 'Avant-Garde CMS' },
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
    ],
    seo: [
        { key: 'default_meta_title', label: 'Default Meta Title', type: 'text', placeholder: 'Avant-Garde Experience' },
        { key: 'default_meta_description', label: 'Default Meta Description', type: 'textarea', placeholder: 'Default description for SEO...' },
        { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'text', placeholder: 'G-XXXXXXXXXX' },
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
    ]
};

/**
 * Convert OKLCH color strings to hex format for HTML color inputs.
 * Falls back to the original value if not OKLCH format.
 */
function oklchToHex(colorStr: string): string {
    if (!colorStr) return '#000000';
    
    // If already hex, return as-is
    if (colorStr.startsWith('#')) return colorStr;
    
    // If it's an oklch string, we need to convert it
    // OKLCH format: oklch(L C H) where L is 0-1, C is 0-0.4, H is 0-360
    const oklchMatch = colorStr.match(/oklch\(([\d.]+)\s+([\d.]+)\s+([\d.]+)\)/);
    if (oklchMatch) {
        const [, l, c, h] = oklchMatch.map(Number);
        // Convert OKLCH to approximate hex - simplified conversion
        // For more accurate conversion, a color library would be needed
        const lightness = Math.round(l * 255);
        if (c < 0.02) {
            // Near-grayscale
            const gray = lightness.toString(16).padStart(2, '0');
            return `#${gray}${gray}${gray}`;
        }
        // For chromatic colors, approximate using HSL-like conversion
        const hue = h || 0;
        const saturation = Math.min(c * 2.5, 1);
        return hslToHex(hue, saturation, l);
    }
    
    // If RGB or other format, try to parse
    if (colorStr.startsWith('rgb')) {
        const match = colorStr.match(/rgba?\((\d+),?\s*(\d+),?\s*(\d+)/);
        if (match) {
            const [, r, g, b] = match;
            return `#${parseInt(r).toString(16).padStart(2, '0')}${parseInt(g).toString(16).padStart(2, '0')}${parseInt(b).toString(16).padStart(2, '0')}`;
        }
    }
    
    return colorStr;
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
        const root = document.documentElement;
        
        // Function to apply a variable if it exists
        const applyVar = (key: string, value: string | undefined | null) => {
             if (value) root.style.setProperty(key, value);
        };

        // 1. Apply Preset Base (if valid preset selected)
        if (themePresets?.themes[selectedPreset]) {
            const preset = themePresets.themes[selectedPreset];
            const isDarkMode = root.classList.contains('dark');
            const colors = isDarkMode ? preset.dark : preset.light;
            
            Object.entries(colors).forEach(([key, value]) => {
                if (value) root.style.setProperty(`--${key}`, value);
            });
            root.style.setProperty('--radius', preset.radius);
            root.style.setProperty('--font-sans', `${preset.fonts.sans}, sans-serif`);
        }

        // 2. Apply Custom Overrides from Form Data (takes precedence)
        // We only apply if the field is not empty
        if (data['brand_primary']) applyVar('--primary', data['brand_primary'] as string);
        if (data['brand_secondary']) applyVar('--secondary', data['brand_secondary'] as string);
        if (data['brand_accent']) applyVar('--accent', data['brand_accent'] as string);
        if (data['brand_neutral']) applyVar('--muted', data['brand_neutral'] as string);
        if (data['brand_background']) applyVar('--background', data['brand_background'] as string);
        if (data['brand_foreground']) applyVar('--foreground', data['brand_foreground'] as string);
        if (data['brand_border']) applyVar('--border', data['brand_border'] as string);
        if (data['brand_ring']) applyVar('--ring', data['brand_ring'] as string);
        
        // Apply Radius Override
        if (data['border_radius']) root.style.setProperty('--radius', data['border_radius'] as string);

        return () => {
             // Cleanup if needed, though usually next effect run overwrites
             // We don't remove everything to avoid flashing defaults
        };
    }, [selectedPreset, themePresets, data]);


    const handlePresetSelect = (presetKey: string) => {
        setSelectedPreset(presetKey);
        setData('theme_preset', presetKey);
        
        // Clear custom color overrides so the preset colors are used directly.
        // This ensures that dark mode works correctly by falling back to the preset's dark mode values.
        // Users can still manually edit colors if they want to override.
        setData('brand_primary', '');
        setData('brand_secondary', '');
        setData('brand_accent', '');
        setData('brand_neutral', '');
        setData('brand_dark', '');
        setData('brand_background', '');
        setData('brand_foreground', '');
        setData('brand_border', '');
        setData('brand_ring', '');
        
        toast.success(`Theme "${themePresets?.themes[presetKey].name}" applied! Save to make it permanent.`);
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
                            <TabsTrigger value="contact">Contact Info</TabsTrigger>
                            <TabsTrigger value="social">Social Media</TabsTrigger>
                            <TabsTrigger value="seo">SEO & Analytics</TabsTrigger>
                            <TabsTrigger value="theme">Theme & Branding</TabsTrigger>
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
                                    <CardContent className="space-y-6">
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
                                                                    style={{ '--bg-color': preset.light.background } as React.CSSProperties}
                                                                    title="Background"
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
                                                                <div className="flex items-center gap-2 w-full">
                                                                    <Input
                                                                        id={item.key}
                                                                        type="color"
                                                                        className="w-10 h-8 p-0.5 border-none bg-transparent cursor-pointer shrink-0"
                                                                        value={oklchToHex(data[item.key] as string)}
                                                                        onChange={(e) => setData(item.key, e.target.value)}
                                                                    />
                                                                    <div className="relative flex-1">
                                                                        <Input
                                                                            type="text"
                                                                            className="h-8 text-sm font-mono text-[11px] pr-8"
                                                                            value={data[item.key] as string}
                                                                            onChange={(e) => setData(item.key, e.target.value)}
                                                                            placeholder={item.placeholder}
                                                                        />
                                                                        {data[item.key] && (
                                                                            <button 
                                                                                type="button"
                                                                                onClick={() => setData(item.key, '')}
                                                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                                                                                title="Clear override - use preset default"
                                                                            >
                                                                                <X className="w-3 h-3" />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {!isColor && (
                                                                <Input
                                                                    id={item.key}
                                                                    type={item.type === 'email' ? 'email' : 'text'}
                                                                    className="h-8 text-sm"
                                                                    value={data[item.key] as string}
                                                                    onChange={(e) => setData(item.key, e.target.value)}
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
