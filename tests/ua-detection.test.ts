import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest'
import type { Device } from '../src/index'
import { uaFixtures } from './ua-strings'
import { expectConsistent, expectFixture } from './fixture-assertions'

// Store originals to restore after all tests
const originalUserAgent = navigator.userAgent
const originalPlatform = navigator.platform
const originalMaxTouchPoints = navigator.maxTouchPoints
const originalScreenWidth = screen.width
const originalScreenHeight = screen.height

function setScreen(width: number, height: number): void {
  Object.defineProperty(screen, 'width', { value: width, configurable: true, writable: true })
  Object.defineProperty(screen, 'height', { value: height, configurable: true, writable: true })
}

/**
 * Imports the device module fresh with a custom UA string.
 * Must be called after vi.resetModules().
 */
async function createDeviceWithUA(
  ua: string,
  overrides?: { platform?: string; maxTouchPoints?: number },
  screenOverrides?: { width: number; height: number }
): Promise<Device> {
  // Mock navigator.userAgent (read at module scope)
  Object.defineProperty(navigator, 'userAgent', {
    value: ua,
    configurable: true,
    writable: true,
  })

  // Always reset platform and maxTouchPoints to prevent state leaking
  // between tests. iPad detection uses these, so we must set explicit
  // defaults when no override is provided.
  Object.defineProperty(navigator, 'platform', {
    value: overrides?.platform ?? originalPlatform,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(navigator, 'maxTouchPoints', {
    value: overrides?.maxTouchPoints ?? originalMaxTouchPoints,
    configurable: true,
    writable: true,
  })

  // jsdom reports a 0x0 screen, which the library treats as unknown
  setScreen(screenOverrides?.width ?? originalScreenWidth, screenOverrides?.height ?? originalScreenHeight)

  // Note: jsdom has window.process (Node.js global), so device.nodeWebkit()
  // returns true. This only affects CSS class assignment, not device.os,
  // device.type, or detection method results — so we don't need to mock it.
  const { default: device } = await import('../src/index')

  return device
}

beforeEach(() => {
  vi.resetModules()
  document.documentElement.className = ''
})

afterAll(() => {
  // Restore original navigator properties
  Object.defineProperty(navigator, 'userAgent', {
    value: originalUserAgent,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(navigator, 'platform', {
    value: originalPlatform,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(navigator, 'maxTouchPoints', {
    value: originalMaxTouchPoints,
    configurable: true,
    writable: true,
  })
  setScreen(originalScreenWidth, originalScreenHeight)
})

describe('UA string detection', () => {
  for (const fixture of uaFixtures) {
    describe(fixture.name, () => {
      if (fixture.knownIssue) {
        // Fails until the bug is fixed; then remove `knownIssue` from the fixture
        it.fails(`known issue: ${fixture.knownIssue}`, async () => {
          const device = await createDeviceWithUA(fixture.ua, fixture.navigatorOverrides, fixture.screenOverrides)
          expectFixture(device, fixture)
          expectConsistent(device)
        })
        return
      }

      it(`detects os=${fixture.expected.os}, type=${fixture.expected.type}`, async () => {
        const device = await createDeviceWithUA(fixture.ua, fixture.navigatorOverrides, fixture.screenOverrides)

        expect(device.os).toBe(fixture.expected.os)
        expect(device.type).toBe(fixture.expected.type)
      })

      for (const [method, expectedResult] of Object.entries(fixture.expected.methods)) {
        it(`${method}() returns ${expectedResult}`, async () => {
          const device = await createDeviceWithUA(fixture.ua, fixture.navigatorOverrides, fixture.screenOverrides)
          const fn = device[method as keyof Device]
          expect(typeof fn, `device.${method} should be a function`).toBe('function')
          expect((fn as () => boolean).call(device)).toBe(expectedResult)
        })
      }

      it('is internally consistent', async () => {
        expectConsistent(await createDeviceWithUA(fixture.ua, fixture.navigatorOverrides, fixture.screenOverrides))
      })
    })
  }
})
