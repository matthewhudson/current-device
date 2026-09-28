---
"current-device": patch
---

Fix the `<html>` class handling when the page has its own classes that contain a class name current-device uses. Classes were matched as substrings, so with `<html class="landscape-hero">` the `landscape` class was never added, and with `<html class="theme portrait-gallery">` removing `portrait` rewrote the page's class to `theme-gallery`. An orientation class that was the first class on `<html>` was also never removed. Classes are now added and removed with `classList`.
