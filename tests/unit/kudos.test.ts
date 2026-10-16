import { describe, expect, it } from 'vitest'
import { replaceKudosEmoji } from '../../src/lib/kudos'

describe('replaceKudosEmoji', () => {
  it('replaces the wave and keeps the count', () => {
    expect(replaceKudosEmoji('\u{1F44B} 3', 'Kudos')).toBe('Kudos 3')
  })

  it('replaces the wave when there is no count', () => {
    expect(replaceKudosEmoji('\u{1F44B}', 'Kudos')).toBe('Kudos')
  })

  it('leaves no emoji behind', () => {
    expect(replaceKudosEmoji('\u{1F44B} 12', 'Kudos')).not.toContain('\u{1F44B}')
  })

  it('leaves text without the emoji unchanged', () => {
    expect(replaceKudosEmoji('Kudos 3', 'Kudos')).toBe('Kudos 3')
    expect(replaceKudosEmoji('Kudos', 'Kudos')).toBe('Kudos')
  })
})
