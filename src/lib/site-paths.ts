import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { articleUrl, projectUrl, talkUrl, type Lang } from './i18n'

const CONTENT = 'src/content'
const STATIC_PATHS = [
  '/',
  '/404',
  '/index.xml',
  '/fr',
  '/fr/index.xml',
  '/articles',
  '/fr/articles',
  '/resume',
  '/talks',
  '/fr/talks',
  '/projects',
  '/fr/projects',
]
const LANGS: Lang[] = ['en', 'fr']

const markdownIn = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))

/** Entries of a talks or projects folder: its top-level files only, not the `fr/` translations. */
const entriesIn = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => entry.name.replace(/\.md$/, ''))

const frontmatter = (file: string): string => /^---\n([\s\S]*?)\n---/.exec(readFileSync(file, 'utf8'))?.[1] ?? ''

const isDraft = (meta: string): boolean => /^draft:\s*true\s*$/m.test(meta)

const frontmatterTitle = (meta: string): string | undefined => /^title:\s*"?(.*?)"?\s*$/m.exec(meta)?.[1]

/** Every live path of the site, computed from the content files (no trailing slash), plus article titles. */
export function siteContent(root = CONTENT): { newPaths: Set<string>; titles: Map<string, string> } {
  const newPaths = new Set(STATIC_PATHS)
  const titles = new Map<string, string>()
  for (const id of markdownIn(join(root, 'articles'))) {
    const meta = frontmatter(join(root, 'articles', `${id}.md`))
    if (isDraft(meta)) continue // drafts are not built, so they are not live
    const path = articleUrl(id).replace(/\/$/, '')
    newPaths.add(path)
    const title = frontmatterTitle(meta)
    if (title) titles.set(path, title)
  }
  // Every talk and project has a page in each language (the French page fails the build without its translation).
  for (const lang of LANGS) {
    for (const id of entriesIn(join(root, 'talks'))) newPaths.add(talkUrl(id, lang).replace(/\/$/, ''))
    for (const id of entriesIn(join(root, 'projects'))) newPaths.add(projectUrl(id, lang).replace(/\/$/, ''))
  }
  return { newPaths, titles }
}
