(function() {
  var previousDevice, _addClass, _device, _doc_element, _find, _handleOrientation, _hasClass, _orientation_event, _removeClass, _supports_orientation, _user_agent;

  previousDevice = window.device;

  _device = {};

  window.device = _device;

  _doc_element = window.document.documentElement;

  _user_agent = window.navigator.userAgent.toLowerCase();

  _device.ios = function() {
    return _device.iphone() || _device.ipod() || _device.ipad();
  };

  _device.iphone = function() {
    return _find('iphone');
  };

  _device.ipod = function() {
    return _find('ipod');
  };

  _device.ipad = function() {
    return _find('ipad');
  };

  _device.android = function() {
    return _find('android');
  };

  _device.androidPhone = function() {
    return _device.android() && _find('mobile');
  };

  _device.androidTablet = function() {
    return _device.android() && !_find('mobile');
  };

  _device.blackberry = function() {
    return _find('blackberry') || _find('bb10') || _find('rim');
  };

  _device.blackberryPhone = function() {
    return _device.blackberry() && !_find('tablet');
  };

  _device.blackberryTablet = function() {
    return _device.blackberry() && _find('tablet');
  };

  _device.windows = function() {
    return _find('windows');
  };

  _device.windowsPhone = function() {
    return _device.windows() && _find('phone');
  };

  _device.windowsTablet = function() {
    return _device.windows() && _find('touch');
  };

  _device.fxos = function() {
    return (_find('(mobile;') || _find('(tablet;')) && _find('; rv:');
  };

  _device.fxosPhone = function() {
    return _device.fxos() && _find('mobile');
  };

  _device.fxosTablet = function() {
    return _device.fxos() && _find('tablet');
  };

  _device.meego = function() {
    return _find('meego');
  };

  _device.cordova = function() {
    return window.cordova && location.protocol === 'file:';
  };

  _device.mobile = function() {
    return _device.androidPhone() || _device.iphone() || _device.ipod() || _device.windowsPhone() || _device.blackberryPhone() || _device.fxosPhone() || _device.meego();
  };

  _device.tablet = function() {
    return _device.ipad() || _device.androidTablet() || _device.blackberryTablet() || _device.windowsTablet() || _device.fxosTablet();
  };

  _device.desktop = function() {
    return !_device.tablet() && !_device.mobile();
  };

  _device.portrait = function() {
    return (window.innerHeight / window.innerWidth) > 1;
  };

  _device.landscape = function() {
    return (window.innerHeight / window.innerWidth) < 1;
  };

  _device.noConflict = function() {
    window.device = previousDevice;
    return this;
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

  if (_device.ios()) {
    if (_device.ipad()) {
      _addClass("ios ipad tablet");
    } else if (_device.iphone()) {
      _addClass("ios iphone mobile");
    } else if (_device.ipod()) {
      _addClass("ios ipod mobile");
    }
  } else if (_device.android()) {
    if (_device.androidTablet()) {
      _addClass("android tablet");
    } else {
      _addClass("android mobile");
    }
  } else if (_device.blackberry()) {
    if (_device.blackberryTablet()) {
      _addClass("blackberry tablet");
    } else {
      _addClass("blackberry mobile");
    }
  } else if (_device.windows()) {
    if (_device.windowsTablet()) {
      _addClass("windows tablet");
    } else if (_device.windowsPhone()) {
      _addClass("windows mobile");
    } else {
      _addClass("desktop");
    }
  } else if (_device.fxos()) {
    if (_device.fxosTablet()) {
      _addClass("fxos tablet");
    } else {
      _addClass("fxos mobile");
    }
  } else if (_device.meego()) {
    _addClass("meego mobile");
  } else {
    _addClass("desktop");
  }

  if (_device.cordova()) {
    _addClass("cordova");
  }

  _handleOrientation = function() {
    if (_device.landscape()) {
      _removeClass("portrait");
      return _addClass("landscape");
    } else {
      _removeClass("landscape");
      return _addClass("portrait");
    }
  };

  _supports_orientation = "onorientationchange" in window;

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
