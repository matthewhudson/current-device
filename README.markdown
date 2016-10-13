# [DEVICE.JS](http://matthewhudson.me/projects/device.js/)

[![Join the chat at https://gitter.im/matthewhudson/device.js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/matthewhudson/device.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Device.js makes it easy to write conditional CSS _and/or_ JavaScript based on device operating system (iOS, Android, Blackberry, Windows, Firefox OS, MeeGo, AppleTV, etc), orientation (Portrait vs. Landscape), and type (Tablet vs. Mobile).

[View the Demo &rarr;](http://matthewhudson.me/projects/device.js/)

### EXAMPLES

Device.js inserts CSS classes into the `<html>` element.

#### iPhone

<img src="http://matthewhudson.me/projects/device.js/screenshots/iphone.png" />

#### Android Tablet

<img src="http://matthewhudson.me/projects/device.js/screenshots/android.png" />

#### Blackberry Tablet

<img src="http://matthewhudson.me/projects/device.js/screenshots/blackberry.png" />

### DEVICE SUPPORT

* iOS: iPhone, iPod, iPad
* Android: Phones & Tablets
* Blackberry: Phones & Tablets
* Windows: Phones & Tablets
* Firefox OS: Phones & Tablets

### USAGE

Just include the script. The script then updates the `<html>` section with the [appropriate classes](https://github.com/matthewhudson/device.js#conditional-css) based on the device's characteristics.

``` html
<script src="device.js"></script>
```

###### Bower

``` sh
bower install devicejs
```

### CONDITIONAL CSS

The following tables map which CSS classes are added based on device and orientation.

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

Device.js _also_ includes support for conditional JavaScript, allowing you to write checks on the following device characteristics:

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
 Android
Resources

    More information about Android
    Android Open Source Project
    Android SDK

 Android
Resources

    More information about Android
    Android Open Source Project
    Android SDK

   Android™ delivers a complete set of software for mobile devices: an operating system, middleware and key mobile applications.
   Android was built from the ground-up to enable developers to create compelling mobile applications that take full advantage of all a handset has to offer. It was built to be truly open. For example, an application can call upon any of the phone’s core functionality such as making calls, sending text messages, or using the camera, allowing developers to create richer and more cohesive experiences for users. Android is built on the open Linux Kernel. Furthermore, it utilizes a custom virtual machine that was designed to optimize memory and hardware resources in a mobile environment. Android is open source; it can be liberally extended to incorporate new cutting edge technologies as they emerge. The platform will continue to evolve as the developer community works together to build innovative mobile applications. 
 Developer
•	Google
•	Open Handset Alliance

Written in
Java (UI),[1] C (core), C++

OS family	Unix-like

Working state	Current
Source model	Open source[2] and in most devices with proprietary components[3]

Initial release	September 23, 2008; 8 years ago[4]

Latest release
7.0 "Nougat" / August 22, 2016; 51 days ago
Marketing target	Smartphones, tablet computers, Android TV, Android Auto and Android Wear

Available in
100+ languages[5]

Package manager
APK (through Google Play)

Platforms	32- and 64-bit ARM, x86,[6] MIPS[7] and MIPS64[a]

Kernel type
Monolithic (modified Linux kernel)

Userland
Bionic libc,[8] mksh shell,[9] Toybox as core utilities beginning with Android 6.0,[10][11] previously native core utilities with a few from NetBSD[12][13]

Default user interface
Graphical (Multi-touch)

License
Apache License 2.0
GNU GPL v2 for the Linux kernel modifications[14]

Official website	android.com
Code name 	    Version number 	Initial release date 	  API level 	Support Status
Nougat 	              7.0 – 7.1 	22 August 2016 	          24–25 	Supported
Marshmallow 	      6.0 – 6.0.1 	5 October 2015         	  23 	        Supported
Lollipop 	      5.0 – 5.1.1 	12 November 2014 	  21–22 	Supported
KitKat 	              4.4 – 4.4.4 	31 October 2013 	  19–20 	Security Updates Only
Jelly Bean 	      4.1 – 4.3.1 	9 July 2012 	          16–18 	Discontinued
Ice Cream Sandwich    4.0 – 4.0.4	18 October 2011 	  14–15 	Discontinued
Honeycomb 	      3.0 – 3.2.6 	22 February 2011 	  11–13 	Discontinued
Gingerbread 	      2.3 – 2.3.7 	6 December 2010 	  9–10  	Discontinued
Froyo 	              2.2 – 2.2.3 	20 May 2010 	          8 	        Discontinued
Eclair 	              2.0 – 2.1 	26 October 2009 	  5–7 	        Discontinued
Donut 	              1.6 	        15 September 2009 	  4 	        Discontinued
Cupcake 	      1.5 	        27 April 2009 	3 	                Discontinued
N/A 	              1.0 	        23 September 2008         1             Discontinued
N/A	              1.1 	        9 February 2009           2 	        Discontinued
### Utility Methods

#### device.noConflict()

Run device.js in noConflict mode, returning the device variable to its previous owner.
Returns a reference to the device object.

``` javascript
var devicejs = device.noConflict();
```

### BEST PRACTICES

Environment detection has a high rate of misuse. Often times, folks will attempt to work around browser feature support problems by checking for the affected browser and doing something different in response. The preferred solution for those kinds of problems, of course, is to check for the feature, not the browser (ala [Modernizr](http://modernizr.com/)).

However, that common misuse of device detection doesn't mean it should never be done. For example, device.js could be employed to change the interface of your web app such that it uses interaction patterns and UI elements common to the device it's being presented on. Android devices might get a slightly different treatment than Windows or iOS, for instance. Another valid use-case is guiding users to different app stores depending on the device they're using.

In short, check for features when you need features, and check for the browser when you need the browser.

### CONTRIBUTING

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Make change(s)
4. Commit your changes (`git commit -am 'Added some feature'`)
5. Push to the branch (`git push origin my-new-feature`)
6. Create new Pull Request
