import { existsSync, readFileSync } from 'node:fs'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'

const load = (path: string): Document => parseHTML(readFileSync(`dist/${path}index.html`, 'utf8')).document
const text = (el: Element | null | undefined): string => (el?.textContent ?? '').replace(/\s+/g, ' ').trim()
const dates = (doc: Document): string[] => [...doc.querySelectorAll('.jobs .when')].map(text)
const langSwitch = (doc: Document): string | null | undefined =>
  doc.querySelector('nav.bar .lang a')?.getAttribute('href')
const navHref = (doc: Document, label: string): string | null | undefined =>
  [...doc.querySelectorAll('nav.bar a.cell')].find((a) => text(a) === label)?.getAttribute('href')

describe('French resume page', () => {
  const en = load('resume/')
  const fr = load('fr/resume/')

  it('is in French', () => {
    expect(fr.documentElement.getAttribute('lang')).toBe('fr')
    const headings = [...fr.querySelectorAll('.sec > h2')].map(text).join(' ')
    for (const heading of ['Expérience', 'Compétences', 'Projets', 'Conférences', 'Formation']) {
      expect(headings).toContain(heading)
    }
  })

  it('has the same roles and dates as the English resume', () => {
    expect(dates(fr).map((d) => d.replace('aujourd’hui', 'now'))).toEqual(dates(en))
  })

  it('names the acquirer in French', () => {
    const companies = [...fr.querySelectorAll('.jobs .company')].map(text)
    expect(companies).toContain('Adventori, aujourd’hui the COOL company')
    expect(companies).toContain('E-Deal, aujourd’hui Efficy')
  })

  it('lists spoken languages with their level in French', () => {
    expect(text(fr.querySelector('.languages .label'))).toBe('Langues')
    expect([...fr.querySelectorAll('.languages li')].map(text)).toEqual([
      'Français (langue maternelle)',
      'Anglais (C1)',
    ])
  })

  it('dates roles as MM/YYYY', () => {
    expect(text(fr.querySelector('.jobs .when'))).toBe('11/2025 – aujourd’hui')
    expect(text(fr.querySelector('.projects .role'))).toBe('Créateur')
  })

  it('opens with the target job title and explains internal names in French', () => {
    expect(text(fr.querySelector('.intro .mono'))).toBe('/// Principal/Staff Engineer')
    const nabla = text(fr.querySelector('.jobs > .job'))
    expect(nabla).toContain('Nabla, IA clinique pour les établissements de santé — équipe Dictée')
    expect(nabla).toContain('transcription Ambient (consultations enregistrées)')
    expect(nabla).toContain('le produit Ambient (transcription des consultations) utilise l’API de dictée')
    expect(nabla).not.toMatch(/squad|API Dictation/)
  })

  it('adds the AI workflow, anonymization, AWS and budget facts in French', () => {
    const jobs = [...fr.querySelectorAll('.jobs > .job')]
    expect(text(jobs[0].querySelector('.company'))).toBe(
      'Nabla, IA clinique pour les établissements de santé — équipe Dictée',
    )
    expect(text(jobs[0])).toContain('une douzaine de sous-agents de revue spécialisés')
    expect(text(jobs[0])).toContain('transforme les remarques de revue récurrentes en règles')
    expect(text(jobs[0])).toContain('Anonymisation de l’audio dicté et des transcriptions enregistrées.')
    expect(text(jobs[2])).toContain('Gestion du budget tech et des prestataires avec le CEO.')
  })

  it('marks the current role with aujourd’hui', () => {
    expect(text(fr.querySelector('.jobs .now'))).toBe('aujourd’hui')
  })

  it('links each language to the other resume', () => {
    expect(langSwitch(en)).toBe('/fr/resume/')
    expect(langSwitch(fr)).toBe('/resume/')
  })

  it('points the French nav CV link to the French resume', () => {
    expect(navHref(fr, 'CV')).toBe('/fr/resume/')
    expect(navHref(load('fr/'), 'CV')).toBe('/fr/resume/')
    expect(navHref(en, 'Resume')).toBe('/resume/')
  })

  it('links talks to their French pages', () => {
    const links = [...fr.querySelectorAll('.talk a')].map((a) => a.getAttribute('href'))
    expect(links).toHaveLength(4)
    for (const href of links) expect(href).toMatch(/^\/fr\/talks\//)
  })

  it('lists Hacker le TDAH first', () => {
    expect(text(fr.querySelector('.talk a'))).toBe('Hacker le TDAH : Stratégies pour le développeur moderne')
  })

  it('links Télécharger le PDF to the French PDF', () => {
    const link = [...fr.querySelectorAll('a')].find((a) => /télécharger le pdf/i.test(text(a)))
    expect(link?.getAttribute('href')).toBe('/fr/resume/raphael-lemaitre.pdf')
    expect(link?.getAttribute('download')).toBe('Raphael-Lemaitre-CV.pdf')
    expect(existsSync('dist/fr/resume/raphael-lemaitre.pdf')).toBe(true)
  })

  it('has no email or phone link', () => {
    expect(readFileSync('dist/fr/resume/index.html', 'utf8')).not.toMatch(/mailto:|tel:/i)
  })
})
