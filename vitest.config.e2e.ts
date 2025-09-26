import path from 'node:path'
import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.e2e-spec.ts'],
    globals: true,
    root: './'
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' }
    })
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
})
