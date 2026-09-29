// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import type { Device } from '../src/index'

// These tests run without a DOM, like server-side rendering does: there is no
// `window`, `document`, `screen` or `location`.

const METHODS = [
  'macos',
  'ios',
  'iphone',
  'ipod',
  'ipad',
  'android',
  'androidPhone',
  'androidTablet',
  'blackberry',
  'blackberryPhone',
  'blackberryTablet',
  'windows',
  'windowsPhone',
  'windowsTablet',
  'fxos',
  'fxosPhone',
  'fxosTablet',
  'meego',
  'harmonyos',
  'chromeos',
  'linux',
  'television',
  'cordova',
  'nodeWebkit',
  'mobile',
  'tablet',
  'desktop',
  'portrait',
  'landscape',
] as const

describe('Without a DOM (server-side rendering)', () => {
  it('has no window or document', () => {
    expect(typeof window).toBe('undefined')
    expect(typeof document).toBe('undefined')
  })

  it('can be imported', async () => {
    const { default: device } = await import('../src/index')
    expect(typeof device).toBe('object')
  })

  it('returns false from every detection method', async () => {
    const { default: device } = await import('../src/index')
    for (const method of METHODS) {
      expect(device[method](), method).toBe(false)
    }
  })

  it('reports type, os and orientation as unknown', async () => {
    const { default: device } = await import('../src/index')
    expect(device.type).toBe('unknown')
    expect(device.os).toBe('unknown')
    expect(device.orientation).toBe('unknown')
  })

  it('accepts orientation callbacks, and never calls them', async () => {
    const { default: device } = await import('../src/index')
    const callback = vi.fn()
    const unsubscribe = device.onChangeOrientation(callback)
    expect(typeof unsubscribe).toBe('function')
    unsubscribe()
    expect(callback).not.toHaveBeenCalled()
  })

  it('noConflict() returns the device', async () => {
    const { default: device } = await import('../src/index')
    expect(device.noConflict()).toBe(device)
    expect((globalThis as { device?: Device }).device).toBeUndefined()
  })

  it('renders the React hooks with unknown values', async () => {
    const { useDevice, useOrientation } = await import('../src/react')
    function Probe() {
      const { type, os, orientation } = useDevice()
      return createElement('p', null, [type, os, orientation, useOrientation()].join(' '))
    }
    expect(renderToString(createElement(Probe))).toBe('<p>unknown unknown unknown unknown</p>')
  })
})
