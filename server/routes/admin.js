import { Hono } from 'hono'
import { getDb } from '../db.js'
import { AdminModel } from '../models/Admin.js'
import { ArticleModel } from '../models/Article.js'
import { CategoryModel } from '../models/Category.js'

const app = new Hono()

// Auth middleware
async function authMiddleware(c, next) {
  const authHeader = c.req.header('Authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/, '')
  if (!token) {
    return c.json({ success: false, error: 'Unauthorized: Missing token' }, 401)
  }

  const payload = AdminModel.verifyToken(token)
  if (!payload) {
    return c.json({ success: false, error: 'Unauthorized: Invalid or expired token' }, 401)
  }

  c.set('adminPayload', payload)
  await next()
}

// Admin login
app.post('/login', async (c) => {
  const db = getDb(c)
  const body = await c.req.json()
  const { username, password } = body

  if (!username || !password) {
    return c.json({ success: false, error: 'Username and password required' }, 400)
  }

  const admin = await AdminModel.getByUsername(db, username)
  if (!admin) {
    return c.json({ success: false, error: 'Invalid username or password' }, 401)
  }

  const valid = await AdminModel.verifyPassword(password, admin.password_hash)
  if (!valid) {
    return c.json({ success: false, error: 'Invalid username or password' }, 401)
  }

  const token = AdminModel.generateToken(admin)
  return c.json({
    success: true,
    data: {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    },
  })
})

// Current admin profile
app.get('/me', authMiddleware, async (c) => {
  const adminPayload = c.get('adminPayload')
  return c.json({ success: true, data: adminPayload })
})

// Stats
app.get('/stats', authMiddleware, async (c) => {
  const db = getDb(c)
  const articles = await ArticleModel.getAll(db) // all articles
  const categories = await CategoryModel.getAll(db)
  const admins = await AdminModel.getAll(db)

  return c.json({
    success: true,
    data: {
      totalArticles: articles.length,
      publishedArticles: articles.filter((a) => a.status === 'published').length,
      draftArticles: articles.filter((a) => a.status === 'draft').length,
      totalCategories: categories.length,
      totalAdmins: admins.length,
      featuredArticles: articles.filter((a) => a.featured).length,
    },
  })
})

// Get all articles (both draft and published for Admin)
app.get('/articles', authMiddleware, async (c) => {
  const db = getDb(c)
  const statusParam = c.req.query('status')
  const articles = await ArticleModel.getAll(db, statusParam || null)
  return c.json({ success: true, data: articles })
})

// Article Admin CRUD
app.post('/articles', authMiddleware, async (c) => {
  const db = getDb(c)
  const body = await c.req.json()
  if (!body.slug || !body.title || !body.category) {
    return c.json({ success: false, error: 'Slug, title, and category are required' }, 400)
  }

  const existing = await ArticleModel.getBySlug(db, body.slug)
  if (existing) {
    return c.json({ success: false, error: 'Article with this slug already exists' }, 400)
  }

  await ArticleModel.create(db, body)
  const created = await ArticleModel.getBySlug(db, body.slug)
  return c.json({ success: true, data: created })
})

app.put('/articles/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const body = await c.req.json()

  const existing = await ArticleModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Article not found' }, 404)
  }

  await ArticleModel.update(db, slug, body)
  const updated = await ArticleModel.getBySlug(db, body.slug || slug)
  return c.json({ success: true, data: updated })
})

// Quick update status (Publish / Unpublish)
app.patch('/articles/:slug/status', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const { status } = await c.req.json()

  const existing = await ArticleModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Article not found' }, 404)
  }

  await ArticleModel.updateStatus(db, slug, status)
  const updated = await ArticleModel.getBySlug(db, slug)
  return c.json({ success: true, data: updated })
})

app.delete('/articles/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')

  const existing = await ArticleModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Article not found' }, 404)
  }

  await ArticleModel.delete(db, slug)
  return c.json({ success: true, message: 'Article deleted successfully' })
})

// Category Admin CRUD
app.get('/categories', authMiddleware, async (c) => {
  const db = getDb(c)
  const categories = await CategoryModel.getAll(db)
  return c.json({ success: true, data: categories })
})

app.post('/categories', authMiddleware, async (c) => {
  const db = getDb(c)
  const body = await c.req.json()
  if (!body.slug || !body.label || !body.short) {
    return c.json({ success: false, error: 'Slug, label, and short name are required' }, 400)
  }

  const existing = await CategoryModel.getBySlug(db, body.slug)
  if (existing) {
    return c.json({ success: false, error: 'Category with this slug already exists' }, 400)
  }

  await CategoryModel.create(db, body)
  const created = await CategoryModel.getBySlug(db, body.slug)
  return c.json({ success: true, data: created })
})

app.put('/categories/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const body = await c.req.json()

  const existing = await CategoryModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Category not found' }, 404)
  }

  await CategoryModel.update(db, slug, body)
  const updated = await CategoryModel.getBySlug(db, body.slug || slug)
  return c.json({ success: true, data: updated })
})

app.delete('/categories/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')

  const existing = await CategoryModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Category not found' }, 404)
  }

  await CategoryModel.delete(db, slug)
  return c.json({ success: true, message: 'Category deleted successfully' })
})

export default app
