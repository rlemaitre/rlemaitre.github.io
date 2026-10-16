import { defineCollection, reference } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      tags: z.array(z.string()),
      originallyPublished: z
        .object({
          site: z.string(),
          url: z.url(),
          date: z.coerce.date(),
        })
        .optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      talk: reference('talks').optional(),
    }),
})

const talks = defineCollection({
  loader: glob({ base: './src/content/talks', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    lang: z.enum(['en', 'fr']),
    venues: z
      .array(
        z.object({
          date: z.coerce.date(),
          conference: z.string(),
          url: z.url(),
          city: z.string().optional(),
          country: z.string().optional(),
          online: z.boolean().default(false),
          video: z.url().optional(),
          sessionTitle: z.string().optional(),
        }),
      )
      .min(1),
  }),
})

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    repo: z.url().optional(),
    docs: z.url().optional(),
    tags: z.array(z.string()),
    order: z.number(),
  }),
})

export const collections = { articles, talks, projects }
