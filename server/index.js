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
app.use('*', cors())

// Auto-seed database middleware (ensures DB tables & initial data exist)
let seedAttempted = false
app.use('*', async (c, next) => {
  if (!seedAttempted) {
    seedAttempted = true
    try {
      const db = getDb(c)
      await seedDatabase(db)
    } catch (err) {
      console.error('Database seeding error:', err)
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
app.get('/api/health', (c) => c.json({ status: 'ok', time: new Date().toISOString() }))

export default app
