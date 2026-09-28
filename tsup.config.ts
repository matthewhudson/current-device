import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  // Output syntax floor: browsers with full ES2015 support (see README
  // "Browser Support"). Newer syntax in src/ is down-leveled to this.
  // Enforced by `pnpm run check:es2015`.
  target: 'es2015'
})
