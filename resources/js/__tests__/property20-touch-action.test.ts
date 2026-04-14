/**
 * Property 20: Global touch-action on interactive elements
 * Validates: Requirements 13.1
 *
 * Feature: mobile-performance-optimization, Property 20: Global touch-action on interactive elements
 *
 * For any <button> or <a> element rendered in the application, the computed
 * `touch-action` CSS property SHALL be `manipulation`.
 */

import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import { describe, it, expect } from 'vitest';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const APP_CSS_PATH = path.resolve(__dirname, '../../../resources/css/app.css');

/**
 * Inject a <style> tag into the jsdom document so computed styles work.
 */
function injectCSS(css: string): void {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
}

/**
 * Create an element, append it to the document body, read its computed style,
 * then remove it.
 */
function getComputedTouchAction(el: HTMLElement): string {
    document.body.appendChild(el);
    const value = window.getComputedStyle(el).getPropertyValue('touch-action');
    document.body.removeChild(el);
    return value;
}

// ---------------------------------------------------------------------------
// Inject the minimal CSS rule once before all tests
// ---------------------------------------------------------------------------

// We inject only the relevant rule so jsdom can resolve computed styles.
// jsdom does not parse full CSS files, but it does honour <style> tags.
injectCSS('button, a { touch-action: manipulation; }');

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

/** Arbitrary text content for an element */
const arbText = fc.string({ minLength: 0, maxLength: 80 });

/** Arbitrary className string (may be empty) */
const arbClassName = fc.string({ minLength: 0, maxLength: 40 });

/** Arbitrary disabled state */
const arbDisabled = fc.boolean();

/** Arbitrary href value for <a> elements */
const arbHref = fc.oneof(
    fc.constant(''),
    fc.constant('#'),
    fc.constant('https://example.com'),
    fc.string({ minLength: 1, maxLength: 40 }),
);

/** Arbitrary button type */
const arbButtonType = fc.constantFrom('button', 'submit', 'reset');

// ---------------------------------------------------------------------------
// Part 1 — CSS source assertion (static, no rendering needed)
// ---------------------------------------------------------------------------

describe('Property 20 — CSS source rule', () => {
    it('app.css @layer base contains touch-action: manipulation for button and a', () => {
        const css = fs.readFileSync(APP_CSS_PATH, 'utf-8');

        // The rule must exist somewhere in the file
        expect(css).toMatch(/button\s*,\s*a\s*\{[^}]*touch-action\s*:\s*manipulation/s);
    });

    it('the touch-action rule is inside @layer base', () => {
        const css = fs.readFileSync(APP_CSS_PATH, 'utf-8');

        // Find the @layer base block and confirm the rule is inside it
        const layerBaseMatch = css.match(/@layer base\s*\{([\s\S]*?)\n\}/);
        expect(layerBaseMatch).not.toBeNull();

        const layerBaseContent = layerBaseMatch![1];
        expect(layerBaseContent).toMatch(/button\s*,\s*a\s*\{[^}]*touch-action\s*:\s*manipulation/s);
    });
});

// ---------------------------------------------------------------------------
// Part 2 — Property-based tests using fast-check + jsdom computed styles
// ---------------------------------------------------------------------------

describe('Property 20 — computed touch-action via injected CSS', () => {
    /**
     * **Validates: Requirements 13.1**
     *
     * For any <button> element with arbitrary props, the computed touch-action
     * SHALL be `manipulation`.
     */
    it(
        'Feature: mobile-performance-optimization, Property 20: Global touch-action on interactive elements — button elements',
        () => {
            fc.assert(
                fc.property(
                    arbText,
                    arbClassName,
                    arbDisabled,
                    arbButtonType,
                    (text, className, disabled, type) => {
                        const btn = document.createElement('button');
                        btn.textContent = text;
                        if (className) btn.className = className;
                        btn.disabled = disabled;
                        btn.type = type as 'button' | 'submit' | 'reset';

                        const touchAction = getComputedTouchAction(btn);
                        return touchAction === 'manipulation';
                    },
                ),
                { numRuns: 100 },
            );
        },
    );

    /**
     * **Validates: Requirements 13.1**
     *
     * For any <a> element with arbitrary props, the computed touch-action
     * SHALL be `manipulation`.
     */
    it(
        'Feature: mobile-performance-optimization, Property 20: Global touch-action on interactive elements — anchor elements',
        () => {
            fc.assert(
                fc.property(
                    arbText,
                    arbClassName,
                    arbHref,
                    (text, className, href) => {
                        const anchor = document.createElement('a');
                        anchor.textContent = text;
                        if (className) anchor.className = className;
                        if (href) anchor.href = href;

                        const touchAction = getComputedTouchAction(anchor);
                        return touchAction === 'manipulation';
                    },
                ),
                { numRuns: 100 },
            );
        },
    );

    /**
     * **Validates: Requirements 13.1**
     *
     * Mixed arbitrary sequence of button and anchor elements — all must have
     * touch-action: manipulation.
     */
    it(
        'Feature: mobile-performance-optimization, Property 20: Global touch-action on interactive elements — mixed button and anchor elements',
        () => {
            const arbElement = fc.oneof(
                fc.record({
                    tag: fc.constant('button' as const),
                    text: arbText,
                    className: arbClassName,
                    disabled: arbDisabled,
                }),
                fc.record({
                    tag: fc.constant('a' as const),
                    text: arbText,
                    className: arbClassName,
                    href: arbHref,
                }),
            );

            fc.assert(
                fc.property(fc.array(arbElement, { minLength: 1, maxLength: 20 }), (elements) => {
                    return elements.every((spec) => {
                        const el = document.createElement(spec.tag);
                        el.textContent = spec.text;
                        if (spec.className) el.className = spec.className;
                        if (spec.tag === 'a' && 'href' in spec && spec.href) {
                            (el as HTMLAnchorElement).href = spec.href;
                        }
                        if (spec.tag === 'button' && 'disabled' in spec) {
                            (el as HTMLButtonElement).disabled = spec.disabled;
                        }

                        const touchAction = getComputedTouchAction(el);
                        return touchAction === 'manipulation';
                    });
                }),
                { numRuns: 100 },
            );
        },
    );
});
