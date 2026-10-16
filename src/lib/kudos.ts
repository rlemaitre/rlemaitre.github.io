const WAVE = '\u{1F44B}'

/** Tinylytics writes "<wave> <count>" into the kudos button; the design has no emoji, so use a word instead. */
export function replaceKudosEmoji(text: string, label: string): string {
  return text.includes(WAVE) ? text.replaceAll(WAVE, label).trim() : text
}
