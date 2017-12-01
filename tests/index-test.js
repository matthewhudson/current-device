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

})
