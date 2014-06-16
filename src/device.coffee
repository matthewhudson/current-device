# Device.js
# (c) 2014 Matthew Hudson
# Device.js is freely distributable under the MIT license.
# For all details and documentation:
# http://matthewhudson.me/projects/device.js/

# Save the previous value of the device variable.
previousDevice = window.device

# Add _device as a global object.
_device = {}
window.device = _device

# The <html> element.
_doc_element = window.document.documentElement

# The client user agent string.
# Lowercase, so we can use the more efficient indexOf(), instead of Regex
_user_agent = window.navigator.userAgent.toLowerCase()


# Main functions
# --------------

_device.ios = ->
  _device.iphone() or _device.ipod() or _device.ipad()

_device.iphone = ->
  _find 'iphone'

_device.ipod = ->
  _find 'ipod'

_device.ipad = ->
  _find 'ipad'

_device.android = ->
  _find 'android'

_device.androidPhone = ->
  _device.android() and _find 'mobile'

# See: http://android-developers.blogspot.com/2010/12/android-browser-user-agent-issues.html
_device.androidTablet = ->
  _device.android() and not _find 'mobile'

_device.blackberry = ->
  _find('blackberry') or _find('bb10') or _find('rim')

_device.blackberryPhone = ->
  _device.blackberry() and not _find 'tablet'

# See: http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/How-to-detect-the-BlackBerry-Browser/ta-p/559862
_device.blackberryTablet = ->
  _device.blackberry() and _find 'tablet'

_device.windows = ->
  _find 'windows'

_device.windowsPhone = ->
  _device.windows() and _find 'phone'

_device.windowsTablet = ->
  _device.windows() and _find 'touch'

_device.fxos = ->
  (_find('(mobile;') or _find('(tablet;')) and _find('; rv:')

_device.fxosPhone = ->
  _device.fxos() and _find 'mobile'

_device.fxosTablet = ->
  _device.fxos() and _find 'tablet'

_device.meego = ->
  _find 'meego'

_device.cordova = ->
  window.cordova && location.protocol == 'file:'

_device.mobile = ->
  _device.androidPhone() or _device.iphone() or _device.ipod() or _device.windowsPhone() or _device.blackberryPhone() or _device.fxosPhone() or _device.meego()

_device.tablet = ->
  _device.ipad() or _device.androidTablet() or _device.blackberryTablet() or _device.windowsTablet() or _device.fxosTablet()

_device.desktop = ->
  not _device.tablet() and not _device.mobile()

_device.portrait = ->
  (window.innerHeight/window.innerWidth) > 1

_device.landscape = ->
  (window.innerHeight/window.innerWidth) < 1

# Run device.js in noConflict mode, returning the device variable to its previous owner.
# Returns a reference to the _device object.
_device.noConflict = ->
  window.device = previousDevice
  @

# Private Utility
# ---------------

# Simple UA string search
_find = (needle) ->
  _user_agent.indexOf(needle) isnt -1

# Check if docElement already has a given class.
_hasClass = (class_name) ->
  regex = new RegExp class_name, 'i'
  _doc_element.className.match regex

# Add one or more CSS classes to the <html> element.
_addClass = (class_name) ->
  if not _hasClass class_name
    _doc_element.className += " " + class_name

# Remove single CSS class from the <html> element.
_removeClass = (class_name) ->
  if _hasClass class_name
    _doc_element.className = _doc_element.className.replace class_name, ""


# HTML Element Handling
# ---------------------

# Insert the appropriate CSS class based on the _user_agent.
if _device.ios()
  if _device.ipad()
    _addClass "ios ipad tablet"
  else if _device.iphone()
    _addClass "ios iphone mobile"
  else if _device.ipod()
    _addClass "ios ipod mobile"

else if _device.android()
  if _device.androidTablet()
    _addClass "android tablet"
  else
    _addClass "android mobile"

else if _device.blackberry()
  if _device.blackberryTablet()
    _addClass "blackberry tablet"
  else
    _addClass "blackberry mobile"

else if _device.windows()
  if _device.windowsTablet()
    _addClass "windows tablet"
  else if _device.windowsPhone()
    _addClass "windows mobile"
  else
    _addClass "desktop"

else if _device.fxos()
  if _device.fxosTablet()
    _addClass "fxos tablet"
  else
    _addClass "fxos mobile"

else if _device.meego()
  _addClass "meego mobile"

else
  _addClass "desktop"

if _device.cordova()
  _addClass "cordova"


# Orientation Handling
# --------------------

# Handle _device orientation changes
_handleOrientation = ->
  if _device.landscape()
    _removeClass "portrait"
    _addClass "landscape"
  else
    _removeClass "landscape"
    _addClass "portrait"

# Detect whether _device supports orientationchange event,
# otherwise fall back to the resize event.
_supports_orientation = "onorientationchange" of window
_orientation_event = if _supports_orientation then "orientationchange" else "resize"

# Listen for changes in orientation.
if window.addEventListener
  window.addEventListener _orientation_event, _handleOrientation, no
else if window.attachEvent
  window.attachEvent _orientation_event, _handleOrientation
else
  window[_orientation_event] = _handleOrientation

_handleOrientation()
