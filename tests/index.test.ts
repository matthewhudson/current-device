import { describe, it, expect } from 'vitest'
import device from '../src/index'
import type { Device } from '../src/index'

describe('current-device', () => {
  it('Exports an `object`', () => {
    expect(typeof device).toBe('object')
  })

  describe('Exposes attributes for os, type, and orientation', () => {
    it('Exposes `os` string', () => {
      expect(typeof device.os).toBe('string')
    })
    it('Exposes `type` string', () => {
      expect(typeof device.type).toBe('string')
    })
    it('Exposes `orientation` string', () => {
      expect(typeof device.orientation).toBe('string')
    })
  })

  describe('Exposes functions for detecting device `os`', () => {
    describe('Apple (iOS, macOS)', () => {
      it('Exposes a `macos` function', () => {
        expect(typeof device.macos).toBe('function')
      })
      it('Exposes a `ios` function', () => {
        expect(typeof device.ios).toBe('function')
      })
      it('Exposes a `iphone` function', () => {
        expect(typeof device.iphone).toBe('function')
      })
      it('Exposes a `ipad` function', () => {
        expect(typeof device.ipad).toBe('function')
      })
      it('Exposes a `ipod` function', () => {
        expect(typeof device.ipod).toBe('function')
      })
    })

    describe('Android', () => {
      it('Exposes a `android` function', () => {
        expect(typeof device.android).toBe('function')
      })
      it('Exposes a `androidPhone` function', () => {
        expect(typeof device.androidPhone).toBe('function')
      })
      it('Exposes a `androidTablet` function', () => {
        expect(typeof device.androidTablet).toBe('function')
      })
    })

    describe('Blackberry', () => {
      it('Exposes a `blackberry` function', () => {
        expect(typeof device.blackberry).toBe('function')
      })
      it('Exposes a `blackberryPhone` function', () => {
        expect(typeof device.blackberryPhone).toBe('function')
      })
      it('Exposes a `blackberryTablet` function', () => {
        expect(typeof device.blackberryTablet).toBe('function')
      })
    })

    describe('Windows', () => {
      it('Exposes a `windows` function', () => {
        expect(typeof device.windows).toBe('function')
      })
      it('Exposes a `windowsPhone` function', () => {
        expect(typeof device.windowsPhone).toBe('function')
      })
      it('Exposes a `windowsTablet` function', () => {
        expect(typeof device.windowsTablet).toBe('function')
      })
    })

    describe('Firefox OS', () => {
      it('Exposes a `fxos` function', () => {
        expect(typeof device.fxos).toBe('function')
      })
      it('Exposes a `fxosPhone` function', () => {
        expect(typeof device.fxosPhone).toBe('function')
      })
      it('Exposes a `fxosTablet` function', () => {
        expect(typeof device.fxosTablet).toBe('function')
      })
    })

    describe('Other', () => {
      it('Exposes a `meego` function', () => {
        expect(typeof device.meego).toBe('function')
      })
      it('Exposes a `cordova` function', () => {
        expect(typeof device.cordova).toBe('function')
      })
      it('Exposes a `nodeWebkit` function', () => {
        expect(typeof device.nodeWebkit).toBe('function')
      })
    })
  })

  describe('Exposes functions for detecting device `type`', () => {
    it('Exposes a `desktop` function', () => {
      expect(typeof device.desktop).toBe('function')
    })
    it('Exposes a `tablet` function', () => {
      expect(typeof device.tablet).toBe('function')
    })
    it('Exposes a `mobile` function', () => {
      expect(typeof device.mobile).toBe('function')
    })
    it('Exposes a `television` function', () => {
      expect(typeof device.television).toBe('function')
    })
  })

  describe('Exposes functions for detecting device `orientation`', () => {
    it('Exposes a `portrait` function', () => {
      expect(typeof device.portrait).toBe('function')
    })
    it('Exposes a `landscape` function', () => {
      expect(typeof device.landscape).toBe('function')
    })
  })

  describe('Exposes helper functions', () => {
    it('Exposes a `noConflict` function', () => {
      expect(typeof device.noConflict).toBe('function')
    })
    it('Restores the previous value of the `device` global object when `noConflict` is called', () => {
      const deviceInstance: Device = device.noConflict()
      // previousDevice was undefined before the module loaded in jsdom
      expect(window.device).toBeUndefined()
      expect(deviceInstance).toBe(device)
      // Restore for subsequent tests
      window.device = device
    })
    it('Exposes a `onChangeOrientation` function', () => {
      expect(typeof device.onChangeOrientation).toBe('function')
    })
    it('Calls the provided callback when orientation changes using `onChangeOrientation`', () => {
      return new Promise<void>((resolve) => {
        const callback = (newOrientation: string): void => {
          expect(typeof newOrientation).toBe('string')
          resolve()
        }
        device.onChangeOrientation(callback)
        // Trigger orientation recalculation via resize event
        window.dispatchEvent(new Event('resize'))
      })
    })
  })

  describe('HTML Element Handling', () => {
    it('Adds the correct CSS classes to the <html> element based on the user agent', () => {
      const classNames = document.documentElement.className.split(' ')

      // In jsdom (Node.js), window.process exists so nodeWebkit() is true,
      // which adds 'node-webkit' instead of os/type classes
      if (device.nodeWebkit()) {
        expect(classNames).toContain('node-webkit')
      } else {
        if (device.os !== 'unknown') {
          expect(classNames).toContain(device.os)
        }
        if (device.type !== 'unknown') {
          expect(classNames).toContain(device.type)
        }
      }
      if (device.orientation !== 'unknown') {
        expect(classNames).toContain(device.orientation)
      }
    })
  })
})
