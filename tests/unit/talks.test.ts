import { describe, expect, it } from 'vitest'
import { talkDescription, talkTotals, venueSummary, type Venue } from '../../src/lib/talks'

const venue = (date: string, over: Partial<Venue> = {}): Venue => ({
  date: new Date(date),
  conference: 'Conf',
  url: 'https://example.com',
  online: false,
  ...over,
})

const iron: Venue[] = [
  venue('2023-11-23', { city: 'Paris', country: 'France' }),
  venue('2024-02-15', { city: 'Nantes', country: 'France' }),
  venue('2024-03-22', { city: 'Warsaw', country: 'Poland' }),
  venue('2024-06-08', { city: 'Tokyo', country: 'Japan' }),
  venue('2024-12-05', { online: true }),
]
const fearless = [venue('2024-07-04', { city: 'Montpellier', country: 'France' })]
const pillars = [
  venue('2024-12-06', { online: true }),
  venue('2025-03-28', { city: 'Warsaw', country: 'Poland' }),
  venue('2025-10-17', { city: 'Paris', country: 'France' }),
]
const adhd = [
  venue('2024-04-17', { city: 'Paris', country: 'France' }),
  venue('2024-07-04', { city: 'Montpellier', country: 'France' }),
]

describe('venueSummary', () => {
  it('summarises the Iron talk', () => {
    expect(venueSummary(iron)).toEqual({
      count: 5,
      firstYear: 2023,
      lastYear: 2024,
      places: ['Paris', 'Nantes', 'Warsaw', 'Tokyo', 'Online'],
    })
  })

  it('orders places by date and deduplicates them', () => {
    const unsorted = [
      venue('2025-01-01', { city: 'Paris' }),
      venue('2024-01-01', { city: 'Paris' }),
      venue('2024-06-01', { online: true }),
    ]
    expect(venueSummary(unsorted).places).toEqual(['Paris', 'Online'])
  })
})

describe('talkTotals', () => {
  it('counts venues and distinct countries, not online', () => {
    expect(talkTotals([{ venues: iron }, { venues: fearless }, { venues: pillars }, { venues: adhd }])).toEqual({
      venues: 11,
      countries: 3,
    })
  })
})

describe('talkDescription', () => {
  it('says once for a single venue', () => {
    expect(talkDescription({ count: 1, firstYear: 2024, lastYear: 2024, places: [] })).toBe('Given once, in 2024.')
  })

  it('uses a single year when all venues share it', () => {
    expect(talkDescription({ count: 3, firstYear: 2024, lastYear: 2024, places: [] })).toBe('Given 3 times in 2024.')
  })

  it('uses a range otherwise', () => {
    expect(talkDescription({ count: 5, firstYear: 2023, lastYear: 2024, places: [] })).toBe(
      'Given 5 times between 2023 and 2024.',
    )
  })
})
