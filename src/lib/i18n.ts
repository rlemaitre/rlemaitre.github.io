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
  talk: 'Talk',
  givenInEnglish: 'given in English',
  givenInFrench: 'given in French',
  abstract: 'Abstract',
  venues: 'Venues',
  online: 'Online',
  project: 'Project',
  docs: 'Docs',
  openSource: 'open source',
  projectsIntro: 'Open-source projects: Pillars, Mason, Risk Matrix and the FunktionalIO organization.',
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
    talk: 'Talk',
    givenInEnglish: 'donné en anglais',
    givenInFrench: 'donné en français',
    abstract: 'Résumé',
    venues: 'Interventions',
    online: 'En ligne',
    project: 'Projet',
    docs: 'Doc',
    openSource: 'open source',
    projectsIntro: 'Projets open source : Pillars, Mason, Risk Matrix et l’organisation FunktionalIO.',
  },
}

export const t = (lang: Lang, key: UiKey): string => ui[lang][key]

export const articleLang = (id: string): Lang => (id.startsWith('fr/') ? 'fr' : 'en')

export const articleSlug = (id: string): string => id.slice(id.indexOf('/') + 1)

export const otherLang = (lang: Lang): Lang => (lang === 'en' ? 'fr' : 'en')

const prefix = (lang: Lang): string => (lang === 'fr' ? '/fr' : '')

export const homeUrl = (lang: Lang): string => `${prefix(lang)}/`

export const articleUrl = (id: string): string =>
  `${articleLang(id) === 'fr' ? '/fr' : ''}/articles/${articleSlug(id)}/`

export const talksUrl = (lang: Lang): string => `${prefix(lang)}/talks/`

export const talkUrl = (id: string, lang: Lang = 'en'): string => `${talksUrl(lang)}${id}/`

export const projectsUrl = (lang: Lang): string => `${prefix(lang)}/projects/`

export const projectUrl = (id: string, lang: Lang = 'en'): string => `${projectsUrl(lang)}${id}/`

/** URL of the translation of an article, or the other language's home when none exists. */
export function altLangUrl(id: string, allIds: string[]): string {
  const other: Lang = articleLang(id) === 'en' ? 'fr' : 'en'
  const twin = `${other}/${articleSlug(id)}`
  return allIds.includes(twin) ? articleUrl(twin) : homeUrl(other)
}
