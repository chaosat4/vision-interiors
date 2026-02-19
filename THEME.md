# Vision Interiors Theme

This document defines the visual system, motion language, and implementation rules for the Vision Interiors homepage experience.

## Design Philosophy

- **Mood:** refined luxury, warm editorial minimalism, cinematic depth.
- **Intent:** premium but calm; high contrast readability over rich media backgrounds.
- **Character:** elegant serif-led brand voice balanced with modern geometric body text.
- **Experience priority:** first-load splash reveal should feel crafted, not flashy.

## Brand Direction

- Brand text: `VISION` / `INTERIORS`.
- Brand mark: `public/vision-logo.png` placed before wordmark in navbar.
- Logo aspect ratio must remain untouched.
- Logo height should visually match the full two-line wordmark height.

## Typography System

- **Display font:** `Cormorant Garamond` (`--font-display`) for identity and hero statements.
- **Body font:** `Manrope` (`--font-body`) for navigation, supporting copy, and utility text.
- **Type contrast rule:** serif for emotional impact, sans for clarity and hierarchy.

### Hero Headline Rules

- Rotate through approved headline list from content.
- Rotation duration: **15s** per headline.
- Clamp to **maximum 2 lines** for consistency.
- Remove/tagline variants that regularly wrap to 3 lines.

## Color Palette

Core tokens in `app/globals.css`:

- `--background`: `#d9cfc0` (sand)
- `--foreground`: `#12100d` (ink)
- `--sand`: `#d9cfc0`
- `--ink`: `#12100d`
- `--mist`: `#ece6db`

Hero-specific treatment (`HomeExperience.module.css`):

- Base hero media backing: `#141312`
- Atmospheric overlays: warm dark gradients + soft amber radial light
- Navigation glass: translucent warm brown with subtle blur and border
- Rating card: light parchment tint with soft shadow

## Motion Language

### Splash Sequence

Phases:

1. `intro`
2. `split`
3. `hold`
4. `burst`
5. `done`

Rules:

- Desktop: splash words split horizontally in opposite directions.
- Mobile: splash words split vertically in opposite directions.
- Word offsets are measured dynamically from rendered text and window dimensions.
- Burst must transition seamlessly to hero without zoom pop or snap-back.

### Hero Motion

- Hero content fades/slides in with staged timing after splash completes.
- Background video starts after reveal, runs at normal speed, then eases into pause near midpoint.
- Respect reduced motion: skip splash and disable non-essential transitions.

## Layout & Composition Rules

- Keep hero statement visually centered and dominant.
- Maintain generous breathing space around navigation and headline.
- Bottom-left description must remain clearly readable and larger than generic footnote copy.
- Right rating card should remain prominent enough to read at a glance.

## Navbar Rules

- Desktop: full nav links + CTA.
- Mobile: hamburger trigger + expandable menu panel.
- Ensure transparent/glass nav remains readable across bright video frames.

## Content Rules

- All headline and hero copy should come from `content/content.ts`.
- Prefer concise, declarative taglines with strong design language.
- Avoid overly long slogans that break visual rhythm.

## Implementation Notes

- Main implementation files:
  - `components/pages/home/HomeExperience.tsx`
  - `components/pages/home/HomeExperience.module.css`
  - `content/content.ts`
  - `app/globals.css`
  - `app/layout.tsx`
- Keep this document updated when visual tokens, motion timing, or component hierarchy changes.
