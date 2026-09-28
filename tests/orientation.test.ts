import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Device } from '../src/index'

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.4 Mobile/15E148 Safari/604.1'
const ANDROID_TABLET_UA =
  'Mozilla/5.0 (Linux; Android 13; SM-X700) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const originalUserAgent = navigator.userAgent

/**
 * Simulates a mobile browser that exposes both `window.orientation` and
 * `screen.orientation` (e.g. Safari on iOS 16.4+), then imports the device
 * module fresh.
 */
async function createDevice(options: {
  ua: string
  windowOrientation: number
  screenOrientationType: string
}): Promise<Device> {
  Object.defineProperty(navigator, 'userAgent', {
    value: options.ua,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(window, 'orientation', {
    value: options.windowOrientation,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(window, 'onorientationchange', {
    value: null,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(screen, 'orientation', {
    value: { type: options.screenOrientationType },
    configurable: true,
    writable: true,
  })

  const { default: device } = await import('../src/index')
  return device
}

function setWindowOrientation(value: number): void {
  Object.defineProperty(window, 'orientation', { value, configurable: true, writable: true })
}

beforeEach(() => {
  vi.resetModules()
  document.documentElement.className = ''
})

afterEach(() => {
  Object.defineProperty(navigator, 'userAgent', {
    value: originalUserAgent,
    configurable: true,
    writable: true,
  })
  const win = window as unknown as Record<string, unknown>
  delete win.orientation
  delete win.onorientationchange
  delete (screen as unknown as Record<string, unknown>).orientation
})

// Safari on iOS 16.4+ exposes `screen.orientation`, but during the
// `orientationchange` event it still reports the previous orientation.
// `window.orientation` is updated in time, so iOS must prefer it (#367).
describe('Orientation on iOS with a stale screen.orientation (#367)', () => {
  it('uses window.orientation for landscape()/portrait()', async () => {
    const device = await createDevice({
      ua: IPHONE_UA,
      windowOrientation: 90,
      screenOrientationType: 'portrait-primary',
    })

    expect(device.landscape()).toBe(true)
    expect(device.portrait()).toBe(false)
    expect(device.orientation).toBe('landscape')
    expect(document.documentElement.className).toContain('landscape')
  })

  it('reports the new orientation when orientationchange fires', async () => {
    const device = await createDevice({
      ua: IPHONE_UA,
      windowOrientation: 0,
      screenOrientationType: 'portrait-primary',
    })
    const callback = vi.fn()
    device.onChangeOrientation(callback)

    // Rotate: window.orientation updates, screen.orientation is still stale
    setWindowOrientation(-90)
    window.dispatchEvent(new Event('orientationchange'))

    expect(callback).toHaveBeenCalledWith('landscape')
    expect(device.orientation).toBe('landscape')
    expect(document.documentElement.className).toContain('landscape')
    expect(document.documentElement.className).not.toContain('portrait')
  })
})

describe('Orientation on non-iOS devices', () => {
  // window.orientation is relative to the device's natural orientation, so on
  // a landscape-native Android tablet 0 means landscape. screen.orientation
  // must keep winning outside iOS.
  it('prefers screen.orientation over window.orientation', async () => {
    const device = await createDevice({
      ua: ANDROID_TABLET_UA,
      windowOrientation: 0,
      screenOrientationType: 'landscape-primary',
    })

    expect(device.landscape()).toBe(true)
    expect(device.portrait()).toBe(false)
  })
})
