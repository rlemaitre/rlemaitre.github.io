const stripSlash = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, '') : path)

/** Lowercased letters and digits only: "h-a-c-k---a-d-h-d" and "Hack ADHD" compare equal. */
const squash = (text: string): string => text.normalize('NFC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

const toCanonical = (path: string): string => (path === '/' ? path : `${path}/`)

const ARTICLE_PATH = /^(\/fr)?\/articles\/[^/]+\/[^/]+$/
const LANG_PREFIX = /^\/(?:fr|-f-r-)(?=\/)/
const POSTS_PATH = /^(?:\/(?:fr|-f-r-))?\/(?:posts|-p-o-s-t-s-)\//
const TIL_ALIAS = /^\/T-?I-?L-?:/
const WORD_ALIASES = new Set(['/a-d-h-d', '/s-c-a-l-a', '/scala', '/t-i-l', '/p-o-s-t-s'])

/** `/x/index.md` -> `/x`, `/x.md` -> `/x`, `/x/` -> `/x`. */
const stripMarkdown = (path: string): string => stripSlash(path).replace(/\/index\.md$/, '').replace(/\.md$/, '') || '/'

type Article = { path: string; keys: string[] }

function articlesOf(newPaths: Set<string>, titles: ReadonlyMap<string, string>): Article[] {
  return [...newPaths]
    .filter((path) => ARTICLE_PATH.test(path))
    .map((path) => {
      const slug = path.slice(path.lastIndexOf('/') + 1)
      const title = titles.get(path)
      return { path, keys: [squash(slug), ...(title ? [squash(title)] : [])] }
    })
}

/** Matches the last segment of a text-like alias (spaced-out, Hugo `posts`, `TIL:` prefix) to an article. */
function matchArticle(path: string, articles: Article[]): string | undefined {
  const isFr = LANG_PREFIX.test(path)
  const last = squash(path.slice(path.lastIndexOf('/') + 1))
  const wanted = TIL_ALIAS.test(path) ? [last, last.replace(/^til/, '')] : [last]
  const pool = TIL_ALIAS.test(path) ? articles : articles.filter((a) => a.path.startsWith('/fr/') === isFr)
  return pool.find((article) => article.keys.some((key) => wanted.includes(key)))?.path
}

function target(path: string, articles: Article[]): string | undefined {
  if (path === '/C-V' || path === '/k8s' || path === '/resume' || path.startsWith('/resume/')) return '/resume/'
  if (TIL_ALIAS.test(path) || POSTS_PATH.test(path)) {
    const article = matchArticle(path, articles)
    return article && toCanonical(article)
  }
  if (/^\/[A-Z][^/]*$/.test(path)) return '/resume/'
  if (path === '/notes' || path.startsWith('/notes/') || path === '/dbs') return '/articles/'
  if (path === '/tags' || path.startsWith('/tags/') || WORD_ALIASES.has(path) || /^\/articles\/[^/]+$/.test(path)) return '/articles/'
  if (/^\/fr\/articles\/[^/]+$/.test(path)) return '/fr/articles/'
  return undefined
}

/**
 * Maps every legacy path that is not a live page to the live page that replaces it.
 * `newPaths` holds the live paths (trailing slash ignored); `titles` maps an article path to its title, used to
 * match spaced-out and translated aliases. Throws, listing them all, when a path matches no rule.
 */
export function buildRedirects(
  legacy: string[],
  newPaths: Set<string>,
  titles: ReadonlyMap<string, string> = new Map(),
): Record<string, string> {
  const live = new Set([...newPaths].map(stripSlash))
  const articles = articlesOf(live, titles)
  const redirects: Record<string, string> = {}
  const unmatched: string[] = []
  for (const path of legacy) {
    const source = stripSlash(path)
    if (live.has(source)) continue
    const page = stripMarkdown(path)
    const destination = live.has(page) ? toCanonical(page) : target(page, articles)
    if (destination) redirects[source] = destination
    else unmatched.push(path)
  }
  if (unmatched.length > 0) throw new Error(`Legacy URLs without a redirect rule:\n${unmatched.join('\n')}`)
  return redirects
}
