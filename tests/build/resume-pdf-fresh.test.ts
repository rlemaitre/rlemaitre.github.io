import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/** Fingerprints of the print pages the PDFs were made from, written by `npm run resume:pdf`. */
const LOCK = 'scripts/resume-pdf.lock.json'
const PAGES = { en: 'dist/resume/print/index.html', fr: 'dist/fr/resume/print/index.html' } as const

const sha256 = (file: string): string => createHash('sha256').update(readFileSync(file)).digest('hex')

describe('resume PDFs', () => {
  const lock = JSON.parse(readFileSync(LOCK, 'utf8')) as Record<string, string>

  for (const [lang, page] of Object.entries(PAGES)) {
    it(`${lang} PDF matches the current resume (else run npm run resume:pdf and commit the PDFs)`, () => {
      expect(lock[lang]).toBe(sha256(page))
    })
  }
})
