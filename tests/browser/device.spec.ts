import { test, expect, type Page } from '@playwright/test'
import { resolve } from 'node:path'
import type { Device } from '../../src/index'
import type { deviceProfiles } from '../../playwright.config'

declare global {
  interface Window {
    device: Device
  }
}

// Playwright compiles specs to CommonJS here (package.json has no "type": "module")
const scriptPath = resolve(__dirname, '../../dist/index.global.js')

const expected: Record<(typeof deviceProfiles)[number], { os: string; type: string; classes: string[] }> = {
  'Desktop Chrome': { os: 'windows', type: 'desktop', classes: ['windows', 'desktop'] },
  'Desktop Firefox': { os: 'windows', type: 'desktop', classes: ['windows', 'desktop'] },
  'Desktop Safari': { os: 'macos', type: 'desktop', classes: ['macos', 'desktop'] },
  'iPhone 15': { os: 'ios', type: 'mobile', classes: ['ios', 'iphone', 'mobile'] },
  'iPad Pro 11': { os: 'ios', type: 'tablet', classes: ['ios', 'ipad', 'tablet'] },
  'Pixel 7': { os: 'android', type: 'mobile', classes: ['android', 'mobile'] },
  'Galaxy Tab S4': { os: 'android', type: 'tablet', classes: ['android', 'tablet'] }
}

// Load the <script> build into a blank page, as a CDN user would
async function loadScript(page: Page): Promise<void> {
  await page.setContent('<!doctype html><html><head></head><body></body></html>')
  await page.addScriptTag({ path: scriptPath })
}

function htmlClasses(page: Page): Promise<string[]> {
  return page.evaluate(() => document.documentElement.className.split(/\s+/).filter(Boolean))
}

function orientationOf(size: { width: number; height: number }): 'portrait' | 'landscape' {
  return size.height > size.width ? 'portrait' : 'landscape'
}

test('detects the device and adds <html> classes', async ({ page }, testInfo) => {
  const want = expected[testInfo.project.name as keyof typeof expected]
  await loadScript(page)

  const result = await page.evaluate(() => ({
    os: window.device.os,
    type: window.device.type,
    orientation: window.device.orientation
  }))
  const viewport = page.viewportSize()!

  expect(result).toEqual({ os: want.os, type: want.type, orientation: orientationOf(viewport) })
  expect(await htmlClasses(page)).toEqual(expect.arrayContaining([...want.classes, result.orientation]))
})

test('adds only the `device` global', async ({ page }) => {
  await page.setContent('<!doctype html><html><head></head><body></body></html>')
  const before = await page.evaluate(() => Object.keys(window))
  await page.addScriptTag({ path: scriptPath })
  const added = await page.evaluate((before) => Object.keys(window).filter((key) => !before.includes(key)), before)
  expect(added).toEqual(['device'])
})

test('rotating updates orientation, classes and callbacks', async ({ page, isMobile }, testInfo) => {
  await loadScript(page)
  const start = page.viewportSize()!
  const rotated = { width: start.height, height: start.width }
  const target = orientationOf(rotated)

  if (!isMobile) {
    // Without orientationchange support the library follows window resizes.
    // Playwright's WebKit exposes onorientationchange even on desktop, so
    // there orientation follows the screen instead of the window.
    const hasOrientationEvent = await page.evaluate(() =>
      Object.prototype.hasOwnProperty.call(window, 'onorientationchange')
    )
    test.skip(hasOrientationEvent, `${testInfo.project.name} fires orientationchange, not resize`)
  }

  await page.evaluate(() => {
    ;(window as Window & { changes?: string[] }).changes = []
    window.device.onChangeOrientation((orientation) => {
      ;(window as Window & { changes?: string[] }).changes!.push(orientation)
    })
  })
  await page.setViewportSize(rotated)

  await expect.poll(() => page.evaluate(() => window.device.orientation)).toBe(target)
  expect(await page.evaluate(() => (window as Window & { changes?: string[] }).changes)).toContain(target)
  const classes = await htmlClasses(page)
  expect(classes).toContain(target)
  expect(classes).not.toContain(orientationOf(start))

  if (expected[testInfo.project.name as keyof typeof expected].os === 'ios') {
    // iOS reads window.orientation, which updates during orientationchange (#367)
    expect(await page.evaluate(() => Math.abs(window.orientation))).toBe(90)
  }
})
