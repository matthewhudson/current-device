/*! device.js 0.2.0 */
(function() {
  var _addClass, _doc_element, _find, _handleOrientation, _hasClass, _orientation_event, _removeClass, _supports_orientation, _user_agent,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.device = {};

  _doc_element = window.document.documentElement;

  _user_agent = window.navigator.userAgent.toLowerCase();

  device.ios = function() {
    return device.iphone() || device.ipod() || device.ipad();
  };

  device.iphone = function() {
    return _find('iphone');
  };

  device.ipod = function() {
    return _find('ipod');
  };

  device.ipad = function() {
    return _find('ipad');
  };

  device.android = function() {
    return _find('android');
  };

  device.androidPhone = function() {
    return device.android() && _find('mobile');
  };

  device.androidTablet = function() {
    return device.android() && !_find('mobile');
  };

  device.blackberry = function() {
    return _find('blackberry') || _find('bb10') || _find('rim');
  };

  device.blackberryPhone = function() {
    return device.blackberry() && !_find('tablet');
  };

  device.blackberryTablet = function() {
    return device.blackberry() && _find('tablet');
  };

  device.windows = function() {
    return _find('windows');
  };

  device.windowsPhone = function() {
    return device.windows() && _find('phone');
  };

  device.windowsTablet = function() {
    return device.windows() && _find('touch');
  };

  device.mobile = function() {
    return device.androidPhone() || device.iphone() || device.ipod() || device.windowsPhone() || device.blackberryPhone();
  };

  device.tablet = function() {
    return device.ipad() || device.androidTablet() || device.blackberryTablet() || device.windowsTablet();
  };

  device.desktop = function() {
    return (device.windows() && !device.windowsTablet() && !device.windowsPhone())
           || (!device.ios() && !device.android() && !device.blackberry() && device.windows());
  };

  device.portrait = function() {
    if (typeof window.orientation!='undefined')
      return Math.abs(window.orientation) !== 90;
    return ( window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight )
           >( window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth );
  };

  device.landscape = function() {
    if (typeof window.orientation!='undefined')
      return Math.abs(window.orientation) === 90;
    return ( window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth )
           >=( window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight );
  };

  _find = function(needle) {
    return _user_agent.indexOf(needle) !== -1;
  };

  _hasClass = function(class_name) {
    var regex;
    regex = new RegExp(class_name, 'i');
    return _doc_element.className.match(regex);
  };

  _addClass = function(class_name) {
    if (!_hasClass(class_name)) {
      return _doc_element.className += " " + class_name;
    }
  };

  _removeClass = function(class_name) {
    if (_hasClass(class_name)) {
      return _doc_element.className = _doc_element.className.replace(class_name, "");
    }
  };


  _addClass( (device.ios()?"":"no-")+"ios" );
  _addClass( (device.ipad()?"":"no-")+"ipad" );
  _addClass( (device.iphone()?"":"no-")+"iphone" );
  _addClass( (device.ipod()?"":"no-")+"ipod" );

  _addClass( (device.android()?"":"no-")+"android" );
  _addClass( (device.androidPhone()?"":"no-")+"androidPhone" );
  _addClass( (device.androidTablet()?"":"no-")+"androidTablet" );

  _addClass( (device.blackberry()?"":"no-")+"blackberry" );
  _addClass( (device.blackberryPhone()?"":"no-")+"blackberryPhone" );
  _addClass( (device.blackberryTablet()?"":"no-")+"blackberryTablet" );

  _addClass( (device.windows()?"":"no-")+"windows" );
  _addClass( (device.windowsPhone()?"":"no-")+"windowsPhone" );
  _addClass( (device.windowsTablet()?"":"no-")+"windowsTablet" );

  _addClass( (device.tablet()?"":"no-")+"tablet" );
  _addClass( (device.mobile()?"":"no-")+"mobile" );
  _addClass( (device.desktop()?"":"no-")+"desktop" );

  if (!device.ios() && !device.android() && !device.blackberry() && device.windows())
    _addClass("desktop unknown");


  _handleOrientation = function() {
    if (device.landscape()) {
      _removeClass("portrait");
      return _addClass("landscape");
    } else {
      _removeClass("landscape");
      return _addClass("portrait");
    }
  };

  _supports_orientation = __indexOf.call(window, "onorientationchange") >= 0;

  _orientation_event = _supports_orientation ? "orientationchange" : "resize";

  if (window.addEventListener) {
    window.addEventListener(_orientation_event, _handleOrientation, false);
  } else if (window.attachEvent) {
    window.attachEvent(_orientation_event, _handleOrientation);
  } else {
    window[_orientation_event] = _handleOrientation;
  }

  _handleOrientation();

}).call(this);
