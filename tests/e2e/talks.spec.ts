import { expect, test } from '@playwright/test'

test('video facade loads nothing from YouTube until clicked', async ({ page }) => {
  const external: string[] = []
  page.on('request', (request) => {
    if (/youtube|ytimg/.test(request.url())) external.push(request.url())
  })
  await page.goto('/talks/armored-type-safety-with-iron')
  await page.waitForLoadState('networkidle')
  expect(external).toEqual([])
  await expect(page.locator('iframe')).toHaveCount(0)

  await page.getByRole('button', { name: /Scala Matters/ }).click()
  const frame = page.locator('iframe')
  await expect(frame).toHaveCount(1)
  await expect(frame).toHaveAttribute('src', /^https:\/\/www\.youtube-nocookie\.com\/embed\/lrdBoYSKSnw/)
})
