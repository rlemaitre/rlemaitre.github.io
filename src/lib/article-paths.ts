import { getPublishedArticles } from './collections'
import { altLangUrl, articleLang, articleSlug, type Lang } from './i18n'

/** Static paths for one language's article pages. Drafts are excluded by getPublishedArticles. */
export async function articlePaths(lang: Lang) {
  const all = await getPublishedArticles()
  const ids = all.map((article) => article.id)
  return all
    .filter((article) => articleLang(article.id) === lang)
    .map((article) => ({
      params: { slug: articleSlug(article.id) },
      props: { article, altLangUrl: altLangUrl(article.id, ids) },
    }))
}
