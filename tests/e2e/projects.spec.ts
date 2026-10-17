import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

for (const width of [1280, 375]) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } })

    test('project rows start at the gutter', async ({ page }) => {
      await page.goto('/projects/')
      const left = await page.locator('.rows a.row .title').first().evaluate((el) => el.getBoundingClientRect().left)
      expect(left).toBeLessThan(40)
    })

    test('project pages have no horizontal scroll', async ({ page }) => {
      for (const path of ['/projects/', '/projects/pillars/', '/projects/funktionalio/']) {
        await page.goto(path)
        await expectNoHorizontalScroll(page)
      }
    })
  })
}
