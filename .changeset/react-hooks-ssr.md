---
"current-device": minor
---

Add React hooks, support server-side rendering, and let orientation callbacks unsubscribe.

- **React hooks.** `current-device/react` exports `useDevice()`, which returns `{ type, os, orientation }`, and `useOrientation()`. Both re-render the component when the orientation changes. They need React 18 or later, which is an optional peer dependency.
- **Server-side rendering.** Importing current-device without a DOM, as Next.js, Remix and Astro do on the server, threw `ReferenceError: window is not defined`. The import now works: there every method returns `false`, and `device.type`, `device.os` and `device.orientation` are `'unknown'`. The hooks return `'unknown'` on the server and while the page hydrates.
- **Unsubscribe.** `device.onChangeOrientation(callback)` now returns a function that removes the callback. It returned nothing before.
- **Fix:** `device.orientation` already has the new value when the orientation callbacks are called. It had the previous value until they had all returned.
