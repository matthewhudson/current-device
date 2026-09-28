---
"current-device": patch
---

Ship ES5 output again. Since 2.0.0 the build targeted ES2022, so `dist/` (including the `<script>`/CDN build `dist/index.global.js`) contained arrow functions, `let`/`const` and template literals, and failed to parse in ES5-only browsers such as IE11 and older Android WebViews. All three builds (CJS, ESM, IIFE) are now down-leveled to ES5, with no Symbol or other ES2015+ runtime APIs, and no extra globals. Detection behavior is unchanged.
