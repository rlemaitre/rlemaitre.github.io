import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('build smoke', () => {
  it('renders the home page', () => {
    expect(existsSync('dist/index.html')).toBe(true)
    expect(readFileSync('dist/index.html', 'utf8')).toContain('Raphaël Lemaitre')
  })
})
