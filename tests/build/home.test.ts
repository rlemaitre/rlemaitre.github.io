import { existsSync, readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const load = (path: string): Document => parseHTML(readFileSync(`dist/${path}index.html`, 'utf8')).document
const text = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()

const rowDates = (doc: Document): string[] =>
  [...doc.querySelectorAll('.recent a.row time')].map((time) => time.getAttribute('datetime') ?? '')

describe('English home page', () => {
  const doc = load('')

  it('shows the masthead name', () => {
    expect(text(doc.querySelector('.mast'))).toMatch(/RAPHAËL\s*LEMAITRE/i)
  })

  it('has an h-card with name, url and photo', () => {
    const card = doc.querySelector('.h-card')
    expect(card).not.toBeNull()
    expect(text(card?.querySelector('.p-name'))).toMatch(/Raphaël Lemaitre/i)
    expect(card?.querySelector('.u-url')?.getAttribute('href')).toMatch(/^https:\/\/rlemaitre\.com\/?$/)
    expect(card?.querySelector('img.u-photo')).not.toBeNull()
  })

  it('shows the three stats computed from content', () => {
    const stats = [...doc.querySelectorAll('.stat')].map(text)
    expect(stats).toHaveLength(3)
    // 26 in 2026: years since 2000, computed at build time.
    const value = (i: number): string => text(doc.querySelectorAll('.stat .n')[i])
    expect(value(0)).toBe(String(new Date().getUTCFullYear() - 2000))
    expect(value(1)).toBe('11')
    expect(value(2)).toBe('04')
    expect(stats.map((s) => s.replace(/^\d+\s*/, ''))).toEqual(['Years shipping', 'Talks given', 'OSS projects'])
  })

  it('lists 3 to 5 recent English articles, newest first', () => {
    const rows = [...doc.querySelectorAll('.recent a.row')]
    expect(rows.length).toBeGreaterThanOrEqual(3)
    expect(rows.length).toBeLessThanOrEqual(5)
    for (const row of rows) expect(row.getAttribute('href')).toMatch(/^\/articles\//)
    const dates = rowDates(doc)
    expect(dates).toEqual(dates.toSorted().toReversed())
  })

  it('mentions Nabla and Kotlin in the intro', () => {
    expect(text(doc.querySelector('.lede'))).toContain('Nabla')
    expect(text(doc.querySelector('.lede'))).toContain('Kotlin')
  })

  it('links to social profiles with rel="me"', () => {
    const hrefs = [...doc.querySelectorAll('.socials a.cell[rel~="me"]')].map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('https://github.com/rlemaitre')
    expect(hrefs).toContain('https://social.treehouse.systems/@rlemaitre')
  })

  it('describes the portrait', () => {
    expect(doc.querySelector('.portrait img')?.getAttribute('alt')?.trim()).toBeTruthy()
  })
})

describe('French home page', () => {
  it('exists', () => {
    expect(existsSync('dist/fr/index.html')).toBe(true)
  })

  const doc = existsSync('dist/fr/index.html') ? load('fr/') : parseHTML('<html></html>').document

  it('shows the French footer labels', () => {
    expect(text(doc.querySelector('[data-theme-toggle]'))).toBe('Sombre')
    expect(doc.querySelector('.socials')?.getAttribute('aria-label')).toBe('Profils')
  })

  it('is in French', () => {
    expect(doc.documentElement.getAttribute('lang')).toBe('fr')
    expect(text(doc.querySelector('.lede'))).toMatch(/\bje\b|\bj’|\bj'/i)
    expect(text(doc.querySelector('.lede'))).toContain('Nabla')
    expect(text(doc.querySelector('.lede'))).toContain('Kotlin')
  })

  it('lists French articles only, newest first', () => {
    const rows = [...doc.querySelectorAll('.recent a.row')]
    expect(rows.length).toBeGreaterThanOrEqual(3)
    for (const row of rows) expect(row.getAttribute('href')).toMatch(/^\/fr\/articles\//)
    const dates = rowDates(doc)
    expect(dates).toEqual(dates.toSorted().toReversed())
  })

  it('describes the portrait', () => {
    expect(doc.querySelector('.portrait img')?.getAttribute('alt')?.trim()).toBeTruthy()
  })
})
