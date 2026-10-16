import sitemap from '@astrojs/sitemap'
import { defineConfig } from 'astro/config'
import type { ThemeRegistration } from 'shiki'
import dark from './src/shiki/rlemaitre-dark.json' with { type: 'json' }
import light from './src/shiki/rlemaitre-light.json' with { type: 'json' }

const SITE_URL = 'https://rlemaitre.com'

/** Sources of legacy redirects (Task 10 fills this in); they must never appear in the sitemap. */
const redirects: Record<string, string> = {}

const stripSlash = (path: string): string => (path.length > 1 ? path.replace(/\/+$/, '') : path)
const redirectSources = new Set(Object.keys(redirects).map(stripSlash))

export default defineConfig({
  site: SITE_URL,
  redirects,
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en', fr: 'fr' } },
      filter: (page) => {
        const path = stripSlash(new URL(page).pathname)
        return path !== '/404' && !redirectSources.has(path)
      },
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
