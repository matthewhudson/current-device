(function () {
	
	// The <html> element.
	var docElement = window.document.documentElement
	
	// If #debug selector exists, insert debug information.
	var debug = function () {
		var debugElement = window.document.getElementById("debug");
		if (debugElement) {
			debugElement.innerHTML = 
				"<h4>DEBUG</h4>" 
				+ "<p>UA String: " + isAgent.agent() + "</p>"
				+ "<p>Dimensions: " + window.innerWidth + 'x' + window.innerHeight + "</p>"
				+ "<p>Orientation: " + (window.orientation || "-") + "</p>"
				+ "<p>CSS Classes: " + docElement.className + "</p>";
		}
	}
	
	var DeviceUserAgent = function () {
		var that = {},
			my = {};

		my.agent = window.navigator.userAgent.toLowerCase();

		that.ios = function () {
			return (that.iphone() || that.ipod() || that.ipad());
		};

		that.iphone = function () {
			return my.agent.match(/iphone/i) ? true : false;
		};

		that.ipod = function () {
			return my.agent.match(/ipod/i) ? true : false;
		};

		that.ipad = function () {
			return my.agent.match(/ipad/i) ? true : false;
		};

		that.android = function () {
			return my.agent.match(/android/i) ? true : false;
		};

		// See: http://android-developers.blogspot.com/2010/12/android-browser-user-agent-issues.html
		that.androidTablet = function () {
			return (that.android() && my.agent.match(/mobile/i)) ? false : true;
		};

		that.blackberry = function () {
			return my.agent.match(/blackberry/i) ? true : false;
		};

		// See: http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/How-to-detect-the-BlackBerry-Browser/ta-p/559862
		that.blackberryTablet = function () {
			return my.agent.match(/rim tablet/i) ? true : false;
		};
		
		that.windowsPhone = function () {
			return my.agent.match(/windows phone/i) ? true : false;
		};
		
		that.mobile = function () {
			return (that.android() || that.iphone() || that.ipod() || that.windowsphone() || that.blackberry());
		};

		that.tablet = function () {
			return (that.ipad() || that.androidTablet() || that.blackberryTablet());
		};
		
		that.agent = function () {
			return my.agent;
		};
		
		return that;
	};

	var DeviceOrientation = function () {
		var that = {};

		that.portrait = function () {
			return Math.abs(window.orientation) == 90 ? false : true;
		};

		that.landscape = function () {
			return Math.abs(window.orientation) == 90 ? true : false;
		};

		return that;
	};
	
	// Check if docElement already has a given class.
	var hasClass = function (className) {
		var regex = new RegExp(className, "i");
		return docElement.className.match(regex);
	};
	
	// Add one or more CSS classes to the <html> element.
	var addClass = function (className) {
		if (!hasClass(className)) {
			docElement.className += " " + className;
		}
	};

	// Remove single CSS class from the <html> element.
	var removeClass = function (className) {
		if (hasClass(className)) {
			docElement.className = docElement.className.replace(className, "");
		}
	};

	// Insert the appropriate CSS class based on the UserAgent.
	var isAgent = DeviceUserAgent();
	
	if (isAgent.ios()) {
		if (isAgent.ipad()) {
			addClass("ios ipad tablet");
		} else if (isAgent.iphone()) {
			addClass("ios iphone mobile");
		} else if (isAgent.ipod()) {
			addClass("ios ipod mobile");
		}
	} else if (isAgent.android()) {
		if (isAgent.androidTablet()) {
			addClass("android tablet");
		} else {
			addClass("android mobile");
		}
	} else if (isAgent.blackberry()) {
		addClass("blackberry");
	} else if (isAgent.blackberryTablet()) {
		addClass("blackberry tablet");
	} else if (isAgent.windowsPhone()) {
		addClass("windows mobile");
	} else {
		addClass("desktop");
	}
	
	// Handle device orientation changes
	var checkOrientation = function () {
		if (isOrientation.landscape()) {
			removeClass("portrait");
			addClass("landscape");
		} else {
			removeClass("landscape");
			addClass("portrait");
		}
		debug();
	}
	
	// Detect whether device supports orientationchange event, 
	// otherwise fall back to the resize event.
	var isOrientation = DeviceOrientation();
	var supportsOrientationChange = "onorientationchange" in window,
		orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

	// Listen for changes in orientation.
	window.addEventListener(orientationEvent, checkOrientation, false);
	
	checkOrientation();
	
}).call(this);