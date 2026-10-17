import { existsSync, readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const TALKS = [
  'armored-type-safety-with-iron',
  'fearless-coding-scala-3-and-iron',
  'from-zero-to-production-faster-than-your-average-meeting-with-pillars',
  'hacking-adhd-strategies-for-the-modern-developer',
]
const PROJECTS = ['pillars', 'mason', 'riskmatrix', 'funktionalio']
const IRON = 'armored-type-safety-with-iron'
const ADHD_FR_TITLE = 'Hacker le TDAH : Stratégies pour le développeur moderne'
const ADHD = 'hacking-adhd-strategies-for-the-modern-developer'

const file = (path: string): string => `dist/${path}index.html`
const load = (path: string): Document => parseHTML(readFileSync(file(path), 'utf8')).document
const text = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
const langSwitch = (doc: Document): string | null | undefined =>
  doc.querySelector('nav.bar .lang a')?.getAttribute('href')
const navHref = (doc: Document, label: string): string | null | undefined =>
  [...doc.querySelectorAll('nav.bar a.cell')].find((a) => text(a) === label)?.getAttribute('href')

describe('French talk pages', () => {
  it('builds every talk and the index under /fr/talks/', () => {
    for (const path of ['fr/talks/', ...TALKS.map((slug) => `fr/talks/${slug}/`)]) {
      expect(existsSync(file(path)), path).toBe(true)
      expect(load(path).documentElement.getAttribute('lang'), path).toBe('fr')
    }
  })

  it('uses French labels on the Iron page', () => {
    const doc = load(`fr/talks/${IRON}/`)
    expect(text(doc.querySelector('.kicker'))).toBe('/// Talk — donné en anglais')
    expect(text(doc.querySelector('#abstract'))).toBe('Résumé')
    expect(text(doc.querySelector('#venues'))).toBe('Interventions (5)')
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Donné 5 fois entre 2023 et 2024.')
    const places = [...doc.querySelectorAll('.venues .when')].map(text)
    expect(places.some((p) => p.endsWith('Warsaw, Pologne'))).toBe(true)
    expect(places.some((p) => p.endsWith('Tokyo, Japon'))).toBe(true)
    expect(places.some((p) => p.endsWith('En ligne'))).toBe(true)
    expect(doc.querySelector('button[data-video]')?.getAttribute('aria-label')).toBe(
      'Lire la vidéo : Armored Type Safety With Iron, Scala Matters',
    )
  })

  it('shows the French abstract, not the English one', () => {
    const prose = text(load(`fr/talks/${IRON}/`).querySelector('.prose'))
    expect(prose).toMatch(/\bIron\b/)
    expect(prose).toMatch(/\b(?:les|des|une|nous)\b/)
    expect(prose).not.toContain('When designing an application')
  })

  it('says a French talk is given in French, in both languages', () => {
    expect(text(load(`fr/talks/${ADHD}/`).querySelector('.kicker'))).toBe('/// Talk — donné en français')
    expect(text(load(`talks/${ADHD}/`).querySelector('.kicker'))).toBe('/// Talk — given in French')
  })

  it('keeps the talk title and the French session title of fearless-coding', () => {
    const doc = load('fr/talks/fearless-coding-scala-3-and-iron/')
    expect(text(doc.querySelector('h1'))).toMatch(/^Fearless Coding/)
    expect(text(doc.querySelector('.venues .session'))).toBe('Codez sans craintes avec Scala 3 et Iron')
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('Donné une fois, en 2024.')
  })

  it('shows Raph\'s original French title and abstract on the French ADHD page, the English title on the English one', () => {
    const fr = load(`fr/talks/${ADHD}/`)
    expect(text(fr.querySelector('h1'))).toBe(ADHD_FR_TITLE)
    expect(fr.querySelector('h1')?.getAttribute('lang')).toBeNull()
    expect(text(fr.querySelector('title'))).toContain(ADHD_FR_TITLE)
    expect(fr.querySelector('meta[property="og:title"]')?.getAttribute('content')).toContain(ADHD_FR_TITLE)
    expect(text(fr.querySelector('.prose'))).toContain('un atout inestimable dans le domaine du développement logiciel')
    expect(text(load(`talks/${ADHD}/`).querySelector('h1'))).toBe('Hacking ADHD: Strategies for the Modern Developer')
  })

  it('shows the French session title on the SunnyTech venue of the ADHD talk, in both languages', () => {
    for (const path of [`talks/${ADHD}/`, `fr/talks/${ADHD}/`]) {
      const sessions = [...load(path).querySelectorAll('.venues .session')].map(text)
      expect(sessions, path).toEqual([ADHD_FR_TITLE])
    }
  })

  it('uses the French ADHD title in the French index and the French article\'s linked talk', () => {
    const row = [...load('fr/talks/').querySelectorAll('.rows a.row')].find((a) => a.getAttribute('href') === `/fr/talks/${ADHD}/`)
    expect(text(row?.querySelector('.title'))).toContain(ADHD_FR_TITLE)
    const link = [...load(`fr/articles/adhd/${ADHD}/`).querySelectorAll('dl a')].find((a) => a.getAttribute('href') === `/fr/talks/${ADHD}/`)
    expect(text(link)).toBe(ADHD_FR_TITLE)
  })

  it('links the language switch both ways', () => {
    expect(langSwitch(load(`talks/${IRON}/`))).toBe(`/fr/talks/${IRON}/`)
    expect(langSwitch(load(`fr/talks/${IRON}/`))).toBe(`/talks/${IRON}/`)
    expect(langSwitch(load('talks/'))).toBe('/fr/talks/')
    expect(langSwitch(load('fr/talks/'))).toBe('/talks/')
  })

  it('lists the French talk pages on the French index, with French totals', () => {
    const doc = load('fr/talks/')
    const hrefs = [...doc.querySelectorAll('.rows a.row')].map((a) => a.getAttribute('href'))
    expect(hrefs).toHaveLength(4)
    for (const href of hrefs) expect(href).toMatch(/^\/fr\/talks\/[^/]+\/$/)
    expect(text(doc.querySelector('.intro'))).toContain('11 interventions / 3 pays')
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe('11 interventions dans 3 pays.')
    expect(text(doc.body)).toContain('En ligne')
  })
})

describe('French project pages', () => {
  it('builds every project and the index under /fr/projects/', () => {
    for (const path of ['fr/projects/', ...PROJECTS.map((slug) => `fr/projects/${slug}/`)]) {
      expect(existsSync(file(path)), path).toBe(true)
      expect(load(path).documentElement.getAttribute('lang'), path).toBe('fr')
    }
  })

  it('shows the French summary, body and labels on the Pillars page', () => {
    const doc = load('fr/projects/pillars/')
    expect(text(doc.querySelector('.kicker'))).toMatch(/^\/\/\/ Projet — /)
    const lede = text(doc.querySelector('.lede'))
    expect(lede).toContain('Scala 3')
    expect(lede).not.toContain('A Scala 3 library')
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(lede)
    expect(text(doc.querySelector('.prose'))).not.toContain('With Pillars, you define routes')
    const links = [...doc.querySelectorAll('.links a')]
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['https://github.com/FunktionalIO/pillars', 'https://pillars.dev/'])
    expect(links.map((a) => text(a.querySelector('span')))).toEqual(['GitHub', 'Doc'])
  })

  it('links the language switch both ways', () => {
    expect(langSwitch(load('projects/pillars/'))).toBe('/fr/projects/pillars/')
    expect(langSwitch(load('fr/projects/pillars/'))).toBe('/projects/pillars/')
    expect(langSwitch(load('projects/'))).toBe('/fr/projects/')
    expect(langSwitch(load('fr/projects/'))).toBe('/projects/')
  })

  it('lists the French project pages in order on the French index', () => {
    const doc = load('fr/projects/')
    expect([...doc.querySelectorAll('.rows a.row')].map((a) => a.getAttribute('href'))).toEqual(
      PROJECTS.map((slug) => `/fr/projects/${slug}/`),
    )
    expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toMatch(/^Projets open source/)
  })
})

describe('French navigation', () => {
  it('sends the Talks and Projects cells of French pages to the French indexes, the resume to English', () => {
    for (const path of ['fr/', 'fr/articles/', `fr/talks/${IRON}/`, 'fr/projects/pillars/']) {
      const doc = load(path)
      expect(navHref(doc, 'Talks'), path).toBe('/fr/talks/')
      expect(navHref(doc, 'Projets'), path).toBe('/fr/projects/')
      expect(navHref(doc, 'CV'), path).toBe('/resume/')
    }
  })

  it('keeps English pages on English indexes', () => {
    const doc = load(`talks/${IRON}/`)
    expect(navHref(doc, 'Talks')).toBe('/talks/')
    expect(navHref(doc, 'Projects')).toBe('/projects/')
  })

  it('links the French ADHD article to the French talk page', () => {
    const doc = load(`fr/articles/adhd/${ADHD}/`)
    expect([...doc.querySelectorAll('dl a')].map((a) => a.getAttribute('href'))).toContain(`/fr/talks/${ADHD}/`)
  })

  it('links Pillars from the French home intro to the French project page', () => {
    const hrefs = [...load('fr/').querySelectorAll('.lede a')].map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('/fr/projects/pillars/')
  })
})

describe('sitemap pairs French talks and projects with English ones', () => {
  const urls = readFileSync('dist/sitemap-0.xml', 'utf8').split('<url>').slice(1)
  const entry = (path: string): string | undefined => urls.find((u) => u.includes(`<loc>https://rlemaitre.com${path}</loc>`))

  for (const [en, fr] of [
    ['/talks/', '/fr/talks/'],
    ['/projects/pillars/', '/fr/projects/pillars/'],
    [`/talks/${IRON}/`, `/fr/talks/${IRON}/`],
  ]) {
    it(`pairs ${fr} with ${en}`, () => {
      for (const path of [en, fr]) {
        const url = entry(path)
        expect(url, `${path} missing from the sitemap`).toBeDefined()
        expect(url).toContain(`hreflang="en" href="https://rlemaitre.com${en}"`)
        expect(url).toContain(`hreflang="fr" href="https://rlemaitre.com${fr}"`)
      }
    })
  }
})
