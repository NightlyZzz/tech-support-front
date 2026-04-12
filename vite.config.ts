import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ mode }) => ({
    plugins: mode === 'development'
            ? [vue(), vueDevTools()]
            : [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        host: '0.0.0.0',
        port: 80,
        strictPort: true,
        origin: 'https://127.0.0.1',
        hmr: {
            protocol: 'wss',
            host: '127.0.0.1',
            clientPort: 443
        }
    },
    preview: {
        host: '0.0.0.0',
        port: 80,
        strictPort: true
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/tests/setup.ts'],
        include: ['src/tests/**/*.test.ts']
    }
}))