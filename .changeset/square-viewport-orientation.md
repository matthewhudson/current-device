---
"current-device": patch
---

Fix the orientation of a square viewport. When the viewport's width and height were equal, `<html>` got the `portrait` class, but `device.portrait()` and `device.landscape()` both returned false and `device.orientation` was `'unknown'`. A square viewport is now portrait everywhere, which matches the CSS `(orientation: portrait)` media query.
