import { usePage, Head } from '@inertiajs/react';

interface ThemeColors {
    background?: string;
    foreground?: string;
    card?: string;
    'card-foreground'?: string;
    popover?: string;
    'popover-foreground'?: string;
    primary?: string;
    'primary-foreground'?: string;
    secondary?: string;
    'secondary-foreground'?: string;
    muted?: string;
    'muted-foreground'?: string;
    accent?: string;
    'accent-foreground'?: string;
    destructive?: string;
    'destructive-foreground'?: string;
    border?: string;
    input?: string;
    ring?: string;
    sidebar?: string;
    'sidebar-foreground'?: string;
    'sidebar-primary'?: string;
    'sidebar-primary-foreground'?: string;
    'sidebar-accent'?: string;
    'sidebar-accent-foreground'?: string;
    'sidebar-border'?: string;
    'sidebar-ring'?: string;
    'gradient-start'?: string;
    'gradient-end'?: string;
    'gradient-accent'?: string;
    [key: string]: string | undefined;
}

interface ThemePreset {
    name: string;
    description: string;
    fonts: {
        sans: string;
        mono: string;
        serif?: string;
        display?: string;
    };
    radius: string;
    light: ThemeColors;
    dark: ThemeColors;
}

interface ThemePresetsConfig {
    default: string;
    themes: Record<string, ThemePreset>;
}

interface ThemeData {
    preset?: ThemePreset;
    presetKey?: string;
}

interface PageProps {
    theme?: ThemeData & { preset?: string };
    themePresets?: ThemePresetsConfig;
    settings?: Record<string, Array<{ key: string; value: string | string[] | null }>>;
    nonce?: string;
    [key: string]: unknown; // Index signature for Inertia PageProps compatibility
}


export default function ThemeStyles() {
    const props = usePage<PageProps>().props;
    const { themePresets, settings, theme } = props;

    // Get selected preset key from settings (fallback only)
    const getSettingValue = (key: string): string | null => {
        if (!settings) return null;
        const flatSettings = Object.values(settings).flat();
        const item = flatSettings.find(s => s.key === key);
        if (item) {
            if (Array.isArray(item.value)) return item.value[0] || null;
            return item.value;
        }
        return null;
    };

    // Priority: 1) theme.preset from shared props (most reliable), 2) settings lookup, 3) default
    const selectedPresetKey = theme?.preset || getSettingValue('theme_preset') || themePresets?.default || 'ottostart_default';
    const preset = themePresets?.themes[selectedPresetKey];

    // Debug logging (remove in production)
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).DEBUG_THEME) {
        console.log('[ThemeStyles] Preset selection:', {
            fromThemeProp: theme?.preset,
            fromSettings: getSettingValue('theme_preset'),
            default: themePresets?.default,
            selected: selectedPresetKey,
            presetFound: !!preset
        });
    }

    if (!preset) return null;

    // Get specific overrides
    const customPrimary = getSettingValue('brand_primary');
    const customAccent = getSettingValue('brand_accent');
    const customBackground = getSettingValue('brand_background');
    const customForeground = getSettingValue('brand_foreground');
    const customBorder = getSettingValue('brand_border');
    const customRing = getSettingValue('brand_ring');
    const customRadius = getSettingValue('border_radius');
    const customFontWeight = getSettingValue('font_weight');
    const customFontWeightHeading = getSettingValue('font_weight_heading');
    const customDisplayFont = getSettingValue('font_display');
    const customBodyFont = getSettingValue('font_body');

    // Debug logging (remove in production)
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).DEBUG_THEME) {
        console.log('[ThemeStyles] Custom overrides:', {
            customPrimary, customAccent, customBackground, customForeground,
            customBorder, customRing, customRadius, customFontWeight
        });
    }

    // Generate font loading URL for Bunny Fonts
    const generateFontUrl = () => {
        const fontFamilies = new Set<string>();
        if (customDisplayFont) fontFamilies.add(customDisplayFont);
        if (customBodyFont) fontFamilies.add(customBodyFont);
        if (preset.fonts.sans) fontFamilies.add(preset.fonts.sans);
        if (preset.fonts.serif) fontFamilies.add(preset.fonts.serif);
        if (preset.fonts.mono) fontFamilies.add(preset.fonts.mono);

        const systemFonts = ['serif', 'sans-serif', 'monospace', 'system-ui', 'Georgia', 'Arial', 'Times New Roman'];
        const fontsToLoad = Array.from(fontFamilies).filter(font => !systemFonts.includes(font));

        if (fontsToLoad.length === 0) return null;

        const formattedFonts = fontsToLoad.map(font => {
            const normalized = font.toLowerCase().replace(/\s+/g, '-');
            return `${normalized}:300,400,500,600,700,800,900`;
        }).join('|');

        return `https://fonts.bunny.net/css?family=${formattedFonts}&display=swap`;
    };

    const fontUrl = generateFontUrl();

    /**
     * Generate fallback values for missing color tokens to ensure proper contrast.
     * This prevents undefined CSS variables that cause broken styling.
     */
    const generateFallbacks = (colors: ThemeColors, isDark: boolean): ThemeColors => {
        const bg = colors.background || (isDark ? 'oklch(0.15 0 0)' : 'oklch(0.98 0 0)');
        const fg = colors.foreground || (isDark ? 'oklch(0.95 0 0)' : 'oklch(0.25 0 0)');
        
        const lightDefaults: ThemeColors = {
            'card': bg,
            'card-foreground': fg,
            'popover': bg,
            'popover-foreground': fg,
            'secondary-foreground': 'oklch(0.25 0 0)',
            'muted-foreground': 'oklch(0.45 0 0)',
            'accent-foreground': 'oklch(0.25 0 0)',
            'destructive-foreground': 'oklch(1 0 0)',
            'input': colors.border,
            'surface-container-lowest': 'oklch(1 0 0)',
            'surface-container-low': 'oklch(0.96 0 0)',
            'surface-container': 'oklch(0.94 0 0)',
            'surface-container-high': 'oklch(0.92 0 0)',
            'surface-container-highest': 'oklch(0.90 0 0)',
            'surface': bg,
            'on-surface': fg,
            'on-surface-variant': 'oklch(0.45 0 0)',
            'surface-variant': 'oklch(0.92 0 0)',
            'outline': 'oklch(0.50 0 0)',
            'outline-variant': 'oklch(0.80 0 0)',
        };
        
        const darkDefaults: ThemeColors = {
            'card': bg,
            'card-foreground': fg,
            'popover': bg,
            'popover-foreground': fg,
            'secondary-foreground': 'oklch(0.95 0 0)',
            'muted-foreground': 'oklch(0.70 0 0)',
            'accent-foreground': 'oklch(0.95 0 0)',
            'destructive-foreground': 'oklch(1 0 0)',
            'input': colors.border,
            'surface-container-lowest': 'oklch(0.12 0 0)',
            'surface-container-low': 'oklch(0.18 0 0)',
            'surface-container': 'oklch(0.22 0 0)',
            'surface-container-high': 'oklch(0.28 0 0)',
            'surface-container-highest': 'oklch(0.35 0 0)',
            'surface': bg,
            'on-surface': fg,
            'on-surface-variant': 'oklch(0.80 0 0)',
            'surface-variant': 'oklch(0.30 0 0)',
            'outline': 'oklch(0.60 0 0)',
            'outline-variant': 'oklch(0.35 0 0)',
        };
        
        const defaults = isDark ? darkDefaults : lightDefaults;
        
        // Merge: theme values override defaults
        return { ...defaults, ...colors };
    };

    const generateCssVariables = (colors: ThemeColors, isDark: boolean, indent: string = '    '): string => {
        // First apply fallbacks for missing tokens
        const baseColors = generateFallbacks(colors, isDark);
        
        // Then apply user overrides ONLY if they are non-empty
        // Empty string means use preset colors
        if (customPrimary && customPrimary.trim()) baseColors.primary = customPrimary;
        if (customAccent && customAccent.trim()) baseColors.accent = customAccent;
        if (customBackground && customBackground.trim()) baseColors.background = customBackground;
        if (customForeground && customForeground.trim()) baseColors.foreground = customForeground;
        if (customBorder && customBorder.trim()) baseColors.border = customBorder;
        if (customRing && customRing.trim()) baseColors.ring = customRing;

        return Object.entries(baseColors)
            .filter(([, value]) => value !== undefined)
            .map(([key, value]) => `${indent}--${key}: ${value};`)
            .join('\n');
    };

    return (
        <Head>
            {fontUrl && <link rel="stylesheet" href={fontUrl} />}
            <style id="theme-variables" nonce={props.nonce} dangerouslySetInnerHTML={{
                __html: `
                    :root {
                        ${generateCssVariables(preset.light, false, '                        ')}
                        /* Logo Colors - allow manual override or fallback to theme colors */
                        --logo-primary: ${getSettingValue('brand_logo_primary') || 'var(--primary)'};
                        --logo-secondary: ${getSettingValue('brand_logo_secondary') || 'var(--secondary)'};
                        --logo-accent: ${getSettingValue('brand_logo_accent') || 'var(--accent)'};
                        --logo-dynamic: ${getSettingValue('brand_logo_dynamic') || 'false'};

                        /* Decorative Branding Colors (Artboard-8) - fallback to Logo colors */
                        --logo-secondary-primary: ${getSettingValue('brand_secondary_primary') || 'var(--logo-primary)'};
                        --logo-secondary-secondary: ${getSettingValue('brand_secondary_secondary') || 'var(--logo-secondary)'};
                        --logo-secondary-accent: ${getSettingValue('brand_secondary_accent') || 'var(--logo-accent)'};

                        --radius: ${customRadius || preset.radius || '0.5rem'};
                        --font-sans: "${customBodyFont || preset.fonts.sans || 'Inter'}", ui-sans-serif, system-ui, sans-serif;
                        --font-display: "${customDisplayFont || preset.fonts.display || preset.fonts.sans || 'Inter'}", ui-sans-serif, system-ui, sans-serif;
                        --font-serif: "${preset.fonts.serif || 'Georgia'}", ui-serif, Georgia, serif;
                        --font-mono: "${preset.fonts.mono || 'monospace'}", ui-monospace, SFMono-Regular, monospace;
                        --font-weight-base: ${customFontWeight || '400'};
                        --font-weight-heading: ${customFontWeightHeading || '700'};
                        
                        /* Chart colors - derived from theme */
                        --chart-1: ${preset.light.primary || 'oklch(0.55 0.13 43)'};
                        --chart-2: ${preset.light.secondary || 'oklch(0.69 0.16 290)'};
                        --chart-3: ${preset.light.accent || 'oklch(0.88 0.03 93)'};
                        --chart-4: ${preset.light.muted || 'oklch(0.88 0.04 298)'};
                        --chart-5: ${preset.light.ring || 'oklch(0.56 0.13 42)'};
                        
                        /* Agency color mappings - light mode */
                        --agency-primary: var(--foreground);
                        --agency-secondary: var(--background);
                        --agency-accent: var(--primary);
                        --agency-accent-soft: var(--secondary);
                        --agency-neutral: var(--muted);
                        --agency-dark: oklch(0.15 0 0);
                        
                        /* Primary RGB for effects (approximate) */
                        --primary-rgb: 194, 94, 46;
                        
                        /* Gradient system — derived from theme tokens or fallback to primary/accent */
                        --gradient-start: ${ (customPrimary && customPrimary.trim()) || preset.light['gradient-start'] || preset.light.primary || 'oklch(0.55 0.13 43)'};
                        --gradient-end: ${ (customAccent && customAccent.trim()) || preset.light['gradient-end'] || preset.light.accent || 'oklch(0.88 0.03 93)'};
                        --gradient-accent: ${ (customAccent && customAccent.trim()) || preset.light['gradient-accent'] || preset.light.accent || 'oklch(0.70 0.10 200)'};
                        --theme-gradient: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
                        --theme-gradient-reverse: linear-gradient(135deg, var(--gradient-end), var(--gradient-start));
                        --theme-gradient-subtle: linear-gradient(135deg, color-mix(in oklch, var(--gradient-start) 8%, var(--background)), color-mix(in oklch, var(--gradient-end) 8%, var(--background)));
                        --theme-gradient-radial: radial-gradient(ellipse at 20% 50%, color-mix(in oklch, var(--gradient-start) 15%, transparent), color-mix(in oklch, var(--gradient-end) 10%, transparent), transparent 70%);
                    }
                    
                    .dark {
                        ${generateCssVariables(preset.dark, true, '                        ')}
                        
                        /* Logo Colors - Dark Mode overrides */
                        --logo-primary: ${getSettingValue('brand_logo_primary_dark') || getSettingValue('brand_logo_primary') || 'var(--primary)'};
                        --logo-secondary: ${getSettingValue('brand_logo_secondary_dark') || getSettingValue('brand_logo_secondary') || 'var(--secondary)'};
                        --logo-accent: ${getSettingValue('brand_logo_accent_dark') || getSettingValue('brand_logo_accent') || 'var(--accent)'};

                        /* Decorative Branding Colors - Dark Mode overrides */
                        --logo-secondary-primary: ${getSettingValue('brand_secondary_primary_dark') || getSettingValue('brand_secondary_primary') || 'var(--logo-primary)'};
                        --logo-secondary-secondary: ${getSettingValue('brand_secondary_secondary_dark') || getSettingValue('brand_secondary_secondary') || 'var(--logo-secondary)'};
                        --logo-secondary-accent: ${getSettingValue('brand_secondary_accent_dark') || getSettingValue('brand_secondary_accent') || 'var(--logo-accent)'};

                        /* Chart colors - dark mode variants */
                        --chart-1: ${preset.dark.primary || 'oklch(0.55 0.13 43)'};
                        --chart-2: ${preset.dark.secondary || 'oklch(0.69 0.16 290)'};
                        --chart-3: ${preset.dark.accent || 'oklch(0.21 0.01 95)'};
                        --chart-4: ${preset.dark.muted || 'oklch(0.31 0.05 289)'};
                        --chart-5: ${preset.dark.ring || 'oklch(0.56 0.13 42)'};
                        
                        /* Agency color mappings - dark mode */
                        --agency-primary: var(--foreground);
                        --agency-secondary: var(--background);
                        --agency-accent: var(--primary);
                        --agency-accent-soft: var(--secondary);
                        --agency-neutral: var(--muted);
                        --agency-dark: oklch(0.10 0 0);
                        
                        /* Primary RGB for effects - dark mode */
                        --primary-rgb: 217, 116, 65;
                        
                        /* Gradient system — dark mode */
                        --gradient-start: ${ (customPrimary && customPrimary.trim()) || preset.dark['gradient-start'] || preset.dark.primary || 'oklch(0.55 0.13 43)'};
                        --gradient-end: ${ (customAccent && customAccent.trim()) || preset.dark['gradient-end'] || preset.dark.accent || 'oklch(0.21 0.01 95)'};
                        --gradient-accent: ${ (customAccent && customAccent.trim()) || preset.dark['gradient-accent'] || preset.dark.accent || 'oklch(0.50 0.08 200)'};

                        --theme-gradient: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
                        --theme-gradient-reverse: linear-gradient(135deg, var(--gradient-end), var(--gradient-start));
                        --theme-gradient-subtle: linear-gradient(135deg, color-mix(in oklch, var(--gradient-start) 12%, var(--background)), color-mix(in oklch, var(--gradient-end) 12%, var(--background)));
                        --theme-gradient-radial: radial-gradient(ellipse at 20% 50%, color-mix(in oklch, var(--gradient-start) 20%, transparent), color-mix(in oklch, var(--gradient-end) 15%, transparent), transparent 70%);
                    }

                    /* Global Font Applications */
                    body {
                        font-family: var(--font-sans);
                        font-weight: var(--font-weight-base);
                    }

                    h1, h2, h3, h4, h5, h6, .font-display {
                        font-family: var(--font-display);
                        letter-spacing: -0.05em;
                    }

                    h1 {
                        font-weight: 900;
                    }

                    h2, h3, h4, h5, h6 {
                        font-weight: var(--font-weight-heading);
                    }
                `
            }} />
        </Head>
    );
}
