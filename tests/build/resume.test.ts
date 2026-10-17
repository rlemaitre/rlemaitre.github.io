import { readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const load = (path: string): Document => parseHTML(readFileSync(`dist/${path}index.html`, 'utf8')).document
const text = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()

describe('resume page', () => {
  const doc = load('resume/')
  const jobs = [...doc.querySelectorAll('.jobs > .job')]
  const html = readFileSync('dist/resume/index.html', 'utf8')

  it('opens with the current Nabla role', () => {
    const first = text(jobs[0])
    for (const part of ['Senior Backend Engineer', 'Nabla', 'Dictation squad', '2025.11', 'now']) {
      expect(first).toContain(part)
    }
    expect(first).toContain('Real-time dictation transcription pipeline backend.')
    expect(first).toContain('Formatting post-processing.')
  })

  it('says Kotlin at Nabla and Scala on the side in the pitch', () => {
    const pitch = text(doc.querySelector('.pitch'))
    expect(pitch).toMatch(/Nabla[^.]*Kotlin/)
    expect(pitch).not.toMatch(/mostly Scala/)
  })

  it('dates the Ledger role 2022.03 to 2025.10, not as current', () => {
    const ledger = jobs.find((j) => text(j).includes('Ledger'))
    expect(text(ledger)).toContain('2022.03')
    expect(text(ledger)).toContain('2025.10')
    expect(text(ledger)).not.toMatch(/\bnow\b/i)
    expect(jobs.filter((j) => /\bnow\b/i.test(text(j.querySelector('.when'))))).toHaveLength(1)
  })

  it('lists every role of the confirmed content, older ones compact', () => {
    expect(jobs).toHaveLength(7)
    expect(text(jobs[2])).toContain('CTO, previously Lead Developer')
    expect(text(jobs[2])).toContain('2014.06')
    for (const job of jobs.slice(3)) expect(job.classList.contains('compact')).toBe(true)
    expect(text(jobs[6])).toContain('E-Deal')
  })

  it('does not present Ledger as current on the home page', () => {
    expect(text(load('').body)).not.toMatch(/Ledger/)
  })

  it('has no email or phone link', () => {
    expect(html).not.toMatch(/mailto:|tel:/i)
  })

  it('lists the four talks, Iron with x5', () => {
    const talks = [...doc.querySelectorAll('.talk')]
    expect(talks).toHaveLength(4)
    const iron = talks.find((t) => text(t).includes('Armored Type Safety'))
    expect(text(iron)).toContain('×5')
  })

  it('links to LinkedIn and GitHub', () => {
    expect(doc.querySelector('a[href="https://www.linkedin.com/in/rlemaitre"]')).not.toBeNull()
    expect(doc.querySelector('a[href="https://github.com/rlemaitre"]')).not.toBeNull()
  })

  it('has a Save PDF button, not a link', () => {
    const button = [...doc.querySelectorAll('button')].find((b) => /save pdf/i.test(text(b)))
    expect(button).toBeDefined()
  })

  it('groups skills without editors or note-taking tools', () => {
    const skills = text(doc.querySelector('.skills'))
    for (const group of ['Languages', 'Data', 'Ops & tools']) expect(skills).toContain(group)
    expect(skills).not.toMatch(/Obsidian|IntelliJ|Zed|Neovim|Visual Studio/)
  })

  it('shows the education', () => {
    const education = text(doc.querySelector('.education'))
    expect(education).toContain('ENSIIE')
    expect(education).toContain('1997')
    expect(education).toContain('2001')
  })
})
