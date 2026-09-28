import { expect } from 'vitest'
import type { Device } from '../src/index'
import type { UAFixture } from './ua-strings'

// Operating-system families that can't apply to the same device.
// (harmonyos and chromeos are excluded: HarmonyOS devices are also android by
// design, and so is an Android app running on a Chromebook.)
const OS_FAMILIES = [
  'ios',
  'android',
  'blackberry',
  'windows',
  'fxos',
  'meego',
  'macos',
  'linux'
] as const

// Everything a fixture expects: os, type and each listed method
export function expectFixture(device: Device, fixture: UAFixture): void {
  expect(device.os, 'device.os').toBe(fixture.expected.os)
  expect(device.type, 'device.type').toBe(fixture.expected.type)
  for (const [method, expected] of Object.entries(fixture.expected.methods)) {
    const fn = device[method as keyof Device]
    expect(typeof fn, `device.${method} should be a function`).toBe('function')
    expect((fn as () => boolean).call(device), `device.${method}()`).toBe(expected)
  }
}

// Rules every detection result must satisfy, whatever the UA
export function expectConsistent(device: Device): void {
  const types = (['mobile', 'tablet', 'desktop'] as const).filter((type) => device[type]())
  expect(types, 'exactly one of mobile()/tablet()/desktop() is true, matching device.type').toEqual([device.type])

  const families = OS_FAMILIES.filter((os) => device[os]())
  expect(families.length, `at most one OS family is detected, got: ${families.join(', ')}`).toBeLessThanOrEqual(1)

  // chromeos() and linux() are never both true: ChromeOS is not desktop Linux
  expect(device.chromeos() && device.linux(), 'chromeos() and linux() are both true').toBe(false)

  // A television is neither a phone nor a tablet
  if (device.television()) {
    expect(device.type, 'a television has type desktop').toBe('desktop')
  }
}
