import type { Dirent } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const GALLERY_DIRECTORY = path.join(process.cwd(), "public", "gallery");

const IMAGE_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

export type GalleryImage = {
  /** Public URL, e.g. `/gallery/courtyard-house.jpg`. */
  src: string;
  /** Readable alt text derived from the file name. */
  alt: string;
  fileName: string;
  /** File mtime in ms, used for newest-first ordering. */
  addedAt: number;
};

/**
 * Turns `2026-02-01_living-room.jpg` into `Living room`.
 * Strips a leading date or numeric ordering prefix, then separators.
 */
function toAltText(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");
  const withoutPrefix = withoutExtension
    .replace(/^\d{4}-\d{2}-\d{2}[-_\s]*/, "")
    .replace(/^\d+[-_\s]+/, "");
  const words = (withoutPrefix || withoutExtension)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!words) {
    return "Gallery image";
  }

  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Reads every image in `public/gallery`, newest first.
 *
 * Ordering is by file mtime descending, with file name descending as the
 * tiebreak. Note that git does not preserve mtimes — on a fresh clone or CI
 * build every file gets the checkout time, so the name tiebreak becomes the
 * effective order. Prefix files (`2026-02-01-name.jpg`, `010-name.jpg`) when
 * you need a guaranteed order in production.
 *
 * A missing or unreadable directory yields an empty list rather than throwing,
 * so the page degrades to its empty state.
 */
export async function readGalleryImages(): Promise<GalleryImage[]> {
  let entries: Dirent[];

  try {
    entries = await fs.readdir(GALLERY_DIRECTORY, { withFileTypes: true });
  } catch {
    return [];
  }

  const imageFiles = entries.filter(
    (entry) =>
      entry.isFile() &&
      !entry.name.startsWith(".") &&
      IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
  );

  const images = await Promise.all(
    imageFiles.map(async (entry): Promise<GalleryImage | null> => {
      try {
        const stats = await fs.stat(path.join(GALLERY_DIRECTORY, entry.name));

        return {
          src: `/gallery/${encodeURIComponent(entry.name)}`,
          alt: toAltText(entry.name),
          fileName: entry.name,
          addedAt: stats.mtimeMs,
        };
      } catch {
        return null;
      }
    }),
  );

  return images
    .filter((image): image is GalleryImage => image !== null)
    .sort(
      (a, b) =>
        b.addedAt - a.addedAt ||
        b.fileName.localeCompare(a.fileName, undefined, { numeric: true }),
    );
}
