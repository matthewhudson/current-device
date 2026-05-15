---
"current-device": minor
---

Expand device and OS support and modernize internal DOM logic.

- Added detection for **visionOS** (Apple Vision Pro).
- Added detection for **ChromeOS** and generic **Linux**.
- Expanded **Television** detection to include modern Smart TV platforms (Tizen, webOS) and game consoles (PlayStation, Xbox, Nintendo).
- Refactored internal DOM manipulation to use the modern `classList` API for better safety and performance.
- Improved logic for existing detections to prevent false positives (e.g., excluding visionOS from macOS/iPadOS).
