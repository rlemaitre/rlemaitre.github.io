export type Lang = 'en' | 'fr'

const en = {
  nav: 'Main',
  home: 'Home',
  writing: 'Writing',
  talks: 'Talks',
  projects: 'Projects',
  resume: 'Resume',
  recentWriting: 'Recent writing',
  read: 'Read',
  min: 'min',
  originallyPublished: 'Originally published on',
  contents: 'Contents',
  article: 'Article',
  note: 'Note',
  published: 'Pub.',
  updated: 'Upd.',
  readingTime: 'Read',
  language: 'Lang',
  follow: 'Follow',
  kudos: 'Send kudos',
  writingIntro: 'Articles and notes, newest first.',
  savePdf: 'Save PDF',
  skipToContent: 'Skip to content',
  notFoundTitle: 'Page not found',
  notFoundText: 'This page does not exist, or it moved when I rebuilt the site.',
} as const

export type UiKey = keyof typeof en

export const ui: Record<Lang, Record<UiKey, string>> = {
  en,
  fr: {
    nav: 'Principale',
    home: 'Accueil',
    writing: 'Articles',
    talks: 'Talks',
    projects: 'Projets',
    resume: 'CV',
    recentWriting: 'Articles récents',
    read: 'Lire',
    min: 'min',
    originallyPublished: 'Initialement publié sur',
    contents: 'Sommaire',
    article: 'Article',
    note: 'Note',
    published: 'Publ.',
    updated: 'Màj',
    readingTime: 'Lecture',
    language: 'Langue',
    follow: 'Suivre',
    kudos: 'Envoyer des kudos',
    writingIntro: 'Articles et notes, du plus récent au plus ancien.',
    savePdf: 'Enregistrer en PDF',
    skipToContent: 'Aller au contenu',
    notFoundTitle: 'Page introuvable',
    notFoundText: 'Cette page n’existe pas, ou elle a bougé lors de la refonte du site.',
  },
}

export const t = (lang: Lang, key: UiKey): string => ui[lang][key]

export const articleLang = (id: string): Lang => (id.startsWith('fr/') ? 'fr' : 'en')

export const articleSlug = (id: string): string => id.slice(id.indexOf('/') + 1)

export const homeUrl = (lang: Lang): string => (lang === 'fr' ? '/fr/' : '/')

export const articleUrl = (id: string): string =>
  `${articleLang(id) === 'fr' ? '/fr' : ''}/articles/${articleSlug(id)}`

/** URL of the translation of an article, or the other language's home when none exists. */
export function altLangUrl(id: string, allIds: string[]): string {
  const other: Lang = articleLang(id) === 'en' ? 'fr' : 'en'
  const twin = `${other}/${articleSlug(id)}`
  return allIds.includes(twin) ? articleUrl(twin) : homeUrl(other)
}
