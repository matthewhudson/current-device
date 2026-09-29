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
  'smart tv',
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
  'ce-html',
  // Android TV, Google TV and Android set-top boxes
  'android tv',
  'androidtv',
  'tv box',
  'tvbox',
  'tv_box',
  'smart box',
  'smartbox',
  'bravia',
  'mitv',
  'mibox',
  'fire tv',
  'firetv',
  '; aft', // Fire TV model numbers: AFTKA, AFTMM, AFTSS...
  'chromecast',
  'crkey',
  'nexus player',
  'a95x',
  'ugoos',
  'zidoo',
  'vontar',
  'rombica',
  'mygica',
  'nexbox',
  'uhd',
  'iptv',
  // Linux-based TVs and set-top boxes
  ' omi/', // Opera's TV browser (with the space: "Xiaomi/")
  'opera tv',
  'sonycebrowser',
  'vizio',
  'smartcast',
  'vidaa',
  'philipstv',
  'vstvb',
  'fvc/',
  'sraf',
  'mstar',
]

// "TV" or "STB" on its own in a model name ("MYSTERY_TV_D2365CH58",
// "R-TV BOX X10") or browser token ("(lite) TV Safari"). Underscore counts as
// a separator here, unlike with \b
const televisionModel = /(^|[^a-z0-9])(tv|stb)([^a-z0-9]|$)/

// Android tablets whose browser still says "Mobile" (Chrome adds it on screens
// narrower than 600dp): model names and numbers of tablet families, Huawei and
// Honor Wi-Fi tablet model codes ("VRD-W09", "BAH4-W09": phones use -L09 and
// -AL00), and the "/apad" token Yandex apps add on tablets
const androidTabletModel =
  /tablet|(^|[^a-z0-9])(tab ?[a-z]?\d|(sm-[tpx]|gt-p|tb-[a-z]?)\d|kf[a-z]{2,6}([^a-z0-9]|$)|nexus (7|9|10)([^0-9]|$)|[a-z0-9]{2,5}-w\d\d([^a-z0-9]|$))|mediapad|matepad|kindle|\/apad/

// Foldable phones: unfolded, their inner screen is wider than 600dp, so Chrome
// drops "Mobile" and they look like tablets (Galaxy Z Fold "SM-F9xx", Pixel Fold)
const androidFoldablePhone = /(^|[^a-z0-9])(sm-f9\d\d[a-z0-9]?|pixel( \d+ pro)? fold)([^a-z0-9]|$)/

// Feature phones and other handsets no OS check above knows: Java ME (MIDP/CLDC),
// Symbian, Nokia Series 40/60, MediaTek MAUI, Openwave, WAP browsers, UC Browser
// and Opera Mini, NTT DoCoMo, Samsung Bada, Palm webOS. (KaiOS keeps the
// Firefox OS user agent shape, so device.fxos() catches it first)
const otherPhones: string[] = [
  'midp',
  'cldc',
  'symbian',
  'series60',
  'series40',
  'nokia',
  'maui',
  'mre/',
  'mmp/',
  'up.browser',
  'wap browser',
  'wap-browser',
  'netfront',
  'obigo',
  'teleca',
  'ucweb',
  'opera mini',
  'opera mobi',
  'docomo',
  'bada',
  'palm',
  'blazer',
  'webos/',
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

// The shorter side of the screen in CSS pixels, or 0 when unknown. On iOS it
// is the device's portrait width whatever the current orientation
function screenSide(): number {
  if (!isBrowser || !window.screen) {
    return 0
  }
  const side = Math.min(screen.width, screen.height)
  return side > 0 ? side : 0
}

// iPhones are at most 440 CSS pixels wide, iPads at least 744 (iPad mini)
function phoneSizedScreen(): boolean {
  const side = screenSide()
  return side > 0 && side < 600
}

function tabletSizedScreen(): boolean {
  return screenSide() >= 600
}

// iPadOS 13+ sends a Mac user agent, and so does an iPhone with "Request
// Desktop Website"; unlike a Mac, both have a touchscreen
function appleTouchMac(): boolean {
  return find('macintosh') && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
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

// Every Mac browser says "Macintosh; Intel Mac OS X"; native Mac apps say
// "Mac OS/13.7.2". A bare "mac" also matched the "Mac Audio" and "Atmaca"
// device makers. iOS says "like Mac OS X" and Windows Phone 8.1 "Mac OS X"
device.macos = function (): boolean {
  return (
    (find('macintosh') || find('mac os')) &&
    !device.ios() &&
    !device.windows() &&
    !device.android() &&
    !device.television()
  )
}

device.ios = function (): boolean {
  return device.iphone() || device.ipod() || device.ipad()
}

// Some iPad UAs say "iPad; CPU iPhone OS". An iPhone in desktop mode is told
// from an iPad by its screen size, and so is an iPad whose app reports an
// iPhone user agent (Cordova, #106)
device.iphone = function (): boolean {
  if (device.windows()) {
    return false
  }
  if (find('iphone') && !find('ipad')) {
    return !tabletSizedScreen()
  }
  return appleTouchMac() && phoneSizedScreen()
}

device.ipod = function (): boolean {
  return find('ipod')
}

device.ipad = function (): boolean {
  if (find('ipad')) {
    return true
  }
  if (appleTouchMac()) {
    // A desktop-mode iPad, unless the screen is phone-sized (#363). An
    // unknown screen size (0) keeps the iPad
    return !phoneSizedScreen()
  }
  return !device.windows() && find('iphone') && tabletSizedScreen()
}

device.android = function (): boolean {
  return !device.windows() && find('android')
}

// Android TVs and Android apps on Chromebooks are neither phones nor tablets
function androidHandheld(): boolean {
  return device.android() && !device.television() && !device.chromeos()
}

device.androidPhone = function (): boolean {
  return (
    androidHandheld() &&
    (androidFoldablePhone.test(userAgent) || (find('mobile') && !androidTabletModel.test(userAgent)))
  )
}

device.androidTablet = function (): boolean {
  return (
    androidHandheld() &&
    !androidFoldablePhone.test(userAgent) &&
    (!find('mobile') || androidTabletModel.test(userAgent))
  )
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

// Windows Mobile and Windows CE handsets say "IEMobile" or "Windows CE";
// Internet Explorer on Windows Phone 8.1 in desktop mode says "WPDesktop"
device.windowsPhone = function (): boolean {
  return device.windows() && (find('phone') || find('iemobile') || find('windows ce') || find('wpdesktop'))
}

// Only Internet Explorer ever said "Touch", and it did so on touch-screen
// laptops as well (#64), so a tablet is a Windows RT device: "ARM" (#89)
device.windowsTablet = function (): boolean {
  return device.windows() && find('touch') && find('; arm;') && !device.windowsPhone()
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

// HarmonyOS 2 to 4 run an Android compatibility layer and say "Android ...;
// HarmonyOS". HarmonyOS NEXT (OpenHarmony 5 and later) has no Android layer:
// "(Phone; OpenHarmony 5.0) ... ArkWeb/4.1.6.1 Mobile", "(Tablet; OpenHarmony
// 5.0) ..." or "(PC; OpenHarmony 5.0; HarmonyOS 5.0) ..."
device.harmonyos = function (): boolean {
  return find('harmonyos') || find('openharmony')
}

// The form factor of a HarmonyOS NEXT device, from its device-type token.
// The Android-based versions go through androidPhone()/androidTablet()
function harmonyosNextPhone(): boolean {
  return device.harmonyos() && !device.android() && !find('(tablet') && (find('(phone') || find('mobile'))
}

function harmonyosNextTablet(): boolean {
  return device.harmonyos() && !device.android() && find('(tablet')
}

// Match " cros " with spaces: "microsoft" also contains "cros". An Android app
// on a Chromebook sends an Android UA that names the Chromebook as the model
device.chromeos = function (): boolean {
  return find(' cros ') || find('chromebook')
}

// Android, HarmonyOS, many smart TVs and Linux-based phones (Tizen, Sailfish)
// also report "Linux" in their UA
device.linux = function (): boolean {
  return find('linux') && !device.android() && !device.television() && !device.chromeos() && !otherPhone()
}

// A handset that no operating-system check knows: a feature phone, or a phone
// on a platform without its own method (Symbian, Tizen, Sailfish, KaiOS...)
function otherPhone(): boolean {
  if (
    device.android() ||
    device.ios() ||
    device.windows() ||
    device.blackberry() ||
    device.fxos() ||
    device.meego() ||
    device.harmonyos() ||
    device.macos() ||
    device.chromeos() ||
    device.television()
  ) {
    return false
  }
  if (find('mobile')) {
    return true
  }
  for (let i = 0; i < otherPhones.length; i++) {
    if (find(otherPhones[i])) {
      return true
    }
  }
  return false
}

device.cordova = function (): boolean {
  return isBrowser && !!(window as Window & { cordova?: unknown }).cordova && location.protocol === 'file:'
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
    device.meego() ||
    harmonyosNextPhone() ||
    otherPhone()
  )
}

device.tablet = function (): boolean {
  return (
    device.ipad() ||
    device.androidTablet() ||
    device.blackberryTablet() ||
    device.windowsTablet() ||
    device.fxosTablet() ||
    harmonyosNextTablet()
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
  return televisionModel.test(userAgent)
}

device.portrait = function (): boolean {
  if (!isBrowser) {
    return false
  }
  // Check iOS first: Safari 16.4+ exposes screen.orientation, but it still
  // reports the previous orientation during the orientationchange event (#367)
  if (device.ios() && Object.prototype.hasOwnProperty.call(window, 'orientation')) {
    return Math.abs(window.orientation as number) !== 90
  }
  if (screen.orientation && Object.prototype.hasOwnProperty.call(window, 'onorientationchange')) {
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
  if (device.ios() && Object.prototype.hasOwnProperty.call(window, 'orientation')) {
    return Math.abs(window.orientation as number) === 90
  }
  if (screen.orientation && Object.prototype.hasOwnProperty.call(window, 'onorientationchange')) {
    return includes(screen.orientation.type, 'landscape')
  }
  return window.innerHeight < window.innerWidth
}

// Public Utility Functions
// ------------------------

// Run device.js in noConflict mode,
// returning the device variable to its previous owner.
// Returns `device` itself, also when called unbound (`const { noConflict } = device`)
device.noConflict = function (): Device {
  if (isBrowser) {
    window.device = previousDevice as Device
  }
  return device
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
} else if (device.chromeos()) {
  // Before Android: an Android app on a Chromebook
  addClass('chromeos desktop')
} else if (device.harmonyos()) {
  // The same rules as device.type; a HarmonyOS PC is a desktop
  if (device.tablet()) {
    addClass('harmonyos tablet')
  } else if (device.mobile()) {
    addClass('harmonyos mobile')
  } else {
    addClass('harmonyos desktop')
  }
} else if (device.android()) {
  if (device.television()) {
    addClass('android television')
  } else if (device.androidTablet()) {
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
} else if (device.linux()) {
  addClass('linux desktop')
} else if (device.mobile()) {
  // A feature phone or a phone on a platform without its own class
  addClass('mobile')
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
    if (
      device[arr[i] as keyof Device] &&
      typeof device[arr[i] as keyof Device] === 'function' &&
      (device[arr[i] as keyof Device] as () => boolean)()
    ) {
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
  'chromeos',
  'harmonyos',
  'android',
  'blackberry',
  'macos',
  'windows',
  'fxos',
  'meego',
  'television',
  'linux',
]) as DeviceOs

function setOrientationCache(): void {
  device.orientation = findMatch(['portrait', 'landscape']) as DeviceOrientation
}

setOrientationCache()

export default device
