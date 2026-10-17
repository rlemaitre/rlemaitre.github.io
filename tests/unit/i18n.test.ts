import { describe, expect, it } from 'vitest'
import {
  altLangUrl,
  articleLang,
  articleSlug,
  articleUrl,
  homeUrl,
  projectUrl,
  projectsUrl,
  t,
  talkUrl,
  talksUrl,
  ui,
} from '../../src/lib/i18n'

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

describe('ui labels', () => {
  it('translates the footer labels', () => {
    expect([t('fr', 'dark'), t('fr', 'profiles')]).toEqual(['Sombre', 'Profils'])
    expect([t('en', 'dark'), t('en', 'profiles')]).toEqual(['Dark', 'Profiles'])
  })
  it('does not mention notes in the writing intro', () => {
    expect(t('en', 'writingIntro')).not.toMatch(/note/i)
    expect(t('fr', 'writingIntro')).not.toMatch(/note/i)
  })
})

describe('talk and project urls', () => {
  it('builds English urls by default', () => {
    expect(talkUrl('x')).toBe('/talks/x/')
    expect(projectUrl('pillars')).toBe('/projects/pillars/')
    expect(talksUrl('en')).toBe('/talks/')
    expect(projectsUrl('en')).toBe('/projects/')
  })
  it('builds French urls under /fr/', () => {
    expect(talkUrl('x', 'fr')).toBe('/fr/talks/x/')
    expect(projectUrl('pillars', 'fr')).toBe('/fr/projects/pillars/')
    expect(talksUrl('fr')).toBe('/fr/talks/')
    expect(projectsUrl('fr')).toBe('/fr/projects/')
  })
})
