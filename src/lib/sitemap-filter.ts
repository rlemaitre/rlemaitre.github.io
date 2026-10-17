type Redirects = Record<string, string | { destination: string; status?: number }>

const stripSlash = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, '') : path)

/** One comparable form for raw redirect keys and percent-encoded sitemap URLs. */
const comparable = (path: string): string => {
  let decoded = path
  try {
    decoded = decodeURI(path)
  } catch {
    // keep malformed escapes as they are
  }
  return stripSlash(decoded.normalize('NFC'))
}

/** Sitemap `filter`: drops the 404 page and every source path of Astro's `redirects` config. */
export function makeSitemapFilter(redirects: Redirects): (page: string) => boolean {
  const excluded = new Set(['/404', ...Object.keys(redirects).map(comparable)])
  return (page) => !excluded.has(comparable(new URL(page).pathname))
}
