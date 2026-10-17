const pad = (n: number): string => String(n).padStart(2, '0')

/** Formats a date as `YYYY.MM.DD` in UTC. */
export function formatDate(d: Date): string {
  return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`
}

/** Formats a date as `YYYY.MM` in UTC. */
export function formatYearMonth(d: Date): string {
  return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}`
}

/** Parses a `YYYY-MM` string as the first of that month, in UTC. */
export function parseYearMonth(s: string): Date {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(s)) throw new Error(`Expected YYYY-MM, got "${s}"`)
  return new Date(`${s}-01T00:00:00Z`)
}
