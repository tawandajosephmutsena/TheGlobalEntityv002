---
name: Theme Preset Creation
description: Add a new selectable color theme preset to the branding settings. Covers the PHP config, OKLCH color format, light/dark mode pairs, contrast best practices, font selection, and ThemeStyles integration.
---

# Theme Preset Creation

Use this skill when you need to add a new color theme that users can select and edit in the **Theme & Branding** tab under **Settings > Theme & Branding**. The new theme must behave identically to existing presets: appear in the preset grid, apply instantly on selection, support light/dark mode, and maintain accessible contrast ratios.

## Architecture Overview

| Layer | File | Role |
|-------|------|------|
| **Presets Config** | `config/theme-presets.php` | PHP array defining all theme presets (colors, fonts, radius) |
| **CSS Variable Injection** | `resources/js/components/ThemeStyles.tsx` | Reads the active preset from shared Inertia props, generates CSS custom properties with fallbacks |
| **Settings UI** | `resources/js/pages/admin/settings/Index.tsx` | Renders the preset picker grid and per-color override inputs in the "Theme & Branding" tab |
| **Database** | `settings` table, key `theme_preset` | Stores the selected preset key as a string |

> [!IMPORTANT]
> You only need to edit **one file** to add a new theme: `config/theme-presets.php`. The frontend automatically discovers and renders all themes defined in that config.

## Step-by-Step Workflow

### 1. Choose a Unique Key

The key is a `snake_case` string used internally. It must be unique across all existing keys in `config/theme-presets.php`.

```php
// Existing keys for reference:
// ottostart_default, basicc, amber_minimal, cosmic_night, dark_matter,
// pastel_dreams, tangarine, sage_garden, amathyist_haze, caffeine,
// claude, claymophism, graphite, my_notebook, solar_dusk, twitter,
// vintage_trust, sunset_horizon, soft_pop
```

### 2. Define the Preset in `config/theme-presets.php`

Add a new entry inside the `'themes'` array. Every preset has this structure:

```php
'my_new_theme' => [
    'name' => 'My New Theme',           // Display name in the UI preset card
    'description' => 'Brief tagline',   // Shown below the name in the card
    'fonts' => [
        'sans'  => 'Inter',             // Primary body/UI font (loaded from Bunny Fonts)
        'serif' => 'Georgia',           // Serif fallback
        'mono'  => 'JetBrains Mono',    // Monospace (code blocks, etc.)
    ],
    'radius' => '0.5rem',               // Default border-radius for UI elements

    'light' => [
        // --- REQUIRED CORE TOKENS ---
        'background'           => 'oklch(...)',
        'foreground'           => 'oklch(...)',
        'primary'              => 'oklch(...)',
        'primary-foreground'   => 'oklch(...)',
        'secondary'            => 'oklch(...)',
        'secondary-foreground' => 'oklch(... )',
        'muted'                => 'oklch(...)',
        'muted-foreground'     => 'oklch(...)',
        'accent'               => 'oklch(...)',
        'accent-foreground'    => 'oklch(...)',
        'destructive'          => 'oklch(...)',
        'destructive-foreground' => 'oklch(...)',
        'border'               => 'oklch(...)',
        'input'                => 'oklch(...)',
        'ring'                 => 'oklch(...)',

        // --- OPTIONAL (auto-fallback in ThemeStyles.tsx) ---
        'card'                 => 'oklch(...)',
        'card-foreground'      => 'oklch(...)',
        'popover'              => 'oklch(...)',
        'popover-foreground'   => 'oklch(...)',
        'sidebar'              => 'oklch(...)',
        'sidebar-foreground'   => 'oklch(...)',
        'sidebar-primary'      => 'oklch(...)',
        'sidebar-primary-foreground' => 'oklch(...)',
        'sidebar-accent'       => 'oklch(...)',
        'sidebar-accent-foreground'  => 'oklch(...)',
        'sidebar-border'       => 'oklch(...)',
        'sidebar-ring'         => 'oklch(...)',
    ],

    'dark' => [
        // Same token keys as light, with dark-appropriate values
        // At minimum provide: background, foreground, primary, accent, muted, border
        // ThemeStyles.tsx generates fallbacks for anything missing
    ],
],
```

> [!TIP]
> **Minimal dark mode**: If you only provide `background`, `foreground`, `primary`, `accent`, `muted`, and `border` for the dark array, `ThemeStyles.tsx` will auto-generate sensible fallbacks for `card`, `popover`, `secondary-foreground`, `muted-foreground`, `accent-foreground`, `destructive-foreground`, and `input`. See the `generateFallbacks()` function.

### 3. Color Format — OKLCH

All colors **must** use the `oklch(L C H)` format:

| Parameter | Range | Meaning |
|-----------|-------|---------|
| **L** (Lightness) | `0.0` – `1.0` | `0` = black, `1` = white |
| **C** (Chroma) | `0.0` – `~0.4` | `0` = gray/neutral, higher = more saturated |
| **H** (Hue) | `0` – `360` | Color wheel angle (0=red, 120=green, 240=blue) |

```
oklch(0.6171 0.1375 39.0427)   ← warm orange, medium lightness
oklch(0.95 0 0)                 ← near-white neutral (no chroma/hue)
oklch(0.15 0 0)                 ← near-black neutral
```

> [!CAUTION]
> Do NOT use hex (`#ff6b35`), RGB, or HSL in the config. The settings UI converts OKLCH → Hex for the color pickers, and custom user overrides may be stored as hex, but **preset definitions must always be OKLCH**.

### 4. Contrast Best Practices

Maintain WCAG AA contrast (minimum 4.5:1 for normal text, 3:1 for large text):

| Pair | Rule |
|------|------|
| `foreground` on `background` | ≥ 4.5:1 — Primary readability |
| `primary-foreground` on `primary` | ≥ 4.5:1 — Buttons, badges |
| `muted-foreground` on `background` | ≥ 3:1 — Secondary text |
| `destructive-foreground` on `destructive` | ≥ 4.5:1 — Error states |
| `accent-foreground` on `accent` | ≥ 3:1 — Highlighted areas |

**Quick OKLCH contrast heuristic**: The lightness (`L`) difference between a foreground and its background should be **at least 0.40** for AA text contrast.

```
✅ foreground L=0.25 on background L=0.98  → diff = 0.73 (excellent)
✅ primary-foreground L=1.00 on primary L=0.55  → diff = 0.45 (good)
❌ muted-foreground L=0.60 on background L=0.70  → diff = 0.10 (FAIL)
```

**Light mode tips:**
- Background lightness: `0.93` – `1.0`
- Foreground lightness: `0.15` – `0.38`
- Primary lightness: `0.43` – `0.72`
- Muted-foreground lightness: `0.40` – `0.55`

**Dark mode tips:**
- Background lightness: `0.14` – `0.28`
- Foreground lightness: `0.80` – `0.97`
- Primary lightness: `0.55` – `0.93` (brighter than light mode's primary)
- Muted-foreground lightness: `0.65` – `0.75`

### 5. Font Selection

Fonts are loaded via **Bunny Fonts** (privacy-friendly Google Fonts mirror). The system strips system fonts (`serif`, `sans-serif`, `monospace`, `system-ui`, `Georgia`, `Arial`, `Times New Roman`) from the Bunny Fonts request.

- Use fonts available on [Bunny Fonts](https://fonts.bunny.net/).
- System fonts like `system-ui` or `Georgia` won't trigger a network request (good for performance).
- Font name must match exactly (case-sensitive): `'Inter'`, `'Plus Jakarta Sans'`, `'DM Sans'`.

### 6. Radius

Common values:

| Value | Visual |
|-------|--------|
| `0` | Sharp corners |
| `0.25rem` – `0.375rem` | Subtle rounding |
| `0.5rem` – `0.75rem` | Moderate (default-like) |
| `1rem` – `1.5rem` | Bubbly / soft /  claymorphism |
| `9999px` | Pill-shaped (full round) |

## Complete Example

Here is a production-ready theme to use as a template:

```php
'ocean_breeze' => [
    'name' => 'Ocean Breeze',
    'description' => 'Calming teal tones with coastal energy',
    'fonts' => ['sans' => 'Inter', 'serif' => 'Lora', 'mono' => 'JetBrains Mono'],
    'radius' => '0.5rem',
    'light' => [
        'background'             => 'oklch(0.9850 0.0050 200)',
        'foreground'             => 'oklch(0.2500 0.0200 220)',
        'card'                   => 'oklch(0.9850 0.0050 200)',
        'card-foreground'        => 'oklch(0.2500 0.0200 220)',
        'popover'                => 'oklch(0.9850 0.0050 200)',
        'popover-foreground'     => 'oklch(0.2500 0.0200 220)',
        'primary'                => 'oklch(0.5500 0.1200 195)',
        'primary-foreground'     => 'oklch(1.0000 0 0)',
        'secondary'              => 'oklch(0.9200 0.0300 195)',
        'secondary-foreground'   => 'oklch(0.2500 0 0)',
        'accent'                 => 'oklch(0.9100 0.0400 180)',
        'accent-foreground'      => 'oklch(0.2500 0 0)',
        'muted'                  => 'oklch(0.9500 0.0100 200)',
        'muted-foreground'       => 'oklch(0.4500 0.0200 220)',
        'destructive'            => 'oklch(0.6368 0.2078 25.3313)',
        'destructive-foreground' => 'oklch(1.0000 0 0)',
        'border'                 => 'oklch(0.9000 0.0100 200)',
        'input'                  => 'oklch(0.9000 0.0100 200)',
        'ring'                   => 'oklch(0.5500 0.1200 195)',
    ],
    'dark' => [
        'background'             => 'oklch(0.1800 0.0200 210)',
        'foreground'             => 'oklch(0.9200 0.0100 200)',
        'primary'                => 'oklch(0.6500 0.1100 195)',
        'primary-foreground'     => 'oklch(0.1500 0 0)',
        'accent'                 => 'oklch(0.3500 0.0600 195)',
        'accent-foreground'      => 'oklch(0.9500 0 0)',
        'muted'                  => 'oklch(0.2500 0.0150 210)',
        'muted-foreground'       => 'oklch(0.7000 0 0)',
        'destructive'            => 'oklch(0.6368 0.2078 25.3313)',
        'destructive-foreground' => 'oklch(1.0000 0 0)',
        'border'                 => 'oklch(0.3200 0.0200 210)',
        'input'                  => 'oklch(0.3200 0.0200 210)',
        'ring'                   => 'oklch(0.6500 0.1100 195)',
    ],
],
```

## How It All Connects (No Other Files to Edit)

1. **Server boot**: Laravel loads `config('theme-presets')` and shares it with Inertia as `themePresets`.
2. **Settings UI**: `settings/Index.tsx` reads `themePresets.themes`, renders a card per theme with color swatches, and saves the selected key to `theme_preset` in the DB.
3. **Frontend render**: `ThemeStyles.tsx` reads the active `theme.preset` key from Inertia shared data, looks up the preset colors, generates CSS variables with fallbacks, and injects a `<style>` tag into `<Head>`.
4. **Custom overrides**: If the user edits individual colors in the branding tab (e.g., `brand_primary`), those values override the preset's colors in `ThemeStyles.tsx`.

## Verification Checklist

- [ ] New key is unique and `snake_case` in `config/theme-presets.php`
- [ ] Both `light` and `dark` arrays are present
- [ ] All color values use `oklch(L C H)` format
- [ ] Foreground/background lightness difference ≥ 0.40 in both modes
- [ ] `primary-foreground` on `primary` has sufficient contrast
- [ ] `muted-foreground` on `background` is readable (L diff ≥ 0.35)
- [ ] Theme appears in the Settings > Theme & Branding preset grid
- [ ] Selecting the theme instantly previews colors in the admin
- [ ] Font names match Bunny Fonts catalog exactly
- [ ] Light and dark modes both render correctly
- [ ] Saving persists the preset and reloading shows it active

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Theme doesn't appear in the preset grid | Clear config cache: `php artisan config:clear` |
| Colors look wrong after selecting | Check for a typo in the OKLCH values; verify all three params are present |
| Font doesn't load | Verify the font name spelling matches Bunny Fonts exactly including casing |
| Dark mode looks identical to light | You likely copied light values; dark background L should be `0.14`–`0.28` |
| User override clobbers the preset | Custom overrides only apply if non-empty; selecting a preset auto-clears overrides |
