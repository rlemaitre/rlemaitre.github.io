import { defineCollection, reference } from 'astro:content'
import { file, glob } from 'astro/loaders'
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

/**
 * French text of talks and projects: one file per entry, same id as the English file, in a `fr/` folder next to it.
 * They hold only the translated text. Venues, links, tags and order live in the English entry alone.
 */
const talksFr = defineCollection({
  loader: glob({ base: './src/content/talks/fr', pattern: '*.md' }),
  schema: z.object({}),
})

const projectsFr = defineCollection({
  loader: glob({ base: './src/content/projects/fr', pattern: '*.md' }),
  schema: z.object({ summary: z.string() }),
})

const resume = defineCollection({
  loader: file('./src/content/resume.yaml'),
  schema: z.object({
    pitch: z.string(),
    location: z.string(),
    languages: z.array(z.string()),
    experience: z.array(
      z.object({
        role: z.string(),
        company: z.string(),
        team: z.string().optional(),
        start: z.string().regex(/^\d{4}-\d{2}$/),
        end: z
          .string()
          .regex(/^\d{4}-\d{2}$/)
          .optional(),
        bullets: z.array(z.string()),
        compact: z.boolean(),
      }),
    ),
    skills: z.array(z.object({ group: z.enum(['Languages', 'Data', 'Ops & tools']), items: z.array(z.string()) })),
    education: z.array(z.object({ degree: z.string(), school: z.string(), url: z.url(), start: z.number(), end: z.number() })),
  }),
})

const home = defineCollection({
  loader: glob({ base: './src/content/home', pattern: '*.md' }),
  schema: z.object({ description: z.string() }),
})

export const collections = { articles, talks, talksFr, projects, projectsFr, resume, home }
