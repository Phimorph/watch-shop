import { expect, test } from '@playwright/test'

// Runs against the sample content from `pnpm seed`.
test.describe('Collection search', () => {
  test('the header search finds watches by their description', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('http://localhost:3000/')
    const field = page.locator('.header-search input[name="q"]')
    await field.fill('chronograph')
    await field.press('Enter')

    await expect(page).toHaveURL(/\/watches\?q=chronograph/)
    await expect(page.getByRole('status')).toContainText('3')
    await expect(page.getByRole('heading', { name: 'Speedmaster Reduced' })).toBeVisible()
  })

  test('choosing a brand and applying narrows the results to that maker', async ({ page }) => {
    await page.goto('http://localhost:3000/watches')
    // The results stream in after the static shell; wait for them, then use the live form.
    await expect(page.getByRole('status')).toBeVisible()
    await page.getByRole('combobox', { name: 'Brand' }).selectOption('Rolex')
    await page.getByRole('combobox', { name: 'Availability' }).selectOption('')
    await page.getByRole('button', { name: 'Apply' }).click()

    await expect(page).toHaveURL(/brand=Rolex/)
    await expect(page.locator('.finder-chips')).toContainText('Rolex')
    for (const brand of await page.locator('.watch-card-meta span:first-child').allTextContents()) {
      expect(brand.toLowerCase()).toBe('rolex')
    }
  })

  test('a search with no match offers to find the watch', async ({ page }) => {
    await page.goto('http://localhost:3000/watches?q=nothing-matches-this')
    await expect(page.locator('.finder-empty h2')).toBeVisible()
    await expect(page.locator('.finder-empty a[href^="https://wa.me/"]')).toBeVisible()
  })
})
