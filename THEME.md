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

### Our Process Section Rules

- Position directly below hero on homepage.
- Use one seamless background image across all process cards.
- Card expand/collapse should never shift or distort the shared background.
- First card stays open by default.
- Desktop interaction: hover/focus expands cards.
- Mobile interaction: featured active card + vertical timeline rail with tap-to-switch steps.
- Keep transitions smooth and restrained; avoid abrupt scale effects.

### About Vision Interiors Section Rules

- Use a scroll-stage composition with sticky editorial text at center.
- Floating image cards should move sequentially: left entry, center rise, right entry.
- Keep the text block composition stable while images animate around it.
- Motion should include a subtle mid-scroll dwell (sweetspot) before cards lift out.
- Maintain warm palette contrast and avoid harsh, high-saturation overlays.

### Featured Works Section Rules

- Present projects in a horizontal scroller without next/previous controls.
- Keep movement tactile and smooth using scroll-snap and touch-friendly drag behavior.
- Maintain dark editorial contrast with warm type accents for section identity.
- Cards should feel premium: clear project image, concise metadata, and restrained hover motion.
- Mobile must retain horizontal swipe with readable card copy and spacing.

### Gallery Page Rules

- Route: `/gallery`, on the dark editorial ground shared with Featured Works,
  over a fine woven texture and vignette.
- No navbar. A single back control sits top left, matching the contact page.
- Header elements stage in (eyebrow, heading, description, count) and a hairline
  rule draws across beneath them.
- Content is **auto-generated**: `lib/gallery.ts` reads `public/gallery` on the
  server. Adding an image file is the only step — no code or content edit.
- Order is newest first (file mtime descending, file name descending as tiebreak).
  Git does not preserve mtimes, so prefix file names when order matters in production.
- Alt text is derived from the file name; a leading date or number prefix is stripped.
- Bento rhythm is a six-tile repeat on a four-column grid, driven purely by
  `:nth-child` so breakpoints can redefine it cleanly. `grid-auto-flow: dense`
  fills any gap left by an incomplete final row.
- The newest image always lands on the large 2x2 feature tile.
- Below 1024px the grid drops to two columns with every third tile full width.
- Tiles reveal on scroll via IntersectionObserver: blur-lift in, staggered by
  `(index % 6) * 90ms` so each bento group unfolds rather than snapping in.
- Each tile carries a shimmer skeleton that sits above the image until it decodes,
  then crossfades out as the image fades up from a 1.06 scale.
- Load state is tracked from `onLoad` **and** an `img.complete` check on mount,
  since cached images can finish before hydration and never fire `onLoad`.
- Tiles reveal a rule-prefixed caption and a soft veil on hover/focus; the image
  scales gently.
- Reveal and fade are JS-driven, so a `<noscript>` block forces the finished
  state rather than leaving an empty grid.
- Clicking a tile opens a native `<dialog>` lightbox — this gives a focus trap,
  Escape-to-close and an inert background without custom code. Arrow keys step
  through images, page scroll is locked while open, and focus returns to the
  tile that opened it.
- A missing or empty `public/gallery` renders the empty state, never an error.

### Contact Page Rules

- Route: `/contact`, built as a guided multi-step brief rather than a single form.
- One question per step: four choice steps, then a details step, then a review step.
- Choice selection auto-advances after a short beat; reduced motion advances immediately.
- Deliberately quiet: solid `--sand` ground, no imagery, no navbar, no progress rail
  and no step counter. Restraint is the point — the question carries the page.
- Chrome is one context-aware back control, top left: "Back To Home" on the first
  step and on success, "Back" on every step in between. No second back affordance.
- Choices are hairline-ruled list rows, not cards, with a small ink marker that fills
  when selected and a subtle shift on hover.
- Inputs are underline-only (bottom rule), never boxed.
- Review step is a hairline definition list with per-entry Edit actions.
- One solid ink button per screen; it inverts to outline on hover.
- Studio contact details sit as a quiet line at the foot of the page.
- Focus moves to the step heading on every step change, but never on first paint —
  the guard is keyed on the step itself so StrictMode's double-invoke cannot steal focus.
- Errors use `role="alert"` with `aria-invalid` / `aria-describedby`.
- Choices are real radio inputs, so arrow-key navigation works natively.
- Submission posts to `/api/contact`, which re-validates server-side against the
  same content file. Delivery is still a TODO stub.

## Navbar Rules

- Desktop: full nav links + CTA.
- Mobile: hamburger trigger + expandable menu panel.
- Ensure transparent/glass nav remains readable across bright video frames.
- Extracted to `components/ui/SiteNav.tsx`. The `revealed` prop drives the staged
  entrance (home holds it until the splash finishes; other routes render revealed).
- `linkBase` prefixes in-page hash links so `#works` resolves back to home from a
  sub-route. The contact page deliberately renders no navbar at all.

## Content Rules

- All headline and hero copy should come from `content/content.ts`.
- Prefer concise, declarative taglines with strong design language.
- Avoid overly long slogans that break visual rhythm.

## Implementation Notes

- Main implementation files:
  - `components/pages/home/HomeExperience.tsx`
  - `components/pages/home/HomeExperience.module.css`
  - `components/pages/home/OurProcess.tsx`
  - `components/pages/home/OurProcess.module.css`
  - `components/pages/home/AboutVision.tsx`
  - `components/pages/home/AboutVision.module.css`
  - `components/pages/home/FeaturedWorks.tsx`
  - `components/pages/home/FeaturedWorks.module.css`
  - `components/pages/contact/ContactExperience.tsx`
  - `components/pages/contact/ContactExperience.module.css`
  - `components/pages/gallery/GalleryExperience.tsx`
  - `components/pages/gallery/GalleryExperience.module.css`
  - `app/gallery/page.tsx`
  - `lib/gallery.ts`
  - `content/gallery/gallery.ts`
  - `components/ui/SiteNav.tsx`
  - `components/ui/SiteNav.module.css`
  - `app/contact/page.tsx`
  - `app/api/contact/route.ts`
  - `content/content.ts`
  - `content/contact/contact.ts`
  - `app/globals.css`
  - `app/layout.tsx`
- Keep this document updated when visual tokens, motion timing, or component hierarchy changes.
