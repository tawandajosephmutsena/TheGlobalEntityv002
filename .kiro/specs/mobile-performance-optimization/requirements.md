# Requirements Document

## Introduction

This feature optimizes the Laravel + Inertia.js + React + TypeScript SPA for high performance and mobile friendliness. The application currently loads heavy animation libraries eagerly, renders expensive CSS effects on all pages, and has several mobile layout issues including overflowing text, fixed elements overlapping content, and touch-unfriendly interactions. The goal is to improve Core Web Vitals (LCP, FCP, TTI, CLS) and deliver a polished, accessible mobile experience without sacrificing the desktop visual identity.

## Glossary

- **App**: The full-stack SPA built with Laravel, Inertia.js, React 19, and TypeScript.
- **AnimationSystem**: The collection of GSAP, ScrollTrigger, Lenis, and Framer Motion integrations used for visual effects.
- **BundleOptimizer**: The Vite build configuration responsible for code splitting and chunk management.
- **GlobalWatercolorBackground**: The fixed-position component rendering three large blurred gradient blobs on every page.
- **FloatingSocials**: The fixed right-side social icon bar rendered via a React portal on every page.
- **Navigation**: The top navigation bar including the fullscreen mobile menu overlay.
- **HeroSection**: The above-the-fold landing section with marquee text, parallax images, and animated title.
- **ServicesSection**: The section listing services as interactive rows with hover translate animations.
- **FeaturedProjects**: The section with a sticky sidebar and vertically stacked project cards.
- **StatsSection**: The bento-grid section displaying key statistics.
- **AnimatedSection**: The reusable wrapper component that applies GSAP entrance animations to its children.
- **PageTransition**: The Framer Motion AnimatePresence wrapper applied to every page on navigation.
- **PerformanceObserver**: The browser API used to track Core Web Vitals metrics.
- **ReducedMotion**: The `prefers-reduced-motion` media query preference signalling the user wants minimal animation.
- **TouchDevice**: A device where the primary pointer is coarse (i.e., `pointer: coarse` media query matches).
- **LCP**: Largest Contentful Paint — the time until the largest visible element is rendered.
- **CLS**: Cumulative Layout Shift — the sum of unexpected layout shift scores during page load.
- **TTI**: Time to Interactive — the time until the page is reliably interactive.
- **FCP**: First Contentful Paint — the time until the first content is painted.

---

## Requirements

### Requirement 1: Lazy-Load Heavy Animation Libraries

**User Story:** As a site visitor, I want the page to load quickly, so that I am not waiting for JavaScript I may never use before I can interact with the page.

#### Acceptance Criteria

1. THE BundleOptimizer SHALL exclude `three`, `@react-three/fiber`, and `@react-three/drei` from the Vite `optimizeDeps.include` list so they are not pre-bundled into the main entry chunk.
2. WHEN a page component that uses `Globe3DBlock` is rendered, THE App SHALL load the Three.js bundle via dynamic `import()` rather than at application boot.
3. THE BundleOptimizer SHALL place `three`, `@react-three/fiber`, and `@react-three/drei` into a dedicated `three-vendor` chunk that is only fetched on demand.
4. WHEN the application boots on a TouchDevice, THE AnimationSystem SHALL defer GSAP ScrollTrigger initialization until after the first user scroll event rather than registering it synchronously in `app.tsx`.
5. THE BundleOptimizer SHALL keep the initial JS payload delivered to the browser below 400 kB (gzipped) for the critical path.

---

### Requirement 2: Eliminate Duplicated Performance Monitoring

**User Story:** As a developer, I want a single, consolidated performance monitoring setup, so that redundant PerformanceObserver instances do not consume memory and CPU on every page load.

#### Acceptance Criteria

1. THE App SHALL initialize LCP and CLS PerformanceObserver instances in exactly one location (either `app.blade.php` or `app.tsx`, not both).
2. WHEN the App initializes, THE App SHALL register at most one LCP observer and at most one CLS observer across the entire application lifecycle.
3. THE App SHALL remove the inline `<script>` PerformanceObserver block from `MainLayout.tsx` so that observer setup is not duplicated on every Inertia page navigation.
4. IF a PerformanceObserver type is unsupported by the browser, THEN THE App SHALL catch the error silently without logging to the console in production.

---

### Requirement 3: Reduce GlobalWatercolorBackground Paint Cost on Mobile

**User Story:** As a mobile visitor, I want the page to scroll and animate smoothly, so that the experience does not feel sluggish or drain my battery.

#### Acceptance Criteria

1. WHILE the viewport width is less than 768 px, THE GlobalWatercolorBackground SHALL render blobs with a `blur()` value no greater than 60 px.
2. WHILE the viewport width is 768 px or greater, THE GlobalWatercolorBackground SHALL continue to use the configured blur value (default 140 px).
3. THE GlobalWatercolorBackground SHALL apply `will-change: auto` (not `will-change: transform`) to blob elements so the browser does not promote them to unnecessary compositor layers.
4. WHEN ReducedMotion is active, THE GlobalWatercolorBackground SHALL render static blobs with no CSS animation (`animate-gradient-pulse` removed).
5. THE GlobalWatercolorBackground SHALL set `contain: paint` on its root element to prevent blob overflow from triggering repaints outside the component boundary.

---

### Requirement 4: Disable Magnetic Nav Effects on Touch Devices

**User Story:** As a mobile visitor, I want the navigation to respond instantly to taps, so that I do not experience jank from mouse-tracking JavaScript running on a touch screen.

#### Acceptance Criteria

1. WHEN the Navigation component mounts on a TouchDevice, THE Navigation SHALL NOT attach `mousemove` event listeners via `useMagneticEffect` to any NavLink or the logo element.
2. WHEN the Navigation component mounts on a desktop device with hover capability, THE Navigation SHALL attach magnetic effect listeners as currently implemented.
3. THE Navigation SHALL determine TouchDevice status using `window.matchMedia('(hover: none)')` evaluated once at mount, not on every render.
4. WHEN the mobile menu is open, THE Navigation SHALL NOT render animated gradient blob elements inside the overlay on devices where `prefers-reduced-motion` is active.

---

### Requirement 5: Fix FloatingSocials Overlap on Small Screens

**User Story:** As a mobile visitor, I want the floating social icons to not cover page content, so that I can read and interact with the page without obstruction.

#### Acceptance Criteria

1. WHILE the viewport width is less than 640 px, THE FloatingSocials SHALL be hidden (not rendered or set to `display: none`) so it does not overlap page content.
2. WHILE the viewport width is 640 px or greater, THE FloatingSocials SHALL remain visible on the right edge as currently designed.
3. THE FloatingSocials SHALL use `pointer-events: none` on its container and `pointer-events: auto` only on individual anchor elements, so hidden icons cannot intercept touch events.
4. WHEN FloatingSocials mounts, THE FloatingSocials SHALL NOT run Framer Motion `AnimatePresence` entrance animations on TouchDevices to avoid unnecessary JS execution.

---

### Requirement 6: Fix AnimatedSection Accessibility Bug

**User Story:** As a screen reader user, I want animated content to be accessible immediately, so that I am not blocked from reading content while animations play.

#### Acceptance Criteria

1. THE AnimatedSection SHALL NOT set `aria-hidden="true"` on its container element at any point during the animation lifecycle.
2. WHEN an animation completes, THE AnimatedSection SHALL ensure the container element has no `aria-hidden` attribute.
3. WHEN ReducedMotion is active, THE AnimatedSection SHALL render children with full opacity and no transform applied, without any GSAP animation being scheduled.
4. THE AnimatedSection SHALL NOT apply both `useIntersectionAnimation` and `useTextReveal` simultaneously when `textReveal` is `false` (the default), to avoid scheduling redundant GSAP timelines.
5. THE AnimatedSection SHALL apply `will-change: auto` after an animation completes to release compositor resources.

---

### Requirement 7: Optimize HeroSection for Mobile Viewports

**User Story:** As a visitor on a small phone, I want the hero title and layout to fit within the screen without overflow or clipping, so that I can read the full headline.

#### Acceptance Criteria

1. THE HeroSection title SHALL use a fluid type scale that does not exceed the viewport width on screens narrower than 375 px, replacing the fixed `text-6xl sm:text-8xl md:text-9xl` classes with a `clamp()`-based value.
2. WHILE the viewport width is less than 768 px, THE HeroSection SHALL NOT initialize `useHeroParallax` scroll or mouse listeners.
3. WHILE the viewport width is less than 768 px, THE HeroSection marquee animation SHALL run at a duration of at least 60 seconds per cycle to reduce CPU usage.
4. WHILE the viewport width is less than 768 px, THE HeroSection SHALL hide the three floating image cards (already `hidden md:block`) and SHALL NOT attach their parallax refs to GSAP.
5. THE HeroSection gradient background orbs SHALL use `blur()` values no greater than 60 px on mobile viewports (less than 768 px).

---

### Requirement 8: Fix ServicesSection Touch Interaction

**User Story:** As a mobile visitor browsing services, I want the service rows to respond cleanly to taps without layout jank, so that the interaction feels intentional and smooth.

#### Acceptance Criteria

1. WHILE the viewport width is less than 768 px, THE ServicesSection service row links SHALL NOT apply `group-hover:translate-x-4` transform on the title element, to prevent unintended layout shift on touch tap.
2. THE ServicesSection service row links SHALL include `touch-action: manipulation` to eliminate the 300 ms tap delay on mobile browsers.
3. WHILE the viewport width is less than 768 px, THE ServicesSection SHALL NOT render the sliding arrow overlay panel (`translate-x-full group-hover:translate-x-0`) to reduce paint complexity.
4. THE ServicesSection section container SHALL use `overflow-hidden` only on the individual row, not on the outer section, to prevent content clipping on mobile.

---

### Requirement 9: Fix FeaturedProjects Mobile Spacing

**User Story:** As a mobile visitor, I want the projects section to have reasonable spacing between items, so that I do not have to scroll excessively through empty space.

#### Acceptance Criteria

1. WHILE the viewport width is less than 1024 px, THE FeaturedProjects project list SHALL use a gap of no more than `gap-12` (3 rem) between project cards, replacing the `gap-24 lg:gap-48` values.
2. WHILE the viewport width is less than 1024 px, THE FeaturedProjects sidebar SHALL NOT be sticky and SHALL render above the project list as a standard block element.
3. THE FeaturedProjects section SHALL reduce its horizontal padding to `p-6` on mobile viewports (less than 1024 px), replacing `p-10 lg:p-24` on the sidebar and `p-6 lg:p-20 lg:py-40` on the main column.
4. THE FeaturedProjects project image containers SHALL maintain their `aspect-square` ratio on all viewport sizes without causing horizontal overflow.

---

### Requirement 10: Fix StatsSection Mobile Padding

**User Story:** As a mobile visitor, I want the stats section to use appropriate vertical spacing, so that the page does not feel padded with excessive empty space on small screens.

#### Acceptance Criteria

1. WHILE the viewport width is less than 768 px, THE StatsSection SHALL use a vertical padding of `py-16` (4 rem), replacing the current `py-32` (8 rem).
2. THE StatsSection bento grid SHALL stack to a single column on viewports narrower than 768 px, with each card occupying full width.
3. WHILE the viewport width is less than 768 px, THE StatsSection large stat card SHALL use a minimum height of `min-h-[200px]` instead of `min-h-[400px]` to avoid excessive blank space.
4. THE StatsSection stat value text SHALL scale down proportionally on mobile using `text-6xl md:text-9xl` for the large card and `text-4xl md:text-8xl` for the accent card.

---

### Requirement 11: Fix MainLayout Overflow Clipping

**User Story:** As a mobile visitor, I want all page content to be fully visible and scrollable, so that no content is accidentally hidden by layout overflow rules.

#### Acceptance Criteria

1. THE MainLayout root `div` SHALL replace `overflow-hidden` with `overflow-x-hidden` so that vertical content is never clipped on mobile.
2. THE MainLayout root `div` SHALL retain `overflow-x-hidden` to prevent horizontal scroll caused by animations that translate elements off-screen.
3. WHEN a page uses sticky-positioned elements (such as the FeaturedProjects sidebar), THE MainLayout SHALL NOT apply any CSS property that creates a new stacking context in a way that breaks `position: sticky` on child elements.

---

### Requirement 12: Consolidate and Optimize Font Loading

**User Story:** As a visitor on a slow mobile connection, I want fonts to load without blocking rendering, so that text is readable as quickly as possible.

#### Acceptance Criteria

1. THE App SHALL load no more than two Google Fonts families for the public-facing frontend (reducing from the current four: Material Symbols Outlined, Playfair Display, Epilogue, Plus Jakarta Sans).
2. WHEN a Google Fonts stylesheet is loaded, THE App SHALL use the `media="print" onload="this.media='all'"` non-blocking pattern already in place, and SHALL include a `<noscript>` fallback.
3. THE App SHALL add `&display=swap` to every Google Fonts URL to ensure `font-display: swap` behavior.
4. THE App SHALL consolidate the three separate Google Fonts `<link>` tags into a single combined URL request where the API supports it, to reduce the number of DNS lookups and HTTP requests.
5. THE App SHALL preload only the WOFF2 file for the single most critical font (the primary body font) using `<link rel="preload" as="font">` in the `<head>`.

---

### Requirement 13: Add Touch-Action Optimization to Interactive Elements

**User Story:** As a mobile visitor, I want buttons and links to respond immediately to taps, so that the interface feels as fast as a native app.

#### Acceptance Criteria

1. THE App SHALL apply `touch-action: manipulation` to all `<button>` and `<a>` elements globally via the base CSS layer, eliminating the default 300 ms tap delay.
2. WHEN an interactive element is intended for panning (such as a map or carousel), THE App SHALL explicitly set `touch-action: pan-x`, `touch-action: pan-y`, or `touch-action: none` on that element to override the global rule.
3. THE Navigation mobile menu links SHALL have a minimum tap target size of 44 × 44 px as measured by the element's bounding box.
4. THE FloatingSocials anchor elements SHALL have a minimum tap target size of 44 × 44 px on mobile viewports.

---

### Requirement 14: Reduce PageTransition Overhead

**User Story:** As a visitor navigating between pages, I want transitions to be lightweight, so that navigation feels instant rather than sluggish.

#### Acceptance Criteria

1. WHILE ReducedMotion is active, THE PageTransition SHALL render children directly without wrapping them in a Framer Motion `motion.div` or `AnimatePresence`, eliminating all JS animation overhead.
2. WHILE the viewport width is less than 768 px, THE PageTransition SHALL use a transition duration of no more than 150 ms, replacing the current 400 ms duration.
3. THE ScrollProgressIndicator SHALL use a CSS `transform: scaleX()` driven by a Framer Motion spring, and SHALL NOT cause layout reflow on scroll.
4. THE PageLoadingIndicator SHALL be rendered only when `isLoading` is `true`; WHEN `isLoading` becomes `false`, THE PageLoadingIndicator SHALL be removed from the DOM within 300 ms.
