import { existsSync, readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const IRON = 'talks/armored-type-safety-with-iron'
const ADHD_TALK = '/talks/hacking-adhd-strategies-for-the-modern-developer'

const load = (path: string): Document =>
  parseHTML(readFileSync(`dist/${path}/index.html`, 'utf8')).document

describe('talk pages', () => {
  it('lists the Iron venues with a video facade each and no iframe', () => {
    expect(existsSync(`dist/${IRON}/index.html`)).toBe(true)
    const doc = load(IRON)
    expect(doc.querySelectorAll('.venues > li')).toHaveLength(5)
    expect(doc.querySelectorAll('button[data-video]')).toHaveLength(5)
    expect(doc.querySelectorAll('iframe')).toHaveLength(0)
    expect(readFileSync(`dist/${IRON}/index.html`, 'utf8')).not.toMatch(/img\.youtube\.com|i\.ytimg\.com/)
  })

  it('names each video button after the talk and the venue', () => {
    const label = load(IRON).querySelector('button[data-video]')?.getAttribute('aria-label')
    expect(label).toMatch(/Armored Type Safety With Iron/)
    expect(label).toMatch(/Scala Matters/)
  })

  it('builds all four talks', () => {
    for (const slug of [
      'fearless-coding-scala-3-and-iron',
      'from-zero-to-production-faster-than-your-average-meeting-with-pillars',
      'hacking-adhd-strategies-for-the-modern-developer',
    ]) {
      expect(existsSync(`dist/talks/${slug}/index.html`)).toBe(true)
    }
  })

  it('keeps the French session title on the fearless-coding venue', () => {
    const html = readFileSync('dist/talks/fearless-coding-scala-3-and-iron/index.html', 'utf8')
    expect(html).toContain('Codez sans craintes avec Scala 3 et Iron')
  })
})

describe('talks index', () => {
  const doc = load('talks')

  it('has one row per talk, with the Iron row showing x5', () => {
    const rows = [...doc.querySelectorAll('a.row')]
    expect(rows).toHaveLength(4)
    const iron = rows.find((r) => r.getAttribute('href') === `/${IRON}/` || r.getAttribute('href') === `/${IRON}`)
    expect(iron?.textContent).toContain('×5')
  })

  it('states the totals', () => {
    expect(doc.body.textContent).toMatch(/11 venues/)
    expect(doc.body.textContent).toMatch(/3 countries/)
  })
})

describe('articles linked to a talk', () => {
  it('shows the linked talk on the English ADHD article', () => {
    const doc = load('articles/adhd/hacking-adhd-strategies-for-the-modern-developer')
    const link = [...doc.querySelectorAll('dl a')].find((a) => a.getAttribute('href')?.startsWith(ADHD_TALK))
    expect(link).toBeDefined()
  })

  it('shows the linked talk on the French ADHD article', () => {
    const doc = load('fr/articles/adhd/hacking-adhd-strategies-for-the-modern-developer')
    expect([...doc.querySelectorAll('dl a')].some((a) => a.getAttribute('href')?.startsWith(ADHD_TALK))).toBe(true)
  })

  it('drops the date column from the talks index', () => {
    const rows = load('talks').querySelectorAll('.rows a.row')
    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) {
      expect(row.classList.contains('no-date')).toBe(true)
      expect(row.querySelector('.date')).toBeNull()
    }
  })
})
