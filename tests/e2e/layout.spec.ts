import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

test.describe('layout at phone width', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  for (const path of ['/', '/fr/', '/404', '/talks/', '/talks/armored-type-safety-with-iron/', '/talks/fearless-coding-scala-3-and-iron/']) {
    test(`${path} has no horizontal scroll`, async ({ page }) => {
      await page.goto(path)
      await expectNoHorizontalScroll(page)
    })
  }
})

test('first Tab focuses the skip link to #main', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.press('Tab')
  const focused = page.locator(':focus')
  await expect(focused).toHaveText(/skip to content/i)
  await expect(focused).toHaveAttribute('href', '#main')
  await expect(page.locator('#main')).toHaveCount(1)
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('no CSS animation is running', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav a').nth(1).hover()
    const running = await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === 'running').length,
    )
    expect(running).toBe(0)
  })
})

test.describe('index rows without a date', () => {
  const titleLeft = (page: Page, path: string) =>
    page.goto(path).then(() => page.locator('.rows a.row .title').first().evaluate((el) => el.getBoundingClientRect().left))

  for (const width of [1280, 375]) {
    test(`talks rows start at the gutter at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      expect(await titleLeft(page, '/talks/')).toBeLessThan(40)
    })
  }

  test('dated rows keep the date column on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    expect(await titleLeft(page, '/articles/')).toBeGreaterThan(120)
  })
})
