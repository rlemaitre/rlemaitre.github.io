import { readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const load = (path: string): Document => parseHTML(readFileSync(`dist/${path}index.html`, 'utf8')).document
const text = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
const dates = (doc: Document): string[] => [...doc.querySelectorAll('.jobs .when')].map(text)
const langSwitch = (doc: Document): string | null | undefined =>
  doc.querySelector('nav.bar .lang a')?.getAttribute('href')
const navHref = (doc: Document, label: string): string | null | undefined =>
  [...doc.querySelectorAll('nav.bar a.cell')].find((a) => text(a) === label)?.getAttribute('href')

describe('French resume page', () => {
  const en = load('resume/')
  const fr = load('fr/resume/')

  it('is in French', () => {
    expect(fr.documentElement.getAttribute('lang')).toBe('fr')
    const headings = [...fr.querySelectorAll('.sec > h2')].map(text).join(' ')
    for (const heading of ['Expérience', 'Compétences', 'Talks', 'Formation', 'Certifications']) {
      expect(headings).toContain(heading)
    }
  })

  it('has the same roles and dates as the English resume', () => {
    expect(dates(fr).map((d) => d.replace('aujourd’hui', 'now'))).toEqual(dates(en))
  })

  it('marks the current role with aujourd’hui', () => {
    expect(text(fr.querySelector('.jobs .now'))).toBe('aujourd’hui')
  })

  it('links each language to the other resume', () => {
    expect(langSwitch(en)).toBe('/fr/resume/')
    expect(langSwitch(fr)).toBe('/resume/')
  })

  it('points the French nav CV link to the French resume', () => {
    expect(navHref(fr, 'CV')).toBe('/fr/resume/')
    expect(navHref(load('fr/'), 'CV')).toBe('/fr/resume/')
    expect(navHref(en, 'Resume')).toBe('/resume/')
  })

  it('links talks to their French pages', () => {
    const links = [...fr.querySelectorAll('.talk a')].map((a) => a.getAttribute('href'))
    expect(links).toHaveLength(4)
    for (const href of links) expect(href).toMatch(/^\/fr\/talks\//)
  })

  it('has a French Save PDF button', () => {
    const button = [...fr.querySelectorAll('button')].find((b) => /enregistrer en pdf/i.test(text(b)))
    expect(button).toBeDefined()
  })

  it('has no email or phone link', () => {
    expect(readFileSync('dist/fr/resume/index.html', 'utf8')).not.toMatch(/mailto:|tel:/i)
  })
})
