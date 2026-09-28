# Demo Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the outdated `docs/index.html` with a modern, clean landing page that showcases the `current-device` library's live detection and API to developers evaluating it.

**Architecture:** Single self-contained HTML file with embedded CSS and JS. Loads `current-device` from unpkg CDN and Google Fonts externally. No build step. Uses CSS custom properties for theming, CSS grid for layout, and vanilla JS for live detection display and tab switching.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, animations), vanilla JavaScript, Google Fonts (DM Sans, JetBrains Mono), unpkg CDN for library.

---

### Task 1: Write the complete HTML structure

**Files:**
- Modify: `docs/index.html` (full rewrite)

**Step 1: Write the full HTML document**

Replace `docs/index.html` entirely. The document structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>current-device — Browser Device Detection</title>
  <meta name="description" content="Lightweight device detection for CSS and JavaScript — OS, type, and orientation.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>/* CSS goes here — see Task 2 */</style>
</head>
<body>
  <!-- HERO -->
  <header class="hero">
    <h1>current-device</h1>
    <p class="tagline">Lightweight device detection for CSS and JavaScript — OS, type, and orientation.</p>
    <div class="hero-pill" id="hero-pill">
      <!-- Populated by JS: e.g. "macOS · Desktop · Landscape" -->
    </div>
    <div class="install-bar">
      <code>npm install current-device</code>
    </div>
    <nav class="hero-links">
      <a href="https://github.com/matthewhudson/current-device">GitHub</a>
      <a href="https://www.npmjs.com/package/current-device">npm</a>
    </nav>
  </header>

  <!-- LIVE DETECTION PANEL -->
  <section class="detection-panel">
    <h2>Your Device</h2>
    <p class="detection-note">These CSS classes are automatically added to <code>&lt;html&gt;</code> on import.</p>

    <div class="detection-group">
      <h3>Type</h3>
      <div class="badges">
        <span class="badge mobile">mobile</span>
        <span class="badge tablet">tablet</span>
        <span class="badge desktop">desktop</span>
      </div>
    </div>

    <div class="detection-group">
      <h3>Operating System</h3>
      <div class="badges">
        <span class="badge ios">ios</span>
        <span class="badge iphone">iphone</span>
        <span class="badge ipad">ipad</span>
        <span class="badge ipod">ipod</span>
        <span class="badge android">android</span>
        <span class="badge blackberry">blackberry</span>
        <span class="badge macos">macos</span>
        <span class="badge windows">windows</span>
        <span class="badge fxos">fxos</span>
        <span class="badge meego">meego</span>
        <span class="badge television">television</span>
      </div>
    </div>

    <div class="detection-group">
      <h3>Orientation</h3>
      <div class="badges" id="orientation-badges">
        <span class="badge portrait">portrait</span>
        <span class="badge landscape">landscape</span>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="how-it-works">
    <h2>How It Works</h2>
    <div class="columns">
      <div class="column">
        <h3>CSS Classes</h3>
        <pre><code>/* Applied automatically to &lt;html&gt; */
.desktop { /* desktop styles */ }
.mobile  { /* mobile styles */ }
.portrait  { /* ... */ }
.landscape { /* ... */ }</code></pre>
      </div>
      <div class="column">
        <h3>JavaScript API</h3>
        <pre><code>import device from 'current-device'

device.mobile()  // boolean
device.desktop() // boolean
device.os        // 'macos', 'ios', ...
device.type      // 'mobile', 'tablet', ...</code></pre>
      </div>
      <div class="column">
        <h3>Orientation</h3>
        <pre><code>device.onChangeOrientation(
  (newOrientation) =&gt; {
    console.log(newOrientation)
    // 'portrait' or 'landscape'
  }
)</code></pre>
      </div>
    </div>
  </section>

  <!-- QUICK START -->
  <section class="quick-start">
    <h2>Quick Start</h2>
    <div class="tabs">
      <button class="tab active" data-tab="esm">ESM (Recommended)</button>
      <button class="tab" data-tab="script">Script Tag</button>
    </div>
    <div class="tab-content active" id="tab-esm">
      <pre><code>npm install current-device</code></pre>
      <pre><code>import device from 'current-device'

if (device.mobile()) {
  // Mobile-specific logic
}

console.log(device.type)        // 'mobile', 'tablet', or 'desktop'
console.log(device.os)          // 'ios', 'android', 'macos', ...
console.log(device.orientation) // 'portrait' or 'landscape'</code></pre>
    </div>
    <div class="tab-content" id="tab-script">
      <pre><code>&lt;script src="https://unpkg.com/current-device"&gt;&lt;/script&gt;</code></pre>
      <pre><code>&lt;script&gt;
  if (device.mobile()) {
    // Mobile-specific logic
  }

  console.log(device.type)        // 'mobile', 'tablet', or 'desktop'
  console.log(device.os)          // 'ios', 'android', 'macos', ...
  console.log(device.orientation) // 'portrait' or 'landscape'
&lt;/script&gt;</code></pre>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="footer">
    <p>
      Created by <a href="https://github.com/matthewhudson">Matthew Hudson</a>
      &middot; <a href="https://github.com/matthewhudson/current-device">GitHub</a>
      &middot; <a href="https://www.npmjs.com/package/current-device">npm</a>
      &middot; MIT License
    </p>
  </footer>

  <script src="https://unpkg.com/current-device"></script>
  <script>/* JS goes here — see Task 3 */</script>
</body>
</html>
```

**Step 2: Commit the HTML structure**

```bash
git add docs/index.html
git commit -m "docs: rewrite demo page HTML structure"
```

---

### Task 2: Write the complete CSS

**Files:**
- Modify: `docs/index.html` (the `<style>` block)

**Step 1: Write the full embedded CSS**

Replace the `<style>` block with the complete stylesheet. Key design tokens as CSS custom properties:

```css
:root {
  --bg: #FAFBFE;
  --surface: #FFFFFF;
  --text: #1A1D26;
  --text-secondary: #6B7084;
  --accent: #3B82F6;
  --accent-subtle: #EFF6FF;
  --detected: #10B981;
  --detected-subtle: #ECFDF5;
  --code-bg: #F1F5F9;
  --border: #E2E8F0;
  --font-display: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

Key CSS patterns:
- `* { margin: 0; padding: 0; box-sizing: border-box; }` reset
- `body` centered with `max-width: 720px; margin: 0 auto; padding: 80px 24px;`
- `.hero` centered text, generous bottom margin
- `.hero-pill` inline-flex with gap, light border, rounded, populated by JS
- `.install-bar code` monospace on code-bg, copy-friendly
- `.detection-panel` white card with border + shadow
- `.badge` inline-block pill — default: muted gray border. Active state via CSS class cascade (`.desktop .badge.desktop { ... }`) uses `--detected` bg + white text
- `.columns` CSS grid 3-col, `@media (max-width: 640px)` stacks to 1-col
- `.tabs` / `.tab` / `.tab-content` — simple show/hide with `.active`
- `pre code` styled with `--code-bg`, rounded, `overflow-x: auto`
- `.footer` centered, small, muted
- `@keyframes fadeInUp` with staggered `animation-delay` on sections for page load
- Smooth `transition` on badge background-color for orientation change

Detection highlight rules — using the same CSS-class cascade as current page but with new colors:
```css
.mobile .badge.mobile,
.tablet .badge.tablet,
.desktop .badge.desktop,
.portrait .badge.portrait,
.landscape .badge.landscape,
.ios .badge.ios,
/* ... etc for all OS values ... */
{
  background: var(--detected-subtle);
  color: var(--detected);
  border-color: var(--detected);
  font-weight: 500;
}
```

**Step 2: Verify the page renders correctly**

Open `docs/index.html` in a browser. Check:
- Fonts load (DM Sans for body, JetBrains Mono for code)
- Color palette matches design
- Responsive: resize to 375px width, columns should stack
- Detection badges should highlight correctly (desktop + macos + landscape on a Mac)

**Step 3: Commit the CSS**

```bash
git add docs/index.html
git commit -m "docs: add complete CSS for demo page"
```

---

### Task 3: Write the JavaScript

**Files:**
- Modify: `docs/index.html` (the `<script>` block at bottom)

**Step 1: Write the JS for hero pill, orientation updates, and tab switching**

```javascript
(function () {
  // Populate hero pill with detected values
  var pill = document.getElementById('hero-pill');
  var parts = [];
  if (device.os !== 'unknown') {
    parts.push(device.os);
  }
  if (device.type !== 'unknown') {
    parts.push(device.type);
  }
  if (device.orientation !== 'unknown') {
    parts.push(device.orientation);
  }
  pill.textContent = parts.join(' \u00B7 ');

  // Live orientation update
  device.onChangeOrientation(function (newOrientation) {
    // Update hero pill
    parts[parts.length - 1] = newOrientation;
    pill.textContent = parts.join(' \u00B7 ');
  });

  // Tab switching for Quick Start
  var tabs = document.querySelectorAll('.tab');
  var contents = document.querySelectorAll('.tab-content');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      contents.forEach(function (c) { c.classList.remove('active'); });
      tab.classList.add('active');
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
  });
})();
```

**Step 2: Test in browser**

- Hero pill shows detected values (e.g. "macos · desktop · landscape")
- Resizing window updates orientation in pill and badge highlights
- Tab switching works between ESM and Script Tag views

**Step 3: Commit the JS**

```bash
git add docs/index.html
git commit -m "docs: add JavaScript for live detection and tab switching"
```

---

### Task 4: Visual polish and browser verification

**Files:**
- Modify: `docs/index.html` (tweaks only)

**Step 1: Open the page in a browser and verify**

Use Playwright to open `docs/index.html` and screenshot. Check:
- Layout, spacing, typography all look correct
- Detection badges highlight properly
- Animations play on load
- Page looks good at both desktop and mobile widths
- No broken fonts, missing styles, or JS errors

**Step 2: Fix any visual issues found**

Adjust spacing, colors, font sizes as needed.

**Step 3: Final commit**

```bash
git add docs/index.html
git commit -m "docs: polish demo page visual details"
```

---

### Task 5: Clean up old assets

**Files:**
- Delete: `docs/iphone.png`
- Delete: `docs/android.png`
- Delete: `docs/blackberry.png`

**Step 1: Remove old screenshot images no longer referenced**

```bash
git rm docs/iphone.png docs/android.png docs/blackberry.png
```

**Step 2: Commit**

```bash
git commit -m "docs: remove unused screenshot images"
```
