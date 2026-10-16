import { createHighlighter, type ThemeRegistration } from 'shiki'
import { describe, expect, it } from 'vitest'
import dark from '../../src/shiki/rlemaitre-dark.json'
import light from '../../src/shiki/rlemaitre-light.json'

// WCAG 2 relative luminance and contrast ratio.
const luminance = (hex: string): number => {
  const n = Number.parseInt(hex.slice(1, 7), 16)
  const [r, g, b] = [16, 8, 0]
    .map((shift) => ((n >> shift) & 255) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const themes = { light, dark } as unknown as Record<'light' | 'dark', ThemeRegistration>
const CODE_BG = { light: '#E9E8E2', dark: '#1D1D1D' }
const KEYWORD = { light: '#D01414', dark: '#FF2A2A' }

describe.each(['light', 'dark'] as const)('%s syntax theme', (name) => {
  const theme = themes[name]

  it('uses the code background token', () => {
    expect(theme.colors?.['editor.background']?.toUpperCase()).toBe(CODE_BG[name])
  })

  it('gives every token color at least 4.5:1 on the code background (WCAG AA)', () => {
    const colors = [
      theme.colors?.['editor.foreground'] as string,
      ...(theme.tokenColors ?? []).map((rule) => rule.settings.foreground as string),
    ].filter(Boolean)
    for (const color of colors) {
      expect(contrast(color, CODE_BG[name]), color).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('colors Scala keywords with the accent and leaves operators in ink', async () => {
    const highlighter = await createHighlighter({ themes: [theme], langs: ['scala'] })
    const tokens = highlighter.codeToTokensBase('final case class A(n: Int)\nval a = A(1)', {
      lang: 'scala',
      theme,
    })
    const colorOf = (match: (content: string) => boolean) =>
      tokens
        .flat()
        .find((tok) => match(tok.content))
        ?.color?.toUpperCase()
    expect(colorOf((c) => c.trim() === 'val')).toBe(KEYWORD[name])
    expect(colorOf((c) => c.includes('='))).toBe((theme.colors?.['editor.foreground'] as string).toUpperCase())
  })
})
