import { existsSync, readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const ADHD = 'articles/adhd/hacking-adhd-strategies-for-the-modern-developer'
const XDG = 'articles/scala/scala_xdg'
const FR_HEAP = 'fr/articles/til/default-heap-configuration-in-openjdk'
const ARTICLE_PAGES = [
  ADHD,
  XDG,
  'articles/til/default-heap-configuration-in-openjdk',
  'articles/til/trigger-a-ci-pipeline-from-command-line',
  `fr/${ADHD}`,
  FR_HEAP,
  'fr/articles/til/trigger-a-ci-pipeline-from-command-line',
]

const load = (path: string): Document =>
  parseHTML(readFileSync(`dist/${path}/index.html`, 'utf8')).document

describe('article pages', () => {
  it('serves a resized JPEG as the social image of an article with a cover', () => {
    const og = load(ADHD).querySelector('meta[property="og:image"]')?.getAttribute('content') ?? ''
    expect(og).toMatch(/^https:\/\/rlemaitre\.com\/_astro\/.+\.jpe?g$/)
  })

  it.each([XDG, ADHD, FR_HEAP])('builds %s', (path) => {
    expect(existsSync(`dist/${path}/index.html`)).toBe(true)
  })

  it('links the EN / FR cell to the translation when one exists', () => {
    const href = load(ADHD).querySelector('nav .lang a')?.getAttribute('href')
    expect(href).toBe(`/fr/${ADHD}/`)
  })

  it('links the EN / FR cell to the French home when there is no translation', () => {
    expect(load(XDG).querySelector('nav .lang a')?.getAttribute('href')).toBe('/fr/')
  })

  it('marks the article up as an h-entry', () => {
    const doc = load(ADHD)
    const entry = doc.querySelector('article.h-entry')
    expect(entry).not.toBeNull()
    expect(entry?.querySelector('.p-name')?.textContent).toMatch(/Hacking ADHD/)
    expect(entry?.querySelector('time.dt-published[datetime^="2023-11-14"]')).not.toBeNull()
    expect(entry?.querySelector('.e-content')?.textContent).toMatch(/diagnosed/)
  })

  it('shows each tag of the article as a p-category in the header', () => {
    const header = load(ADHD).querySelector('article.h-entry header')
    const tags = [...(header?.querySelectorAll('.p-category') ?? [])].map((el) => el.textContent?.trim())
    expect(tags).toEqual(['/// adhd', '/// mental-health', '/// productivity'])
    expect(header?.textContent).toContain('Tags')
  })

  it('uses the French label for the tags on the French article', () => {
    const header = load(`fr/${ADHD}`).querySelector('article.h-entry header')
    expect(header?.querySelectorAll('.p-category').length).toBe(3)
    expect(header?.textContent).toContain('Tags')
  })

  it('shows where the article was first published', () => {
    expect(load(ADHD).querySelector('.e-content')?.textContent).toContain('Ledger blog')
  })

  it('renders the cover image with its alt text', () => {
    const img = load(ADHD).querySelector('article img[alt^="Illustration of a hooded figure"]')
    expect(img).not.toBeNull()
  })

  it('sets the document language', () => {
    expect(load(ADHD).documentElement.getAttribute('lang')).toBe('en')
    expect(load(`fr/${ADHD}`).documentElement.getAttribute('lang')).toBe('fr')
    expect(load(FR_HEAP).documentElement.getAttribute('lang')).toBe('fr')
  })

  it('highlights Scala with light and dark colors', () => {
    const block = load(XDG).querySelector('pre[data-language="scala"]')
    const styles = [...(block?.querySelectorAll('span[style]') ?? [])].map((s) => s.getAttribute('style') ?? '')
    expect(styles.some((s) => s.includes('--shiki-light') && s.includes('--shiki-dark'))).toBe(true)
    expect(styles.some((s) => /--shiki-light:#1F5FA8/i.test(s))).toBe(true)
  })

  it.each(ARTICLE_PAGES)('%s has a kudos button', (path) => {
    const kudos = load(path).querySelector('button.tinylytics_kudos')
    expect(kudos).not.toBeNull()
    // Hidden until the Tinylytics script loads, so blocked visitors never see a dead button.
    expect(kudos?.hasAttribute('hidden')).toBe(true)
  })

  it('lists the headings in the table of contents', () => {
    const doc = load(ADHD)
    const tocTargets = [...doc.querySelectorAll('nav.toc a')].map((a) => a.getAttribute('href'))
    const h2Ids = [...doc.querySelectorAll('.e-content h2')].map((h) => `#${h.id}`)
    expect(tocTargets).toEqual(h2Ids)
    expect(tocTargets.length).toBeGreaterThan(3)
  })
})

describe('writing index', () => {
  const rowsOf = (path: string) =>
    [...load(path).querySelectorAll('main ul.rows a')].map((a) => ({
      href: a.getAttribute('href'),
      date: a.querySelector('time')?.getAttribute('datetime') ?? '',
    }))

  it('lists the 4 English articles, newest first', () => {
    const rows = rowsOf('articles')
    expect(rows).toHaveLength(4)
    expect(rows[0]?.href).toBe(`/${XDG}/`)
    const dates = rows.map((r) => r.date)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it('lists the 3 French articles', () => {
    const rows = rowsOf('fr/articles')
    expect(rows).toHaveLength(3)
    expect(rows.every((r) => r.href?.startsWith('/fr/articles/'))).toBe(true)
  })
})
