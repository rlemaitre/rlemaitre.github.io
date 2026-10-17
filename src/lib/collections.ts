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

/** The entry whose body is the talk abstract in `lang`: the talk itself in English, its `fr/` file in French. */
export async function talkAbstract(talk: Talk, lang: Lang): Promise<Talk | CollectionEntry<'talksFr'>> {
  if (lang === 'en') return talk
  const fr = await getEntry('talksFr', talk.id)
  if (!fr) throw new Error(`Missing French abstract: add src/content/talks/fr/${talk.id}.md`)
  return fr
}

