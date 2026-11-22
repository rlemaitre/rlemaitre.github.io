import { readFileSync } from 'node:fs'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { describe, expect, it } from 'vitest'

/** The PDF's text in drawing order, one string per text run: what a recruiting parser reads. */
async function textRuns(file: string): Promise<string[]> {
  const doc = await getDocument({ data: new Uint8Array(readFileSync(file)), verbosity: 0 }).promise
  const runs: string[] = []
  for (let page = 1; page <= doc.numPages; page++) {
    const { items } = await (await doc.getPage(page)).getTextContent()
    for (const item of items) if ('str' in item && item.str.trim()) runs.push(item.str.trim())
  }
  return runs
}

const PDFS = [
  ['public/resume/raphael-lemaitre.pdf', ['EXPERIENCE', 'SKILLS', 'PROJECTS', 'TALKS', 'EDUCATION']],
  ['public/fr/resume/raphael-lemaitre.pdf', ['EXPÉRIENCE', 'COMPÉTENCES', 'PROJETS', 'CONFÉRENCES', 'FORMATION']],
] as const

describe('resume PDF text layer', () => {
  for (const [file, headings] of PDFS) {
    it(`${file} reads each section heading right before its content`, async () => {
      const runs = await textRuns(file)
      const at = headings.map((h) => runs.indexOf(h))
      expect(at.every((i) => i >= 0)).toBe(true)
      // Headings in order, each followed by its own content before the next heading.
      for (let i = 1; i < at.length; i++) expect(at[i] - at[i - 1]).toBeGreaterThan(2)
    })

    it(`${file} keeps each bullet marker with its text`, async () => {
      const runs = await textRuns(file)
      // The page footer, "Raphaël Lemaitre — CV", is the only dash allowed on its own.
      const lone = runs.filter((run, i) => run === '—' && runs[i - 1] !== 'LEMAITRE')
      expect(lone).toEqual([])
      expect(runs.filter((run) => run.startsWith('— ')).length).toBeGreaterThan(20)
    })

    it(`${file} opens with the target job title`, async () => {
      expect((await textRuns(file)).join(' ')).toMatch(/^\/\/\/ PRINCIPAL\/STAFF ENGINEER RAPHAËL/)
    })

    it(`${file} lists English at C1`, async () => {
      expect((await textRuns(file)).join(' ')).toMatch(/(ENGLISH|ANGLAIS) \(C1\)/)
    })

    it(`${file} has no certifications`, async () => {
      expect((await textRuns(file)).join(' ')).not.toMatch(/CERTIFICATIONS|Coursera|edX/)
    })
  }
})
