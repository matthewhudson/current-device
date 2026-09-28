# Demo Page Redesign Design

**Date:** 2026-02-24
**Status:** Approved

## Context

The current `docs/index.html` demo page is outdated (table-based layout, vendor-prefixed gradients, Helvetica Neue, Twitter widget, Google Analytics). It needs a modern redesign that sells the library to developers evaluating it.

## Constraints

- Single static HTML file (no build step, GitHub Pages deploy)
- Primary audience: developers evaluating the library before installing
- Visual tone: clean & modern

## Approach: "Device Dashboard"

Single-page landing that flows top-to-bottom with a live detection demo as the centerpiece.

## Visual Design System

**Typography:**
- Display/headings: DM Sans (Google Fonts)
- Code snippets: JetBrains Mono (Google Fonts)

**Color palette (CSS variables):**
- Background: `#FAFBFE`
- Surface cards: `#FFFFFF` with subtle box-shadow
- Text primary: `#1A1D26`
- Text secondary: `#6B7084`
- Accent: `#3B82F6` (blue)
- Accent subtle: `#EFF6FF`
- Success/detected: `#10B981` (emerald)
- Code background: `#F1F5F9`
- Border: `#E2E8F0`

**Layout:** Max-width 720px, generous vertical rhythm, responsive to mobile.

**Motion:** Subtle CSS fade-in stagger on load, smooth transition on orientation change.

## Page Structure

### 1. Hero
- Library name as main heading
- Tagline: "Lightweight device detection for CSS and JavaScript — OS, type, and orientation."
- Live detection pill: e.g. "macOS · Desktop · Landscape"
- npm install one-liner
- Links: GitHub repo + npm package

### 2. Live Detection Panel
Card with three grouped rows:
- **Type** — mobile, tablet, desktop badges (detected = emerald highlight)
- **OS** — ios, iphone, ipad, ipod, android, blackberry, macos, windows, fxos, meego, television badges
- **Orientation** — portrait, landscape (updates live on resize)
- Note about automatic CSS classes on `<html>`

### 3. How It Works (3 columns, stacks on mobile)
- CSS Classes — shows auto-applied class selectors
- JavaScript API — shows import + method calls
- Orientation Callbacks — shows `onChangeOrientation` usage

### 4. Quick Start
Two tabs: ESM (recommended) and Script Tag, each with install + usage code.

### 5. Footer
GitHub link, npm link, MIT license, "Created by Matthew Hudson". No Twitter widget, no analytics.

## Removed from Current Page
- Google Analytics tracking
- Twitter follow button/widget
- Old UMD CDN path (replaced with modern unpkg URL)
- Table-based centering layout
- Vendor-prefixed gradient backgrounds
- Screenshot images (iphone.png, android.png, blackberry.png)
