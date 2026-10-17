export type Lang = 'en' | 'fr'

const en = {
  nav: 'Main',
  home: 'Home',
  writing: 'Writing',
  talks: 'Talks',
  projects: 'Projects',
  resume: 'Resume',
  recentWriting: 'Recent writing',
  allWriting: 'All writing',
  status: 'Status',
  openToTalk: 'Open to talk',
  yearsShipping: 'Years shipping',
  talksGiven: 'Talks given',
  ossProjects: 'OSS projects',
  portraitCaption: 'Fig. 01 / Iceland',
  portraitAlt: 'Raphaël Lemaitre in Iceland, wearing a beanie, sunglasses and a parka, in front of dry grass and a blue sky',
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
  linkedTalk: 'Talk',
  tags: 'Tags',
  playVideo: 'Play video',
  follow: 'Follow',
  writingIntro: 'Articles, newest first.',
  savePdf: 'Save PDF',
  skipToContent: 'Skip to content',
  dark: 'Dark',
  profiles: 'Profiles',
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
    allWriting: 'Tous les articles',
    status: 'Statut',
    openToTalk: 'Ouvert à la discussion',
    yearsShipping: 'Ans de métier',
    talksGiven: 'Talks donnés',
    ossProjects: 'Projets open source',
    portraitCaption: 'Fig. 01 / Islande',
    portraitAlt: 'Raphaël Lemaitre en Islande, avec un bonnet, des lunettes de soleil et une parka, devant de l’herbe sèche et un ciel bleu',
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
    linkedTalk: 'Talk',
    tags: 'Tags',
    playVideo: 'Lire la vidéo',
    follow: 'Suivre',
    writingIntro: 'Articles, du plus récent au plus ancien.',
    savePdf: 'Enregistrer en PDF',
    skipToContent: 'Aller au contenu',
    dark: 'Sombre',
    profiles: 'Profils',
    notFoundTitle: 'Page introuvable',
    notFoundText: 'Cette page n’existe pas, ou elle a bougé lors de la refonte du site.',
  },
}

export const t = (lang: Lang, key: UiKey): string => ui[lang][key]

export const articleLang = (id: string): Lang => (id.startsWith('fr/') ? 'fr' : 'en')

export const articleSlug = (id: string): string => id.slice(id.indexOf('/') + 1)

export const homeUrl = (lang: Lang): string => (lang === 'fr' ? '/fr/' : '/')

export const articleUrl = (id: string): string =>
  `${articleLang(id) === 'fr' ? '/fr' : ''}/articles/${articleSlug(id)}/`

export const talkUrl = (id: string): string => `/talks/${id}/`

export const projectUrl = (id: string): string => `/projects/${id}/`

/** URL of the translation of an article, or the other language's home when none exists. */
export function altLangUrl(id: string, allIds: string[]): string {
  const other: Lang = articleLang(id) === 'en' ? 'fr' : 'en'
  const twin = `${other}/${articleSlug(id)}`
  return allIds.includes(twin) ? articleUrl(twin) : homeUrl(other)
}
