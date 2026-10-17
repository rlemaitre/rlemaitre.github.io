import { existsSync, readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { beforeAll, describe, expect, it } from 'vitest'

const SOCIAL_URLS = [
  'https://github.com/rlemaitre',
  'https://bsky.app/profile/rlemaitre.com',
  'https://www.linkedin.com/in/rlemaitre',
  'https://social.treehouse.systems/@rlemaitre',
]

let document: Document

beforeAll(() => {
  document = parseHTML(readFileSync('dist/index.html', 'utf8')).document
})

describe('head of the home page', () => {
  it('declares the webmention and pingback endpoints', () => {
    expect(
      document.querySelector('link[rel="webmention"][href="https://webmention.io/rlemaitre.com/webmention"]'),
    ).not.toBeNull()
    expect(
      document.querySelector('link[rel="pingback"][href="https://webmention.io/rlemaitre.com/xmlrpc"]'),
    ).not.toBeNull()
  })

  it('has one rel=me link per social profile, GitHub with authn', () => {
    const meLinks = [...document.querySelectorAll('a[rel~="me"]')]
    expect(meLinks.map((a) => a.getAttribute('href')).sort()).toEqual([...SOCIAL_URLS].sort())
    const github = meLinks.find((a) => a.getAttribute('href') === 'https://github.com/rlemaitre')
    expect(github?.getAttribute('rel')).toBe('me authn')
  })

  it('loads Tinylytics with custom kudos markup (count only), deferred', () => {
    const script = document.querySelector(
      'script[src="https://tinylytics.app/embed/UKo7ysT1y9ouVGcZtHMp.js?kudos=custom"]',
    )
    expect(script).not.toBeNull()
    expect(script?.hasAttribute('defer')).toBe(true)
  })

  it('has Open Graph, canonical and RSS alternate tags', () => {
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBeTruthy()
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe('https://rlemaitre.com/')
    const rss = document.querySelector('link[rel="alternate"][type="application/rss+xml"]')
    expect(rss?.getAttribute('href')).toMatch(/\/index\.xml$/)
  })
})

describe('favicon set', () => {
  it('links the ico, the svg and the apple touch icon', () => {
    const icons = [...document.querySelectorAll('link[rel="icon"]')].map((l) => l.getAttribute('href'))
    expect(icons).toEqual(['/favicon.ico', '/favicon.svg'])
    expect(document.querySelector('link[rel="icon"][href="/favicon.svg"][type="image/svg+xml"]')).not.toBeNull()
    expect(document.querySelector('link[rel="icon"][href="/favicon.ico"][sizes="48x48"]')).not.toBeNull()
    expect(document.querySelector('link[rel="apple-touch-icon"][href="/apple-touch-icon.png"]')).not.toBeNull()
  })

  it('ships the icon files', () => {
    for (const f of ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png']) {
      expect(existsSync(`dist/${f}`), f).toBe(true)
    }
  })

  it('has a 180x180 apple touch icon', () => {
    const png = readFileSync('dist/apple-touch-icon.png')
    expect(png.readUInt32BE(16)).toBe(180)
    expect(png.readUInt32BE(20)).toBe(180)
  })

  it('has an ico declaring 3 images', () => {
    const ico = readFileSync('dist/favicon.ico')
    expect(ico.readUInt16LE(0)).toBe(0)
    expect(ico.readUInt16LE(2)).toBe(1)
    expect(ico.readUInt16LE(4)).toBe(3)
  })
})
