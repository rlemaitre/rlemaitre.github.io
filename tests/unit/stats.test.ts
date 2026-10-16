import { describe, expect, it } from 'vitest'
import { homeStats } from '../../src/lib/stats'
import type { Venue } from '../../src/lib/talks'

const venue = (date: string, over: Partial<Venue> = {}): Venue => ({
  date: new Date(date),
  conference: 'Conf',
  url: 'https://example.com',
  online: false,
  ...over,
})

const talks = [
  { venues: ['2023-11-23', '2024-02-15', '2024-03-22', '2024-06-08', '2024-12-05'].map((d) => venue(d)) },
  { venues: [venue('2024-07-04')] },
  { venues: ['2024-12-06', '2025-03-28', '2025-10-17'].map((d) => venue(d)) },
  { venues: ['2024-04-17', '2024-07-04'].map((d) => venue(d)) },
]

describe('homeStats', () => {
  it('computes years shipping, talks given and OSS projects', () => {
    expect(homeStats({ talks, projectCount: 4, now: new Date('2026-10-16') })).toEqual({
      years: 26,
      talks: 11,
      oss: 4,
    })
  })

  it('counts years from the UTC year of now', () => {
    expect(homeStats({ talks: [], projectCount: 0, now: new Date('2030-01-01T00:00:00Z') }).years).toBe(30)
  })
})
