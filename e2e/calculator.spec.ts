import { expect, test } from '@playwright/test'

test('calculator handles basic arithmetic and keyboard input without a mode selector', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Miniräknarläge' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Beräkna' })).toBeVisible()
  await expect(page.getByText('Installera eller använd offline')).toHaveCount(0)
  await page.keyboard.type('2+3*4')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('14')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('calculator handles science, history, memory and persistence', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 })
  await page.goto('/')
  await page.getByRole('button', { name: 'sin' }).click()
  await page.getByRole('button', { name: '3' }).click()
  await page.getByRole('button', { name: '0' }).click()
  await page.getByRole('button', { name: ')' }).click()
  await page.getByRole('button', { name: 'Beräkna' }).click()
  await expect(page.getByRole('status')).toContainText('0,5')
  await page.getByRole('button', { name: 'M+' }).click()
  await expect(page.getByText('M', { exact: true })).toBeVisible()

  await expect(page.getByRole('dialog', { name: 'Historik' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Historik' }).click()
  await expect(page.getByRole('button', { name: /Återanvänd resultatet 0,5/ })).toBeVisible()
  await page.getByRole('button', { name: 'Stäng historik' }).last().click()

  await page.reload()
  await expect(page.getByText('M', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Historik' }).click()
  await expect(page.getByRole('button', { name: /Återanvänd resultatet 0,5/ })).toBeVisible()
})

test('small portrait phone keeps numeric keypad available and collapses functions after a choice', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const functions = page.getByRole('button', { name: /Funktioner/ })
  await expect(functions).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('button', { name: 'sin' })).toBeHidden()
  await expect(page.getByRole('button', { name: '7' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true)

  await functions.click()
  await expect(functions).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('button', { name: 'sin' }).click()
  await expect(functions).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('button', { name: '7' })).toBeVisible()
})

test('phone landscape shows scientific and numeric keypads side by side without scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 })
  await page.goto('/')

  const calculator = page.locator('.calculator-card')
  const advanced = page.locator('.advanced-controls')
  const basic = page.locator('.basic-keypad')
  const [calculatorBox, advancedBox, basicBox] = await Promise.all([
    calculator.boundingBox(),
    advanced.boundingBox(),
    basic.boundingBox(),
  ])

  expect(calculatorBox).not.toBeNull()
  expect(advancedBox).not.toBeNull()
  expect(basicBox).not.toBeNull()
  expect(advancedBox!.y).toBeCloseTo(basicBox!.y, 0)
  expect(advancedBox!.x).toBeLessThan(basicBox!.x)
  await expect(page.locator('.app-header')).toBeHidden()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true)
})

test('iPad-sized landscape viewport shows both keypads without page scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')

  const advancedBox = await page.locator('.advanced-controls').boundingBox()
  const basicBox = await page.locator('.basic-keypad').boundingBox()
  expect(advancedBox).not.toBeNull()
  expect(basicBox).not.toBeNull()
  expect(advancedBox!.y).toBeCloseTo(basicBox!.y, 0)
  expect(advancedBox!.x).toBeLessThan(basicBox!.x)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true)
})

test('theme persists after reload', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('combobox', { name: 'Tema' }).selectOption('dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('mathematical errors are recoverable without reloading', async ({ page }) => {
  await page.goto('/')
  await page.keyboard.type('1/0')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('Det går inte att dividera med noll.')
  await page.keyboard.press('Escape')
  await page.keyboard.type('7*8')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('56')
})

test('app shell works offline after the service worker takes control', async ({ page, context }) => {
  await page.goto('/')
  const manifest = await page.evaluate(async () => fetch('/manifest.webmanifest').then((response) => response.json()))
  expect(manifest.name).toContain('Miniräknaren')
  expect(manifest.icons).toHaveLength(2)
  await page.evaluate(async () => { await navigator.serviceWorker.ready })
  await page.reload()
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
  await context.setOffline(true)
  await page.reload()
  await page.keyboard.type('7*8')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('56')
  await context.setOffline(false)
})
