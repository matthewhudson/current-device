# [CURRENT-DEVICE](http://thematthewhudson.com/current-device/)

[![Build Status](https://travis-ci.org/matthewhudson/current-device.svg?branch=master)](https://travis-ci.org/matthewhudson/current-device)
[![Coverage Status](https://coveralls.io/repos/github/matthewhudson/current-device/badge.svg?branch=master)](https://coveralls.io/github/matthewhudson/current-device?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/matthewhudson/current-device.svg)](https://greenkeeper.io/)
[![NPM version](https://badge.fury.io/js/current-device.svg)](http://badge.fury.io/js/current-device)
[![NPM downloads](https://img.shields.io/npm/dm/current-device.svg)](https://www.npmjs.com/package/current-device)

This module makes it easy to write conditional CSS _and/or_ JavaScript based on
device operating system (iOS, Android, Blackberry, Windows, Firefox OS, MeeGo,
AppleTV, etc), orientation (Portrait vs. Landscape), and type (Tablet vs.
Mobile).

[View the Demo &rarr;](http://thematthewhudson.com/current-device/)

### EXAMPLES

This module inserts CSS classes into the `<html>` element.

#### iPhone

<img src="https://raw.githubusercontent.com/matthewhudson/current-device/master/docs/iphone.png" />

#### Android Tablet

<img src="https://raw.githubusercontent.com/matthewhudson/current-device/master/docs/android.png" />

#### Blackberry Tablet

<img src="https://raw.githubusercontent.com/matthewhudson/current-device/master/docs/blackberry.png" />

### DEVICE SUPPORT

- iOS: iPhone, iPod, iPad
- Android: Phones & Tablets
- Blackberry: Phones & Tablets
- Windows: Phones & Tablets
- Firefox OS: Phones & Tablets

### USAGE

Just include the script. The script then updates the `<html>` section with the
[appropriate classes](https://github.com/matthewhudson/current-device#conditional-css)
based on the device's characteristics.

## Installation

```sh
npm install current-device
```

And then import it:

```js
// using es modules
import device from 'current-device'

// common.js
const device = require('current-device').default
```

Or use script tags and globals.

```html
<script src="https://unpkg.com/current-device/umd/current-device.min.js"></script>
```

And then access it off the global like so:

```js
console.log('device.mobile() === %s', device.mobile())
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
		<td>Android Phone</td>
		<td>android mobile</td>
	</tr>
	<tr>
		<td>Android Tablet</td>
		<td>android tablet</td>
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
		<td>Desktop</td>
		<td>desktop</td>
	</tr>
	<tr>
		<td>Television</td>
		<td>television</td>
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

```js
device.onChangeOrientation((newOrientation) => {
  console.log(`New orientation is ${newOrientation}`)
})
```

### Utility Methods

#### device.noConflict()

Run `current-device` in noConflict mode, returning the device variable to its
previous owner. Returns a reference to the `device` object.

```js
const currentDevice = device.noConflict()
```

### Useful Properties

Access these properties on the `device` object to get the first match on that
attribute without looping through all of its getter methods.

<table>
	<tr>
		<th>JS Property</th>
		<th>Returns</th>
	</tr>
	<tr>
		<td>device.type</td>
		<td>'mobile', 'tablet', 'desktop', or 'unknown'</td>
	</tr>
	<tr>
		<td>device.orientation</td>
		<td>'landscape', 'portrait', or 'unknown'</td>
	</tr>
	<tr>
		<td>device.os</td>
		<td>'ios', 'iphone', 'ipad', 'ipod', 'android', 'blackberry', 'windows', 'fxos', 'meego', 'television', or 'unknown'</td>
	</tr>
</table>

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

### SUPPORT ON BEERPAY

[![Beerpay](https://beerpay.io/matthewhudson/device.js/badge.svg?style=beer-square)](https://beerpay.io/matthewhudson/device.js)
[![Beerpay](https://beerpay.io/matthewhudson/device.js/make-wish.svg?style=flat-square)](https://beerpay.io/matthewhudson/device.js?focus=wish)
