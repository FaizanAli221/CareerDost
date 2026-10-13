import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import app from './server/index.js'

function setupApi(server) {
  server.middlewares.use('/api', async (req, res, next) => {
    try {
      const protocol = req.headers['x-forwarded-proto'] || 'http'
      const host = req.headers.host || 'localhost:5173'
      const urlPath = req.originalUrl || `/api${req.url}`
      const fullUrl = `${protocol}://${host}${urlPath}`

      const headers = new Headers()
      for (const [key, value] of Object.entries(req.headers)) {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v))
          } else {
            headers.set(key, value)
          }
        }
      }

      let body = null
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const buffers = []
        for await (const chunk of req) {
          buffers.push(chunk)
        }
        body = Buffer.concat(buffers)
      }

      const webReq = new Request(fullUrl, {
        method: req.method,
        headers,
        body: body && body.length > 0 ? body : null,
      })

      const webRes = await app.fetch(webReq)

      res.statusCode = webRes.status
      webRes.headers.forEach((val, key) => {
        res.setHeader(key, val)
      })

      const responseBuffer = await webRes.arrayBuffer()
      res.end(Buffer.from(responseBuffer))
    } catch (err) {
      console.error('API server middleware error:', err)
      next(err)
    }
  })
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'hono-api-server',
      configureServer(server) {
        setupApi(server)
      },
      configurePreviewServer(server) {
        setupApi(server)
      },
    },
  ],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run/router')) {
            return 'vendor-router'
          }
          if (id.includes('data/listings')) {
            return 'data-listings'
          }
        },
      },
    },
  },
})
