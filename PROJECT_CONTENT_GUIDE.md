# Managing Projects

You only need two folders to manage the project portfolio:

- `content/projects` contains the written project information.
- `public/projects` contains the project photographs.

No component or route code needs to be changed when adding a project.

## Add a project

1. Copy `content/projects/_template.json`.
2. Rename the copy using lowercase words and hyphens, for example:
   `lake-house.json`.
3. Create a matching image folder: `public/projects/lake-house`.
4. Put the project images inside that folder.
5. Edit the new JSON file with the project information.

The JSON file name and image folder name must match exactly.

```text
content/projects/lake-house.json
public/projects/lake-house/
  00-lake-house-cover.jpg
  01-living-room.jpg
  02-dining-room.jpg
  03-bedroom.jpg
```

Images appear in file-name order. Start names with `00-`, `01-`, `02-`, and
so on to control their order. Use descriptive names because image descriptions
are created automatically from the file names.

The image named in `coverImage` becomes the image used on the Projects page,
the project hero, social previews, and Featured Works. If `coverImage` is
removed, the first image alphabetically is used.

## Project options

- `category` must be `residential`, `hotel-banquets`, or `commercial`.
- `featured` is `true` to show the project on the homepage or `false` to show
  it only on the Projects page.
- `order` is a number. Lower numbers appear first.
- `layout` can be `feature`, `wide`, `portrait`, or `standard` and controls the
  desktop bento-card shape.
- `overview` contains the paragraphs on the project detail page.
- `services` contains the services shown in the project facts.

Keep double quotes around text and keep a comma after every line except the
last line in an object or list. The build will provide a clear error naming the
file and missing field if the content is invalid.

## Edit or remove a project

- To edit a project, update its JSON file or replace images in its matching
  `public/projects` folder.
- To remove a project, delete its JSON file. Its page, card, filter result, and
  Featured Works entry will disappear automatically. The image folder can then
  be removed as well.

## Change Projects page wording

Edit `content/projects/_page.json` to change the Projects page heading,
description, filter labels, metadata, and homepage Featured Works heading.

## Check changes

Run:

```bash
npm run lint
npm run build
```

The build automatically creates a page for every project JSON file.
