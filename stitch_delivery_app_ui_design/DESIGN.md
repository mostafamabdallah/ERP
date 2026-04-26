# Design System Specification: High-Energy Editorial

## 1. Overview & Creative North Star: "The Neon Nocturne"
This design system moves away from the sterile "SaaS-blue" world into a high-energy, editorial-inspired space. We are not building a dashboard; we are curating a digital experience. 

**The Creative North Star: "The Neon Nocturne"**
The system is built on a foundation of deep, obsidian purples intersected by high-voltage yellow accents. It draws inspiration from premium lifestyle magazines and night-time urban landscapes. We break the "template" look by utilizing **intentional asymmetry**—large display typography should often be offset, and secondary information should breathe through expansive whitespace rather than being boxed in. Elements should feel like they are floating in a liquid space, layered through tonal depth rather than rigid lines.

---

## 2. Color Strategy & The "No-Line" Rule
The palette is dominated by a rich, dark purple (`surface: #1c0324`), punctuated by an electric, high-contrast yellow (`secondary: #fcd401`).

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** Traditional dividers are the enemy of premium design. Boundaries must be defined through:
*   **Background Color Shifts:** Use `surface-container-low` for large section blocks sitting on a `surface` background.
*   **Tonal Transitions:** Transition from `primary` to `primary-container` for CTAs to create a "glow" rather than a flat fill.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the surface-container tiers to define importance:
*   **Base:** `surface` (#1c0324)
*   **Deepest Inset:** `surface-container-lowest` (#000000) for high-contrast content wells.
*   **Raised Layers:** Use `surface-container-high` (#32103d) for interactive cards.
*   **Glassmorphism:** For floating modals or navigation bars, use `surface` at 60% opacity with a `24px` backdrop-blur. This allows the vibrant purples to bleed through, creating a "frosted glass" aesthetic.

---

## 3. Typography: The Bilingual Powerhouse
The typography strategy is a bridge between modern geometric precision and technical clarity.

*   **English Primary:** *Plus Jakarta Sans*. Use its wide apertures and modern curves for a friendly yet bold energy.
*   **Arabic Primary:** *IBM Plex Sans Arabic*. This font provides a sophisticated, structured feel that matches the technical precision of the English typeface, ensuring the "high-energy" vibe isn't lost in translation.

### Typography Scales
*   **Display (lg/md/sm):** These are your "Editorial Hooks." Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create high-impact headers.
*   **Headline & Title:** Use for secondary messaging. Headlines should be bold and assertive.
*   **Body (lg/md/sm):** Reserved for readability. Ensure `body-lg` (1rem) is used for most reading contexts to maintain a premium feel.
*   **Label:** Use `label-md` for metadata, always in All-Caps for English to provide a "technical" contrast to the organic Arabic script.

---

## 4. Elevation & Depth: Tonal Layering
We do not use drop shadows to mimic 2010-era skeuomorphism. Depth is achieved through light and tone.

*   **The Layering Principle:** Stacking tiers is mandatory. A `surface-container-lowest` card placed on a `surface-container-low` section creates a natural "recessed" look. 
*   **Ambient Shadows:** If a "floating" element (like a FAB or Popover) requires a shadow, it must be a "Tinted Glow." Use a blur of `32px` to `48px` with the color `on-surface` (#fcdbff) at 5% opacity. This creates an ethereal lift.
*   **The "Ghost Border":** For high-density data where separation is legally or functionally required, use `outline-variant` (#5a3d61) at **15% opacity**. This creates a suggestion of a boundary without cluttering the visual field.

---

## 5. Components

### Buttons: The Kinetic Energy
*   **Primary:** `primary` fill (#d09afa) with `on-primary` text. Radius: `md` (0.75rem). Apply a subtle gradient transition to `primary-container` on hover.
*   **Secondary (High Energy):** `secondary` (#fcd401) fill. This is your "Call to Action" for conversion-critical moments.
*   **Tertiary:** No fill. Use `title-sm` typography with an underline that only appears on hover.

### Cards & Lists: The "Fluid Separation"
*   **Cards:** Use `surface-container-highest` (#3a1646). **Forbidden:** Divider lines. 
*   **Separation:** Content within cards must be separated by 24px or 32px of vertical whitespace. If a visual break is needed, use a background shift to `surface-variant`.

### Input Fields: Minimalist Technicality
*   **State:** Background should be `surface-container-low`. 
*   **Active State:** Instead of a thick border, use a 2px bottom-border of `secondary` (#fcd401).
*   **Error:** Use `error` (#ff6e84) for helper text, but avoid thick red boxes. A subtle `error_container` glow is preferred.

### Glass Navigation
*   A fixed top navigation bar using `surface` at 70% opacity with `backdrop-blur: 12px`. This keeps the "high-energy" background colors visible as the user scrolls, maintaining brand immersion.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts (e.g., a headline on the left with a large empty space on the right).
*   **Do** mix the two typefaces seamlessly. Ensure the line height of *IBM Plex Sans Arabic* is adjusted to match the visual "weight" of *Plus Jakarta Sans*.
*   **Do** use `secondary_fixed` (#fcd401) for small accents like notification dots or progress bars.

### Don't:
*   **Don't** use 100% black (#000000) for backgrounds unless it's a `surface-container-lowest` inset. Use the deep purple `surface` (#1c0324) to maintain tonal depth.
*   **Don't** use standard "Drop Shadows" from a design software's default settings. They look "cheap" in this system.
*   **Don't** use more than one "High Energy" yellow element per screen area. It should be a surgical strike of color, not a flood.