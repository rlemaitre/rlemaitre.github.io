# rlemaitre.com

Personal site of Raphaël Lemaitre: articles, talks, projects and a one-page resume, in English and French.
Live at <https://rlemaitre.com>.

## Stack

- [Astro](https://astro.build) 7, static output, content collections with Zod schemas
- Plain CSS with design tokens (`src/styles/`), light and dark themes, a print stylesheet for the resume
- Shiki for syntax highlighting, with custom light and dark themes in `src/shiki/`
- Vitest for unit and build-output tests, Playwright for end-to-end tests
- GitHub Pages for hosting, Tinylytics for analytics and kudos

## Commands

Node 22 or newer (see `.node-version`).

| Command              | What it does                                                          |
| -------------------- | --------------------------------------------------------------------- |
| `npm ci`             | Install dependencies                                                  |
| `npm run dev`        | Start the dev server on <http://localhost:4321>                       |
| `npm run build`      | Type-check with `astro check`, then build the site into `dist/`       |
| `npm run preview`    | Serve `dist/` locally                                                 |
| `npm run test`       | Unit tests (`tests/unit`)                                             |
| `npm run test:build` | Tests on the built HTML, feeds and redirects (`tests/build`)          |
| `npm run test:e2e`   | Playwright tests (`tests/e2e`); run `npx playwright install chromium` once |

`test:build` and `test:e2e` need a fresh `npm run build` first.

## Content layout

Everything lives under `src/content`. Schemas are in `src/content.config.ts`.

```
src/content/
  articles/en/<section>/<slug>.md   English articles
  articles/fr/<section>/<slug>.md   French translations
  talks/<slug>.md                   one file per talk, with its venues in the frontmatter
  projects/<slug>.md                one file per project
  home/{en,fr}.md                   home page introduction
  resume.yaml                       resume data
```

Dates come from the frontmatter, not from git history. Legacy Quartz URLs are kept alive as redirects, built from
`tests/fixtures/legacy-urls.txt` by `src/lib/redirects.ts`.

### Add an article

1. Create `src/content/articles/en/<section>/<slug>.md` (sections in use: `adhd`, `scala`, `til`).
2. Add the frontmatter:

   ```yaml
   ---
   title: 'Title in sentence case'
   description: 'One sentence for the index, feeds and social cards.'
   published: 2026-10-16
   tags: ['scala', 'tooling']
   ---
   ```

   Optional fields: `updated`, `cover` and `coverAlt`, `draft: true` (excluded from the build), `talk` (link to a talk
   id), `originallyPublished` (site, url, date).

3. Write the body in Markdown. Tags are lowercase.
4. For a French version, add a file with the same section and slug under `src/content/articles/fr/`. The two pages then
   link to each other; an article without a translation links to the other language's home page.

## Deploy

Merging into `v4` runs `.github/workflows/deploy.yaml`: `npm ci`, `npm run build`, then the `dist/` folder is published to
GitHub Pages. The custom domain comes from `public/CNAME`. Pull requests and pushes to `v4` also run
`.github/workflows/test.yaml` (unit, build and end-to-end tests).
