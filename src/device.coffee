# Device.js
# (c) 2013 Matthew Hudson
# Device.js is freely distributable under the MIT license.
# For all details and documentation:
# http://matthewhudson.me/projects/device.js/
device = {}

# The <html> element.
_doc_element = window.document.documentElement

# The client user agent string.
_user_agent = window.navigator.userAgent.toLowerCase()


# Main functions
# --------------

device.ios = () ->
  device.iphone() or device.ipod() or device.ipad()

device.iphone = () ->
  if _user_agent.match /iphone/i then yes else no

device.ipod = () ->
  if _user_agent.match /ipod/i then yes else no

device.ipad = () ->
  if _user_agent.match /ipad/i then yes else no

device.android = () ->
  if _user_agent.match /android/i then yes else no

device.androidPhone = () ->
  if device.android() and _user_agent.match /mobile/i then yes else no

# See: http://android-developers.blogspot.com/2010/12/android-browser-user-agent-issues.html
device.androidTablet = () ->
  if device.android() and not _user_agent.match /mobile/i then yes else no

device.blackberry = () ->
  if _user_agent.match /blackberry/i then yes else no

device.blackberryPhone = () ->
  if device.blackberry() and not _user_agent.match /tablet/i then yes else no

# See: http://supportforums.blackberry.com/t5/Web-and-WebWorks-Development/How-to-detect-the-BlackBerry-Browser/ta-p/559862
device.blackberryTablet = () ->
  if _user_agent.match /rim tablet/i then yes else no

device.windowsPhone = () ->
  if  _user_agent.match /windows phone/i then yes else no

device.mobile = () ->
  device.androidPhone() or device.iphone() or device.ipod() or device.windowsPhone() or device.blackberryPhone()

device.tablet = () ->
  device.ipad() or device.androidTablet() or device.blackberryTablet()

device.portrait = () ->
  if Math.abs window.orientation is 90 then no else yes

device.landscape = () ->
  if Math.abs window.orientation is 90 then yes else no


# Private Utility 
# ---------------

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
if device.ios()
  if device.ipad()
    _addClass "ios ipad tablet"
  else if device.iphone()
    _addClass "ios iphone mobile"
  else if device.ipod()
    _addClass "ios ipod mobile"

else if device.android()
  if device.androidTablet()
    _addClass "android tablet"
  else
    _addClass "android mobile"

else if device.blackberry()
  if device.blackberryTablet()
    _addClass "blackberry tablet"
  else
    _addClass "blackberry mobile"

else if device.windowsPhone()
  _addClass "windows mobile"
else 
  _addClass "desktop"


# Orientation Handling
# --------------------

# Handle device orientation changes
_handleOrientation = () ->
  if device.landscape()
    _removeClass "portrait"
    _addClass "landscape"
  else 
    _removeClass "landscape"
    _addClass "portrait"

# Detect whether device supports orientationchange event, 
# otherwise fall back to the resize event.
_supports_orientation = "onorientationchange" in window
_orientation_event = if _supports_orientation then "orientationchange" else "resize"

# Listen for changes in orientation.
if window.addEventListener
  window.addEventListener _orientation_event, _handleOrientation, no
else if window.attachEvent
  window.attachEvent _orientation_event, _handleOrientation
else
  window[_orientation_event] = _handleOrientation

_handleOrientation()
