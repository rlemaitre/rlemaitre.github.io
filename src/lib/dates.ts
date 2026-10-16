const pad = (n: number): string => String(n).padStart(2, '0')

/** Formats a date as `YYYY.MM.DD` in UTC. */
export function formatDate(d: Date): string {
  return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}.${pad(d.getUTCDate())}`
}

/** Formats a date as `YYYY.MM` in UTC. */
export function formatYearMonth(d: Date): string {
  return `${d.getUTCFullYear()}.${pad(d.getUTCMonth() + 1)}`
}
