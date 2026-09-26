import { Hono } from 'hono'
import { getDb } from '../db.js'
import { ArticleModel } from '../models/Article.js'

const app = new Hono()

// Public API: Get published articles with optional filtering/search
app.get('/', async (c) => {
  const db = getDb(c)
  const query = c.req.query('q')
  const featured = c.req.query('featured')
  const latest = c.req.query('latest')
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit'), 10) : undefined
  const category = c.req.query('category')

  if (query) {
    const articles = await ArticleModel.search(db, query, 'published')
    return c.json({ success: true, data: articles })
  }

  if (featured === 'true') {
    const articles = await ArticleModel.getFeatured(db, limit || 4, 'published')
    return c.json({ success: true, data: articles })
  }

  if (latest === 'true') {
    const articles = await ArticleModel.getLatest(db, limit || 12, 'published')
    return c.json({ success: true, data: articles })
  }

  if (category) {
    const articles = await ArticleModel.getByCategory(db, category, 'published')
    return c.json({ success: true, data: articles })
  }

  const articles = await ArticleModel.getAll(db, 'published')
  return c.json({ success: true, data: articles })
})

// Public API: Search published articles
app.get('/search', async (c) => {
  const db = getDb(c)
  const q = c.req.query('q') || ''
  if (!q.trim()) {
    return c.json({ success: true, data: [] })
  }
  const articles = await ArticleModel.search(db, q, 'published')
  return c.json({ success: true, data: articles })
})

// Public API: Get published article by slug
app.get('/:slug', async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const article = await ArticleModel.getBySlug(db, slug, 'published')

  if (!article) {
    return c.json({ success: false, error: 'Article not found' }, 404)
  }

  return c.json({ success: true, data: article })
})

export default app
