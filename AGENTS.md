# AGENTS.md
Practical guidance for coding agents working in `vision-interiors`.

## Project Overview
- Product type: portfolio website for an Interior Designing company.
- Stack: Next.js 16 (App Router), React 19, TypeScript 5.
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`.
- Linting: ESLint 9 with Next core web vitals + TypeScript config.
- Package manager: npm (`package-lock.json` present).
- Alias: `@/*` -> repo root (from `tsconfig.json`).

## Core Build Strategy
- Build UI pages component-by-component.
- Keep page-specific components grouped in dedicated folders.
- Keep static content (copy/image links) in content files, not inside JSX.
- Prioritize content-driven rendering so non-technical users can update content safely.

## Target Folder Architecture
Use this structure as the default pattern for new work:

```text
app/
  contact/
    page.tsx
  gallery/
    page.tsx
  api/
    contact/
      route.ts
lib/
  gallery.ts
components/
  ui/
    SiteNav.tsx
  pages/
    home/
      Hero.tsx
      AboutPreview.tsx
    contact/
      ContactExperience.tsx
    gallery/
      GalleryExperience.tsx
    services/
      ServicesHero.tsx
      ServiceCard.tsx
    projects/
      ProjectsHero.tsx
      ProjectCard.tsx
content/
  content.ts
  contact/
    contact.ts
  gallery/
    gallery.ts
  services/
    services.ts
  projects/
    projects.ts
```

Rules:
- Each page gets a subfolder under `components/pages/`.
- Page-level UI components live in that page subfolder.
- Shared/reusable UI can live in a non-page-specific component area if needed.
- `content/content.ts` stores global/static site content.
- `content/services/services.ts` stores Services route content.
- `content/projects/projects.ts` stores Projects route content.
- In route-specific content folders, name the file after the route for clear nomenclature.

## Content-Driven Rendering Requirements
- Services and Projects pages must render from `content/` data.
- Use one common page layout pattern for services and projects.
- New service/project entries should be addable by editing content files only.
- Removing an entry should only require deleting it from content data.
- Avoid hardcoding marketing copy/image URLs in route components.

Recommended data shape:
- Stable `slug` per item.
- Title/subtitle/description fields.
- Image URL(s) and optional alt text.
- Optional tags, category, and sort order.

## Key Files To Read First
- `package.json` (scripts/deps)
- `tsconfig.json` (strict mode, alias, compiler behavior)
- `eslint.config.mjs` (lint presets + ignores)
- `next.config.ts` (Next config)
- `app/layout.tsx` (root layout)
- `app/globals.css` (global tokens/theme)
- `content/content.ts` and domain content files once added

## Install, Build, Run, Lint
Run from `/Users/vishal-mac/Work/vision-interiors`.

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

### Command intent
- `npm run dev`: local dev server (usually `http://localhost:3000`).
- `npm run build`: production build validation.
- `npm run start`: run built app.
- `npm run lint`: ESLint checks.

## Tests (Including Single Test)
Current status:
- No test script exists in `package.json`.
- No Jest/Vitest/Playwright/Cypress config found.

Current verification path:
```bash
npm run lint
npm run build
```

If introducing tests, standardize scripts like this:
- `test`: run all tests once.
- `test:watch`: watch mode.
- `test:single`: one-file execution.

Example Vitest setup:
```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
npm pkg set scripts.test="vitest run"
npm pkg set scripts.test:watch="vitest"
npm pkg set scripts.test:single="vitest run"
```

Run one test file (Vitest):
```bash
npm run test:single -- app/components/example.test.tsx
```

Run one test by name (Vitest):
```bash
npm run test -- -t "renders expected content"
```

## Code Style Rules
Follow existing repo conventions and keep changes minimal/surgical.

### Imports
- Use `import type` for type-only symbols.
- Preferred order: framework/runtime, third-party, `@/` internals, relatives.
- Keep CSS side-effect imports after non-side-effect imports.
- Prefer `@/` over deep relative paths.

### Formatting
- Match current style: double quotes, semicolons, trailing commas.
- Keep JSX readable; wrap long prop lists onto multiple lines.
- Avoid unrelated formatting churn in untouched files.

### TypeScript
- Keep `strict` mode enabled.
- Avoid `any`; prefer `unknown` + narrowing.
- Define typed content models for services/projects.
- Keep content type names aligned to route names (for example, `ServiceItem`, `ProjectItem`).
- Type function boundaries explicitly when inference is weak.
- Narrow nullable/optional values before use.

### Naming
- Components: `PascalCase`.
- Hooks: `useXxx`.
- Variables/functions: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for true constants only.
- Route files follow Next naming (`page.tsx`, `layout.tsx`).
- Content files in domain folders should match route names (`services.ts`, `projects.ts`).

### React / Next Practices
- Default to Server Components in `app/`.
- Add `"use client"` only when browser interactivity is required.
- Use `next/image` when practical.
- Keep App Router structure idiomatic.
- Add/update metadata intentionally for each user-facing route.

### Styling
- Prefer Tailwind utilities for component-level styling.
- Keep design tokens in `app/globals.css` where possible.
- Reuse CSS variables for theme consistency.
- Preserve mobile-first responsive behavior.

### Error Handling
- Do not swallow errors silently.
- Validate content data shape at boundaries.
- Render safe fallbacks for missing images/text.
- Keep user-facing error messages actionable and non-sensitive.

## Lint and Quality Expectations
- Respect rules from `eslint-config-next/core-web-vitals`.
- Respect rules from `eslint-config-next/typescript`.
- Keep repo buildable and lint-clean after meaningful changes.
- Before handoff, run:

```bash
npm run lint
npm run build
```

## Git and Diff Discipline
- Keep diffs focused on the requested task.
- Do not edit unrelated files.
- Do not update lockfiles unless dependencies changed.
- If architecture/workflow changes, update this file.

## Cursor / Copilot Rule Files
Repository scan results at time of writing:
- `.cursor/rules/` not found.
- `.cursorrules` not found.
- `.github/copilot-instructions.md` not found.

If these files appear later, treat them as high-priority instructions and reconcile this document with them.

## Quick PR Checklist
- Run `npm run lint`.
- Run `npm run build`.
- Smoke-check changed routes with `npm run dev`.
- Confirm Services/Projects pages still render from `content/` only.
- Ensure non-technical content edits require no component code changes.
