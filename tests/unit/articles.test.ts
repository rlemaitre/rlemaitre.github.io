import { describe, expect, it } from 'vitest'
import { articleCategory, publishedNewestFirst } from '../../src/lib/articles'

const entry = (id: string, published: string, draft = false) => ({
  id,
  data: { published: new Date(published), draft },
})

describe('publishedNewestFirst', () => {
  it('drops drafts and sorts by publication date, newest first', () => {
    const entries = [
      entry('en/a/old', '2021-01-01'),
      entry('en/a/draft', '2026-01-01', true),
      entry('en/a/new', '2025-01-01'),
    ]
    expect(publishedNewestFirst(entries).map((e) => e.id)).toEqual(['en/a/new', 'en/a/old'])
  })

  it('does not mutate its input', () => {
    const entries = [entry('en/a/old', '2021-01-01'), entry('en/a/new', '2025-01-01')]
    publishedNewestFirst(entries)
    expect(entries.map((e) => e.id)).toEqual(['en/a/old', 'en/a/new'])
  })
})

describe('articleCategory', () => {
  it('is the folder after the language', () => {
    expect(articleCategory('en/scala/scala_xdg')).toBe('scala')
    expect(articleCategory('fr/til/default-heap-configuration-in-openjdk')).toBe('til')
  })
})
