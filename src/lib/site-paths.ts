import { readdirSync, readFileSync } from 'node:fs'
import { basename, join } from 'node:path'

const CONTENT = 'src/content'
const STATIC_PATHS = ['/', '/404', '/index.xml', '/fr', '/fr/index.xml', '/articles', '/fr/articles', '/resume', '/talks', '/projects']

const markdownIn = (dir: string): string[] =>
  readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace(/\.md$/, ''))

const frontmatterTitle = (file: string): string | undefined =>
  /^title:\s*"?(.*?)"?\s*$/m.exec(readFileSync(file, 'utf8'))?.[1]

/** Every live path of the site, computed from the content files (no trailing slash), plus article titles. */
export function siteContent(root = CONTENT): { newPaths: Set<string>; titles: Map<string, string> } {
  const newPaths = new Set(STATIC_PATHS)
  const titles = new Map<string, string>()
  for (const id of markdownIn(join(root, 'articles'))) {
    const path = id.startsWith('fr/') ? `/fr/articles/${id.slice(3)}` : `/articles/${id.slice(id.indexOf('/') + 1)}`
    newPaths.add(path)
    const title = frontmatterTitle(join(root, 'articles', `${id}.md`))
    if (title) titles.set(path, title)
  }
  for (const id of markdownIn(join(root, 'talks'))) newPaths.add(`/talks/${basename(id)}`)
  for (const id of markdownIn(join(root, 'projects'))) newPaths.add(`/projects/${basename(id)}`)
  return { newPaths, titles }
}
