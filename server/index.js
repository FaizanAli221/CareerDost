import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getDb } from './db.js'
import { seedDatabase } from './seed.js'
import categoriesRouter from './routes/categories.js'
import articlesRouter from './routes/articles.js'
import adminRouter from './routes/admin.js'
import seoRouter from './routes/seo.js'

const app = new Hono()

// CORS Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))

// Global Error Handler
app.onError((err, c) => {
  console.error('API Error:', err)
  return c.json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.',
  }, 500)
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

// Health check endpoint
app.get('/api/health', (c) => c.json({
  success: true,
  status: 'ok',
  time: new Date().toISOString(),
  environment: 'production',
}))

export default app
