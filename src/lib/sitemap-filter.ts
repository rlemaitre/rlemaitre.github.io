type Redirects = Record<string, string | { destination: string; status?: number }>

const stripSlash = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, '') : path)

/** Sitemap `filter`: drops the 404 page and every source path of Astro's `redirects` config. */
export function makeSitemapFilter(redirects: Redirects): (page: string) => boolean {
  const excluded = new Set(['/404', ...Object.keys(redirects).map(stripSlash)])
  return (page) => !excluded.has(stripSlash(new URL(page).pathname))
}
