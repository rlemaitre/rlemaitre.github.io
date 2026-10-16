import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

const ADHD = '/articles/adhd/hacking-adhd-strategies-for-the-modern-developer'
const XDG = '/articles/scala/scala_xdg'

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
