import { defineConfig, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { ServerResponse } from 'node:http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function chatbotProxy(): ProxyOptions {
  return {
    target: process.env.CHATBOT_API_HOST || 'http://127.0.0.1:8000',
    changeOrigin: true,
    rewrite: (requestPath) => requestPath.replace(/^\/api\/chatbot/, ''),
    configure: (proxy) => {
      proxy.on('error', (_err, _req, res) => {
        const response = res as ServerResponse | undefined
        if (response && !response.headersSent) {
          response.writeHead(503, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify({ status: 'unavailable' }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  server: {
    proxy: {
      '/api/chatbot': chatbotProxy(),
    },
  },
  preview: {
    proxy: {
      '/api/chatbot': chatbotProxy(),
    },
  },
})
