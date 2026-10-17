import sitemap from '@astrojs/sitemap'
import { readFileSync } from 'node:fs'
import { defineConfig } from 'astro/config'
import type { ThemeRegistration } from 'shiki'
import dark from './src/shiki/rlemaitre-dark.json' with { type: 'json' }
import { buildRedirects } from './src/lib/redirects'
import { siteContent } from './src/lib/site-paths'
import { makeSitemapFilter } from './src/lib/sitemap-filter'
import light from './src/shiki/rlemaitre-light.json' with { type: 'json' }

const SITE_URL = 'https://rlemaitre.com'

const legacyUrls = readFileSync('tests/fixtures/legacy-urls.txt', 'utf8').split('\n').filter(Boolean)
const { newPaths, titles } = siteContent()

/** One redirect per legacy URL that is not a live page; they must never appear in the sitemap. */
const redirects = buildRedirects(legacyUrls, newPaths, titles)

export default defineConfig({
  site: SITE_URL,
  redirects,
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
      filter: makeSitemapFilter(redirects),
    }),
  ],
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // Colors live in CSS variables (--shiki-light / --shiki-dark); prose.css picks one per theme.
    shikiConfig: {
      themes: { light: light as ThemeRegistration, dark: dark as ThemeRegistration },
      defaultColor: false,
    },
  },
})
