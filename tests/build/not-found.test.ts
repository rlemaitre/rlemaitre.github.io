import { readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const doc = parseHTML(readFileSync('dist/404.html', 'utf8')).document

describe('404 page', () => {
  it('is noindex and has no canonical', () => {
    expect(doc.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex')
    expect(doc.querySelector('link[rel="canonical"]')).toBeNull()
  })

  it('uses the shared copy and does not mention notes', () => {
    const text = doc.querySelector('main')?.textContent ?? ''
    expect(text).toContain('This page does not exist, or it moved when I rebuilt the site.')
    expect(text).not.toMatch(/notes/i)
  })
})
