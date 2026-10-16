import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { getPublishedArticles } from './collections'
import { articleUrl, type Lang } from './i18n'
import { SITE } from './site'

const CHANNEL_TITLE: Record<Lang, string> = {
  en: 'Raphaël Lemaitre — Writing',
  fr: 'Raphaël Lemaitre — Articles',
}

/** RSS response for one language: published articles only, absolute links, newest first. */
export async function buildFeed(lang: Lang): Promise<Response> {
  const [articles, homes] = await Promise.all([getPublishedArticles(lang), getCollection('home')])
  const home = homes.find((entry) => entry.id === lang)
  return rss({
    title: CHANNEL_TITLE[lang],
    description: home?.data.description ?? CHANNEL_TITLE[lang],
    site: SITE.url,
    customData: `<language>${lang}</language>`,
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.published,
      link: `${SITE.url}${articleUrl(article.id)}`,
    })),
  })
}
