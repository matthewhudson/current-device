import { describe, it, expect, vi, afterEach } from 'vitest'
import { createDevice } from '../src/core'
import type { Device } from '../src/core'

// `current-device/core` does nothing on import: it is imported statically
// here, and the first test checks that the page is untouched

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1'
const ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36'
const LINUX_UA = 'Mozilla/5.0 (X11; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0'

const originalUserAgent = navigator.userAgent
const originalWidth = window.innerWidth
const originalHeight = window.innerHeight

function setUserAgent(ua: string): void {
  Object.defineProperty(navigator, 'userAgent', { value: ua, configurable: true, writable: true })
}

function setViewport(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true, writable: true })
  Object.defineProperty(window, 'innerHeight', { value: height, configurable: true, writable: true })
}

function htmlClasses(): string[] {
  return document.documentElement.className.split(/\s+/).filter(Boolean)
}

// Each createDevice() call adds a resize listener; remove them between tests
const listeners: (() => void)[] = []
const addEventListener = window.addEventListener.bind(window)
window.addEventListener = function (type: string, listener: EventListenerOrEventListenerObject, ...rest: unknown[]) {
  listeners.push(() => window.removeEventListener(type, listener))
  return addEventListener(type, listener, ...(rest as [boolean | AddEventListenerOptions | undefined]))
} as typeof window.addEventListener

afterEach(() => {
  for (const remove of listeners.splice(0)) {
    remove()
  }
  setUserAgent(originalUserAgent)
  setViewport(originalWidth, originalHeight)
  document.documentElement.className = ''
  delete (window as { device?: Device }).device
})

describe('current-device/core', () => {
  it('does nothing on import', () => {
    expect(htmlClasses()).toEqual([])
    expect(window.device).toBeUndefined()
  })

  it('createDevice() adds the same classes as the main entry point', () => {
    setUserAgent(IPHONE_UA)
    setViewport(390, 844)
    const device = createDevice()

    expect(device.os).toBe('ios')
    expect(device.type).toBe('mobile')
    expect(device.orientation).toBe('portrait')
    expect(htmlClasses().sort()).toEqual(['ios', 'iphone', 'mobile', 'portrait'])
  })

  it('prefixes every class with classPrefix', () => {
    setUserAgent(IPHONE_UA)
    setViewport(390, 844)
    createDevice({ classPrefix: 'cd-' })

    expect(htmlClasses().sort()).toEqual(['cd-ios', 'cd-iphone', 'cd-mobile', 'cd-portrait'])
  })

  it('prefixes the runtime classes too', () => {
    // jsdom has window.process, so the library reports an NW.js/Electron runtime
    setUserAgent(LINUX_UA)
    setViewport(1200, 800)
    createDevice({ classPrefix: 'cd-' })

    expect(htmlClasses().sort()).toEqual(['cd-landscape', 'cd-node-webkit'])
  })

  it('updates the prefixed orientation class when the orientation changes', () => {
    setUserAgent(IPHONE_UA)
    setViewport(390, 844)
    const device = createDevice({ classPrefix: 'cd-' })
    const callback = vi.fn()
    device.onChangeOrientation(callback)

    setViewport(844, 390)
    window.dispatchEvent(new Event('resize'))

    expect(callback).toHaveBeenCalledWith('landscape')
    expect(device.orientation).toBe('landscape')
    expect(htmlClasses().sort()).toEqual(['cd-ios', 'cd-iphone', 'cd-landscape', 'cd-mobile'])
  })

  it('leaves the unprefixed classes of the page alone', () => {
    document.documentElement.className = 'mobile portrait'
    setUserAgent(IPHONE_UA)
    setViewport(390, 844)
    createDevice({ classPrefix: 'cd-' })
    setViewport(844, 390)
    window.dispatchEvent(new Event('resize'))

    expect(htmlClasses()).toEqual(expect.arrayContaining(['mobile', 'portrait', 'cd-landscape']))
    expect(htmlClasses()).not.toContain('cd-portrait')
  })

  it('does not define the `device` global', () => {
    setUserAgent(IPHONE_UA)
    const device = createDevice({ classPrefix: 'cd-' })

    expect(window.device).toBeUndefined()
    expect(device.noConflict()).toBe(device)
    expect(window.device).toBeUndefined()
  })

  it('noConflict() leaves a `device` global of the page alone', () => {
    const previous = {} as Device
    window.device = previous
    const device = createDevice({ classPrefix: 'cd-' })

    expect(window.device).toBe(previous)
    expect(device.noConflict()).toBe(device)
    expect(window.device).toBe(previous)
  })

  it('reads the user agent when called, not when imported', () => {
    setUserAgent(IPHONE_UA)
    const iphone = createDevice({ classPrefix: 'a-' })
    setUserAgent(ANDROID_UA)
    const android = createDevice({ classPrefix: 'b-' })

    expect(iphone.os).toBe('ios')
    expect(iphone.ios()).toBe(true)
    expect(android.os).toBe('android')
    expect(android.androidPhone()).toBe(true)
    expect(iphone.ios()).toBe(true)
  })

  it('gives every instance its own classes and callbacks', () => {
    setUserAgent(IPHONE_UA)
    setViewport(390, 844)
    const first = createDevice({ classPrefix: 'a-' })
    const second = createDevice({ classPrefix: 'b-' })
    const firstCallback = vi.fn()
    const secondCallback = vi.fn()
    first.onChangeOrientation(firstCallback)
    second.onChangeOrientation(secondCallback)()

    setViewport(844, 390)
    window.dispatchEvent(new Event('resize'))

    expect(htmlClasses()).toEqual(expect.arrayContaining(['a-mobile', 'a-landscape', 'b-mobile', 'b-landscape']))
    expect(firstCallback).toHaveBeenCalledTimes(1)
    expect(secondCallback).not.toHaveBeenCalled()
    expect(second.orientation).toBe('landscape')
  })
})
