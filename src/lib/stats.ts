import { SITE } from './site'
import { talkTotals, type Venue } from './talks'

export type HomeStats = { years: number; talks: number; oss: number }

/** Numbers shown on the home page: years since the first job, talk venues, open-source projects. */
export function homeStats(input: { talks: { venues: Venue[] }[]; projectCount: number; now: Date }): HomeStats {
  return {
    years: input.now.getUTCFullYear() - SITE.startYear,
    talks: talkTotals(input.talks).venues,
    oss: input.projectCount,
  }
}
