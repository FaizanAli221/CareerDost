import { Hono } from 'hono'
import { getDb } from '../db.js'
import { CategoryModel } from '../models/Category.js'
import { ArticleModel } from '../models/Article.js'

const app = new Hono()

// Get all categories
app.get('/', async (c) => {
  const db = getDb(c)
  const categories = await CategoryModel.getAll(db)
  return c.json({ success: true, data: categories })
})

// Get category by slug + its published articles
app.get('/:slug', async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const category = await CategoryModel.getBySlug(db, slug)

  if (!category) {
    return c.json({ success: false, error: 'Category not found' }, 404)
  }

  const articles = await ArticleModel.getByCategory(db, slug, 'published')
  return c.json({
    success: true,
    data: {
      category,
      articles,
    },
  })
})

export default app
