import { readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const load = (path: string): Document => parseHTML(readFileSync(`dist/${path}index.html`, 'utf8')).document
const text = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()

describe('resume print pages, the source of the PDFs', () => {
  for (const [path, lang, heading] of [
    ['resume/print/', 'en', 'Experience'],
    ['fr/resume/print/', 'fr', 'Expérience'],
  ] as const) {
    const doc = load(path)

    it(`${path} is a standalone ${lang} page kept out of search engines`, () => {
      expect(doc.documentElement.getAttribute('lang')).toBe(lang)
      expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex')
      expect(doc.querySelector('link[rel="stylesheet"]')).toBeNull()
      expect(doc.querySelector('nav')).toBeNull()
    })

    it(`${path} has the same roles as the web resume`, () => {
      const web = load(path.replace('print/', ''))
      expect(doc.querySelectorAll('.sec .entry:not(.short)')).toHaveLength(web.querySelectorAll('.jobs > .job').length)
      expect(text(doc.querySelector('.sec h2'))).toContain(heading)
      expect(doc.querySelectorAll('.sec .stack')).toHaveLength(web.querySelectorAll('.jobs .stack').length)
      expect(doc.querySelectorAll('.sec .acquired')).toHaveLength(4)
      expect(doc.querySelectorAll('.org a')).toHaveLength(web.querySelectorAll('.jobs .company a').length)
    })
  }

  it('leaves the print pages out of the sitemap', () => {
    const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8')
    expect(sitemap).not.toMatch(/resume\/print/)
  })
})
