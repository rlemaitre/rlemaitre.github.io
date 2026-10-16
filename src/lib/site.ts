export const SITE = {
  url: 'https://rlemaitre.com',
  name: 'Raphaël Lemaitre',
  tinylyticsId: 'UKo7ysT1y9ouVGcZtHMp',
  webmention: 'https://webmention.io/rlemaitre.com/webmention',
  pingback: 'https://webmention.io/rlemaitre.com/xmlrpc',
  startYear: 2000,
} as const

export interface Social {
  readonly label: 'GitHub' | 'Bluesky' | 'LinkedIn' | 'Mastodon'
  readonly url: string
  readonly rel: string
}

export const SOCIALS: readonly Social[] = [
  { label: 'GitHub', url: 'https://github.com/rlemaitre', rel: 'me authn' },
  { label: 'Bluesky', url: 'https://bsky.app/profile/rlemaitre.com', rel: 'me' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rlemaitre', rel: 'me' },
  { label: 'Mastodon', url: 'https://social.treehouse.systems/@rlemaitre', rel: 'me' },
]
