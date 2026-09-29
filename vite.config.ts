import { defineConfig, loadEnv, type Plugin, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { ServerResponse } from 'node:http'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Load built CSS without blocking first paint (critical shell is inlined in index.html). */
function nonBlockingCssPlugin(): Plugin {
  return {
    name: 'non-blocking-css',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(
        /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/g,
        '<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel=\'stylesheet\'" />\n    <noscript><link rel="stylesheet" href="$1" /></noscript>',
      )
    },
  }
}

function googleReviewsDevPlugin(
  apiKey: string | undefined,
  placeCid: string | undefined,
  placeId: string | undefined,
): Plugin {
  return {
    name: 'google-reviews-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url !== '/api/google-reviews') {
          next()
          return
        }

        if (!apiKey) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'missing_api_key' }))
          return
        }

        try {
          const { fetchPlaceReviews } = await import('./api/google-reviews.js')
          const result = await fetchPlaceReviews(apiKey, {
            cid: placeCid,
            placeId,
          })
          const body = {
            placeName: result.name,
            rating: result.rating ?? null,
            userRatingsTotal: result.user_ratings_total ?? 0,
            mapsUrl: result.url ?? null,
            reviews: (result.reviews ?? []).map((review: {
              author_name: string
              rating: number
              text?: string
              relative_time_description?: string
              profile_photo_url?: string
            }) => ({
              authorName: review.author_name,
              rating: review.rating,
              text: review.text ?? '',
              relativeTime: review.relative_time_description ?? '',
              profilePhotoUrl: review.profile_photo_url ?? null,
            })),
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        } catch (error) {
          const message = error instanceof Error ? error.message : 'fetch_failed'
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'fetch_failed', message }))
        }
      })
    },
  }
}

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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const googlePlacesKey = env.GOOGLE_PLACES_API_KEY || env.GOOGLE_MAPS_API_KEY
  const googlePlaceCid = env.GOOGLE_PLACE_CID
  const googlePlaceId = env.GOOGLE_PLACE_ID

  return {
  plugins: [
    react(),
    tailwindcss(),
    nonBlockingCssPlugin(),
    googleReviewsDevPlugin(googlePlacesKey, googlePlaceCid, googlePlaceId),
  ],
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
}
})
