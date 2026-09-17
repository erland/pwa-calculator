import { expect, test } from '@playwright/test'

test('375x812 portrait fits expanded functions and numeric keypad without page scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const functions = page.getByRole('button', { name: /Funktioner/ })
  await expect(functions).toHaveAttribute('aria-expanded', 'false')
  await functions.click()
  await expect(functions).toHaveAttribute('aria-expanded', 'true')

  await expect(page.getByRole('button', { name: 'Variabel x' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Eulers tal' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Beräkna' })).toBeVisible()

  const advancedKeypad = await page.locator('.advanced-keypad').boundingBox()
  const basicKeypad = await page.locator('.basic-keypad').boundingBox()
  expect(advancedKeypad).not.toBeNull()
  expect(basicKeypad).not.toBeNull()
  expect(advancedKeypad!.y + advancedKeypad!.height).toBeLessThanOrEqual(812)
  expect(basicKeypad!.y + basicKeypad!.height).toBeLessThanOrEqual(812)

  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('compact portrait still collapses functions after choosing x and shows landscape graph hint', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const functions = page.getByRole('button', { name: /Funktioner/ })
  await functions.click()
  await page.getByRole('button', { name: 'Variabel x' }).click()

  await expect(functions).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByText('Grafen visas i landskap.')).toBeVisible()
  await expect(page.getByRole('img', { name: /Graf för uttrycket x/ })).toBeHidden()
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true)
})
