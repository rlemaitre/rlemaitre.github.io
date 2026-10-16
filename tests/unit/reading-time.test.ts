import { describe, expect, it } from 'vitest'
import { readingMinutes } from '../../src/lib/reading-time'

describe('readingMinutes', () => {
  it('rounds words / wpm', () => {
    expect(readingMinutes('word '.repeat(440))).toBe(2)
  })
  it('returns at least 1', () => {
    expect(readingMinutes('')).toBe(1)
  })
  it('ignores fenced code blocks', () => {
    const code = '```ts\n' + 'word '.repeat(1000) + '\n```'
    expect(readingMinutes(`${'word '.repeat(220)}\n${code}`)).toBe(1)
    expect(readingMinutes(`${'word '.repeat(440)}\n${code}`)).toBe(2)
  })
  it('honours a custom wpm', () => {
    expect(readingMinutes('word '.repeat(300), 100)).toBe(3)
  })
})
