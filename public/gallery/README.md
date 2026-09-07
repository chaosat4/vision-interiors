# Gallery images

Drop image files in this folder and they appear on `/gallery` automatically —
no code changes needed.

- **Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`
- **Order:** newest first, by file modified time, with file name (descending) as
  the tiebreak.
- **Alt text** is derived from the file name, so name files descriptively:
  `courtyard-house-living-room.jpg` becomes "Courtyard house living room".
  A leading date or number prefix is stripped from the alt text.
- The first (newest) image always lands on the large feature tile.

## Controlling the order in production

Git does not preserve file modified times. On a fresh clone or CI build every
file gets the checkout time, so the file name tiebreak becomes the effective
order. When the order matters, prefix the file names:

```
2026-02-14-terrace-villa.jpg   <- appears first
2026-01-30-stone-villa.jpg
2025-11-02-courtyard-house.jpg <- appears last
```

Numeric prefixes (`030-`, `020-`, `010-`) work too — sorting is descending and
numeric-aware.

## Note on adding images after deployment

The page reads this folder when it is built. On a static host (Vercel and
similar) adding an image means committing it and redeploying, which is the
normal flow. If you self-host and want new files to appear without a rebuild,
add `export const dynamic = "force-dynamic";` to `app/gallery/page.tsx`.

Files starting with `.` and this README are ignored.
