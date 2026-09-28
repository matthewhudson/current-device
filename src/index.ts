export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'unknown'
export type DeviceOrientation = 'landscape' | 'portrait' | 'unknown'
export type DeviceOs =
  | 'ios'
  | 'iphone'
  | 'ipad'
  | 'ipod'
  | 'android'
  | 'blackberry'
  | 'macos'
  | 'windows'
  | 'fxos'
  | 'meego'
  | 'television'
  | 'harmonyos'
  | 'chromeos'
  | 'linux'
  | 'unknown'

export type OrientationChangeCallback = (newOrientation: 'landscape' | 'portrait') => void

export interface Device {
  macos(): boolean
  ios(): boolean
  iphone(): boolean
  ipod(): boolean
  ipad(): boolean
  android(): boolean
  androidPhone(): boolean
  androidTablet(): boolean
  blackberry(): boolean
  blackberryPhone(): boolean
  blackberryTablet(): boolean
  windows(): boolean
  windowsPhone(): boolean
  windowsTablet(): boolean
  fxos(): boolean
  fxosPhone(): boolean
  fxosTablet(): boolean
  meego(): boolean
  harmonyos(): boolean
  chromeos(): boolean
  linux(): boolean
  television(): boolean
  cordova(): boolean
  nodeWebkit(): boolean
  mobile(): boolean
  tablet(): boolean
  desktop(): boolean
  portrait(): boolean
  landscape(): boolean
  onChangeOrientation(cb: OrientationChangeCallback): () => void
  noConflict(): Device
  type: DeviceType
  os: DeviceOs
  orientation: DeviceOrientation
}

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

const device = {} as Device

const changeOrientationList: OrientationChangeCallback[] = []

// Add device as a global object.
if (isBrowser) {
  window.device = device
}

// The <html> element.
const documentElement = isBrowser ? window.document.documentElement : undefined

// The client user agent string.
// Lowercase, so we can use the more efficient indexOf(), instead of Regex
const userAgent = isBrowser ? window.navigator.userAgent.toLowerCase() : ''

// Detectable television devices.
const televisionDevices: string[] = [
  'googletv',
  'viera',
  'smarttv',
  'smart-tv',
  'internet.tv',
  'netcast',
  'nettv',
  'appletv',
  'boxee',
  'kylo',
  'roku',
  'dlnadoc',
  'pov_tv',
  'hbbtv',
  'ce-html'
]

// Private Utility Functions
// -------------------------

// Check if element exists
function includes(haystack: string, needle: string): boolean {
  return haystack.indexOf(needle) !== -1
}

// Simple UA string search
function find(needle: string): boolean {
  return includes(userAgent, needle)
}

// Add one or more CSS classes (space-separated) to the <html> element.
function addClass(classNames: string): void {
  if (!documentElement) {
    return
  }
  const names = classNames.split(' ')
  for (let i = 0; i < names.length; i++) {
    documentElement.classList.add(names[i])
  }
}

// Remove a single CSS class from the <html> element.
function removeClass(className: string): void {
  if (!documentElement) {
    return
  }
  documentElement.classList.remove(className)
}

// Main functions
// --------------

// Windows Phone 8.1 UAs contain "like iPhone OS ... Mac OS X", and some
// Android devices have "Mac" in their model name
device.macos = function (): boolean {
  return (
    find('mac') && !device.ios() && !device.windows() && !device.android()
  )
}

device.ios = function (): boolean {
  return device.iphone() || device.ipod() || device.ipad()
}

// Some iPad UAs say "iPad; CPU iPhone OS"
device.iphone = function (): boolean {
  return !device.windows() && find('iphone') && !find('ipad')
}

device.ipod = function (): boolean {
  return find('ipod')
}

device.ipad = function (): boolean {
  // iPadOS 13+ sends a Mac user agent; unlike a Mac, it has a touchscreen
  const iPadOS13Up =
    find('macintosh') &&
    navigator.platform === 'MacIntel' &&
    navigator.maxTouchPoints > 1
  return find('ipad') || iPadOS13Up
}

device.android = function (): boolean {
  return !device.windows() && find('android')
}

device.androidPhone = function (): boolean {
  return device.android() && find('mobile')
}

device.androidTablet = function (): boolean {
  return device.android() && !find('mobile')
}

// The BlackBerry PlayBook's UA says "RIM Tablet OS" instead of BlackBerry
device.blackberry = function (): boolean {
  return find('blackberry') || find('bb10') || find('rim tablet os')
}

device.blackberryPhone = function (): boolean {
  return device.blackberry() && !find('tablet')
}

device.blackberryTablet = function (): boolean {
  return device.blackberry() && find('tablet')
}

device.windows = function (): boolean {
  return find('windows')
}

device.windowsPhone = function (): boolean {
  return device.windows() && find('phone')
}

device.windowsTablet = function (): boolean {
  return device.windows() && (find('touch') && !device.windowsPhone())
}

// Windows Phone 8.1 UAs also start with "(Mobile;" and contain " rv:"
device.fxos = function (): boolean {
  return (find('(mobile') || find('(tablet')) && find(' rv:') && !device.windows()
}

device.fxosPhone = function (): boolean {
  return device.fxos() && find('mobile')
}

device.fxosTablet = function (): boolean {
  return device.fxos() && find('tablet')
}

device.meego = function (): boolean {
  return find('meego')
}

device.harmonyos = function (): boolean {
  return find('harmonyos')
}

// Match " cros " with spaces: "microsoft" also contains "cros"
device.chromeos = function (): boolean {
  return find(' cros ')
}

// Android, HarmonyOS and many smart TVs also report "Linux" in their UA
device.linux = function (): boolean {
  return find('linux') && !device.android() && !device.television()
}

device.cordova = function (): boolean {
  return (
    isBrowser &&
    !!(window as Window & { cordova?: unknown }).cordova &&
    location.protocol === 'file:'
  )
}

device.nodeWebkit = function (): boolean {
  return isBrowser && typeof (window as Window & { process?: unknown }).process === 'object'
}

device.mobile = function (): boolean {
  return (
    device.androidPhone() ||
    device.iphone() ||
    device.ipod() ||
    device.windowsPhone() ||
    device.blackberryPhone() ||
    device.fxosPhone() ||
    device.meego()
  )
}

device.tablet = function (): boolean {
  return (
    device.ipad() ||
    device.androidTablet() ||
    device.blackberryTablet() ||
    device.windowsTablet() ||
    device.fxosTablet()
  )
}

device.desktop = function (): boolean {
  return isBrowser && !device.tablet() && !device.mobile()
}

device.television = function (): boolean {
  let i = 0
  while (i < televisionDevices.length) {
    if (find(televisionDevices[i])) {
      return true
    }
    i++
  }
  return false
}

device.portrait = function (): boolean {
  if (!isBrowser) {
    return false
  }
  // Check iOS first: Safari 16.4+ exposes screen.orientation, but it still
  // reports the previous orientation during the orientationchange event (#367)
  if (
    device.ios() &&
    Object.prototype.hasOwnProperty.call(window, 'orientation')
  ) {
    return Math.abs(window.orientation as number) !== 90
  }
  if (
    screen.orientation &&
    Object.prototype.hasOwnProperty.call(window, 'onorientationchange')
  ) {
    return includes(screen.orientation.type, 'portrait')
  }
  // A square viewport is portrait, as in CSS `(orientation: portrait)`
  return window.innerHeight >= window.innerWidth
}

device.landscape = function (): boolean {
  if (!isBrowser) {
    return false
  }
  // Check iOS first: Safari 16.4+ exposes screen.orientation, but it still
  // reports the previous orientation during the orientationchange event (#367)
  if (
    device.ios() &&
    Object.prototype.hasOwnProperty.call(window, 'orientation')
  ) {
    return Math.abs(window.orientation as number) === 90
  }
  if (
    screen.orientation &&
    Object.prototype.hasOwnProperty.call(window, 'onorientationchange')
  ) {
    return includes(screen.orientation.type, 'landscape')
  }
  return window.innerHeight < window.innerWidth
}

// Public Utility Functions
// ------------------------

// Run device.js in noConflict mode,
// returning the device variable to its previous owner.
device.noConflict = function (): Device {
  if (isBrowser) {
    window.device = previousDevice as Device
  }
  return this
}

// HTML Element Handling
// ---------------------

// Insert the appropriate CSS class based on the user agent.

if (device.ios()) {
  if (device.ipad()) {
    addClass('ios ipad tablet')
  } else if (device.iphone()) {
    addClass('ios iphone mobile')
  } else if (device.ipod()) {
    addClass('ios ipod mobile')
  }
} else if (device.macos()) {
  addClass('macos desktop')
} else if (device.harmonyos()) {
  if (find('mobile')) {
    addClass('harmonyos mobile')
  } else {
    addClass('harmonyos tablet')
  }
} else if (device.android()) {
  if (device.androidTablet()) {
    addClass('android tablet')
  } else {
    addClass('android mobile')
  }
} else if (device.blackberry()) {
  if (device.blackberryTablet()) {
    addClass('blackberry tablet')
  } else {
    addClass('blackberry mobile')
  }
} else if (device.windows()) {
  if (device.windowsTablet()) {
    addClass('windows tablet')
  } else if (device.windowsPhone()) {
    addClass('windows mobile')
  } else {
    addClass('windows desktop')
  }
} else if (device.fxos()) {
  if (device.fxosTablet()) {
    addClass('fxos tablet')
  } else {
    addClass('fxos mobile')
  }
} else if (device.meego()) {
  addClass('meego mobile')
} else if (device.nodeWebkit()) {
  addClass('node-webkit')
} else if (device.television()) {
  addClass('television')
} else if (device.chromeos()) {
  addClass('chromeos desktop')
} else if (device.linux()) {
  addClass('linux desktop')
} else if (device.desktop()) {
  addClass('desktop')
}

if (device.cordova()) {
  addClass('cordova')
}

// Orientation Handling
// --------------------

// The orientation the <html> classes and callbacks were last updated for.
let currentOrientation: 'landscape' | 'portrait' | undefined

// Handle device orientation changes. The resize event also fires when the
// orientation stays the same, so only act when it changed.
function handleOrientation(): void {
  const newOrientation = device.landscape() ? 'landscape' : 'portrait'
  if (newOrientation === currentOrientation) {
    return
  }
  currentOrientation = newOrientation
  removeClass(newOrientation === 'landscape' ? 'portrait' : 'landscape')
  addClass(newOrientation)
  // Update device.orientation first, so callbacks that read it see the new value
  setOrientationCache()
  walkOnChangeOrientationList(newOrientation)
}

function walkOnChangeOrientationList(newOrientation: 'landscape' | 'portrait'): void {
  // Walk a copy: a callback may unsubscribe itself or others while it runs
  const callbacks = changeOrientationList.slice()
  for (let index = 0; index < callbacks.length; index++) {
    callbacks[index](newOrientation)
  }
}

// Returns a function that removes the callback again.
device.onChangeOrientation = function (cb: OrientationChangeCallback): () => void {
  if (typeof cb !== 'function') {
    return function (): void {}
  }
  changeOrientationList.push(cb)
  let subscribed = true
  return function (): void {
    if (!subscribed) {
      return
    }
    subscribed = false
    changeOrientationList.splice(changeOrientationList.lastIndexOf(cb), 1)
  }
}

if (isBrowser) {
  // Detect whether device supports orientationchange event,
  // otherwise fall back to the resize event.
  let orientationEvent = 'resize'
  if (Object.prototype.hasOwnProperty.call(window, 'onorientationchange')) {
    orientationEvent = 'orientationchange'
  }

  // Listen for changes in orientation.
  window.addEventListener(orientationEvent, handleOrientation, false)

  handleOrientation()
}

// Public functions to get the current value of type, os, or orientation
// ---------------------------------------------------------------------

function findMatch<T extends string>(arr: T[]): T | 'unknown' {
  for (let i = 0; i < arr.length; i++) {
    if (device[arr[i] as keyof Device] && typeof device[arr[i] as keyof Device] === 'function' && (device[arr[i] as keyof Device] as () => boolean)()) {
      return arr[i]
    }
  }
  return 'unknown'
}

device.type = findMatch(['mobile', 'tablet', 'desktop']) as DeviceType
device.os = findMatch([
  'ios',
  'iphone',
  'ipad',
  'ipod',
  'harmonyos',
  'android',
  'blackberry',
  'macos',
  'windows',
  'fxos',
  'meego',
  'television',
  'chromeos',
  'linux'
]) as DeviceOs

function setOrientationCache(): void {
  device.orientation = findMatch(['portrait', 'landscape']) as DeviceOrientation
}

setOrientationCache()

export default device
