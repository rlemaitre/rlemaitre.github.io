import { describe, expect, it } from 'vitest'
import { altLangUrl, articleLang, articleSlug, articleUrl, homeUrl, t, ui } from '../../src/lib/i18n'

describe('article ids', () => {
  it('derives the language', () => {
    expect(articleLang('en/scala/scala_xdg')).toBe('en')
    expect(articleLang('fr/til/x')).toBe('fr')
  })
  it('strips the language segment', () => {
    expect(articleSlug('fr/til/x')).toBe('til/x')
  })
  it('builds urls without trailing slash', () => {
    expect(articleUrl('en/scala/scala_xdg')).toBe('/articles/scala/scala_xdg/')
    expect(articleUrl('fr/til/x')).toBe('/fr/articles/til/x/')
  })
  it('builds home urls', () => {
    expect(homeUrl('en')).toBe('/')
    expect(homeUrl('fr')).toBe('/fr/')
  })
})

describe('altLangUrl', () => {
  const both = ['en/til/x', 'fr/til/x']
  it('links to the translation when it exists', () => {
    expect(altLangUrl('en/til/x', both)).toBe('/fr/articles/til/x/')
    expect(altLangUrl('fr/til/x', both)).toBe('/articles/til/x/')
  })
  it('falls back to the other language home', () => {
    expect(altLangUrl('en/scala/scala_xdg', ['en/scala/scala_xdg'])).toBe('/fr/')
    expect(altLangUrl('fr/til/y', ['fr/til/y'])).toBe('/')
  })
})

describe('ui strings', () => {
  it('has the same keys in both languages', () => {
    expect(Object.keys(ui.fr).sort()).toEqual(Object.keys(ui.en).sort())
  })
  it('translates', () => {
    expect(t('en', 'writing')).toBe('Writing')
    expect(t('fr', 'writing')).toBe('Articles')
  })
})
