import { expect, test } from '@playwright/test'

test('simple mode calculates with operator precedence and keyboard', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.type('2+3*4')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('14')
  await expect(page.getByRole('button', { name: 'Kvadratrot' })).toHaveCount(0)
})

test('advanced mode handles science, history, memory and persistence', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Avancerad' }).click()
  await page.keyboard.type('sin(30)')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('0,5')
  await page.getByRole('button', { name: 'M+' }).click()
  await expect(page.getByText('M', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /Återanvänd resultatet 0,5/ })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Avancerad' })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: /Återanvänd resultatet 0,5/ })).toBeVisible()
  await expect(page.getByText('M', { exact: true })).toBeVisible()
})

test('mode switch preserves a pending calculation', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.type('12+7')
  await page.getByRole('button', { name: 'Avancerad' }).click()
  await page.getByRole('button', { name: 'Enkel' }).click()
  await expect(page.getByRole('status')).toContainText('12+7')
})

test('theme persists after reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Tema' }).selectOption('dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('app shell works offline after the service worker takes control', async ({ page, context }) => {
  await page.goto('/')
  await page.waitForFunction(() => 'serviceWorker' in navigator)
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await context.setOffline(true)
  await page.reload()
  await page.keyboard.type('7*8')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('56')
  await context.setOffline(false)
})
