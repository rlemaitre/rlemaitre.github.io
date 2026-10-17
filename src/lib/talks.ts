export type Venue = {
  date: Date
  conference: string
  url: string
  city?: string
  country?: string
  online: boolean
  video?: string
  sessionTitle?: string
}

export type VenueSummary = { count: number; firstYear: number; lastYear: number; places: string[] }

const byDate = (a: Venue, b: Venue): number => a.date.getTime() - b.date.getTime()

/** Count, year span and distinct places (city, or "Online") of a talk's venues, in date order. */
export function venueSummary(venues: Venue[]): VenueSummary {
  const sorted = [...venues].sort(byDate)
  const places = sorted.flatMap((v) => (v.online ? ['Online'] : v.city ? [v.city] : []))
  return {
    count: sorted.length,
    firstYear: sorted[0].date.getUTCFullYear(),
    lastYear: sorted[sorted.length - 1].date.getUTCFullYear(),
    places: [...new Set(places)],
  }
}

/** Meta description of a talk page: "Given once, in 2024." / "Given 3 times in 2024." / "Given 3 times between 2023 and 2024." */
export function talkDescription({ count, firstYear, lastYear }: VenueSummary): string {
  if (count === 1) return `Given once, in ${firstYear}.`
  if (firstYear === lastYear) return `Given ${count} times in ${firstYear}.`
  return `Given ${count} times between ${firstYear} and ${lastYear}.`
}

/** Total venues and distinct countries across talks. Online venues are not a country. */
export function talkTotals(talks: { venues: Venue[] }[]): { venues: number; countries: number } {
  const venues = talks.flatMap((talk) => talk.venues)
  const countries = new Set(venues.flatMap((v) => (v.online || !v.country ? [] : [v.country])))
  return { venues: venues.length, countries: countries.size }
}

/** Venues in date order (oldest first). */
export const sortedVenues = (venues: Venue[]): Venue[] => [...venues].sort(byDate)

/** YouTube video id from a watch URL, or null if it is not one. */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null
    return u.searchParams.get('v')
  } catch {
    return null
  }
}
