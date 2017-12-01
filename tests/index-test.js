import expect from 'expect'
import device from 'src'

describe('current-device', () => {
  it('Exports an `object`', () => {
    expect(device).toBeA('object');
  })

  describe('Exposes attributes for os, type, and orientation', () => {
    it('Exposes `os` string', () => {
      expect(device.os).toBeA('string');
    })
    it('Exposes `type` string', () => {
      expect(device.type).toBeA('string');
    })
    it('Exposes `orientation` string', () => {
      expect(device.orientation).toBeA('string');
    })
  })

  describe('Exposes functions for detecting various devices', () => {
    describe('Apple (iOS, macOS)', () => {
      it('Exposes a `macos` function', () => {
        expect(device.macos).toBeA('function');
      })
      it('Exposes a `ios` function', () => {
        expect(device.ios).toBeA('function');
      })
      it('Exposes a `iphone` function', () => {
        expect(device.iphone).toBeA('function');
      })
      it('Exposes a `ipad` function', () => {
        expect(device.ipad).toBeA('function');
      })
      it('Exposes a `ipod` function', () => {
        expect(device.ipod).toBeA('function');
      })
    })

    describe('Android', () => {
      it('Exposes a `android` function', () => {
        expect(device.android).toBeA('function');
      })
      it('Exposes a `androidPhone` function', () => {
        expect(device.androidPhone).toBeA('function');
      })
      it('Exposes a `androidTablet` function', () => {
        expect(device.androidTablet).toBeA('function');
      })
    })

    describe('Blackberry', () => {
      it('Exposes a `blackberry` function', () => {
        expect(device.blackberry).toBeA('function');
      })
      it('Exposes a `blackberryPhone` function', () => {
        expect(device.blackberryPhone).toBeA('function');
      })
      it('Exposes a `blackberryTablet` function', () => {
        expect(device.blackberryTablet).toBeA('function');
      })
    })

    describe('Windows', () => {
      it('Exposes a `windows` function', () => {
        expect(device.windows).toBeA('function');
      })
      it('Exposes a `windowsPhone` function', () => {
        expect(device.windowsPhone).toBeA('function');
      })
      it('Exposes a `windowsTablet` function', () => {
        expect(device.windowsTablet).toBeA('function');
      })
    })

    describe('Firefox OS', () => {
      it('Exposes a `fxos` function', () => {
        expect(device.fxos).toBeA('function');
      })
      it('Exposes a `fxosPhone` function', () => {
        expect(device.fxosPhone).toBeA('function');
      })
      it('Exposes a `fxosTablet` function', () => {
        expect(device.fxosTablet).toBeA('function');
      })
    })

    describe('Other', () => {
      it('Exposes a `meego` function', () => {
        expect(device.meego).toBeA('function');
      })
      it('Exposes a `cordova` function', () => {
        expect(device.cordova).toBeA('function');
      })
      it('Exposes a `nodeWebkit` function', () => {
        expect(device.nodeWebkit).toBeA('function');
      })
    })
  })
})
