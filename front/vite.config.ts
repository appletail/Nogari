import * as path from 'node:path'

import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'
import { checker } from 'vite-plugin-checker'
import svgr from 'vite-plugin-svgr'

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  return defineConfig({
    plugins: [
      react(),
      svgr(),
      !process.env.VITEST
        ? checker({
            typescript: true,
          })
        : undefined,
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      VITE_SERVER_URL: process.env.VITE_SERVER_URL,
    },
  })
}
// https://vitejs.dev/config/
