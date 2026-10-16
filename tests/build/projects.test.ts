import { existsSync, readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const load = (path: string): Document => parseHTML(readFileSync(`dist/${path}/index.html`, 'utf8')).document

describe('projects', () => {
  it('lists four projects in order', () => {
    const rows = [...load('projects').querySelectorAll('.rows a.row')]
    expect(rows.map((a) => a.getAttribute('href'))).toEqual([
      '/projects/pillars',
      '/projects/mason',
      '/projects/riskmatrix',
      '/projects/funktionalio',
    ])
  })

  it('keeps the date column on rows that have a date', () => {
    const row = load('articles').querySelector('.rows a.row, a.row')
    expect(row?.classList.contains('no-date')).toBe(false)
    expect(row?.querySelector('.date time')).not.toBeNull()
  })

  it('builds the Pillars page with links to its repo and docs', () => {
    expect(existsSync('dist/projects/pillars/index.html')).toBe(true)
    const doc = load('projects/pillars')
    const hrefs = [...doc.querySelectorAll('.links a')].map((a) => a.getAttribute('href'))
    expect(hrefs).toContain('https://github.com/FunktionalIO/pillars')
    expect(hrefs).toContain('https://pillars.dev/')
  })

  it('builds every project page', () => {
    for (const slug of ['pillars', 'mason', 'riskmatrix', 'funktionalio']) {
      expect(existsSync(`dist/projects/${slug}/index.html`)).toBe(true)
    }
  })
})
