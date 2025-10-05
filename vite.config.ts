import { defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import vueDevTools from 'vite-plugin-vue-devtools';

const rootDir = process.cwd();

const aliases = [
  // Shared
  { find: '@', replacement: resolve(rootDir, 'src') },
  {
    find: '@styles',
    replacement: resolve(rootDir, 'src/app/styles/')
  },
  {
    find: '@icon',
    replacement: resolve(rootDir, 'src/shared/assets/icon/')
  },
  {
    find: '@pages',
    replacement: resolve(rootDir, 'src/pages/')
  },
  {
    find: '@ui',
    replacement: resolve(rootDir, 'src/shared/ui')
 },
  {
    find: '@api',
    replacement: resolve(rootDir, 'src/shared/api/')
  },
  {
    find: '@request',
    replacement: resolve(rootDir, 'src/shared/api/model')
 },
  {
    find: '@store',
    replacement: resolve(rootDir, 'src/shared/store/')
  },
  {
    find: '@composables',
    replacement: resolve(rootDir, 'src/shared/composables/index.ts')
  },
  // Other
 {
    find: '@entities',
    replacement: resolve(rootDir, 'src/entities/')
  },
  {
    find: '@features',
    replacement: resolve(rootDir, 'src/features/')
  },
  {
    find: '@widgets',
    replacement: resolve(rootDir, 'src/widgets/')
  },
  {
    find: '@layout',
    replacement: resolve(rootDir, 'src/layout/')
  }
];

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  base: '/vue-3-todo-list/',
  server: {
    host: true
  },
  preview: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
        api: 'modern',
        additionalData: `
          @use "@/app/styles/mixins.scss" as *;
        `
      }
    }
  },
  resolve: {
    alias: aliases
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{vue,ts,js}']
    }
  }
} as UserConfig);