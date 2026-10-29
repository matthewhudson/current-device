import { createDevice } from './core'
import type { Device } from './core'

export type { Device, DeviceOrientation, DeviceOs, DeviceType, OrientationChangeCallback } from './core'

declare global {
  interface Window {
    device: Device
  }
}

// False on a server (server-side rendering) and anywhere else without a DOM.
// There the module can still be imported: it adds no classes or listeners, and
// every detection method returns false.
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

// Save the previous value of the device variable.
const previousDevice = isBrowser ? window.device : undefined

// Adds the <html> classes and starts the orientation listener. To choose a
// class prefix, or to do this later than at import, use `current-device/core`
const device = createDevice()

// Add device as a global object.
if (isBrowser) {
  window.device = device
}

// Gives the `device` global back to whatever it held before current-device
// loaded, for pages where that name is taken (see the <script> build).
// Returns `device` itself, also when called unbound (`const { noConflict } = device`)
device.noConflict = function (): Device {
  if (isBrowser) {
    window.device = previousDevice as Device
  }
  return device
}

export default device
