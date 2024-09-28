import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vuePlugin from "./plugin-vue/src";
import Inspect from 'vite-plugin-inspect'
import type {Plugin} from 'vite'
import vitePluginOvs from "./src/ovs/vitePluginOvs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.ovs$/]
    }),
    vitePluginOvs(),
    Inspect(),
    // pluginAspect1()
  ],
  build: {
    minify: false,
  },
  esbuild: {
    target: 'es2022'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
