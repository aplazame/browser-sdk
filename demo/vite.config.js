
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vite'

const __dirname = dirname(resolve(fileURLToPath(import.meta.url)))

console.log('__dirname', __dirname)

// https://vitejs.dev/config/
export default defineConfig({
    root: __dirname,
    envPrefix: 'APZ_',
    envDir: resolve(__dirname, '..'),
    server: {
        port: 8086,
    },
})
