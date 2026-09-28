# [CURRENT-DEVICE](https://matthewhudson.github.io/current-device/)

[![CI](https://github.com/matthewhudson/current-device/actions/workflows/ci.yml/badge.svg)](https://github.com/matthewhudson/current-device/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/current-device.svg)](https://www.npmjs.com/package/current-device)
[![npm downloads](https://img.shields.io/npm/dm/current-device.svg)](https://www.npmjs.com/package/current-device)

current-device adds CSS classes to `<html>` for the visitor's operating system,
device type and orientation, and gives you the same answers in JavaScript:

```html
<!-- iPhone -->        <html class="ios iphone mobile portrait">
<!-- Galaxy Tab -->    <html class="android tablet landscape">
<!-- MacBook -->       <html class="macos desktop landscape">
```

```ts
import device from "current-device";

device.type; // 'mobile' | 'tablet' | 'desktop' | 'unknown'
device.os; // 'ios' | 'android' | 'windows' | 'macos' | ...
device.orientation; // 'portrait' | 'landscape' | 'unknown'
device.mobile(); // boolean
```

It is a small (under 3 KB gzipped), dependency-free classifier built for
styling, layout conventions and analytics. It reads the user agent string once
and sorts the device into a handful of buckets. It does not identify device
models, browsers or OS versions, and user agent sniffing has hard limits in
2026: read [Limitations](#limitations) before you rely on it.

[View the Demo &rarr;](https://matthewhudson.github.io/current-device/)

## Installation

```sh
npm install current-device
```

```ts
// ES modules (recommended)
import device from "current-device";

// CommonJS
const device = require("current-device").default;
```

Importing the module adds the classes to `<html>` and starts listening for
orientation changes. Nothing else is needed.

### CDN / Script Tag

```html
<script src="https://unpkg.com/current-device@2/dist/index.global.js"></script>
<script>
  console.log(device.type); // 'mobile', 'tablet' or 'desktop'
</script>
```

The script defines one global, `device`. See
[`device.noConflict()`](#devicenoconflict) if that name is taken.

### React

`current-device/react` has hooks for React 18 and later:

```tsx
import { useDevice, useOrientation } from "current-device/react";

function Navigation() {
  const { type, os, orientation } = useDevice();
  return type === "mobile" ? <MobileNav /> : <DesktopNav />;
}

function Player() {
  const orientation = useOrientation();
  return <video className={orientation} />;
}
```

- `useDevice()` returns `{ type, os, orientation }`, with the same values as
  [`device.type`, `device.os` and `device.orientation`](#properties).
- `useOrientation()` returns only the orientation.

Both re-render the component when the orientation changes.

### Server-Side Rendering

current-device can be imported on a server, for example with Next.js, Remix or
Astro. A server can't see the device, so there:

- no classes are added to `<html>`,
- every method, such as `device.mobile()`, returns `false`,
- `device.type`, `device.os` and `device.orientation` are `'unknown'`.

The React hooks also return `'unknown'` on the server and while the page
hydrates, and the real values right after. Render something that fits every
device for `'unknown'`.

In Next.js, components that use the hooks need the `"use client"` directive.

In a server-rendered app, don't call `device` methods such as `device.mobile()`
while a component renders. They return `false` on the server and the real value
in the browser, which causes a hydration error, and React then removes the
classes from `<html>`. Use the hooks, or call the methods in an effect or an
event handler.

### TypeScript

The package ships its own types:

```ts
import device from "current-device";
import type { Device, DeviceType, DeviceOs, DeviceOrientation } from "current-device";

const os: DeviceOs = device.os;
const type: DeviceType = device.type;
const isPhone: boolean = device.mobile();
```

## CSS Classes

One operating-system class and one type class are added to `<html>`, plus the
orientation class.

<table>
	<tr>
		<th>Device</th>
		<th>CSS Classes</th>
	</tr>
	<tr>
		<td>iPhone</td>
		<td>ios iphone mobile</td>
	</tr>
	<tr>
		<td>iPad (also iPadOS 13+ with its Mac user agent)</td>
		<td>ios ipad tablet</td>
	</tr>
	<tr>
		<td>iPod touch</td>
		<td>ios ipod mobile</td>
	</tr>
	<tr>
		<td>Mac</td>
		<td>macos desktop</td>
	</tr>
	<tr>
		<td>Android phone</td>
		<td>android mobile</td>
	</tr>
	<tr>
		<td>Android tablet</td>
		<td>android tablet</td>
	</tr>
	<tr>
		<td>Android TV, Google TV, Fire TV, Chromecast</td>
		<td>android television</td>
	</tr>
	<tr>
		<td>HarmonyOS phone</td>
		<td>harmonyos mobile</td>
	</tr>
	<tr>
		<td>HarmonyOS tablet</td>
		<td>harmonyos tablet</td>
	</tr>
	<tr>
		<td>HarmonyOS PC</td>
		<td>harmonyos desktop</td>
	</tr>
	<tr>
		<td>ChromeOS (also an Android app on a Chromebook)</td>
		<td>chromeos desktop</td>
	</tr>
	<tr>
		<td>Windows desktop, laptop or 2-in-1</td>
		<td>windows desktop</td>
	</tr>
	<tr>
		<td>Windows RT tablet</td>
		<td>windows tablet</td>
	</tr>
	<tr>
		<td>Windows Phone, Windows Mobile</td>
		<td>windows mobile</td>
	</tr>
	<tr>
		<td>Linux desktop</td>
		<td>linux desktop</td>
	</tr>
	<tr>
		<td>Other television or set-top box (Tizen, webOS, Roku, Apple TV, HbbTV...)</td>
		<td>television</td>
	</tr>
	<tr>
		<td>BlackBerry phone</td>
		<td>blackberry mobile</td>
	</tr>
	<tr>
		<td>BlackBerry PlayBook</td>
		<td>blackberry tablet</td>
	</tr>
	<tr>
		<td>Firefox OS or KaiOS phone</td>
		<td>fxos mobile</td>
	</tr>
	<tr>
		<td>Firefox OS tablet</td>
		<td>fxos tablet</td>
	</tr>
	<tr>
		<td>MeeGo</td>
		<td>meego mobile</td>
	</tr>
	<tr>
		<td>Other phone (feature phone, Symbian, Tizen, Sailfish...)</td>
		<td>mobile</td>
	</tr>
	<tr>
		<td>Anything else</td>
		<td>desktop</td>
	</tr>
</table>

Two more classes describe the runtime rather than the device:

<table>
	<tr>
		<th>Runtime</th>
		<th>CSS Class</th>
	</tr>
	<tr>
		<td>Cordova app (<code>window.cordova</code> exists and the page is loaded from <code>file:</code>)</td>
		<td>cordova, added to the classes above</td>
	</tr>
	<tr>
		<td>NW.js or Electron renderer (<code>window.process</code> exists)</td>
		<td>node-webkit. On Windows and macOS the classes above win; on Linux it is added instead of them</td>
	</tr>
</table>

### Orientation

<table>
	<tr>
		<th>Orientation</th>
		<th>CSS Class</th>
	</tr>
	<tr>
		<td>Landscape</td>
		<td>landscape</td>
	</tr>
	<tr>
		<td>Portrait</td>
		<td>portrait</td>
	</tr>
</table>

The orientation class is the only one that changes while the page is open. On
phones and tablets it follows the screen's orientation; on desktops, where the
screen doesn't rotate, it follows the window's aspect ratio, so a portrait
monitor or a tall window is `portrait`. A square window is `portrait`, like the
CSS `(orientation: portrait)` media query.

## JavaScript API

### Type

<table>
	<tr>
		<th>Type</th>
		<th>Method</th>
	</tr>
	<tr>
		<td>Phone</td>
		<td>device.mobile()</td>
	</tr>
	<tr>
		<td>Tablet</td>
		<td>device.tablet()</td>
	</tr>
	<tr>
		<td>Neither: desktops, laptops and televisions</td>
		<td>device.desktop()</td>
	</tr>
</table>

Exactly one of the three is true in a browser.

### Operating System and Device

<table>
	<tr>
		<th>Device</th>
		<th>Method</th>
	</tr>
	<tr>
		<td>iOS or iPadOS</td>
		<td>device.ios()</td>
	</tr>
	<tr>
		<td>iPhone</td>
		<td>device.iphone()</td>
	</tr>
	<tr>
		<td>iPad</td>
		<td>device.ipad()</td>
	</tr>
	<tr>
		<td>iPod touch</td>
		<td>device.ipod()</td>
	</tr>
	<tr>
		<td>Mac</td>
		<td>device.macos()</td>
	</tr>
	<tr>
		<td>Android (phones, tablets, TVs, HarmonyOS, Android apps on a Chromebook)</td>
		<td>device.android()</td>
	</tr>
	<tr>
		<td>Android phone</td>
		<td>device.androidPhone()</td>
	</tr>
	<tr>
		<td>Android tablet</td>
		<td>device.androidTablet()</td>
	</tr>
	<tr>
		<td>HarmonyOS, including HarmonyOS NEXT (the Android-based versions are also <code>android()</code>)</td>
		<td>device.harmonyos()</td>
	</tr>
	<tr>
		<td>ChromeOS</td>
		<td>device.chromeos()</td>
	</tr>
	<tr>
		<td>Windows</td>
		<td>device.windows()</td>
	</tr>
	<tr>
		<td>Windows Phone, Windows Mobile</td>
		<td>device.windowsPhone()</td>
	</tr>
	<tr>
		<td>Windows RT tablet</td>
		<td>device.windowsTablet()</td>
	</tr>
	<tr>
		<td>Linux desktop</td>
		<td>device.linux()</td>
	</tr>
	<tr>
		<td>Television or set-top box (any OS)</td>
		<td>device.television()</td>
	</tr>
	<tr>
		<td>BlackBerry</td>
		<td>device.blackberry()</td>
	</tr>
	<tr>
		<td>BlackBerry phone</td>
		<td>device.blackberryPhone()</td>
	</tr>
	<tr>
		<td>BlackBerry PlayBook</td>
		<td>device.blackberryTablet()</td>
	</tr>
	<tr>
		<td>Firefox OS or KaiOS</td>
		<td>device.fxos()</td>
	</tr>
	<tr>
		<td>Firefox OS or KaiOS phone</td>
		<td>device.fxosPhone()</td>
	</tr>
	<tr>
		<td>Firefox OS tablet</td>
		<td>device.fxosTablet()</td>
	</tr>
	<tr>
		<td>MeeGo</td>
		<td>device.meego()</td>
	</tr>
</table>

### Runtime

<table>
	<tr>
		<th>Runtime</th>
		<th>Method</th>
	</tr>
	<tr>
		<td>Cordova app</td>
		<td>device.cordova()</td>
	</tr>
	<tr>
		<td>NW.js or Electron renderer</td>
		<td>device.nodeWebkit()</td>
	</tr>
</table>

### Orientation

<table>
	<tr>
		<th>Orientation</th>
		<th>Method</th>
	</tr>
	<tr>
		<td>Landscape</td>
		<td>device.landscape()</td>
	</tr>
	<tr>
		<td>Portrait</td>
		<td>device.portrait()</td>
	</tr>
</table>

```ts
const unsubscribe = device.onChangeOrientation((newOrientation: "landscape" | "portrait") => {
  console.log(`New orientation is ${newOrientation}`);
});

unsubscribe(); // removes the callback again
```

### Properties

The properties hold the first match, so you don't have to call the methods one
by one.

<table>
	<tr>
		<th>Property</th>
		<th>Type</th>
		<th>Value</th>
	</tr>
	<tr>
		<td>device.type</td>
		<td>DeviceType</td>
		<td>'mobile', 'tablet', 'desktop' or 'unknown'</td>
	</tr>
	<tr>
		<td>device.os</td>
		<td>DeviceOs</td>
		<td>'ios', 'android', 'harmonyos', 'chromeos', 'windows', 'macos', 'linux', 'television', 'blackberry', 'fxos', 'meego' or 'unknown'</td>
	</tr>
	<tr>
		<td>device.orientation</td>
		<td>DeviceOrientation</td>
		<td>'landscape', 'portrait' or 'unknown'</td>
	</tr>
</table>

Notes on `device.os`:

- It is `'ios'` for every iPhone, iPad and iPod touch. The `DeviceOs` type also
  lists `'iphone'`, `'ipad'` and `'ipod'` for backwards compatibility, but
  `device.os` never has those values; use `device.iphone()`, `device.ipad()` and
  `device.ipod()` instead. The three values will be removed from the type in 3.0.
- Where two checks match, the more specific platform wins: a HarmonyOS device is
  `'harmonyos'` (and `device.android()` is also true on the Android-based
  versions), an Android app running on
  a Chromebook is `'chromeos'`, and an Android TV is `'android'` with
  `device.television()` true. `'television'` is used for TVs whose operating
  system isn't recognised (Tizen, webOS, Roku...).
- Feature phones and phones on platforms without their own method are
  `'unknown'` with `device.type === 'mobile'`.

`device.type` and `device.os` are computed once when the module is imported;
only `device.orientation` changes afterwards.

### device.noConflict()

Returns the `device` object and gives the global `device` variable back to its
previous owner. Only relevant for the `<script>` build.

```ts
const currentDevice: Device = device.noConflict();
```

## Device Support

Current platforms:

- iOS and iPadOS: iPhone, iPad, iPod touch
- macOS
- Android: phones, tablets and TVs
- HarmonyOS, including HarmonyOS NEXT (OpenHarmony): phones, tablets and PCs
- ChromeOS, including Android apps running on a Chromebook
- Windows: desktops, laptops and 2-in-1s (`desktop`), Windows RT tablets,
  Windows Phone and Windows Mobile
- Linux desktops
- Televisions and set-top boxes: Android TV, Google TV, Fire TV, Chromecast,
  Samsung Tizen, LG webOS, Roku, Apple TV, HbbTV, Vizio, Hisense VIDAA, Opera TV
- Feature phones and other handsets (Java ME, Symbian, KaiOS, Tizen, Sailfish,
  Palm webOS...) as `mobile`

Legacy platforms, still recognised by user agent although their browsers cannot
run the ES2015 bundle (see [Browser Support](#browser-support)): BlackBerry and
the PlayBook, Windows Phone, Firefox OS and MeeGo. Their methods stay in 2.x
for compatibility.

## Browser Support

current-device 2.x ships ES2015 JavaScript without polyfills. It runs in any
browser with full ES2015 support:

| Browser | Minimum version |
| --- | --- |
| Chrome, Android WebView | 51 |
| Edge | 15 |
| Firefox | 54 |
| Safari (macOS and iOS) | 10 |
| Samsung Internet | 5 |
| Opera | 38 |

Internet Explorer and other browsers without ES2015 support are not supported.
This includes the built-in browsers of several platforms that current-device
still recognizes by user agent: the Android stock browser (Android 4.4 and
earlier), BlackBerry, Windows Phone 8.x, Firefox OS and MeeGo. If you need to
support them, use current-device 0.10.x, which ships ES5:

```html
<script src="https://unpkg.com/current-device@0.10.2/umd/current-device.min.js"></script>
```

## Limitations

current-device classifies the user agent string, once, at import. That is
enough to tell phones, tablets and desktops apart and to name the operating
system for the vast majority of visitors (89% of the 35,000 user agents in the
[Matomo device-detector](https://github.com/matomo-org/device-detector)
fixtures get the right type). It is not device identification, and these
limits are inherent to the approach:

- **Results don't follow the window.** `device.type`, `device.os` and their
  classes describe the device and are computed once. Resizing the browser,
  docking a tablet or opening the page in a split screen only updates the
  orientation. Use CSS media queries for layout that should follow the
  viewport.
- **Chrome's reduced user agent.** Since Chrome 110 every Android Chrome user
  agent says `Android 10; K`, without the device model. Phone versus tablet
  then rests on Chrome's own `Mobile` token, which Chrome adds on screens
  narrower than 600dp, so a 7" or 8" tablet is a phone. Tablet model names
  still help in browsers that send them (WebViews, Samsung Internet, Huawei
  Browser): Galaxy Tab, Lenovo Tab, MediaPad/MatePad, Huawei `-W09` models,
  Kindle Fire and a few others are tablets even with `Mobile`.
- **Apple's Mac user agent.** iPadOS 13+ and an iPhone with "Request Desktop
  Website" both send the Mac Safari user agent. current-device recognises them
  by their touchscreen (`navigator.maxTouchPoints`) and tells the iPhone from
  the iPad by screen size. This relies on `navigator.platform`, which browsers
  have deprecated; if Safari stops reporting it, desktop-mode iPads become
  Macs.
- **Windows and ChromeOS tablets are desktops.** No modern browser on Windows
  or ChromeOS puts a tablet hint in the user agent, so a Surface, a 2-in-1 or a
  Chromebook tablet is `desktop`. Only Windows RT devices, whose Internet
  Explorer said `ARM` and `Touch`, are `windows tablet`.
- **Client Hints are not used.** Detection is user agent only;
  `navigator.userAgentData` is Chromium-only and its useful fields are
  asynchronous, which doesn't fit classes that must be set at import time.
- **Foldables.** Unfolded, a foldable's screen is wider than 600dp and Chrome
  drops `Mobile`. Galaxy Z Fold and Pixel Fold are phones in either state;
  other foldables are tablets when unfolded.
- **Televisions have `type: 'desktop'`** with the `television` class, and an
  Android TV has `os: 'android'`; there is no television type. Wearables, game
  consoles, car displays, smart displays and VR headsets have no category of
  their own and land in `mobile` or `desktop`.
- **A phone whose model name contains "TV"** as a separate word (for example
  "KAZAM TV 45") is detected as a television.
- **KaiOS keeps the Firefox OS user agent** it descends from, so it is reported
  as `fxos`, not as a separate platform.
- **No browsers, versions or models.** current-device does not report the
  browser, the OS version or the device model. For those, use a full parser
  such as [ua-parser-js](https://github.com/faisalman/ua-parser-js) or
  [device-detector](https://github.com/matomo-org/device-detector).

## Best Practices

Use current-device for what only the platform can tell you: interaction
conventions (Android and iOS users expect different controls), app-store links,
platform-specific help text, and analytics segments.

Don't use it as a proxy for capabilities or screen size. The browser can tell
you those directly, on every device, and keeps them up to date:

- layout that depends on the viewport: CSS media queries, or `matchMedia()`
- touch versus mouse: `(pointer: coarse)` and `(hover: none)` media queries
- orientation-dependent layout: the `(orientation: portrait)` media query
- an API or feature: check for the feature itself

In short, check for features when you need features, and check for the platform
when you need the platform.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://hudson.dev"><img src="https://avatars2.githubusercontent.com/u/320194?v=4" width="100px;" alt=""/><br /><sub><b>Matthew Hudson</b></sub></a><br /><a href="https://github.com/matthewhudson/current-device/commits?author=matthewhudson" title="Code">💻</a> <a href="#maintenance-matthewhudson" title="Maintenance">🚧</a></td>
    <td align="center"><a href="http://rteran.com/"><img src="https://avatars3.githubusercontent.com/u/6477537?v=4" width="100px;" alt=""/><br /><sub><b>Rafael Terán</b></sub></a><br /><a href="https://github.com/matthewhudson/current-device/commits?author=RTeran" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/winternet-studio"><img src="https://avatars1.githubusercontent.com/u/5200270?v=4" width="100px;" alt=""/><br /><sub><b>Allan</b></sub></a><br /><a href="https://github.com/matthewhudson/current-device/pulls?q=is%3Apr+reviewed-by%3Awinternet-studio" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://martin-wepner.de"><img src="https://avatars3.githubusercontent.com/u/12143284?v=4" width="100px;" alt=""/><br /><sub><b>martinwepner</b></sub></a><br /><a href="https://github.com/matthewhudson/current-device/commits?author=martinwepner" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
