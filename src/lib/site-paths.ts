import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { articleUrl } from './i18n'

const CONTENT = 'src/content'
const STATIC_PATHS = ['/', '/404', '/index.xml', '/fr', '/fr/index.xml', '/articles', '/fr/articles', '/resume', '/talks', '/projects']

const markdownIn = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))

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
  for (const id of markdownIn(join(root, 'talks'))) newPaths.add(`/talks/${basename(id)}`)
  for (const id of markdownIn(join(root, 'projects'))) newPaths.add(`/projects/${basename(id)}`)
  return { newPaths, titles }
}
