import { describe, it, expect, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { JSDOM, ResourceLoader, VirtualConsole, type DOMWindow } from 'jsdom'
import type { Device } from '../../src/index'
import { uaFixtures, type UAFixture } from '../ua-strings'
import { expectConsistent, expectFixture } from '../fixture-assertions'

// These tests run against the built files in dist/ (run `pnpm run build`
// first). Each test gets a fresh jsdom window, so unlike the src/ tests there
// is no `window.process` and the real <html> classes can be asserted.

const distUrl = new URL('../../dist/', import.meta.url)
const iifeSource = readFileSync(new URL('index.global.js', distUrl), 'utf8')
const require = createRequire(import.meta.url)

type DeviceWindow = DOMWindow & { device?: unknown; scriptErrors: Error[] }

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1'

function createWindow(ua: string, overrides?: UAFixture['navigatorOverrides']): DeviceWindow {
  // jsdom reports errors thrown by <script> elements here instead of throwing
  const scriptErrors: Error[] = []
  const virtualConsole = new VirtualConsole()
  virtualConsole.on('jsdomError', (error) => scriptErrors.push(error))

  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
    runScripts: 'dangerously',
    resources: new ResourceLoader({ userAgent: ua }),
    virtualConsole,
  })
  const win = Object.assign(dom.window, { scriptErrors }) as DeviceWindow
  const { navigator } = win
  if (overrides?.platform !== undefined) {
    Object.defineProperty(navigator, 'platform', { value: overrides.platform, configurable: true })
  }
  if (overrides?.maxTouchPoints !== undefined) {
    Object.defineProperty(navigator, 'maxTouchPoints', { value: overrides.maxTouchPoints, configurable: true })
  }
  return win
}

// Load the <script> build with a real <script> element. (window.eval() is not
// equivalent: the build is strict mode, and in strict eval code top-level
// `var`s stay local instead of becoming globals, which would hide leaks.)
function loadScript(win: DeviceWindow): Device {
  const script = win.document.createElement('script')
  script.textContent = iifeSource
  win.document.head.appendChild(script)
  expect(win.scriptErrors).toEqual([])
  return win.device as Device
}

function htmlClasses(win: DeviceWindow): string[] {
  return win.document.documentElement.className.split(/\s+/).filter(Boolean)
}

function setViewport(win: DeviceWindow, width: number, height: number): void {
  Object.defineProperty(win, 'innerWidth', { value: width, configurable: true })
  Object.defineProperty(win, 'innerHeight', { value: height, configurable: true })
}

// The <html> classes must agree with what the JS API reports
function expectClassesMatch(win: DeviceWindow, device: Device): void {
  const classes = htmlClasses(win)
  expect(classes).toContain(device.orientation)
  if (device.os === 'television') {
    expect(classes).toContain('television')
  } else {
    expect(classes).toContain(device.type)
  }
  if (device.os !== 'unknown') {
    expect(classes).toContain(device.os)
  }
}

describe('dist/index.global.js (<script> build)', () => {
  describe('UA string detection', () => {
    for (const fixture of uaFixtures) {
      const check = (): void => {
        const win = createWindow(fixture.ua, fixture.navigatorOverrides)
        const device = loadScript(win)
        expectFixture(device, fixture)
        expectConsistent(device)
        expectClassesMatch(win, device)
      }
      if (fixture.knownIssue) {
        // Fails until the bug is fixed; then remove `knownIssue` from the fixture
        it.fails(`${fixture.name} (known issue: ${fixture.knownIssue})`, check)
      } else {
        it(fixture.name, check)
      }
    }
  })

  it('adds only the `device` global', () => {
    const win = createWindow(IPHONE_UA)
    const before = new Set(Object.keys(win))
    loadScript(win)
    expect(Object.keys(win).filter((key) => !before.has(key))).toEqual(['device'])
  })

  it('noConflict() restores the previous window.device', () => {
    const win = createWindow(IPHONE_UA)
    const previous = { mine: true }
    win.device = previous
    const device = loadScript(win)

    expect(device.noConflict()).toBe(device)
    expect(win.device).toBe(previous)
  })

  it('updates orientation classes and calls callbacks on resize', () => {
    const win = createWindow(IPHONE_UA)
    setViewport(win, 390, 844)
    const device = loadScript(win)
    expect(device.orientation).toBe('portrait')

    const callback = vi.fn()
    device.onChangeOrientation(callback)
    setViewport(win, 844, 390)
    win.dispatchEvent(new win.Event('resize'))

    expect(callback).toHaveBeenCalledWith('landscape')
    expect(device.orientation).toBe('landscape')
    expect(htmlClasses(win)).toContain('landscape')
    expect(htmlClasses(win)).not.toContain('portrait')
  })
})

// The CJS and ESM builds read browser globals at import time, so expose a
// jsdom window's globals on globalThis while loading them
const GLOBALS = ['window', 'document', 'navigator', 'screen', 'location'] as const
const savedGlobals = new Map<string, PropertyDescriptor | undefined>()

function installGlobals(win: DeviceWindow): void {
  for (const name of GLOBALS) {
    savedGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name))
    Object.defineProperty(globalThis, name, { value: win[name], configurable: true, writable: true })
  }
}

afterEach(() => {
  for (const [name, descriptor] of savedGlobals) {
    if (descriptor) {
      Object.defineProperty(globalThis, name, descriptor)
    } else {
      delete (globalThis as Record<string, unknown>)[name]
    }
  }
  savedGlobals.clear()
})

describe('dist/index.js (CommonJS build)', () => {
  it('exports the device object as `default`', () => {
    const win = createWindow(IPHONE_UA)
    installGlobals(win)
    const path = require.resolve('../../dist/index.js')
    delete require.cache[path]
    const mod = require(path) as { default: Device; __esModule?: boolean }

    expect(mod.__esModule).toBe(true)
    expect(mod.default.os).toBe('ios')
    expect(mod.default.type).toBe('mobile')
    expect(htmlClasses(win)).toEqual(expect.arrayContaining(['ios', 'iphone', 'mobile']))
  })
})

describe('dist/index.mjs (ES module build)', () => {
  it('exports the device object as the default export', async () => {
    const win = createWindow(IPHONE_UA)
    installGlobals(win)
    const mod = (await import(new URL('index.mjs', distUrl).href)) as { default: Device }

    expect(mod.default.os).toBe('ios')
    expect(mod.default.type).toBe('mobile')
    expect(htmlClasses(win)).toEqual(expect.arrayContaining(['ios', 'iphone', 'mobile']))
  })
})

// On a server there are no browser globals at all
describe('Without a DOM (server-side rendering)', () => {
  it('dist/index.js can be required', () => {
    const path = require.resolve('../../dist/index.js')
    delete require.cache[path]
    const mod = require(path) as { default: Device }

    expect(mod.default.type).toBe('unknown')
    expect(mod.default.os).toBe('unknown')
    expect(mod.default.orientation).toBe('unknown')
    expect(mod.default.desktop()).toBe(false)
  })

  it('dist/index.mjs can be imported', async () => {
    const url = new URL('index.mjs', distUrl)
    url.search = '?server'
    const mod = (await import(url.href)) as { default: Device }

    expect(mod.default.type).toBe('unknown')
    expect(mod.default.orientation).toBe('unknown')
  })
})

// `current-device/react` resolves through the package's own exports
describe('current-device/react (React hooks)', () => {
  type Hooks = typeof import('../../src/react')

  function render(hooks: Hooks): string {
    const { createElement } = require('react') as typeof import('react')
    const { renderToString } = require('react-dom/server') as typeof import('react-dom/server')
    function Probe() {
      const { type, os } = hooks.useDevice()
      return createElement('p', null, [type, os, hooks.useOrientation()].join(' '))
    }
    return renderToString(createElement(Probe))
  }

  it('dist/react.js renders on a server', () => {
    expect(render(require('current-device/react') as Hooks)).toBe('<p>unknown unknown unknown</p>')
  })

  it('dist/react.mjs renders on a server', async () => {
    // @ts-ignore -- resolves to dist/, which only exists after a build
    const hooks = (await import('current-device/react')) as Hooks
    expect(render(hooks)).toBe('<p>unknown unknown unknown</p>')
  })

  it('uses the device of the main entry point instead of its own copy', () => {
    for (const file of ['react.js', 'react.mjs']) {
      const source = readFileSync(new URL(file, distUrl), 'utf8')
      expect(source, file).toMatch(/(require\(|from )"current-device"/)
      expect(source, file).not.toContain('userAgent')
    }
  })
})
