# The Design System: Fairy Pirate & Editorial Soul

## 1. Overview & Creative North Star
**Creative North Star: "The Ethereal Cartographer"**

This design system rejects the clinical, rigid constraints of modern SaaS in favor of a "Fairy Pirate" aesthetic—a high-end editorial experience that blends the precision of a professional traveler with the soulful, messy beauty of a watercolor journal. We move beyond "templates" by embracing **Organic Brutalism**: using high-contrast, oversized typography paired with soft, bleeding edges and asymmetrical layouts. 

The goal is to make the user feel they are navigating a living map. We break the grid intentionally, allowing "hand-drawn" elements to overlap clean editorial containers, creating a sense of depth and personal storytelling.

---

## 2. Colors & Surface Philosophy
The palette is a vibrant collision of tropical energy and earthy foundations. We use the Material Design tokens to create a sophisticated, layered environment. The theme is currently set to `dark` mode, creating an immersive, rich canvas.

### The Palette
*   **Primary (#a62476):** Our "Passion Magenta." Used for high-impact CTAs and signature storytelling moments.
*   **Secondary (#904800):** Our "Adventure Orange." Represents warmth and the sun-soaked African landscapes.
*   **Tertiary (#006666):** Our "Tropical Turquoise." Used for calm, trust-based interactions and maritime elements.
*   **Surface (#f6f8ea):** A warm, parchment-like off-white that prevents the "digital coldness" of pure white.

### Style Rules
*   **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Definition must come from background shifts. Use `surface-container-low` to transition from a `surface` background.
*   **Surface Hierarchy & Nesting:** Treat the UI as stacked sheets of fine watercolor paper. An inner card (`surface-container-lowest`) should sit on a section background (`surface-container-low`) to create a natural "lift" without a border.
*   **The "Glass & Gradient" Rule:** Floating navigation or high-end modals must use Glassmorphism. Utilize `surface` colors at 70% opacity with a `backdrop-blur` of 12px-20px. 
*   **Signature Textures:** Apply a subtle linear gradient from `primary` to `primary-container` on major action buttons to mimic the bleeding effect of watercolor ink.

---

## 3. Typography: The Editorial Contrast
We pair the structured **Epilogue** with the approachable **Plus Jakarta Sans** to balance "Professionalism" and "Adventure."

*   **Display (Epilogue):** Oversized and bold. Use `display-lg` (3.5rem) for hero statements. These should often be placed with asymmetrical tracking or overlapping watercolor assets.
*   **Headlines (Epilogue):** Set in `headline-lg` to `sm`. This is the "Professional" voice—clean, authoritative, and modern.
*   **Body (Plus Jakarta Sans):** Optimized for readability. Use `body-lg` for narrative descriptions and `body-md` for functional data.
*   **The "Script" Intervention:** While not in the token set, a custom handwritten script font should be used sparingly for "marginalia"—small notes, directional arrows, or captions that look like they were scribbled in the margins of a map.

---

## 4. Elevation & Depth: Tonal Layering
We do not use shadows to mimic gravity; we use them to mimic **atmosphere**.

*   **The Layering Principle:** Use the spacing scale (`spacing-2`) and background color shifts to separate content. High-priority content "floats" by being the lightest color (`surface-container-lowest`) on a slightly darker base.
*   **Ambient Shadows:** For floating menus, use a "Sea Mist" shadow: `box-shadow: 0 20px 40px rgba(45, 48, 39, 0.06)`. It must be soft, diffused, and slightly tinted by the `on-surface` color.
*   **The "Ghost Border" Fallback:** If a divider is mandatory for accessibility, use the `outline-variant` token at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### Buttons: The "Inked" Action
*   **Primary:** Rounded `DEFAULT` (2rem). Background is a gradient of `primary` to `primary-dim`. No border.
*   **Secondary:** `surface-container-highest` background with `on-surface` text. Feels like a tactile pebble.
*   **Interactive State:** On hover, buttons should scale slightly (1.02x) and increase shadow diffusion, mimicking a "lifting" from the paper.

### Cards: The "Journal" Entry
*   **Styling:** No borders. Use `surface-container-low` with a `lg` (2rem) corner radius.
*   **Content:** Forbid divider lines. Use `spacing-4` vertical gaps to separate the title from the body.
*   **Visuals:** Each card should ideally have a "bleed" element—a watercolor texture or hand-drawn icon that breaks the top-right boundary of the card.

### Inputs: The "Field Note"
*   **Style:** Minimalist. A simple `surface-variant` background with a `sm` (0.5rem) radius.
*   **Focus State:** The background shifts to `surface-container-highest` with a `primary` "Ghost Border" (20% opacity).

### Signature Component: The "Hand-Drawn Map" Progress Bar
*   Instead of a sterile line, use a path that looks like a hand-drawn dashed line (the "pirate’s trail"). The "current position" marker is a small, vibrant `secondary` (Orange) dot.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace Asymmetry:** Offset images and text blocks. Let a watercolor splash sit 20px off-center.
*   **Use Generous White Space:** Use `spacing-16` or `spacing-20` between major sections to let the "watercolor" breathe.
*   **Layer Textures:** Place "hand-drawn map" icons (`on-surface-variant`) behind "modern" typography for a layered, historical feel.

### Don’t:
*   **Don't use 100% Black:** Always use `on-background` (#2d3027) for text to maintain the soulful, organic tone.
*   **Don't use Square Corners:** Nothing in nature is a perfect 90-degree angle. Use a minimum of `DEFAULT` (1rem) radius for all containers.
*   **Don't over-animate:** Motion should feel like "drifting at sea"—slow, eased, and fluid. Avoid "snappy" or "robotic" transitions.