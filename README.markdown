# [DEVICE.JS](http://www.matthewghudson.com/projects/device.js/)

Device.js makes it easy for you to write [conditional CSS](http://www.conditional-css.com/) based on device operating system (iOS, Android, Blackberry), orientation (Portrait vs. Landscape), and type (Tablet vs. Mobile).

[View the Demo](http://www.matthewghudson.com/projects/device.js/)

### EXAMPLES

Device.js inserts CSS classes into the `<html>` element.

#### iPhone

<img src="http://www.matthewghudson.com/projects/device.js/screenshots/iphone.png" />

#### Android Tablet

<img src="http://www.matthewghudson.com/projects/device.js/screenshots/android.png" />

#### Blackberry Tablet

<img src="http://www.matthewghudson.com/projects/device.js/screenshots/blackberry.png" />

### USAGE 

Just include the script.

``` html
<script src="device.js"></script>
``` 

### CSS CLASS NAMES

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
		<td>(no support)</td>
	</tr>
	<tr>
		<td>Desktop</td>
		<td>desktop</td>
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

### TODO

* Add UserAgent sniffing for edge cases.
* Add fallback in case "orientation" event doesn't exist.

### DEVICE SUPPORT 

* iOS: iPhone, iPod, iPad
* Android: Phones & Tablets
* Blackberry: Phones & Tablets
* Windows Phone (no Windows Tablet support yet)

### SUGGESTIONS

All comments in how to improve this library are very welcome. Feel free post suggestions to the Issue tracker, or even better, fork the repository to implement your own ideas and submit a pull request.

### LICENSE

Unless attributed otherwise, everything is under the MIT License (see LICENSE for more info).