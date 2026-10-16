import { defineConfig } from 'astro/config'
import type { ThemeRegistration } from 'shiki'
import dark from './src/shiki/rlemaitre-dark.json' with { type: 'json' }
import light from './src/shiki/rlemaitre-light.json' with { type: 'json' }

export default defineConfig({
  site: 'https://rlemaitre.com',
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
