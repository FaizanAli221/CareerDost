import { Hono } from 'hono'
import { getDb } from '../db.js'
import { ArticleModel } from '../models/Article.js'
import { filterPublicArticles } from '../../src/data/consolidatedRedirects.js'

const app = new Hono()

// Public API: Get published articles with optional filtering/search
app.get('/', async (c) => {
  c.header('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600')
  const db = getDb(c)
  const query = c.req.query('q')
  const featured = c.req.query('featured')
  const latest = c.req.query('latest')
  const closingSoon = c.req.query('closingSoon')
  const limit = c.req.query('limit') ? parseInt(c.req.query('limit'), 10) : undefined
  const category = c.req.query('category')

  if (query) {
    const articles = filterPublicArticles(await ArticleModel.search(db, query, 'published'))
    return c.json({ success: true, data: limit && limit > 0 ? articles.slice(0, limit) : articles })
  }

  if (closingSoon === 'true') {
    const targetLimit = limit || 6
    const articles = filterPublicArticles(await ArticleModel.getClosingSoon(db, targetLimit + 15, 'published'))
    return c.json({ success: true, data: articles.slice(0, targetLimit) })
  }

  if (featured === 'true') {
    const targetLimit = limit || 4
    const articles = filterPublicArticles(await ArticleModel.getFeatured(db, targetLimit + 15, 'published'))
    return c.json({ success: true, data: articles.slice(0, targetLimit) })
  }

  if (latest === 'true') {
    const targetLimit = limit || 12
    const articles = filterPublicArticles(await ArticleModel.getLatest(db, targetLimit + 15, 'published'))
    return c.json({ success: true, data: articles.slice(0, targetLimit) })
  }

  if (category) {
    const fetchLimit = limit && limit > 0 ? limit + 15 : undefined
    const articles = filterPublicArticles(await ArticleModel.getByCategory(db, category, 'published', fetchLimit))
    return c.json({ success: true, data: limit && limit > 0 ? articles.slice(0, limit) : articles })
  }

  let articles = filterPublicArticles(await ArticleModel.getAll(db, 'published'))
  if (limit && Number(limit) > 0) {
    articles = articles.slice(0, Number(limit))
  }
  return c.json({ success: true, data: articles })
})

// Public API: Search published articles
app.get('/search', async (c) => {
  const db = getDb(c)
  const q = c.req.query('q') || ''
  if (!q.trim()) {
    return c.json({ success: true, data: [] })
  }
  const articles = filterPublicArticles(await ArticleModel.search(db, q, 'published'))
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
