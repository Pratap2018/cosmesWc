import { fileURLToPath, URL } from 'node:url'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({

  base: '/cosmesWc',


  plugins: [
    vue(),
    nodePolyfills(),




  ],
  build: {
    commonjsOptions: { transformMixedEsModules: true }
  },
  resolve: {

    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },

  }
})
