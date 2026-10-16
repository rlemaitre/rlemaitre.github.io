import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://rlemaitre.com',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: { prefixDefaultLocale: false },
  },
})
