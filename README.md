# [CURRENT-DEVICE](https://matthewhudson.github.io/current-device/)

[![CI](https://github.com/matthewhudson/current-device/actions/workflows/ci.yml/badge.svg)](https://github.com/matthewhudson/current-device/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/current-device.svg)](https://www.npmjs.com/package/current-device)
[![npm downloads](https://img.shields.io/npm/dm/current-device.svg)](https://www.npmjs.com/package/current-device)

This module makes it easy to write conditional CSS _and/or_ JavaScript based on
device operating system (iOS, Android, Blackberry, Windows, macOS, Firefox OS, MeeGo,
AppleTV, etc), orientation (Portrait vs. Landscape), and type (Tablet vs.
Mobile).

[View the Demo &rarr;](https://matthewhudson.github.io/current-device/)

### EXAMPLES

This module inserts CSS classes into the `<html>` element.

#### iPhone

<img src="https://raw.githubusercontent.com/matthewhudson/current-device/main/docs/iphone.png" />

#### Android Tablet

<img src="https://raw.githubusercontent.com/matthewhudson/current-device/main/docs/android.png" />

#### Blackberry Tablet

<img src="https://raw.githubusercontent.com/matthewhudson/current-device/main/docs/blackberry.png" />

### DEVICE SUPPORT

- iOS: iPhone, iPod, iPad
- macOS
- Android: Phones, Tablets & TVs
- Blackberry: Phones & Tablets
- Windows: Phones, Tablets, Desktops
- Firefox OS: Phones & Tablets
- ChromeOS (including Android apps running on a Chromebook)
- Linux
- Televisions: Android TV, Google TV, Fire TV, Chromecast, Samsung Tizen,
  LG webOS, Roku, Apple TV, HbbTV, Vizio, Hisense VIDAA and Opera TV
- Feature phones and other handsets (Java ME, Symbian, KaiOS, Tizen,
  Sailfish, Palm webOS...) are reported as mobile

### BROWSER SUPPORT

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

current-device detects the device in the browser. It can also be imported on a
server, see [Server-Side Rendering](#server-side-rendering).

### USAGE

Just include the script. The script then updates the `<html>` section with the
[appropriate classes](#conditional-css) based on the device's characteristics.

## Installation

```sh
npm install current-device
```

And then import it:

```ts
// ES modules (recommended)
import device from "current-device";

// CommonJS
const device = require("current-device").default;
```

### CDN / Script Tag

You can also include current-device directly via a `<script>` tag using a CDN:

```html
<script src="https://unpkg.com/current-device/dist/index.global.js"></script>
<script>
  console.log(device.type); // 'mobile', 'tablet', or 'desktop'
</script>
```

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
  [`device.type`, `device.os` and `device.orientation`](#useful-properties).
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

This package ships with built-in TypeScript types. You can import the types directly:

```ts
import device from "current-device";
import type { Device, DeviceType, DeviceOs, DeviceOrientation } from "current-device";

const os: DeviceOs = device.os;
const type: DeviceType = device.type;
const isPhone: boolean = device.mobile();
```

### CONDITIONAL CSS

The following tables map which CSS classes are added based on device and
orientation.

#### Device CSS Class Names

<table>
	<tr>
		<th>Device</th>
		<th>CSS Classes</th>
	</tr>
	<tr>
		<td>iPad</td>
		<td>ios ipad tablet</td>
	</tr>
	<tr>
		<td>iPhone</td>
		<td>ios iphone mobile</td>
	</tr>
	<tr>
		<td>iPod</td>
		<td>ios ipod mobile</td>
	</tr>
	<tr>
		<td>Mac</td>
		<td>macos desktop</td>
	</tr>
	<tr>
		<td>Android Phone</td>
		<td>android mobile</td>
	</tr>
	<tr>
		<td>Android Tablet</td>
		<td>android tablet</td>
	</tr>
	<tr>
		<td>Android TV</td>
		<td>android television</td>
	</tr>
	<tr>
		<td>BlackBerry Phone</td>
		<td>blackberry mobile</td>
	</tr>
	<tr>
		<td>BlackBerry Tablet</td>
		<td>blackberry tablet</td>
	</tr>
	<tr>
		<td>Windows Phone</td>
		<td>windows mobile</td>
	</tr>
	<tr>
		<td>Windows Tablet</td>
		<td>windows tablet</td>
	</tr>
	<tr>
		<td>Windows Desktop</td>
		<td>windows desktop</td>
	</tr>
	<tr>
		<td>Firefox OS Phone</td>
		<td>fxos mobile</td>
	</tr>
	<tr>
		<td>Firefox OS Tablet</td>
		<td>fxos tablet</td>
	</tr>
	<tr>
		<td>MeeGo</td>
		<td>meego</td>
	</tr>
	<tr>
		<td>Other phone (feature phone, Symbian, Tizen...)</td>
		<td>mobile</td>
	</tr>
	<tr>
		<td>Desktop</td>
		<td>desktop</td>
	</tr>
	<tr>
		<td>Television</td>
		<td>television</td>
	</tr>
	<tr>
		<td>ChromeOS</td>
		<td>chromeos desktop</td>
	</tr>
	<tr>
		<td>Linux</td>
		<td>linux desktop</td>
	</tr>
</table>

#### Orientation CSS Class Names

<table>
	<tr>
		<th>Orientation</th>
		<th>CSS Classes</th>
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

### CONDITIONAL JAVASCRIPT

This module _also_ includes support for conditional JavaScript, allowing you to
write checks on the following device characteristics:

#### Device JavaScript Methods

<table>
	<tr>
		<th>Device</th>
		<th>JavaScript Method</th>
	</tr>
	<tr>
		<td>Mobile</td>
		<td>device.mobile()</td>
	</tr>
	<tr>
		<td>Tablet</td>
		<td>device.tablet()</td>
	</tr>
	<tr>
		<td>Desktop</td>
		<td>device.desktop()</td>
	</tr>
	<tr>
		<td>iOS</td>
		<td>device.ios()</td>
	</tr>
	<tr>
		<td>iPad</td>
		<td>device.ipad()</td>
	</tr>
	<tr>
		<td>iPhone</td>
		<td>device.iphone()</td>
	</tr>
	<tr>
		<td>iPod</td>
		<td>device.ipod()</td>
	</tr>
	<tr>
		<td>Mac</td>
		<td>device.macos()</td>
	</tr>
	<tr>
		<td>Android</td>
		<td>device.android()</td>
	</tr>
	<tr>
		<td>Android Phone</td>
		<td>device.androidPhone()</td>
	</tr>
	<tr>
		<td>Android Tablet</td>
		<td>device.androidTablet()</td>
	</tr>
	<tr>
		<td>BlackBerry</td>
		<td>device.blackberry()</td>
	</tr>
	<tr>
		<td>BlackBerry Phone</td>
		<td>device.blackberryPhone()</td>
	</tr>
	<tr>
		<td>BlackBerry Tablet</td>
		<td>device.blackberryTablet()</td>
	</tr>
	<tr>
		<td>Windows</td>
		<td>device.windows()</td>
	</tr>
	<tr>
		<td>Windows Phone</td>
		<td>device.windowsPhone()</td>
	</tr>
	<tr>
		<td>Windows Tablet</td>
		<td>device.windowsTablet()</td>
	</tr>
	<tr>
		<td>Firefox OS</td>
		<td>device.fxos()</td>
	</tr>
	<tr>
		<td>Firefox OS Phone</td>
		<td>device.fxosPhone()</td>
	</tr>
	<tr>
		<td>Firefox OS Tablet</td>
		<td>device.fxosTablet()</td>
	</tr>
	<tr>
		<td>MeeGo</td>
		<td>device.meego()</td>
	</tr>
	<tr>
		<td>Television</td>
		<td>device.television()</td>
	</tr>
	<tr>
		<td>ChromeOS</td>
		<td>device.chromeos()</td>
	</tr>
	<tr>
		<td>Linux</td>
		<td>device.linux()</td>
	</tr>
</table>

#### Orientation JavaScript Methods

<table>
	<tr>
		<th>Orientation</th>
		<th>JavaScript Method</th>
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

#### Orientation JavaScript Callback

```ts
device.onChangeOrientation((newOrientation: "landscape" | "portrait") => {
  console.log(`New orientation is ${newOrientation}`);
});
```

`onChangeOrientation` returns a function that removes the callback:

```ts
const unsubscribe = device.onChangeOrientation(callback);
unsubscribe();
```

### Utility Methods

#### device.noConflict()

Run `current-device` in noConflict mode, returning the device variable to its
previous owner. Returns a reference to the `device` object.

```ts
const currentDevice: Device = device.noConflict();
```

### Useful Properties

Access these properties on the `device` object to get the first match on that
attribute without looping through all of its getter methods.

<table>
	<tr>
		<th>JS Property</th>
		<th>Type</th>
		<th>Returns</th>
	</tr>
	<tr>
		<td>device.type</td>
		<td>DeviceType</td>
		<td>'mobile', 'tablet', 'desktop', or 'unknown'</td>
	</tr>
	<tr>
		<td>device.orientation</td>
		<td>DeviceOrientation</td>
		<td>'landscape', 'portrait', or 'unknown'</td>
	</tr>
	<tr>
		<td>device.os</td>
		<td>DeviceOs</td>
		<td>'ios', 'iphone', 'ipad', 'ipod', 'android', 'blackberry', 'windows', 'macos', 'fxos', 'meego', 'television', 'chromeos', 'linux', or 'unknown'</td>
	</tr>
</table>

### LIMITATIONS

current-device reads the browser's user agent string once, when it is imported.
That has consequences worth knowing before you rely on it:

- **`device.type` and `device.os` do not change while the page is open.** They
  describe the device, not the window. Resizing the browser only updates the
  orientation (and calls `onChangeOrientation` callbacks); it never turns a
  desktop into a mobile. Use CSS media queries for layout that should follow
  the window size.
- **Chrome's reduced user agent** (`Android 10; K`) hides the device model, so
  an Android tablet narrower than 600dp, which Chrome labels `Mobile`, is
  reported as a phone. Tablets whose user agent still names a known tablet
  family (Galaxy Tab, Lenovo Tab, MediaPad/MatePad, Huawei `-W09` models,
  Kindle Fire...) are tablets.
- **iPadOS 13+ and "Request Desktop Website"** send a Mac user agent. iPads
  are recognised by their touchscreen, and an iPhone in desktop mode is told
  from an iPad by its screen size. An iPad inside an app that reports an
  iPhone user agent (some Cordova apps) is an iPad for the same reason.
- **Foldable phones** unfolded are wider than 600dp, so Chrome drops `Mobile`.
  Known families (Galaxy Z Fold, Pixel Fold) are still phones; unknown ones
  are tablets.
- **Windows tablets and 2-in-1s** are `desktop`. Modern browsers on Windows
  give no hint of a tablet; only Windows RT devices (Internet Explorer with
  `ARM` and `Touch` in the user agent) are `windows tablet`.
- **Televisions** are `device.type === 'desktop'` with the `television` class.
  Wearables, consoles, car displays and VR headsets have no category of their
  own.

### BEST PRACTICES

Environment detection has a high rate of misuse. Often times, folks will attempt
to work around browser feature support problems by checking for the affected
browser and doing something different in response. The preferred solution for
those kinds of problems, of course, is to check for the feature, not the browser
(ala [Modernizr](http://modernizr.com/)).

However, that common misuse of device detection doesn't mean it should never be
done. For example, `current-device` could be employed to change the interface of
your web app such that it uses interaction patterns and UI elements common to
the device it's being presented on. Android devices might get a slightly
different treatment than Windows or iOS, for instance. Another valid use-case is
guiding users to different app stores depending on the device they're using.

In short, check for features when you need features, and check for the browser
when you need the browser.

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
