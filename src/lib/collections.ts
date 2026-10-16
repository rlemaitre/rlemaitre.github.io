import { getCollection, type CollectionEntry } from 'astro:content'
import { publishedNewestFirst } from './articles'
import { articleLang, type Lang } from './i18n'

export type Article = CollectionEntry<'articles'>

/** Every non-draft article, newest first. The single source for indexes and static paths. */
export async function getPublishedArticles(lang?: Lang): Promise<Article[]> {
  const all = publishedNewestFirst(await getCollection('articles'))
  return lang ? all.filter((article) => articleLang(article.id) === lang) : all
}
