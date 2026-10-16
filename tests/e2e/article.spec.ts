import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

const ADHD = '/articles/adhd/hacking-adhd-strategies-for-the-modern-developer/'
const XDG = '/articles/scala/scala_xdg/'

test.describe('article at phone width', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  for (const path of [ADHD, XDG, '/articles/']) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path)
      await expectNoHorizontalScroll(page)
    })
  }

  test('long code lines scroll inside the code block', async ({ page }) => {
    await page.goto(XDG)
    const pre = page.locator('pre[data-language="scala"]')
    const { scrollWidth, clientWidth, overflowX } = await pre.evaluate((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      overflowX: getComputedStyle(el).overflowX,
    }))
    expect(scrollWidth).toBeGreaterThan(clientWidth)
    expect(overflowX).toBe('auto')
  })
})

test('table of contents links jump to their section', async ({ page }) => {
  await page.goto(ADHD)
  const links = page.locator('nav.toc a')
  const count = await links.count()
  expect(count).toBeGreaterThan(3)
  const last = links.nth(count - 1)
  const href = await last.getAttribute('href')
  await last.click()
  await expect(page).toHaveURL(new RegExp(`${href}$`))
  await expect(page.locator(`h2${href}`)).toBeInViewport()
})

// Injected into a real article so the fixtures go through the same prose CSS.
test('a heading with inline code keeps its spaces', async ({ page }) => {
  await page.goto(XDG)
  const text = await page.evaluate(() => {
    const h2 = document.createElement('h2')
    h2.innerHTML = 'Using <code>val</code> and <em>more</em> today'
    document.querySelector('.prose')?.append(h2)
    return h2.innerText
  })
  expect(text.toLowerCase()).toBe('using val and more today')
})

test.describe('long inline tokens at phone width', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  test('do not cause horizontal scroll', async ({ page }) => {
    await page.goto(XDG)
    await page.evaluate(() => {
      const p = document.createElement('p')
      const token = 'averyveryverylongidentifierwithoutanybreakopportunity'.repeat(3)
      p.innerHTML = `See <code>-XX:${token}</code> and <a href="#">https://example.com/${token}</a>.`
      const h2 = document.createElement('h2')
      h2.innerHTML = `Set <code>${token}</code>`
      document.querySelector('.prose')?.append(p, h2)
    })
    await expectNoHorizontalScroll(page)
  })
})

test('the kudos button never shows the Tinylytics emoji', async ({ page }) => {
  await page.goto(XDG)
  const button = page.locator('button.tinylytics_kudos')
  await button.evaluate((el) => {
    el.textContent = '\u{1F44B} 3'
  })
  await expect(button).toHaveText('Kudos 3')
  expect(await button.textContent()).not.toContain('\u{1F44B}')
  await expect(button).toHaveAccessibleName('Kudos 3')
})
