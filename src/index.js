// uasniffer
// (c) 2012-present Matthew Hudson
// uasniffer is freely distributable under the MIT license.
// For all details and documentation:
// http://thematthewhudson.com/uasniffer/

(function() {

  var uasniffer,
    previousUasniffer,
    addClass,
    documentElement,
    find,
    handleOrientation,
    hasClass,
    orientationEvent,
    removeClass,
    userAgent;

  // Save the previous value of the `uasniffer` variable.
  previousUasniffer = window.uasniffer;

  device = {};

  // Add `uasniffer` as a global object.
  window.uasniffer = uasniffer;

  // The `<html>` node.
  documentElement = window.document.documentElement;

  // The client user agent string.
  // Lowercase, so we can use the more efficient indexOf(), instead of Regex.
  userAgent = window.navigator.userAgent.toLowerCase();

  // Main functions
  // --------------

  uasniffer.ios = function () {
    return uasniffer.iphone() || uasniffer.ipod() || uasniffer.ipad();
  };

  uasniffer.iphone = function () {
    return !uasniffer.windows() && find('iphone');
  };

  uasniffer.ipod = function () {
    return find('ipod');
  };

  uasniffer.ipad = function () {
    return find('ipad');
  };

  uasniffer.android = function () {
    return !uasniffer.windows() && find('android');
  };

  uasniffer.androidPhone = function () {
    return uasniffer.android() && find('mobile');
  };

  uasniffer.androidTablet = function () {
    return uasniffer.android() && !find('mobile');
  };

  uasniffer.blackberry = function () {
    return find('blackberry') || find('bb10') || find('rim');
  };

  uasniffer.blackberryPhone = function () {
    return uasniffer.blackberry() && !find('tablet');
  };

  uasniffer.blackberryTablet = function () {
    return uasniffer.blackberry() && find('tablet');
  };

  uasniffer.windows = function () {
    return find('windows');
  };

  uasniffer.windowsPhone = function () {
    return uasniffer.windows() && find('phone');
  };

  uasniffer.windowsTablet = function () {
    return uasniffer.windows() && (find('touch') && !uasniffer.windowsPhone());
  };

  uasniffer.fxos = function () {
    return (find('(mobile;') || find('(tablet;')) && find('; rv:');
  };

  uasniffer.fxosPhone = function () {
    return uasniffer.fxos() && find('mobile');
  };

  uasniffer.fxosTablet = function () {
    return uasniffer.fxos() && find('tablet');
  };

  uasniffer.meego = function () {
    return find('meego');
  };

  uasniffer.cordova = function () {
    return window.cordova && location.protocol === 'file:';
  };

  uasniffer.nodeWebkit = function () {
    return typeof window.process === 'object';
  };

  uasniffer.mobile = function () {
    return uasniffer.androidPhone() || uasniffer.iphone() || uasniffer.ipod() || uasniffer.windowsPhone() || uasniffer.blackberryPhone() || uasniffer.fxosPhone() || uasniffer.meego();
  };

  uasniffer.tablet = function () {
    return uasniffer.ipad() || uasniffer.androidTablet() || uasniffer.blackberryTablet() || uasniffer.windowsTablet() || uasniffer.fxosTablet();
  };

  uasniffer.desktop = function () {
    return !uasniffer.tablet() && !uasniffer.mobile();
  };

  uasniffer.television = function() {
    var i, television = [
      "googletv",
      "viera",
      "smarttv",
      "internet.tv",
      "netcast",
      "nettv",
      "appletv",
      "boxee",
      "kylo",
      "roku",
      "dlnadoc",
      "roku",
      "pov_tv",
      "hbbtv",
      "ce-html"
    ];

    i = 0;
    while (i < television.length) {
      if (find(television[i])) {
        return true;
      }
      i++;
    }
    return false;
  };

  uasniffer.portrait = function () {
    return (window.innerHeight / window.innerWidth) > 1;
  };

  uasniffer.landscape = function () {
    return (window.innerHeight / window.innerWidth) < 1;
  };

  // Public Utility Functions
  // ------------------------

  // Run `uasniffer` in noConflict mode,
  // returning the device variable to its previous owner.
  uasniffer.noConflict = function () {
    window.uasniffer = previousUasniffer;
    return this;
  };

  // Private Utility Functions
  // -------------------------

  // Simple UA string search
  find = function (needle) {
    return userAgent.indexOf(needle) !== -1;
  };

  // Check if documentElement already has a given class.
  hasClass = function (className) {
    var regex;
    regex = new RegExp(className, 'i');
    return documentElement.className.match(regex);
  };

  // Add one or more CSS classes to the <html> element.
  addClass = function (className) {
    var currentClassNames = null;
    if (!hasClass(className)) {
      currentClassNames = documentElement.className.replace(/^\s+|\s+$/g, '');
      documentElement.className = currentClassNames + " " + className;
    }
  };

  // Remove single CSS class from the <html> element.
  removeClass = function (className) {
    if (hasClass(className)) {
      documentElement.className = documentElement.className.replace(" " + className, "");
    }
  };

  // HTML Element Handling
  // ---------------------

  // Insert the appropriate CSS class based on the _user_agent.

  if (uasniffer.ios()) {
    if (uasniffer.ipad()) {
      addClass("ios ipad tablet");
    } else if (uasniffer.iphone()) {
      addClass("ios iphone mobile");
    } else if (uasniffer.ipod()) {
      addClass("ios ipod mobile");
    }
  } else if (uasniffer.android()) {
    if (uasniffer.androidTablet()) {
      addClass("android tablet");
    } else {
      addClass("android mobile");
    }
  } else if (uasniffer.blackberry()) {
    if (uasniffer.blackberryTablet()) {
      addClass("blackberry tablet");
    } else {
      addClass("blackberry mobile");
    }
  } else if (uasniffer.windows()) {
    if (uasniffer.windowsTablet()) {
      addClass("windows tablet");
    } else if (uasniffer.windowsPhone()) {
      addClass("windows mobile");
    } else {
      addClass("desktop");
    }
  } else if (uasniffer.fxos()) {
    if (uasniffer.fxosTablet()) {
      addClass("fxos tablet");
    } else {
      addClass("fxos mobile");
    }
  } else if (uasniffer.meego()) {
    addClass("meego mobile");
  } else if (uasniffer.nodeWebkit()) {
    addClass("node-webkit");
  } else if (uasniffer.television()) {
    addClass("television");
  } else if (uasniffer.desktop()) {
    addClass("desktop");
  }

  if (uasniffer.cordova()) {
    addClass("cordova");
  }

  // Orientation Handling
  // --------------------

  // Handle device orientation changes.
  handleOrientation = function () {
    if (uasniffer.landscape()) {
      removeClass("portrait");
      addClass("landscape");
    } else {
      removeClass("landscape");
      addClass("portrait");
    }
  };

  // Detect whether device supports orientationchange event,
  // otherwise fall back to the resize event.
  if (Object.prototype.hasOwnProperty.call(window, "onorientationchange")) {
    orientationEvent = "orientationchange";
  } else {
    orientationEvent = "resize";
  }

  // Listen for changes in orientation.
  if (window.addEventListener) {
    window.addEventListener(orientationEvent, handleOrientation, false);
  } else if (window.attachEvent) {
    window.attachEvent(orientationEvent, handleOrientation);
  } else {
    window[orientationEvent] = handleOrientation;
  }

  handleOrientation();

  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    define(function() {
      return uasniffer;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = uasniffer;
  } else {
    window.uasniffer = uasniffer;
  }

}).call(this);
