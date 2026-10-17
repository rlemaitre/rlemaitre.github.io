import { describe, expect, it } from 'vitest'
import { buildRedirects } from '../../src/lib/redirects'

const newPaths = new Set([
  '/',
  '/fr',
  '/404',
  '/index.xml',
  '/resume',
  '/articles',
  '/fr/articles',
  '/talks',
  '/projects',
  '/projects/mason',
  '/articles/scala/scala_xdg',
  '/articles/til/default-heap-configuration-in-openjdk',
  '/articles/adhd/hacking-adhd-strategies-for-the-modern-developer',
  '/fr/articles/til/default-heap-configuration-in-openjdk',
  '/fr/articles/adhd/hacking-adhd-strategies-for-the-modern-developer',
])
const titles = new Map([
  ['/articles/til/default-heap-configuration-in-openjdk', 'Default Heap Configuration in OpenJDK'],
  ['/fr/articles/til/default-heap-configuration-in-openjdk', 'Configuration de la mémoire par défaut dans OpenJDK'],
  ['/articles/adhd/hacking-adhd-strategies-for-the-modern-developer', 'Hacking ADHD: Strategies for the Modern Developer'],
  ['/fr/articles/adhd/hacking-adhd-strategies-for-the-modern-developer', 'Hacker le TDAH – Stratégies pour le Développeur Moderne'],
])
const redirect = (legacy: string): string | undefined => buildRedirects([legacy], newPaths, titles)[legacy.replace(/\/+$/, '')]

describe('buildRedirects', () => {
  it('sends resume sub-pages, root skill pages and /C-V to /resume/', () => {
    expect(redirect('/resume/Experiences/CTO-@-Adventori')).toBe('/resume/')
    expect(redirect('/resume/Skills/')).toBe('/resume/')
    expect(redirect('/Kubernetes')).toBe('/resume/')
    expect(redirect('/k8s')).toBe('/resume/')
    expect(redirect('/C-V')).toBe('/resume/')
  })

  it('does not send /resumeXYZ to the resume by the resume rule', () => {
    expect(() => buildRedirects(['/resumeXYZ'], newPaths, titles)).toThrow(/\/resumeXYZ/)
  })

  it('sends notes to /articles/', () => {
    expect(redirect('/notes/web/POSSE')).toBe('/articles/')
    expect(redirect('/notes/')).toBe('/articles/')
    expect(redirect('/dbs')).toBe('/articles/')
  })

  it('sends tags, category indexes and single-word aliases to the article lists', () => {
    expect(redirect('/tags/ADHD')).toBe('/articles/')
    expect(redirect('/tags/')).toBe('/articles/')
    expect(redirect('/articles/til/')).toBe('/articles/')
    expect(redirect('/scala')).toBe('/articles/')
    expect(redirect('/t-i-l')).toBe('/articles/')
    expect(redirect('/fr/articles/til/')).toBe('/fr/articles/')
  })

  it('recovers spaced-out aliases and matches them to an article title', () => {
    expect(redirect('/T-I-L-:-D-e-f-a-u-l-t-H-e-a-p-C-o-n-f-i-g-u-r-a-t-i-o-n-i-n-O-p-e-n-J-D-K')).toBe(
      '/articles/til/default-heap-configuration-in-openjdk/',
    )
    expect(redirect('/TIL-:-Configuration-de-la-mémoire-par-défaut-dans-OpenJDK')).toBe(
      '/fr/articles/til/default-heap-configuration-in-openjdk/',
    )
    expect(redirect('/-p-o-s-t-s-/-2-0-2-3-/-1-1-/-h-a-c-k-i-n-g---a-d-h-d---s-t-r-a-t-e-g-i-e-s---f-o-r---t-h-e---m-o-d-e-r-n---d-e-v-e-l-o-p-e-r-')).toBe(
      '/articles/adhd/hacking-adhd-strategies-for-the-modern-developer/',
    )
    expect(redirect('/-f-r-/-p-o-s-t-s-/-2-0-2-3-/-1-1-/-h-a-c-k-e-r---l-e---t-d-a-h---s-t-r-a-t-é-g-i-e-s---p-o-u-r---l-e---d-é-v-e-l-o-p-p-e-u-r---m-o-d-e-r-n-e-')).toBe(
      '/fr/articles/adhd/hacking-adhd-strategies-for-the-modern-developer/',
    )
  })

  it('maps the Hugo post aliases to the ADHD articles', () => {
    expect(redirect('/posts/2023/11/hacking-adhd-strategies-for-the-modern-developer/')).toBe(
      '/articles/adhd/hacking-adhd-strategies-for-the-modern-developer/',
    )
    expect(redirect('/fr/posts/2023/11/hacker-le-tdah-stratégies-pour-le-développeur-moderne/')).toBe(
      '/fr/articles/adhd/hacking-adhd-strategies-for-the-modern-developer/',
    )
  })

  it('sends .md and index.md paths to the page or directory they stand for', () => {
    expect(redirect('/projects/mason.md')).toBe('/projects/mason/')
    expect(redirect('/projects/index.md')).toBe('/projects/')
    expect(redirect('/index.md')).toBe('/')
    expect(redirect('/articles/til/index.md')).toBe('/articles/')
    expect(redirect('/fr/articles/index.md')).toBe('/fr/articles/')
    expect(redirect('/articles/scala/scala_xdg.md')).toBe('/articles/scala/scala_xdg/')
  })

  it('skips legacy paths that are already live, with or without a trailing slash', () => {
    const result = buildRedirects(['/articles/scala/scala_xdg', '/projects/', '/', '/index.xml', '/404'], newPaths, titles)
    expect(result).toEqual({})
  })

  it('throws listing every unmatched path', () => {
    expect(() => buildRedirects(['/zzz', '/resume/x', '/yyy/'], newPaths, titles)).toThrow(/\/zzz[\s\S]*\/yyy/)
  })
})
