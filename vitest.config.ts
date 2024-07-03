import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const root = (p: string) => resolve(__dirname, p)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': root('./src'),
    },
    dedupe: ['vue', '@vue/runtime-core'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['**/node_modules/**'],
    include: ['./**/*.test.{ts,js}'],
    environmentOptions: {
      jsdom: {
        resources: 'usable',
      },
    },
  },
})
