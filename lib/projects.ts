import fs from "node:fs/promises";
import path from "node:path";

const PROJECT_CONTENT_DIRECTORY = path.join(process.cwd(), "content", "projects");
const PROJECT_IMAGE_DIRECTORY = path.join(process.cwd(), "public", "projects");
const PAGE_CONTENT_FILE = "_page.json";
const IMAGE_EXTENSIONS = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const PROJECT_CATEGORIES = new Set([
  "residential",
  "hotel-banquets",
  "commercial",
]);
const PROJECT_LAYOUTS = new Set(["feature", "wide", "portrait", "standard"]);

export type ProjectCategory =
  | "residential"
  | "hotel-banquets"
  | "commercial";

export type ProjectFilter = "all" | ProjectCategory;

export type ProjectCategoryOption = {
  slug: ProjectFilter;
  label: string;
};

export type ProjectImage = {
  src: string;
  alt: string;
};

export type ProjectItem = {
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  location: string;
  year: string;
  area: string;
  brief: string;
  overview: string[];
  services: string[];
  imageUrl: string;
  imageAlt: string;
  gallery: ProjectImage[];
  featured: boolean;
  layout: "feature" | "wide" | "portrait" | "standard";
  href: string;
  order: number;
};

export type FeaturedWorksContent = {
  eyebrow: string;
  heading: string;
  description: string;
  items: ProjectItem[];
};

export type ProjectsPageContent = {
  meta: {
    title: string;
    description: string;
  };
  eyebrow: string;
  heading: string;
  description: string;
  collectionLabel: string;
  filtersLabel: string;
  emptyMessage: string;
  filters: ProjectCategoryOption[];
};

export type ProjectsSettings = ProjectsPageContent & {
  featuredWorks: Omit<FeaturedWorksContent, "items">;
};

type ProjectFile = {
  title: string;
  category: ProjectCategory;
  location: string;
  year: string;
  area: string;
  brief: string;
  overview: string[];
  services: string[];
  featured: boolean;
  layout: ProjectItem["layout"];
  order: number;
  coverImage?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(fileName: string, message: string): never {
  throw new Error(`[projects] ${fileName}: ${message}`);
}

function requiredString(
  record: Record<string, unknown>,
  key: string,
  fileName: string,
): string {
  const value = record[key];

  if (typeof value !== "string" || !value.trim()) {
    fail(fileName, `"${key}" must be a non-empty line of text.`);
  }

  return value.trim();
}

function requiredStringArray(
  record: Record<string, unknown>,
  key: string,
  fileName: string,
): string[] {
  const value = record[key];

  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => typeof item !== "string" || !item.trim())
  ) {
    fail(fileName, `"${key}" must contain at least one line of text.`);
  }

  return value.map((item) => (item as string).trim());
}

async function readJsonFile(fileName: string): Promise<unknown> {
  const filePath = path.join(PROJECT_CONTENT_DIRECTORY, fileName);

  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as unknown;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown error";
    fail(fileName, `could not be read as JSON. ${detail}`);
  }
}

function parseProjectFile(value: unknown, fileName: string): ProjectFile {
  if (!isRecord(value)) {
    fail(fileName, "the file must contain one JSON object.");
  }

  const category = requiredString(value, "category", fileName);
  const layout = requiredString(value, "layout", fileName);
  const featured = value.featured;
  const order = value.order;
  const coverImage = value.coverImage;

  if (!PROJECT_CATEGORIES.has(category)) {
    fail(fileName, '"category" must be residential, hotel-banquets, or commercial.');
  }

  if (!PROJECT_LAYOUTS.has(layout)) {
    fail(fileName, '"layout" must be feature, wide, portrait, or standard.');
  }

  if (typeof featured !== "boolean") {
    fail(fileName, '"featured" must be true or false.');
  }

  if (typeof order !== "number" || !Number.isFinite(order)) {
    fail(fileName, '"order" must be a number.');
  }

  if (
    coverImage !== undefined &&
    (typeof coverImage !== "string" || path.basename(coverImage) !== coverImage)
  ) {
    fail(fileName, '"coverImage" must be a file name from the matching image folder.');
  }

  return {
    title: requiredString(value, "title", fileName),
    category: category as ProjectCategory,
    location: requiredString(value, "location", fileName),
    year: requiredString(value, "year", fileName),
    area: requiredString(value, "area", fileName),
    brief: requiredString(value, "brief", fileName),
    overview: requiredStringArray(value, "overview", fileName),
    services: requiredStringArray(value, "services", fileName),
    featured,
    layout: layout as ProjectItem["layout"],
    order,
    coverImage,
  };
}

function toAltText(fileName: string): string {
  const words = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}[-_\s]*/, "")
    .replace(/^\d+[-_\s]+/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return words
    ? words.charAt(0).toUpperCase() + words.slice(1)
    : "Project image";
}

async function readProjectImages(
  slug: string,
  coverImage: string | undefined,
  fileName: string,
): Promise<{ cover: ProjectImage; gallery: ProjectImage[] }> {
  const directory = path.join(PROJECT_IMAGE_DIRECTORY, slug);
  let entries;

  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    fail(
      fileName,
      `create public/projects/${slug} and add at least one image to it.`,
    );
  }

  const imageNames = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        !entry.name.startsWith(".") &&
        IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
    )
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (imageNames.length === 0) {
    fail(fileName, `public/projects/${slug} does not contain a supported image.`);
  }

  const selectedCover = coverImage ?? imageNames[0];

  if (!imageNames.includes(selectedCover)) {
    fail(
      fileName,
      `cover image "${selectedCover}" was not found in public/projects/${slug}.`,
    );
  }

  const gallery = imageNames.map((imageName) => ({
    src: `/projects/${slug}/${encodeURIComponent(imageName)}`,
    alt: toAltText(imageName),
  }));
  const cover = gallery[imageNames.indexOf(selectedCover)];

  return { cover, gallery };
}

function categoryLabel(category: ProjectCategory): string {
  if (category === "hotel-banquets") {
    return "Hotel & Banquets";
  }

  return category.charAt(0).toUpperCase() + category.slice(1);
}

export async function readProjects(): Promise<ProjectItem[]> {
  const entries = await fs.readdir(PROJECT_CONTENT_DIRECTORY, {
    withFileTypes: true,
  });
  const fileNames = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.endsWith(".json") &&
        !entry.name.startsWith("_"),
    )
    .map((entry) => entry.name);

  const loadedProjects = await Promise.all(
    fileNames.map(async (fileName): Promise<ProjectItem> => {
      const slug = path.basename(fileName, ".json");

      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        fail(fileName, "use a lowercase hyphenated file name, such as courtyard-house.json.");
      }

      const project = parseProjectFile(await readJsonFile(fileName), fileName);
      const images = await readProjectImages(slug, project.coverImage, fileName);

      return {
        slug,
        title: project.title,
        category: project.category,
        categoryLabel: categoryLabel(project.category),
        location: project.location,
        year: project.year,
        area: project.area,
        brief: project.brief,
        overview: project.overview,
        services: project.services,
        imageUrl: images.cover.src,
        imageAlt: images.cover.alt,
        gallery: images.gallery,
        featured: project.featured,
        layout: project.layout,
        href: `/projects/${slug}`,
        order: project.order,
      };
    }),
  );

  const slugs = new Set<string>();

  for (const project of loadedProjects) {
    if (slugs.has(project.slug)) {
      fail(project.slug, "duplicate project slug.");
    }
    slugs.add(project.slug);
  }

  return loadedProjects.sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  );
}

export async function readProjectsSettings(): Promise<ProjectsSettings> {
  const value = await readJsonFile(PAGE_CONTENT_FILE);

  if (!isRecord(value) || !isRecord(value.meta) || !isRecord(value.featuredWorks)) {
    fail(PAGE_CONTENT_FILE, "meta and featuredWorks objects are required.");
  }

  const filters = value.filters;

  if (!Array.isArray(filters) || filters.length === 0) {
    fail(PAGE_CONTENT_FILE, '"filters" must contain the project filters.');
  }

  const parsedFilters = filters.map((filter, index) => {
    if (!isRecord(filter)) {
      fail(PAGE_CONTENT_FILE, `filter ${index + 1} must be an object.`);
    }

    const slug = requiredString(filter, "slug", PAGE_CONTENT_FILE);

    if (slug !== "all" && !PROJECT_CATEGORIES.has(slug)) {
      fail(PAGE_CONTENT_FILE, `filter ${index + 1} has an unsupported slug.`);
    }

    return {
      slug: slug as ProjectFilter,
      label: requiredString(filter, "label", PAGE_CONTENT_FILE),
    };
  });

  return {
    meta: {
      title: requiredString(value.meta, "title", PAGE_CONTENT_FILE),
      description: requiredString(value.meta, "description", PAGE_CONTENT_FILE),
    },
    eyebrow: requiredString(value, "eyebrow", PAGE_CONTENT_FILE),
    heading: requiredString(value, "heading", PAGE_CONTENT_FILE),
    description: requiredString(value, "description", PAGE_CONTENT_FILE),
    collectionLabel: requiredString(value, "collectionLabel", PAGE_CONTENT_FILE),
    filtersLabel: requiredString(value, "filtersLabel", PAGE_CONTENT_FILE),
    emptyMessage: requiredString(value, "emptyMessage", PAGE_CONTENT_FILE),
    filters: parsedFilters,
    featuredWorks: {
      eyebrow: requiredString(value.featuredWorks, "eyebrow", PAGE_CONTENT_FILE),
      heading: requiredString(value.featuredWorks, "heading", PAGE_CONTENT_FILE),
      description: requiredString(
        value.featuredWorks,
        "description",
        PAGE_CONTENT_FILE,
      ),
    },
  };
}

export function createFeaturedWorksContent(
  projects: ProjectItem[],
  settings: ProjectsSettings,
): FeaturedWorksContent {
  return {
    ...settings.featuredWorks,
    items: projects.filter((project) => project.featured),
  };
}
