# Implementation Plan: Mobile Performance Optimization

## Overview

Surgical modifications across the build pipeline and UI components to improve Core Web Vitals and mobile UX. Changes are independent and can be shipped incrementally. No new dependencies are introduced.

## Tasks

- [x] 1. Bundle optimization — vite.config.ts and lazy Globe3D
  - [x] 1.1 Remove `three`, `@react-three/fiber`, `@react-three/drei` from `optimizeDeps.include` in `vite.config.ts`
    - These three entries cause Three.js to be pre-bundled into the main entry chunk
    - _Requirements: 1.1_
  - [x] 1.2 Add `three-vendor` branch to `manualChunks` in `vite.config.ts`
    - Insert before the existing `gsap` branch: `if (id.includes('three') || id.includes('@react-three')) return 'three-vendor';`
    - _Requirements: 1.3_
  - [ ] 1.3 Write unit test for `manualChunks` function
    - Verify ID containing `three` returns `'three-vendor'`
    - Verify ID containing `@react-three/fiber` returns `'three-vendor'`
    - Verify ID containing `gsap` still returns `'gsap'` (no regression)
    - _Requirements: 1.1, 1.3_
  - [x] 1.4 Confirm `Globe3DBlock` is already lazy-loaded via `React.lazy` in `registerBlocks.tsx` and `BlockRenderer.tsx`
    - Both files already use `React.lazy(() => import('@/components/Blocks/Globe3DBlock'))` — no code change needed, just verify and document
    - _Requirements: 1.2_

- [x] 2. Consolidate PerformanceObserver — single location
  - [x] 2.1 Remove the `PerformanceObserver` block (LCP + CLS observers) from the inline `<script>` in `app.blade.php`
    - Keep only the dark-mode detection and `performance.mark('app-start')` in that script
    - _Requirements: 2.1, 2.2_
  - [x] 2.2 Remove the `dangerouslySetInnerHTML` `<script>` block containing the duplicate `PerformanceObserver` from `MainLayout.tsx`
    - The entire `<script nonce={nonce} dangerouslySetInnerHTML={{ __html: ... }} />` block at the bottom of the return should be deleted
    - _Requirements: 2.3_
  - [x] 2.3 Verify `app.tsx` already initializes `initPerformanceMonitoring()` as the single source of truth
    - `initPerformanceMonitoring` is already called at module level in `app.tsx` — confirm it covers LCP and CLS, and that `try/catch` silently swallows unsupported observer types
    - _Requirements: 2.1, 2.4_
  - [ ] 2.4 Write snapshot test for `MainLayout` render
    - Assert root `div` className contains `overflow-x-hidden` and does not contain standalone `overflow-hidden`
    - Assert no `dangerouslySetInnerHTML` prop containing `PerformanceObserver` is present
    - _Requirements: 2.3, 11.1_

- [x] 3. Fix MainLayout overflow clipping
  - [x] 3.1 Replace `overflow-hidden` with `overflow-x-hidden` in the root `div` className in `MainLayout.tsx`
    - Current: `'relative overflow-hidden'` → New: `'relative overflow-x-hidden'`
    - This prevents vertical content from being clipped on mobile while still blocking horizontal scroll
    - _Requirements: 11.1, 11.2_

- [x] 4. Consolidate font loading — app.blade.php
  - [x] 4.1 Merge the three separate Google Fonts `<link rel="preload" as="style">` tags into one combined URL
    - Combine Material Symbols Outlined + Playfair Display + Epilogue + Plus Jakarta Sans into a single `fonts.googleapis.com/css2?family=...&family=...&display=swap` URL
    - Keep the `media="print" onload="this.media='all'"` non-blocking pattern
    - _Requirements: 12.1, 12.3, 12.4_
  - [x] 4.2 Merge the three `<link rel="stylesheet">` tags into one combined URL with `&display=swap`
    - Single stylesheet link using the same combined URL
    - Update the `<noscript>` fallback to use the single combined URL
    - _Requirements: 12.2, 12.3, 12.4_
  - [x] 4.3 Add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for the primary body font WOFF2
    - Use the Epilogue or Plus Jakarta Sans WOFF2 URL (whichever is the primary body font per `--font-sans`)
    - _Requirements: 12.5_
  - [x] 4.4 Write snapshot test for `app.blade.php`
    - Assert exactly one `<link rel="stylesheet">` tag pointing to `fonts.googleapis.com`
    - Assert that URL contains `display=swap`
    - Assert exactly one `<link rel="preload" as="font">` tag
    - _Requirements: 12.3, 12.4, 12.5_

- [x] 5. Defer ScrollTrigger on touch devices — app.tsx
  - [x] 5.1 Replace the unconditional `gsap.registerPlugin(ScrollTrigger)` in `app.tsx` with a touch-conditional deferred registration
    - Evaluate `window.matchMedia('(hover: none)').matches` once at boot
    - On touch: `window.addEventListener('scroll', () => gsap.registerPlugin(ScrollTrigger), { once: true })`
    - On non-touch: register synchronously as before
    - _Requirements: 1.4_
  - [ ] 5.2 Write property test for ScrollTrigger deferred registration (Property 1)
    - **Property 1: ScrollTrigger deferred on touch devices**
    - **Validates: Requirements 1.4**
    - Use `fc.boolean()` to mock `matchMedia` result; assert `gsap.registerPlugin` is not called synchronously when touch=true, and is called after scroll event fires

- [x] 6. GlobalWatercolorBackground — mobile blur cap and paint containment
  - [x] 6.1 Add a `isMobile` state to `GlobalWatercolorBackground` using `window.matchMedia('(max-width: 767px)')`, evaluated once at mount and updated on resize
    - _Requirements: 3.1, 3.2_
  - [x] 6.2 Cap the blur values: use `Math.min(blurAmount, 60)` for all three blobs when `isMobile` is true
    - Blob 1: `filter: blur(${isMobile ? Math.min(blurAmount, 60) : blurAmount}px)`
    - Blob 2: `filter: blur(${isMobile ? Math.min(Math.round(blurAmount * 0.85), 60) : Math.round(blurAmount * 0.85)}px)`
    - Blob 3: `filter: blur(${isMobile ? Math.min(Math.round(blurAmount * 0.7), 60) : Math.round(blurAmount * 0.7)}px)`
    - _Requirements: 3.1, 3.2_
  - [x] 6.3 Add `contain: 'paint'` to the root `div` inline style
    - _Requirements: 3.5_
  - [x] 6.4 Add `useReducedMotion` check; conditionally omit `animate-gradient-pulse` class from blob elements when reduced-motion is active
    - Import `useReducedMotion` from `@/hooks/useAccessibility`
    - _Requirements: 3.4_
  - [ ] 6.5 Write property test for blob blur cap (Property 3)
    - **Property 3: Blob blur respects mobile cap**
    - **Validates: Requirements 3.1, 3.2**
    - Generator: `fc.integer({ min: 0, max: 1500 })` for viewport width, `fc.integer({ min: 60, max: 300 })` for configuredBlur
    - Assert computed blur ≤ 60 when width < 768, equals configuredBlur when width ≥ 768

- [x] 7. Navigation — skip magnetic on touch, skip blobs on reduced-motion
  - [x] 7.1 Evaluate `window.matchMedia('(hover: none)').matches` once at mount in `Navigation` and store in a `ref`
    - Add `const isTouchRef = useRef(typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches)` in `Navigation`
    - Pass `isTouch` down to `NavLink` and the logo `useMagneticEffect` call
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 7.2 In `NavLink`, conditionally call `useMagneticEffect` only when `!isTouch`
    - Add `isTouch` prop to `NavLink`; wrap `useMagneticEffect` call: `if (!isTouch) useMagneticEffect(...)`
    - Note: hooks cannot be called conditionally — instead pass `isTouch` into the hook and return early inside it, or use a no-op ref when touch
    - _Requirements: 4.1, 4.2_
  - [x] 7.3 Skip `useMagneticEffect` on the logo element when `isTouchRef.current` is true
    - _Requirements: 4.1_
  - [x] 7.4 Conditionally omit the two animated blob `div` elements inside the mobile menu overlay when `prefers-reduced-motion` is active
    - Import `useReducedMotion` from `@/hooks/useAccessibility`; wrap the blob `div` block with `{!prefersReducedMotion && (...)}` 
    - _Requirements: 4.4_
  - [ ] 7.5 Write property test for magnetic effect conditioned on hover (Property 5)
    - **Property 5: Magnetic effect conditioned on hover capability**
    - **Validates: Requirements 4.1, 4.2, 4.3**
    - Mock `matchMedia` with `fc.boolean()` for hover capability; assert `mousemove` listeners are attached iff hover=true

- [x] 8. FloatingSocials — hide on small screens, plain anchors on touch
  - [x] 8.1 Add a viewport width check: return `null` when viewport is less than 640 px
    - Add `const [isWideEnough, setIsWideEnough] = useState(typeof window !== 'undefined' && window.innerWidth >= 640)` with a resize listener
    - Return `null` when `!isWideEnough`
    - _Requirements: 5.1, 5.2_
  - [x] 8.2 Add `pointer-events: none` to the container `div` and `pointer-events: auto` on each anchor (already partially done — verify and ensure it applies on all viewports)
    - _Requirements: 5.3_
  - [x] 8.3 On touch devices (`hover: none`), render plain `<a>` elements instead of `motion.a` inside `AnimatePresence`, and skip `AnimatePresence` entirely
    - Add `const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches`
    - When `isTouch`: render a plain `<div>` container with plain `<a>` elements, no `AnimatePresence`
    - _Requirements: 5.4_
  - [ ] 8.4 Write property test for FloatingSocials visibility by viewport (Property 6)
    - **Property 6: FloatingSocials visibility by viewport**
    - **Validates: Requirements 5.1, 5.2**
    - Generator: `fc.integer({ min: 200, max: 1920 })` for viewport width
    - Assert component returns null iff width < 640
  - [ ] 8.5 Write property test for FloatingSocials skips Framer Motion on touch (Property 7)
    - **Property 7: FloatingSocials skips Framer Motion on touch**
    - **Validates: Requirements 5.4**
    - Mock `matchMedia` hover:none; assert no `motion.a` or `AnimatePresence` in rendered output

- [x] 9. AnimatedSection — fix aria-hidden bug, guard useTextReveal, reset will-change
  - [x] 9.1 Remove the `container.setAttribute('aria-hidden', ...)` line from the `useEffect` in `AnimatedSection.tsx`
    - Also remove the corresponding `container.removeAttribute('aria-hidden')` from the cleanup
    - _Requirements: 6.1, 6.2_
  - [x] 9.2 Guard the `useTextReveal` call: only invoke when `textReveal === true`
    - Current code calls `useTextReveal` unconditionally — wrap the hook body with an early return when `textReveal` is false, or pass `enabled` flag into the hook
    - Since hooks cannot be conditionally called, add an `enabled` parameter to `useTextReveal` that returns early if `!enabled`
    - _Requirements: 6.4_
  - [x] 9.3 In the `onComplete` callback of `useIntersectionAnimation`, set `container.style.willChange = 'auto'`
    - _Requirements: 6.5_
  - [x] 9.4 Remove `will-change-transform` from the static className on the wrapper `div` (it is now set dynamically and reset on complete)
    - _Requirements: 6.5_
  - [ ] 9.5 Write property test for AnimatedSection never sets aria-hidden (Property 8)
    - **Property 8: AnimatedSection never sets aria-hidden**
    - **Validates: Requirements 6.1, 6.2**
    - Generator: arbitrary animation type and delay; assert `aria-hidden` attribute is never `"true"` at any lifecycle point
  - [ ] 9.6 Write property test for AnimatedSection skips useTextReveal when textReveal=false (Property 10)
    - **Property 10: AnimatedSection skips useTextReveal when textReveal=false**
    - **Validates: Requirements 6.4**
    - Assert no `data-text-reveal` attributes on children and no ScrollTrigger instances created when `textReveal=false`
  - [ ] 9.7 Write property test for will-change reset after animation (Property 11)
    - **Property 11: will-change reset after animation completes**
    - **Validates: Requirements 6.5**
    - Assert `container.style.willChange === 'auto'` after `onComplete` fires

- [ ] 10. Checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 11. HeroSection — fluid type scale, mobile parallax guard, orb blur cap
  - [x] 11.1 Replace `text-6xl sm:text-8xl md:text-9xl` on the `<h1>` with `text-[clamp(2.5rem,10vw,9rem)]`
    - _Requirements: 7.1_
  - [x] 11.2 Verify `useHeroParallax` is already guarded with `!isMobile` for both `mouseParallax` and `scrollParallax` options — confirm refs are not passed on mobile
    - Current code passes all three image refs regardless of `isMobile`; ensure the hook's internal guard (`intensity: 0` when mobile) is sufficient, or skip passing refs entirely on mobile
    - _Requirements: 7.2, 7.4_
  - [x] 11.3 Verify the marquee `duration` is already `window.innerWidth < 768 ? 60 : 40` — confirm this is correct and the value is ≥ 60 on mobile
    - _Requirements: 7.3_
  - [x] 11.4 Cap the three gradient orb `blur-[120px]`, `blur-[100px]`, `blur-[80px]` classes to `blur-[60px]` on mobile using responsive Tailwind classes
    - Replace `blur-[120px]` with `blur-[60px] md:blur-[120px]`
    - Replace `blur-[100px]` with `blur-[60px] md:blur-[100px]`
    - Replace `blur-[80px]` with `blur-[60px] md:blur-[80px]`
    - _Requirements: 7.5_
  - [ ] 11.5 Write property test for hero title clamp no overflow (Property 12)
    - **Property 12: Hero title clamp does not overflow on narrow viewports**
    - **Validates: Requirements 7.1**
    - Generator: `fc.integer({ min: 320, max: 374 })` for viewport width
    - Assert computed font-size from `clamp(2.5rem, 10vw, 9rem)` ≤ viewport width
  - [ ] 11.6 Write property test for hero parallax disabled on mobile (Property 13)
    - **Property 13: Hero parallax disabled on mobile**
    - **Validates: Requirements 7.2, 7.4**
    - Assert no `mousemove` or `scroll` listeners attached when `window.innerWidth < 768`

- [x] 12. ServicesSection — no translate on mobile, touch-action, no arrow overlay on mobile
  - [x] 12.1 Replace `md:group-hover:translate-x-4` with `hover:translate-x-4` on the service title `<h3>` — Tailwind v4's `hover:` variant only fires on hover-capable devices
    - Current: `md:group-hover:translate-x-4` → New: `group-hover:translate-x-4` (Tailwind v4 `hover:` is already pointer-aware; verify this is sufficient, otherwise use `@media (hover: hover)` via arbitrary variant)
    - _Requirements: 8.1_
  - [x] 12.2 Add `style={{ touchAction: 'manipulation' }}` to the `<Link>` row element
    - _Requirements: 8.2_
  - [x] 12.3 Wrap the arrow overlay `div` (`translate-x-full group-hover:translate-x-0`) in `<div className="hidden md:block">` so it is not rendered on mobile
    - _Requirements: 8.3_
  - [x] 12.4 Move `overflow-hidden` from the outer `<section>` to the individual row `<Link>` element
    - _Requirements: 8.4_
  - [ ] 12.5 Write property test for ServicesSection mobile layout (Property 16)
    - **Property 16: ServicesSection mobile layout correctness**
    - **Validates: Requirements 8.1, 8.3**
    - Generator: `fc.integer({ min: 320, max: 767 })` for viewport width
    - Assert arrow overlay `div` is not in the rendered DOM; assert no `translate-x-4` on title on mobile

- [x] 13. FeaturedProjects — mobile spacing and non-sticky sidebar
  - [x] 13.1 Change `flex flex-col gap-24 lg:gap-48` to `flex flex-col gap-12 lg:gap-48` on the `<main>` column
    - _Requirements: 9.1_
  - [x] 13.2 Verify the sidebar `lg:sticky lg:top-0 lg:h-screen` is already `lg:`-prefixed (non-sticky on mobile) — confirm no additional change needed
    - _Requirements: 9.2_
  - [x] 13.3 Change sidebar padding from `p-10 lg:p-24` to `p-6 lg:p-24`
    - _Requirements: 9.3_
  - [x] 13.4 Verify the main column already has `p-6` on mobile (current: `p-6 lg:p-20 lg:py-40`) — no change needed
    - _Requirements: 9.3_
  - [x] 13.5 Verify image containers keep `aspect-square` on all breakpoints and do not cause horizontal overflow (the `overflow-hidden` on the image wrapper already handles this)
    - _Requirements: 9.4_
  - [ ] 13.6 Write property test for FeaturedProjects mobile layout (Property 17)
    - **Property 17: FeaturedProjects mobile layout correctness**
    - **Validates: Requirements 9.1, 9.2, 9.3**
    - Generator: `fc.integer({ min: 320, max: 1023 })` for viewport width
    - Assert gap ≤ 3rem, sidebar not sticky, padding = 1.5rem on mobile

- [x] 14. StatsSection — mobile padding and scaled text
  - [x] 14.1 Change `py-32` to `py-16 md:py-32` on the `<section>` element
    - _Requirements: 10.1_
  - [x] 14.2 Change large card `min-h-[300px] md:min-h-[400px]` to `min-h-[200px] md:min-h-[400px]`
    - _Requirements: 10.3_
  - [x] 14.3 Change large stat value text from `text-7xl md:text-9xl` to `text-6xl md:text-9xl`
    - _Requirements: 10.4_
  - [x] 14.4 Change accent stat value text from `text-6xl md:text-8xl` to `text-4xl md:text-8xl`
    - _Requirements: 10.4_
  - [ ] 14.5 Write property test for StatsSection mobile spacing (Property 19)
    - **Property 19: StatsSection mobile spacing**
    - **Validates: Requirements 10.1, 10.3, 10.4**
    - Generator: `fc.integer({ min: 320, max: 767 })` for viewport width
    - Assert section padding = py-16, large card min-h = 200px, large stat text = text-6xl on mobile

- [x] 15. PageTransition — skip AnimatePresence on reduced-motion, 150ms on mobile
  - [x] 15.1 Add `prefersReducedMotion` and `isMobile` detection to `PageTransition`
    - `const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches`
    - `const isMobile = typeof window !== 'undefined' && window.innerWidth < 768`
    - _Requirements: 14.1, 14.2_
  - [x] 15.2 When `prefersReducedMotion` is true, render `children` directly without `motion.div` or `AnimatePresence`
    - _Requirements: 14.1_
  - [x] 15.3 When `isMobile` is true (and not reduced-motion), use `duration: 0.15` instead of `0.4` in the transition object
    - _Requirements: 14.2_
  - [ ] 15.4 Write property test for PageTransition skips Framer Motion on reduced-motion (Property 22)
    - **Property 22: PageTransition skips Framer Motion on reduced-motion**
    - **Validates: Requirements 14.1**
    - Mock `matchMedia` prefers-reduced-motion; assert no `motion.div` wrapper and no `AnimatePresence` in rendered output
  - [ ] 15.5 Write property test for PageTransition duration on mobile (Property 23)
    - **Property 23: PageTransition duration on mobile**
    - **Validates: Requirements 14.2**
    - Generator: `fc.integer({ min: 320, max: 767 })` for viewport width
    - Assert transition `duration` ≤ 0.15 on mobile viewports

- [x] 16. Global touch-action — app.css
  - [x] 16.1 Add `touch-action: manipulation` to `button, a` in `@layer base` in `resources/css/app.css`
    - _Requirements: 13.1_
  - [x] 16.2 Write property test for global touch-action on interactive elements (Property 20)
    - **Property 20: Global touch-action on interactive elements**
    - **Validates: Requirements 13.1**
    - Generator: arbitrary rendered `<button>` and `<a>` elements
    - Assert computed `touch-action` is `manipulation` for all such elements

- [ ] 17. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Tasks 1–4 are build/infrastructure changes; tasks 5–16 are component changes
- Property tests use **fast-check** (already available in the JS ecosystem)
- Checkpoints at tasks 10 and 17 ensure incremental validation
