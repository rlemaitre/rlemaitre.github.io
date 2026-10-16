import { existsSync, readFileSync } from 'node:fs'
import { DOMParser, parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const read = (path: string): string => readFileSync(`dist/${path}`, 'utf8')
const xml = (path: string): Document =>
  new DOMParser().parseFromString(read(path), 'text/xml') as unknown as Document

function feedItems(path: string): Element[] {
  return [...xml(path).querySelectorAll('item')]
}

describe('RSS feeds', () => {
  it('serves the English feed at /index.xml with 4 absolute-linked items', () => {
    const items = feedItems('index.xml')
    expect(items).toHaveLength(4)
    for (const item of items) {
      expect(item.querySelector('link')?.textContent).toMatch(/^https:\/\/rlemaitre\.com\/articles\/.+\/$/)
      expect(item.querySelector('description')?.textContent?.trim()).toBeTruthy()
      expect(item.querySelector('pubDate')?.textContent?.trim()).toBeTruthy()
    }
  })

  it('lists items newest first', () => {
    const dates = feedItems('index.xml').map((i) => Date.parse(i.querySelector('pubDate')?.textContent ?? ''))
    expect(dates).toEqual([...dates].sort((a, b) => b - a))
  })

  it('serves the French feed at /fr/index.xml with 3 items', () => {
    const items = feedItems('fr/index.xml')
    expect(items).toHaveLength(3)
    for (const item of items) {
      expect(item.querySelector('link')?.textContent).toMatch(/^https:\/\/rlemaitre\.com\/fr\/articles\//)
    }
  })

  it('sets channel title and language per feed', () => {
    const en = xml('index.xml')
    const fr = xml('fr/index.xml')
    expect(en.querySelector('channel > title')?.textContent).toBe('Raphaël Lemaitre — Writing')
    expect(en.querySelector('channel > language')?.textContent).toBe('en')
    expect(fr.querySelector('channel > title')?.textContent).toBe('Raphaël Lemaitre — Articles')
    expect(fr.querySelector('channel > link')?.textContent).toBe('https://rlemaitre.com/fr/')
    expect(fr.querySelector('channel > language')?.textContent).toBe('fr')
  })

  it('points the RSS alternate link at the feed of the page language', () => {
    const href = (path: string): string | null | undefined =>
      parseHTML(read(path))
        .document.querySelector('link[rel="alternate"][type="application/rss+xml"]')
        ?.getAttribute('href')
    expect(href('index.html')).toBe('/index.xml')
    expect(href('fr/index.html')).toBe('/fr/index.xml')
    expect(href('fr/articles/til/default-heap-configuration-in-openjdk/index.html')).toBe('/fr/index.xml')
  })
})

describe('sitemap', () => {
  it('has an index pointing to a child sitemap with the real pages', () => {
    expect(existsSync('dist/sitemap-index.xml')).toBe(true)
    const child = read('sitemap-0.xml')
    expect(child).toContain('https://rlemaitre.com/resume/')
    expect(child).toContain('https://rlemaitre.com/fr/articles/til/default-heap-configuration-in-openjdk/')
    expect(child).toContain('hreflang="fr"')
  })

  it('excludes the 404 page', () => {
    expect(read('sitemap-0.xml')).not.toContain('/404')
  })

  it('uses the same absolute URL in the feed, the sitemap and the canonical tag', () => {
    const path = 'articles/scala/scala_xdg/'
    const url = `https://rlemaitre.com/${path}`
    const links = feedItems('index.xml').map((i) => i.querySelector('link')?.textContent)
    const canonical = parseHTML(read(`${path}index.html`)).document.querySelector('link[rel="canonical"]')
    expect(links).toContain(url)
    expect(read('sitemap-0.xml')).toContain(`<loc>${url}</loc>`)
    expect(canonical?.getAttribute('href')).toBe(url)
  })
})
