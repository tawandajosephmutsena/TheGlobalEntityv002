<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Fetch all settings and theme presets from cache (processed together for performance)
        $cachedData = \Illuminate\Support\Facades\Cache::flexible('site_settings_all', [60 * 60, 60 * 60 * 2], function () {
            $allSettings = \App\Models\Setting::all();

            // Flat format for easy access - respects types and avoids unwrapping actual arrays (like JSON)
            $flatSettings = $allSettings->mapWithKeys(function ($item) {
                $value = $item->value;
                // If the setting is explicitly marked as JSON or it's an array that isn't just a wrapped single value,
                // we should keep it as an array. Simple text settings are often wrapped in [].
                if ($item->type === 'json') {
                    return [$item->key => $value];
                }

                return [$item->key => is_array($value) ? ($value[0] ?? null) : $value];
            })->toArray();

            // Grouped format for ThemeStyles component
            $groupedSettings = $allSettings->groupBy('group_name')->map(function ($items) {
                return $items->map(function ($item) {
                    return [
                        'key' => $item->key,
                        'value' => $item->value,
                    ];
                })->values();
            })->toArray();

            return [
                'flat' => $flatSettings,
                'grouped' => $groupedSettings,
                'themePresets' => config('theme-presets'),
            ];
        });

        $settings = $cachedData['flat'];
        $groupedSettings = $cachedData['grouped'];
        $themePresets = $cachedData['themePresets'];


        return [
            ...parent::share($request),
            'name' => config('app.name'),

            'auth' => Inertia::always(fn () => [
                'user' => $request->user() ? (function ($user) {
                    $user->loadMissing('roles.permissions');

                    return array_merge($user->toArray(), [
                        'roles' => $user->roles->map(fn($r) => ['slug' => $r->slug, 'name' => $r->name]),
                        'permissions' => (function () use ($user) {
                            $structured = [];
                            foreach ($user->permissions() as $p) {
                                $parts = explode('.', $p->slug);
                                if (count($parts) === 2) {
                                    $resource = $parts[0];
                                    $action = $parts[1];
                                    $structured[$resource]["can_{$action}"] = true;
                                }
                            }
                            return $structured;
                        })(),
                        'is_super_admin' => $user->hasRole('super-admin'),
                    ]);
                })($request->user()) : null,
            ]),

            'csrf_token' => $request->session()->token(),
            'sidebarOpen' => !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'site' => Inertia::always([
                'name' => $settings['site_name'] ?? 'Ottomate',
                'tagline' => $settings['site_tagline'] ?? 'High-Performance Website Platform',
                'description' => $settings['site_description'] ?? 'Ottomate: Professional, SEO-ready digital presences for small businesses that prioritize speed, complete ownership, and offline capabilities. Developed by Mhondoro Inc.',
                'url' => config('app.url'),
                'logo' => ($settings['site_logo'] ?? null)
                    ? (str_starts_with($settings['site_logo'], 'http') || str_starts_with($settings['site_logo'], '/')
                        ? $settings['site_logo']
                        : asset('storage/' . $settings['site_logo']))
                    : asset('logo.svg'),
                'social' => [
                    'twitter' => $settings['twitter_url'] ?? 'https://twitter.com/ottomate',
                    'linkedin' => $settings['linkedin_url'] ?? 'https://linkedin.com/company/mhondoro-inc',
                    'github' => $settings['github_url'] ?? 'https://github.com/mhondoro',
                    'instagram' => $settings['instagram_url'] ?? 'https://instagram.com/ottomate',
                    'facebook' => $settings['facebook_url'] ?? 'https://facebook.com/ottomate',
                    'whatsapp' => $settings['whatsapp_url'] ?? null,
                ],
                'contact' => [
                    'email' => $settings['contact_email'] ?? 'hello@otto-mate.space',
                    'phone' => $settings['contact_phone'] ?? '+263 77 123 4567',
                    'address' => $settings['contact_address'] ?? 'Harare, Zimbabwe',
                    'hours' => $settings['contact_hours'] ?? "Mon - Fri: 9:00 AM - 6:00 PM\nWeekend: By Appointment",
                    'hero_title' => $settings['contact_hero_title'] ?? null,
                    'hero_subtitle' => $settings['contact_hero_subtitle'] ?? null,
                    'hero_description' => $settings['contact_hero_description'] ?? null,
                    'form_title' => $settings['contact_form_title'] ?? null,
                    'google_maps_url' => (function ($val) {
                        $v = is_array($val) ? ($val[0] ?? null) : $val;
                        return $v ?: null;
                    })($settings['google_maps_url'] ?? null),
                    'show_map' => (function ($val) {
                        if ($val === null)
                            return true; // Default to showing map
                        $v = is_array($val) ? ($val[0] ?? 'true') : $val;
                        if (is_bool($v))
                            return $v;
                        return in_array(strtolower((string) $v), ['true', '1', 'yes', 'on'], true);
                    })($settings['show_contact_map'] ?? null),
                ],
                'auth_content' => [
                    'editorial_title' => $settings['auth_editorial_title'] ?? 'Charting the',
                    'editorial_subtitle' => $settings['auth_editorial_subtitle'] ?? 'Unseen Path.',
                    'editorial_description' => $settings['auth_editorial_description'] ?? 'Return to your journal. Your adventures across the ethereal landscapes are waiting to be documented.',
                    'login_title' => $settings['auth_login_title'] ?? 'Welcome Back',
                    'login_description' => $settings['auth_login_description'] ?? 'Sign in to continue your expedition',
                    'register_title' => $settings['auth_register_title'] ?? 'Chart Your Course',
                    'register_description' => $settings['auth_register_description'] ?? 'Create an account to begin your journey',
                ],
                'footer' => [
                    'heading_line1' => $settings['footer_heading_line1'] ?? null,
                    'heading_line2' => $settings['footer_heading_line2'] ?? null,
                    'heading_line3' => $settings['footer_heading_line3'] ?? null,
                    'resources_title' => $settings['footer_resources_title'] ?? null,
                    'resources_links' => $settings['footer_resources_links'] ?? null,
                    'nav_title' => $settings['footer_nav_title'] ?? null,
                    'office_title' => $settings['footer_office_title'] ?? null,
                    'back_to_top' => $settings['footer_back_to_top'] ?? null,
                    'copyright_suffix' => $settings['footer_copyright_suffix'] ?? null,
                    'type' => $settings['footer_type'] ?? 'enterprise',
                ],
                'compliance' => [
                    'cookie_consent_enabled' => (function ($val) {
                        if ($val === null) return false;
                        $v = is_array($val) ? ($val[0] ?? 'false') : $val;
                        if (is_bool($v)) return $v;
                        return in_array(strtolower((string) $v), ['true', '1', 'yes', 'on'], true);
                    })($settings['cookie_consent_enabled'] ?? null),
                    'cookie_consent_message' => $settings['cookie_consent_message'] ?? 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.',
                    'cookie_consent_accept_text' => $settings['cookie_consent_accept_text'] ?? 'Accept All',
                    'cookie_consent_reject_text' => $settings['cookie_consent_reject_text'] ?? 'Reject Non-Essential',
                    'cookie_consent_style' => $settings['cookie_consent_style'] ?? 'bottom-bar',
                    'analytics_enabled' => (function ($val) {
                        if ($val === null) return false;
                        $v = is_array($val) ? ($val[0] ?? 'false') : $val;
                        if (is_bool($v)) return $v;
                        return in_array(strtolower((string) $v), ['true', '1', 'yes', 'on'], true);
                    })($settings['analytics_enabled'] ?? null),
                    'google_analytics_id' => $settings['google_analytics_id'] ?? null,
                    'google_tag_id' => $settings['google_tag_id'] ?? null,
                    'google_conversion_id' => $settings['google_conversion_id'] ?? null,
                    'privacy_policy_url' => $settings['privacy_policy_page'] ?? '/privacy',
                    'terms_url' => $settings['terms_page'] ?? '/privacy',
                    'cookie_policy_url' => $settings['cookie_policy_page'] ?? '/privacy',
                ],
                'podcast' => [
                    'archive_title' => $settings['podcast_archive_title'] ?? 'Signal Archive',
                    'archive_subtitle' => $settings['podcast_archive_subtitle'] ?? 'Explore our latest episodes',
                ],

            ]),
            'theme' => Inertia::always([
                'preset' => $settings['theme_preset'] ?? config('theme-presets.default'),
                'default_appearance' => $settings['default_appearance'] ?? 'system',
                'colors' => [
                    'primary' => $settings['brand_primary'] ?? '#1a1a1a',
                    'secondary' => $settings['brand_secondary'] ?? '#666666',
                    'accent' => $settings['brand_accent'] ?? '#ff6b35',
                    'neutral' => $settings['brand_neutral'] ?? '#f5f5f5',
                    'dark' => $settings['brand_dark'] ?? '#0a0a0a',
                    'background' => $settings['brand_background'] ?? '#ffffff',
                    'foreground' => $settings['brand_foreground'] ?? '#0a0a0a',
                    'border' => $settings['brand_border'] ?? '#e5e5e5',
                    'ring' => $settings['brand_ring'] ?? '#3b82f6',
                ],
                'fonts' => [
                    'display' => $settings['font_display'] ?? 'Inter',
                    'body' => $settings['font_body'] ?? 'Inter',
                    'weight' => $settings['font_weight'] ?? '400',
                ],
                'radius' => $settings['border_radius'] ?? '0.5rem',
            ]),
            'ai' => Inertia::always([
                'citationPreference' => config('seo.ai_optimization.citation_preference', 'with-attribution'),
                'contentRating' => config('seo.ai_optimization.content_rating', 'safe'),
                'llmsTxtUrl' => url('/llms.txt'),
            ]),
            'seo' => Inertia::always([
                'site_name' => $settings['site_name'] ?? 'Ottomate',
                'default_description' => $settings['site_description'] ?? 'High-Performance Website Platform',
                'site_url' => config('app.url'),
                'default_og_image' => ($settings['site_logo'] ?? null)
                    ? (str_starts_with($settings['site_logo'], 'http') || str_starts_with($settings['site_logo'], '/') ? asset($settings['site_logo']) : asset('storage/' . $settings['site_logo']))
                    : asset('logo.svg'),
                'twitter_handle' => $settings['twitter_handle'] ?? '@ottomate',
            ]),
            'nonce' => \Illuminate\Support\Facades\Vite::cspNonce(),
            'themePresets' => $themePresets,
            'settings' => $groupedSettings,
            'menus' => Inertia::always(\Illuminate\Support\Facades\Cache::flexible('navigation_menus', [60 * 60, 60 * 60 * 2], function () {

                $mainMenu = \App\Models\NavigationMenu::where('slug', 'main-menu')
                    ->where('is_active', true)
                    ->with([
                        'items' => function ($query) {
                            $query->where('is_visible', true)
                                ->orderBy('order')
                                ->with('page:id,title,slug');
                        },
                        'items.children' => function ($query) {
                            $query->where('is_visible', true)
                                ->orderBy('order')
                                ->with('page:id,title,slug');
                        }
                    ])
                    ->first();

                $logoMenu = \App\Models\NavigationMenu::where('slug', 'logo-menu')
                    ->where('is_active', true)
                    ->with([
                        'items' => function ($query) {
                            $query->where('is_visible', true)
                                ->orderBy('order')
                                ->with('page:id,title,slug');
                        }
                    ])
                    ->first();

                $logoMenuItem = $logoMenu ? $logoMenu->items->first() : null;

                return [
                    'main' => $mainMenu ? $mainMenu->items->map(function ($item) {
                        return [
                            'name' => $item->title,
                            'href' => $item->resolved_url,
                            'target' => $item->open_in_new_tab ? '_blank' : '_self',
                            'children' => $item->children->map(function ($child) {
                                return [
                                    'name' => $child->title,
                                    'href' => $child->resolved_url,
                                    'target' => $child->open_in_new_tab ? '_blank' : '_self',
                                ];
                            }),
                        ];
                    }) : [],
                    'logo' => $logoMenuItem ? [
                        'href' => $logoMenuItem->resolved_url,
                        'target' => $logoMenuItem->open_in_new_tab ? '_blank' : '_self',
                    ] : null,
                ];
            })),
            'app_version' => \Illuminate\Support\Facades\Cache::remember('app_version', 60 * 60 * 24, function () {
                if (!function_exists('shell_exec')) {
                    return 'unknown';
                }
                try {
                    $output = @shell_exec('git log -1 --format="%h" 2>/dev/null');
                    return $output ? trim($output) : 'unknown';
                } catch (\Exception $e) {
                    return 'unknown';
                }
            }),
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
            'global_stats' => (new \App\Services\Stats\GlobalStatsService())->getStats(),
        ];
    }
}
