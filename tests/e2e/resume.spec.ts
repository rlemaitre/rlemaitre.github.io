import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

test.describe('resume', () => {
  test('prints black on white without nav or grain, even in dark mode', async ({ page }) => {
    await page.goto('/resume/')
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark'
    })
    await page.emulateMedia({ media: 'print' })
    const body = page.locator('body')
    await expect(body).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(body).toHaveCSS('color', 'rgb(0, 0, 0)')
    await expect(page.locator('nav.bar')).toBeHidden()
    await expect(page.locator('footer')).toBeHidden()
    await expect(page.getByRole('link', { name: /download pdf/i })).toBeHidden()
    const grain = await page.evaluate(() => getComputedStyle(document.body, '::after').display)
    expect(grain).toBe('none')
  })

  test('Download PDF serves the PDF', async ({ page, request }) => {
    await page.goto('/resume/')
    const href = await page.getByRole('link', { name: /download pdf/i }).getAttribute('href')
    const response = await request.get(href!)
    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('application/pdf')
  })

  test('has no horizontal scroll at 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/resume/')
    await expectNoHorizontalScroll(page)
  })

  for (const media of ['screen', 'print'] as const) {
    test(`keeps each talk's count and years on one line in ${media}`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 900 })
      await page.goto('/resume/')
      await page.emulateMedia({ media })
      const cells = await page.locator('.talk .num').evaluateAll((els) =>
        els.map((el) => ({
          text: el.textContent?.trim() ?? '',
          fits: el.scrollWidth <= el.clientWidth,
          lines: Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)),
        })),
      )
      expect(cells.length).toBeGreaterThan(0)
      for (const cell of cells) {
        expect(cell, cell.text).toMatchObject({ fits: true, lines: 1 })
      }
    })
  }
})
