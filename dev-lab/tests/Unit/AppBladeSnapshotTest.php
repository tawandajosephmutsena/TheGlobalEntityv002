<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

/**
 * Snapshot assertions for resources/views/app.blade.php
 *
 * Requirements: 12.3, 12.4, 12.5
 *
 * Verifies that the consolidated font-loading strategy is in place:
 *   - Exactly one <link rel="stylesheet"> pointing to fonts.googleapis.com
 *   - That URL contains display=swap
 *   - Exactly one <link rel="preload" as="font"> tag (WOFF2 preload)
 */
class AppBladeSnapshotTest extends TestCase
{
    private string $blade;

    protected function setUp(): void
    {
        parent::setUp();

        $path = __DIR__ . '/../../../resources/views/app.blade.php';

        $this->assertFileExists($path, 'app.blade.php must exist at resources/views/app.blade.php');

        $this->blade = file_get_contents($path);
    }

    // -------------------------------------------------------------------------
    // Requirement 12.4 — single consolidated Google Fonts stylesheet request
    // -------------------------------------------------------------------------

    public function test_exactly_one_google_fonts_stylesheet_link(): void
    {
        // Strip <noscript> blocks first — the noscript fallback is intentional and
        // should not be counted as a duplicate (Requirement 12.2).
        $bladeWithoutNoscript = preg_replace('/<noscript>.*?<\/noscript>/is', '', $this->blade);

        // Match <link ... rel="stylesheet" ... href="https://fonts.googleapis.com/...">
        // or    <link ... href="https://fonts.googleapis.com/..." ... rel="stylesheet" ...>
        $pattern = '/<link\b[^>]*\brel=["\']stylesheet["\'][^>]*\bhref=["\']https:\/\/fonts\.googleapis\.com[^"\']*["\'][^>]*>/i';
        $altPattern = '/<link\b[^>]*\bhref=["\']https:\/\/fonts\.googleapis\.com[^"\']*["\'][^>]*\brel=["\']stylesheet["\'][^>]*>/i';

        preg_match_all($pattern, $bladeWithoutNoscript, $m1);
        preg_match_all($altPattern, $bladeWithoutNoscript, $m2);

        $allMatches = array_unique(array_merge($m1[0], $m2[0]));

        $this->assertCount(
            1,
            $allMatches,
            'Expected exactly one <link rel="stylesheet"> pointing to fonts.googleapis.com (outside <noscript>), found ' . count($allMatches)
        );
    }

    // -------------------------------------------------------------------------
    // Requirement 12.3 — display=swap present in the Google Fonts URL
    // -------------------------------------------------------------------------

    public function test_google_fonts_stylesheet_url_contains_display_swap(): void
    {
        // Extract all href values pointing to fonts.googleapis.com
        $pattern = '/href=["\'](https:\/\/fonts\.googleapis\.com[^"\']*)["\'][^>]*\brel=["\']stylesheet["\']/i';
        $altPattern = '/\brel=["\']stylesheet["\'][^>]*href=["\'](https:\/\/fonts\.googleapis\.com[^"\']*)["\'][^>]*/i';

        preg_match_all($pattern, $this->blade, $m1);
        preg_match_all($altPattern, $this->blade, $m2);

        $urls = array_unique(array_merge($m1[1], $m2[1]));

        $this->assertNotEmpty($urls, 'No Google Fonts stylesheet href found');

        foreach ($urls as $url) {
            $this->assertStringContainsString(
                'display=swap',
                $url,
                "Google Fonts stylesheet URL must contain 'display=swap'. URL: {$url}"
            );
        }
    }

    // -------------------------------------------------------------------------
    // Requirement 12.5 — exactly one <link rel="preload" as="font"> for WOFF2
    // -------------------------------------------------------------------------

    public function test_exactly_one_font_preload_link(): void
    {
        // Match <link ... rel="preload" ... as="font" ...> in any attribute order
        $pattern = '/<link\b[^>]*\brel=["\']preload["\'][^>]*\bas=["\']font["\'][^>]*>/i';
        $altPattern = '/<link\b[^>]*\bas=["\']font["\'][^>]*\brel=["\']preload["\'][^>]*>/i';

        preg_match_all($pattern, $this->blade, $m1);
        preg_match_all($altPattern, $this->blade, $m2);

        $allMatches = array_unique(array_merge($m1[0], $m2[0]));

        $this->assertCount(
            1,
            $allMatches,
            'Expected exactly one <link rel="preload" as="font"> tag, found ' . count($allMatches)
        );
    }

    public function test_font_preload_link_is_woff2(): void
    {
        $pattern = '/<link\b[^>]*\brel=["\']preload["\'][^>]*\bas=["\']font["\'][^>]*>/i';
        $altPattern = '/<link\b[^>]*\bas=["\']font["\'][^>]*\brel=["\']preload["\'][^>]*>/i';

        preg_match_all($pattern, $this->blade, $m1);
        preg_match_all($altPattern, $this->blade, $m2);

        $allMatches = array_unique(array_merge($m1[0], $m2[0]));

        $this->assertNotEmpty($allMatches, 'No font preload link found');

        foreach ($allMatches as $tag) {
            $this->assertMatchesRegularExpression(
                '/type=["\']font\/woff2["\']/i',
                $tag,
                "Font preload link must specify type=\"font/woff2\". Tag: {$tag}"
            );
        }
    }

    public function test_font_preload_link_has_crossorigin(): void
    {
        $pattern = '/<link\b[^>]*\brel=["\']preload["\'][^>]*\bas=["\']font["\'][^>]*>/i';
        $altPattern = '/<link\b[^>]*\bas=["\']font["\'][^>]*\brel=["\']preload["\'][^>]*>/i';

        preg_match_all($pattern, $this->blade, $m1);
        preg_match_all($altPattern, $this->blade, $m2);

        $allMatches = array_unique(array_merge($m1[0], $m2[0]));

        $this->assertNotEmpty($allMatches, 'No font preload link found');

        foreach ($allMatches as $tag) {
            $this->assertMatchesRegularExpression(
                '/\bcrossorigin\b/i',
                $tag,
                "Font preload link must include the crossorigin attribute. Tag: {$tag}"
            );
        }
    }

    // -------------------------------------------------------------------------
    // Requirement 12.2 — noscript fallback uses the same consolidated URL
    // -------------------------------------------------------------------------

    public function test_noscript_fallback_contains_display_swap(): void
    {
        // Extract the <noscript> block
        preg_match('/<noscript>(.*?)<\/noscript>/is', $this->blade, $noscriptMatch);

        $this->assertNotEmpty($noscriptMatch, '<noscript> block must be present for font loading fallback');

        $noscript = $noscriptMatch[1];

        $this->assertStringContainsString(
            'fonts.googleapis.com',
            $noscript,
            '<noscript> fallback must contain a Google Fonts link'
        );

        $this->assertStringContainsString(
            'display=swap',
            $noscript,
            '<noscript> fallback Google Fonts URL must contain display=swap'
        );
    }
}
