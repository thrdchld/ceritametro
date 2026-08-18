# UI/UX Craftsmanship & Anti-AI-Slop Guidelines for Cerita Metro

This project strictly adheres to bespoke, high-craft editorial web application design principles.
All AI assistance in this codebase MUST follow these mandatory UI/UX standards:

---

### 1. Zero "Emoji Soup" Policy
- **DO NOT** use consumer emojis (`✍️`, `⚡`, `🧙‍♂️`, `🧠`, `🏥`, `💬`, `🔍`, `📦`, `🔒`, `💾`, etc.) in titles, headings, navbars, or primary buttons.
- **DO** use precision, monochrome SVG stroke icons (Lucide / Feather style, 1.75px stroke width, optical alignment) imported from `src/ui/icons.js` or pure typographic cues.

---

### 2. "Editorial Paper & Deep Ink" Aesthetic
- **Surfaces**: Warm alabaster paper tones (`#F7F5F2`), clean white cards (`#FFFFFF`), and muted warm stone (`#F2EFEA`).
- **Typography**: 
  - Main text in Deep Espresso Ink (`#1A1615`) with high legibility.
  - Headings with tight negative letter-spacing (`-0.02em` to `-0.03em`).
  - Prose reading areas styled in warm Serif (`Merriweather` / Georgia) with optimal ~65-75ch line measure and `1.8` line-height.
  - Metadata, badges, and timestamps in crisp monospace or compact sans (`0.75rem`, letter-spaced).
- **Accents**: Deep Metro Noir Plum/Velvet (`#4A2E4B`), subtle warm amber (`#D97706`) for highlights. Never use generic neon blues or childish bright purple gradients.

---

### 3. Structural Whitespace Over "Card-inside-Card"
- Avoid nesting bordered boxes inside bordered boxes.
- Use hairline dividers (`1px solid var(--border-light)`), subtle background contrasts, and rhythmic whitespace to separate content.
- Elevate interactive elements with micro-shadows (`0 1px 2px rgba(26,22,21, 0.04)` and `0 2px 8px rgba(26,22,21, 0.06)`), not thick borders or heavy blur gradients.

---

### 4. Tactile & Ergonomic Interactions
- Buttons must have micro-press feedback (`transform: scale(0.98)` on active).
- Form inputs must have distinct focus rings with subtle primary glow.
- Segmented controls and tab switchers must have smooth background slide/pill animations.
- Full viewport single-page architecture: Window does not scroll (`100dvh`), inner containers scroll smoothly.
