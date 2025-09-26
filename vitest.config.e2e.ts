import path from 'node:path'
import swc from 'unplugin-swc'
import tsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts'],
    globals: true,
    root: './'
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' }
    }),
    tsConfigPaths()
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
