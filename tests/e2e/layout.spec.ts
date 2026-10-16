import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll } from './helpers'

test.describe('layout at phone width', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  for (const path of ['/', '/404']) {
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
