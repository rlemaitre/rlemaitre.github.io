import { describe, expect, it } from 'vitest'
import { formatDate, formatYearMonth } from '../../src/lib/dates'

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
