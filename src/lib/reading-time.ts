const FENCE = /^(```|~~~)[\s\S]*?^\1[^\n]*$/gm

/** Estimated reading time in whole minutes (at least 1). Fenced code blocks are excluded. */
export function readingMinutes(markdown: string, wpm = 220): number {
  const words = markdown.replace(FENCE, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / wpm))
}
