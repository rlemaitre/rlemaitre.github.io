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
