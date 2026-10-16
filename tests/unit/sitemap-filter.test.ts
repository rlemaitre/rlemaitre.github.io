import { describe, expect, it } from 'vitest'
import { makeSitemapFilter } from '../../src/lib/sitemap-filter'

const keep = makeSitemapFilter({ '/old': '/resume/', '/legacy/page/': { destination: '/talks/', status: 301 } })
const url = (path: string): string => `https://rlemaitre.com${path}`

describe('makeSitemapFilter', () => {
  it('excludes a redirect source with and without trailing slash', () => {
    expect(keep(url('/old'))).toBe(false)
    expect(keep(url('/old/'))).toBe(false)
    expect(keep(url('/legacy/page'))).toBe(false)
    expect(keep(url('/legacy/page/'))).toBe(false)
  })

  it('excludes a redirect key with accents and spaces when the sitemap URL is percent-encoded', () => {
    const keepAccented = makeSitemapFilter({ '/resume/Experiences/Équipe @ Café (1)': '/resume/' })
    expect(keepAccented(url('/resume/Experiences/%C3%89quipe%20@%20Caf%C3%A9%20(1)/'))).toBe(false)
    expect(keepAccented(url('/resume/Experiences/Caf%C3%A9/'))).toBe(true)
  })

  it('excludes the 404 page', () => {
    expect(keep(url('/404'))).toBe(false)
    expect(keep(url('/404/'))).toBe(false)
  })

  it('keeps normal pages, including a redirect destination and the home', () => {
    expect(keep(url('/'))).toBe(true)
    expect(keep(url('/resume/'))).toBe(true)
    expect(keep(url('/old-but-not-a-redirect/'))).toBe(true)
  })
})
