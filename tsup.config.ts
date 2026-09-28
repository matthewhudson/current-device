import { transform } from '@swc/core'
import { defineConfig, type Options } from 'tsup'

type Plugin = NonNullable<Options['plugins']>[number]

// Down-level the bundled output to ES5 so the library parses in older
// browsers (e.g. IE11, older Android WebViews). esbuild can't emit ES5, so
// SWC does it after bundling. This replaces tsup's built-in `target: 'es5'`
// handling in order to skip `transform-typeof-symbol`: the library never uses
// Symbols, and that transform injects a `_type_of` helper outside the IIFE
// wrapper, which would leak a global in the <script> tag build.
const es5: Plugin = {
  name: 'es5',
  async renderChunk(code, info) {
    if (!/\.(js|mjs|cjs)$/.test(info.path)) {
      return
    }
    const result = await transform(code, {
      filename: info.path,
      sourceMaps: Boolean(this.options.sourcemap),
      swcrc: false,
      configFile: false,
      env: {
        forceAllTransforms: true,
        exclude: ['transform-typeof-symbol']
      },
      jsc: {
        parser: { syntax: 'ecmascript' },
        // Only arrays are iterated (incl. esbuild's CJS interop helpers), so
        // compile for...of to index loops instead of Symbol.iterator, which
        // ES5 engines don't have
        assumptions: { iterableIsArray: true }
      },
      module: {
        type: this.format === 'cjs' ? 'commonjs' : 'es6'
      }
    })
    return { code: result.code, map: result.map }
  }
}

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm', 'iife'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  plugins: [es5]
})
