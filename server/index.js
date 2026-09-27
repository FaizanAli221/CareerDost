import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getDb } from './db.js'
import { seedDatabase } from './seed.js'
import categoriesRouter from './routes/categories.js'
import articlesRouter from './routes/articles.js'
import adminRouter from './routes/admin.js'
import contactRouter from './routes/contact.js'
import seoRouter from './routes/seo.js'
import updatesRouter from './routes/updates.js'
import uploadsRouter from './routes/uploads.js'

const app = new Hono()

// Apply Security Headers to all Function responses
app.use('*', async (c, next) => {
  await next()
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('X-Frame-Options', 'DENY')
  c.header('X-XSS-Protection', '1; mode=block')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  c.header(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
  )
})

// CORS Middleware with origin validation
app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return '*'
      if (
        origin.endsWith('.careerdost.pages.dev') ||
        origin === 'https://careerdost.pages.dev' ||
        origin === 'https://careerdost.pk' ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return origin
      }
      return 'https://careerdost.pages.dev'
    },
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  })
)

// Safe Production Error Handler (masks internal paths & database details)
app.onError((err, c) => {
  console.error('API Error Exception:', err.stack || err.message)
  return c.json(
    {
      success: false,
      error: 'An unexpected error occurred. Please try again later.',
    },
    500
  )
})

// Global 404 Handler for API
app.notFound((c) => {
  return c.json({ success: false, error: 'Endpoint Not Found' }, 404)
})

// Auto-seed / Table Check Middleware
let seedAttempted = false
app.use('*', async (c, next) => {
  if (!seedAttempted) {
    seedAttempted = true
    try {
      const db = getDb(c)
      await seedDatabase(db)
    } catch (err) {
      console.warn('Database initialization note:', err.message)
    }
  }
  await next()
})

// Mount SEO routes at root and /api
app.route('/', seoRouter)
app.route('/api', seoRouter)

// Mount API routes
app.route('/api/categories', categoriesRouter)
app.route('/api/articles', articlesRouter)
app.route('/api/admin', adminRouter)
app.route('/api/contact', contactRouter)
app.route('/api/updates', updatesRouter)
app.route('/api/uploads', uploadsRouter)

// Health check endpoint
app.get('/api/health', (c) =>
  c.json({
    success: true,
    status: 'ok',
    time: new Date().toISOString(),
    environment: 'production',
  })
)

export default app
