import { t, type Lang } from './i18n'

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

/** Count, year span and distinct places (city, or "Online" in `lang`) of a talk's venues, in date order. */
export function venueSummary(venues: Venue[], lang: Lang = 'en'): VenueSummary {
  const sorted = [...venues].sort(byDate)
  const places = sorted.flatMap((v) => (v.online ? [t(lang, 'online')] : v.city ? [v.city] : []))
  return {
    count: sorted.length,
    firstYear: sorted[0].date.getUTCFullYear(),
    lastYear: sorted[sorted.length - 1].date.getUTCFullYear(),
    places: [...new Set(places)],
  }
}

/** Meta description of a talk page: "Given once, in 2024." / "Given 3 times in 2024." / "Given 3 times between 2023 and 2024." */
export function talkDescription({ count, firstYear, lastYear }: VenueSummary, lang: Lang = 'en'): string {
  if (lang === 'fr') {
    if (count === 1) return `Donné une fois, en ${firstYear}.`
    if (firstYear === lastYear) return `Donné ${count} fois en ${firstYear}.`
    return `Donné ${count} fois entre ${firstYear} et ${lastYear}.`
  }
  if (count === 1) return `Given once, in ${firstYear}.`
  if (firstYear === lastYear) return `Given ${count} times in ${firstYear}.`
  return `Given ${count} times between ${firstYear} and ${lastYear}.`
}

/** French names of the countries in the venue data, which stores English names. */
const COUNTRIES_FR: Record<string, string> = { France: 'France', Poland: 'Pologne', Japan: 'Japon' }

/** Country name in `lang`. Throws on a country with no French name, so a new venue cannot ship half-translated. */
export function countryName(country: string, lang: Lang): string {
  if (lang === 'en') return country
  const name = COUNTRIES_FR[country]
  if (!name) throw new Error(`No French name for country "${country}": add it to COUNTRIES_FR in src/lib/talks.ts`)
  return name
}

/** Where a venue took place, in `lang`: "Warsaw, Pologne", or "Online" / "En ligne". City names are not translated. */
export function venuePlace(venue: Venue, lang: Lang): string {
  if (venue.online) return t(lang, 'online')
  return [venue.city, venue.country && countryName(venue.country, lang)].filter(Boolean).join(', ')
}

/** Talks index totals line and meta description: "11 venues / 3 countries", "11 venues in 3 countries." */
export function totalsText({ venues, countries }: { venues: number; countries: number }, lang: Lang): { line: string; description: string } {
  return lang === 'fr'
    ? { line: `${venues} interventions / ${countries} pays`, description: `${venues} interventions dans ${countries} pays.` }
    : { line: `${venues} venues / ${countries} countries`, description: `${venues} venues in ${countries} countries.` }
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
