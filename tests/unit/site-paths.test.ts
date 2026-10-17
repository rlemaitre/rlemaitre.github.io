import { describe, expect, it } from 'vitest'
import { siteContent } from '../../src/lib/site-paths'

describe('siteContent', () => {
  const { newPaths } = siteContent()

  it('lists the English talk and project pages', () => {
    expect(newPaths).toContain('/talks')
    expect(newPaths).toContain('/talks/armored-type-safety-with-iron')
    expect(newPaths).toContain('/projects/pillars')
  })

  it('lists the French talk and project pages', () => {
    expect(newPaths).toContain('/fr/talks')
    expect(newPaths).toContain('/fr/talks/armored-type-safety-with-iron')
    expect(newPaths).toContain('/fr/projects')
    expect(newPaths).toContain('/fr/projects/pillars')
  })

  it('does not treat translation files as pages of their own', () => {
    expect([...newPaths].some((path) => /^\/(?:fr\/)?(?:talks|projects)\/fr(?:\/|$)/.test(path))).toBe(false)
  })
})
