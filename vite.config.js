import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import Inspect from 'vite-plugin-inspect'
import svgLoader from 'vite-svg-loader'

export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '' : '/client/',
    build: {
      outDir: 'dist/client/',
    },
    plugins: [
      vue(),
      svgLoader(),
      Inspect(),
      ElementPlus({
        useSource: true,
        defaultLocale: 'zh-cn',
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/element/index.scss" as *;',
        },
      },
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        utils: fileURLToPath(new URL('./src/utils', import.meta.url)),
        api: fileURLToPath(new URL('./src/api', import.meta.url)),
        hooks: fileURLToPath(new URL('./src/hooks', import.meta.url)),
      },
    },
  }
})
