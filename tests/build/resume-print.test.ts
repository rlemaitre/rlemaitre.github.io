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
      expect([...doc.querySelectorAll('.when')].slice(0, 2).map(text)).toEqual(
        [...web.querySelectorAll('.jobs .when')].slice(0, 2).map(text),
      )
      expect(doc.querySelectorAll('.project a')).toHaveLength(4)
    })

    it(`${path} lists the talks in the web order, each linked to its page on the site`, () => {
      const web = load(path.replace('print/', ''))
      const pdf = [...doc.querySelectorAll('.talk .title a')].map((a) => [text(a), a.getAttribute('href')])
      const site = [...web.querySelectorAll('.talk a')].map((a) => [
        text(a),
        `https://rlemaitre.com${a.getAttribute('href')}`,
      ])
      expect(pdf).toEqual(site)
    })
  }

  it('leaves the print pages out of the sitemap', () => {
    const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8')
    expect(sitemap).not.toMatch(/resume\/print/)
  })
})
