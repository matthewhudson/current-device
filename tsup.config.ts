import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    outDir: 'dist',
    // Output syntax floor: browsers with full ES2015 support (see README
    // "Browser Support"). Newer syntax in src/ is down-leveled to this.
    // Enforced by `pnpm run check:es2015`.
    target: 'es2015'
  },
  {
    // The <script> build (dist/index.global.js), served by unpkg and jsDelivr.
    // Bundlers minify the CJS/ESM builds themselves; nothing minifies this one
    entry: ['src/index.ts'],
    format: ['iife'],
    minify: true,
    sourcemap: true,
    outDir: 'dist',
    target: 'es2015'
  },
  {
    // The React hooks, published as `current-device/react`
    entry: ['src/react.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    outDir: 'dist',
    target: 'es2015',
    external: ['react'],
    // Lets a React Server Component import the hooks' module
    banner: { js: "'use client';" },
    esbuildPlugins: [
      {
        // Import the detection code from the package instead of bundling a
        // second copy, which would add its own listener and `window.device`
        name: 'external-current-device',
        setup(build) {
          build.onResolve({ filter: /^\.\/index$/ }, () => ({
            path: 'current-device',
            external: true
          }))
        }
      }
    ]
  }
])
