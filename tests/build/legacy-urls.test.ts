import { existsSync, readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const legacy = readFileSync('tests/fixtures/legacy-urls.txt', 'utf8').split('\n').filter(Boolean)

/** dist/ file serving a URL path: a file for `/index.xml`, otherwise `<path>/index.html`. */
function distFile(path: string): string | undefined {
  const trimmed = path.replace(/\/+$/, '')
  return [`dist${trimmed}/index.html`, `dist${trimmed}.html`, `dist${trimmed}`].find(
    (file) => existsSync(file) && !file.endsWith('/') && /\.(html|xml)$/.test(file),
  )
}

const document = (file: string): Document => parseHTML(readFileSync(file, 'utf8')).document as unknown as Document
const sitemapPaths = (): string[] =>
  [...readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => decodeURI(new URL(match[1] ?? '').pathname).normalize('NFC'),
  )

describe('legacy URLs', () => {
  it('lists 227 legacy paths', () => {
    expect(legacy).toHaveLength(227)
  })

  it.each(legacy)('%s resolves', (path) => {
    const file = distFile(path)
    expect(file, `no dist file for ${path}`).toBeDefined()
    if (!file?.endsWith('.html')) return
    const doc = document(file)
    const refresh = doc.querySelector('meta[http-equiv="refresh"]')
    if (!refresh) return
    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href')
    expect(canonical, `no canonical on redirect page ${path}`).toBeTruthy()
    const targetPath = new URL(canonical ?? '', 'https://rlemaitre.com').pathname
    expect(refresh.getAttribute('content')).toContain(targetPath)
    const target = distFile(targetPath)
    expect(target, `redirect target ${targetPath} does not exist`).toBeDefined()
    expect(document(target ?? '').querySelector('meta[http-equiv="refresh"]'), `${targetPath} is itself a redirect`).toBeNull()
  })

  it('keeps every redirect source out of the sitemap', () => {
    const sources = legacy.filter((path) => {
      const file = distFile(path)
      return file?.endsWith('.html') && document(file).querySelector('meta[http-equiv="refresh"]')
    })
    expect(sources.length).toBeGreaterThan(100)
    const inSitemap = new Set(sitemapPaths().map((path) => path.replace(/\/+$/, '')))
    const leaked = sources.filter((path) => inSitemap.has(path.normalize('NFC').replace(/\/+$/, '')))
    expect(leaked).toEqual([])
  })
})
