import { getCollection, getEntry } from 'astro:content'
import { talkTitle } from './collections'
import type { Lang, UiKey } from './i18n'
import { SITE, SOCIALS } from './site'
import { venueSummary } from './talks'

const span = ({ firstYear, lastYear }: { firstYear: number; lastYear: number }): string =>
  firstYear === lastYear ? String(firstYear) : `${firstYear}–${lastYear}`

const conferences = (venues: { conference: string }[]): string =>
  [...new Set(venues.map((v) => v.conference))].join(' · ')

/** The resume in `lang`, and its talks newest first with their title in `lang`. */
export async function loadResume(lang: Lang) {
  const resume = (await getEntry(lang === 'fr' ? 'resumeFr' : 'resume', 'resume'))!.data
  const talks = (
    await Promise.all(
      (await getCollection('talks')).map(async (talk) => {
        const summary = venueSummary(talk.data.venues, lang)
        return {
          id: talk.id,
          title: (await talkTitle(talk, lang)).title,
          count: summary.count,
          span: span(summary),
          lastYear: summary.lastYear,
          conferences: conferences(talk.data.venues),
        }
      }),
    )
  ).sort((a, b) => b.lastYear - a.lastYear || a.title.localeCompare(b.title))
  return { resume, talks }
}

/** Profile links shown on the resume: LinkedIn, GitHub and this site. */
export const RESUME_CONTACTS = [
  SOCIALS.find((s) => s.label === 'LinkedIn')!,
  SOCIALS.find((s) => s.label === 'GitHub')!,
  { label: SITE.name, url: SITE.url, rel: 'me' },
]

export const bareUrl = (url: string): string => url.replace(/^https?:\/\/(www\.)?/, '')

/** i18n key of each skill group's label. */
export const SKILL_LABEL: Record<'Languages' | 'AI' | 'Data' | 'Ops & tools', UiKey> = {
  Languages: 'skillLanguages',
  AI: 'skillAi',
  Data: 'skillData',
  'Ops & tools': 'skillOps',
}

/** Path of the resume PDF in `lang`, built by `npm run resume:pdf` from the print page. */
export const resumePdfPath = (lang: Lang): string => `${lang === 'fr' ? '/fr' : ''}/resume/raphael-lemaitre.pdf`
