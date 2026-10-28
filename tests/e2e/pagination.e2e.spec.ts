import { expect, test } from '@playwright/test'

// Runs against the sample content from `pnpm seed`.
test.describe('Load more and the WhatsApp button', () => {
  test('the collection page loads the next watches and fills the progress line', async ({ page }) => {
    await page.goto('http://localhost:3000/watches?availability=')
    const foot = page.locator('.finder .collection-foot')
    await expect(foot).toContainText('Showing 8 of')

    await foot.getByRole('link', { name: 'Load More Watches' }).click()
    await expect(page).toHaveURL(/show=16/)
    await expect(foot).not.toContainText('Showing 8 of')
    await expect(foot.getByRole('link')).toHaveCount(0)
  })

  test('the home collection opens its other cards without JavaScript', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    const cards = page.locator('#collection .collection-grid > li:visible')
    await expect(cards).toHaveCount(4)
    await page.locator('#collection label.collection-more').click()
    await expect(cards).toHaveCount(8)
  })

  test('the WhatsApp button sits in the corner of every page', async ({ page }) => {
    for (const path of ['/', '/watches']) {
      await page.goto(`http://localhost:3000${path}`)
      const chat = page.getByRole('link', { name: 'Chat on WhatsApp' })
      await expect(chat).toBeVisible()
      await expect(chat).toHaveAttribute('href', /^https:\/\/wa\.me\/\d+\?text=/)
    }
  })
})
