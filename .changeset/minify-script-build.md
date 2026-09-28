---
"current-device": patch
---

Minify the `<script>` build (`dist/index.global.js`, the file unpkg and jsDelivr serve). It was shipped unminified at 11 KB; it is now 6 KB, about 2 KB gzipped. The CommonJS and ES module builds are unchanged, since bundlers minify those themselves.
