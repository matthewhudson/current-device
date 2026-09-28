---
"current-device": patch
---

Fix `device.onChangeOrientation()` callbacks being called when the orientation did not change. On browsers without the `orientationchange` event (all desktop browsers) current-device listens to `resize`, and it called every callback and rewrote the `<html>` classes on each resize event, so dragging a window edge called them continuously. Callbacks are now called, and the `landscape`/`portrait` classes updated, only when the orientation changes.
