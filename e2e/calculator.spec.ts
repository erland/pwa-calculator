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

test('small portrait phone keeps graphing compact and collapses functions after choosing x', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const functions = page.getByRole('button', { name: /Funktioner/ })
  await expect(functions).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByRole('button', { name: 'Variabel x' })).toBeHidden()
  await expect(page.getByRole('button', { name: '7' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true)

  await functions.click()
  await page.getByRole('button', { name: 'Variabel x' }).click()
  await expect(functions).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByText('Grafen visas i landskap.')).toBeVisible()
  await expect(page.getByRole('img', { name: /Graf för uttrycket x/ })).toBeHidden()
  await expect(page.getByRole('button', { name: '7' })).toBeVisible()
})

test('phone landscape keeps numeric keypad fixed when x activates the graph', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 })
  await page.goto('/')

  const advanced = page.locator('.advanced-controls')
  const basic = page.locator('.basic-keypad')
  const beforeBasic = await basic.boundingBox()
  const advancedBox = await advanced.boundingBox()
  expect(beforeBasic).not.toBeNull()
  expect(advancedBox).not.toBeNull()
  expect(advancedBox!.x).toBeGreaterThan(beforeBasic!.x)

  await page.getByRole('button', { name: 'Variabel x' }).click()
  const graph = page.getByRole('img', { name: /Graf för uttrycket x/ })
  await expect(graph).toBeVisible()
  await expect(advanced).toBeHidden()

  const afterBasic = await basic.boundingBox()
  expect(afterBasic).not.toBeNull()
  expect(afterBasic!.x).toBeCloseTo(beforeBasic!.x, 0)
  expect(afterBasic!.y).toBeCloseTo(beforeBasic!.y, 0)

  const functions = page.getByRole('button', { name: /Funktioner/ })
  await expect(functions).toBeVisible()
  await functions.click()
  await expect(advanced).toBeVisible()
  await expect(graph).toBeHidden()
  const functionsBasic = await basic.boundingBox()
  expect(functionsBasic!.x).toBeCloseTo(beforeBasic!.x, 0)
  expect(functionsBasic!.y).toBeCloseTo(beforeBasic!.y, 0)

  await expect(page.locator('.app-header')).toBeHidden()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true)
})

test('iPad-sized landscape viewport renders graph in the secondary workspace without moving keypad', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')

  const basic = page.locator('.basic-keypad')
  const beforeBasic = await basic.boundingBox()
  const advancedBox = await page.locator('.advanced-controls').boundingBox()
  expect(beforeBasic).not.toBeNull()
  expect(advancedBox).not.toBeNull()
  expect(advancedBox!.x).toBeGreaterThan(beforeBasic!.x)

  await page.getByRole('button', { name: 'Variabel x' }).click()
  await expect(page.getByRole('img', { name: /Graf för uttrycket x/ })).toBeVisible()
  const afterBasic = await basic.boundingBox()
  expect(afterBasic).not.toBeNull()
  expect(afterBasic!.x).toBeCloseTo(beforeBasic!.x, 0)
  expect(afterBasic!.y).toBeCloseTo(beforeBasic!.y, 0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true)
})

test('keyboard x input activates graphing in landscape', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 })
  await page.goto('/')
  await page.keyboard.type('x^2-4')
  await expect(page.getByRole('img', { name: /Graf för uttrycket x\^2-4/ })).toBeVisible()
})

test('graph viewport can zoom, pan and reset without moving the keypad', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto('/')
  await page.keyboard.type('x^2')

  const graph = page.getByRole('img', { name: /Graf för uttrycket x\^2/ })
  const reset = page.getByRole('button', { name: 'Återställ graf' })
  const keypad = page.locator('.basic-keypad')
  await expect(graph).toBeVisible()
  await expect(reset).toBeDisabled()
  const keypadBefore = await keypad.boundingBox()
  const graphBox = await graph.boundingBox()
  expect(keypadBefore).not.toBeNull()
  expect(graphBox).not.toBeNull()

  await graph.hover({ position: { x: graphBox!.width / 2, y: graphBox!.height / 2 } })
  await page.mouse.wheel(0, -300)
  await expect(reset).toBeEnabled()

  const centerX = graphBox!.x + graphBox!.width / 2
  const centerY = graphBox!.y + graphBox!.height / 2
  await page.mouse.move(centerX, centerY)
  await page.mouse.down()
  await page.mouse.move(centerX + 60, centerY + 30, { steps: 4 })
  await page.mouse.up()

  const keypadAfterInteraction = await keypad.boundingBox()
  expect(keypadAfterInteraction!.x).toBeCloseTo(keypadBefore!.x, 0)
  expect(keypadAfterInteraction!.y).toBeCloseTo(keypadBefore!.y, 0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= window.innerHeight)).toBe(true)

  await reset.click()
  await expect(reset).toBeDisabled()
  const keypadAfterReset = await keypad.boundingBox()
  expect(keypadAfterReset!.x).toBeCloseTo(keypadBefore!.x, 0)
  expect(keypadAfterReset!.y).toBeCloseTo(keypadBefore!.y, 0)
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
