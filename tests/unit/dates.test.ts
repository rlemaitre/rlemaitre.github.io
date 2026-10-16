import { describe, expect, it } from 'vitest'
import { formatDate, formatYearMonth, parseYearMonth } from '../../src/lib/dates'

describe('formatDate', () => {
  it('formats as YYYY.MM.DD in UTC', () => {
    expect(formatDate(new Date('2025-07-11T22:30:00Z'))).toBe('2025.07.11')
  })
})

describe('formatYearMonth', () => {
  it('formats as YYYY.MM', () => {
    expect(formatYearMonth(new Date('2025-11-03'))).toBe('2025.11')
  })
})

describe('parseYearMonth', () => {
  it('parses YYYY-MM as the first of the month in UTC', () => {
    expect(parseYearMonth('2025-11').toISOString()).toBe('2025-11-01T00:00:00.000Z')
  })
})
