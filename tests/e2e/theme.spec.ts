import { expect, test } from '@playwright/test'

const themeOf = (page: import('@playwright/test').Page) =>
  page.locator('html').getAttribute('data-theme')

test.describe('theme', () => {
  test('follows a dark system preference before first paint', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'dark' })
    const page = await context.newPage()
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    expect(await themeOf(page)).toBe('dark')
    await context.close()
  })

  test('toggle flips the theme and the choice survives a reload', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'light' })
    const page = await context.newPage()
    await page.goto('/')
    expect(await themeOf(page)).toBe('light')
    const toggle = page.getByRole('button', { name: /dark|light/i })
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await toggle.click()
    expect(await themeOf(page)).toBe('dark')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await page.reload({ waitUntil: 'domcontentloaded' })
    expect(await themeOf(page)).toBe('dark')
    await context.close()
  })

  test('works when localStorage throws', async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: 'light' })
    // Third-party analytics answers 404 to headless localhost visits; stub it so only our errors count.
    await context.route('https://tinylytics.app/**', (route) =>
      route.fulfill({ contentType: 'text/javascript', body: '' }),
    )
    await context.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get() {
          throw new DOMException('Access denied', 'SecurityError')
        },
      })
    })
    const page = await context.newPage()
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto('/')
    expect(await themeOf(page)).toBe('light')
    await page.getByRole('button', { name: /dark|light/i }).click()
    expect(await themeOf(page)).toBe('dark')
    expect(errors).toEqual([])
    await context.close()
  })
})
