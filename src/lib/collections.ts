import { getCollection, getEntry, type CollectionEntry } from 'astro:content'
import { publishedNewestFirst } from './articles'
import { articleLang, type Lang } from './i18n'

export type Article = CollectionEntry<'articles'>

/** Every non-draft article, newest first. The single source for indexes and static paths. */
export async function getPublishedArticles(lang?: Lang): Promise<Article[]> {
  const all = publishedNewestFirst(await getCollection('articles'))
  return lang ? all.filter((article) => articleLang(article.id) === lang) : all
}

export type Talk = CollectionEntry<'talks'>
export type Project = CollectionEntry<'projects'>

/** The entry whose body is the talk abstract in `lang`: the talk itself in English, its `fr/` file in French. */
export async function talkAbstract(talk: Talk, lang: Lang): Promise<Talk | CollectionEntry<'talksFr'>> {
  if (lang === 'en') return talk
  const fr = await getEntry('talksFr', talk.id)
  if (!fr) throw new Error(`Missing French abstract: add src/content/talks/fr/${talk.id}.md`)
  return fr
}

/** The talk title in `lang`, and whether it is the French title (otherwise it is the original, English, one). */
export async function talkTitle(talk: Talk, lang: Lang): Promise<{ title: string; translated: boolean }> {
  if (lang === 'fr') {
    const title = (await getEntry('talksFr', talk.id))?.data.title
    if (title) return { title, translated: true }
  }
  return { title: talk.data.title, translated: false }
}

/** The project summary in `lang`, and the entry whose body is the project description in that language. */
export async function projectText(
  project: Project,
  lang: Lang,
): Promise<{ summary: string; body: Project | CollectionEntry<'projectsFr'> }> {
  if (lang === 'en') return { summary: project.data.summary, body: project }
  const fr = await getEntry('projectsFr', project.id)
  if (!fr) throw new Error(`Missing French text: add src/content/projects/fr/${project.id}.md`)
  return { summary: fr.data.summary, body: fr }
}
