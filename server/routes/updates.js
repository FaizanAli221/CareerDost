import { Hono } from 'hono'
import { getDb } from '../db.js'
import { DailyUpdateModel } from '../models/DailyUpdate.js'

const updatesRouter = new Hono()

// GET /api/updates - List published daily updates
updatesRouter.get('/', async (c) => {
  const db = getDb(c)
  const category = c.req.query('category')
  const limitQuery = c.req.query('limit')
  const q = c.req.query('q')

  let updates = []
  if (q) {
    updates = await DailyUpdateModel.search(db, q, 'published')
  } else if (category) {
    updates = await DailyUpdateModel.getByCategory(db, category, 'published')
  } else {
    updates = await DailyUpdateModel.getAll(db, 'published')
  }

  if (limitQuery) {
    const limit = parseInt(limitQuery, 10)
    if (!isNaN(limit) && limit > 0) {
      updates = updates.slice(0, limit)
    }
  }

  return c.json({
    success: true,
    data: updates,
  })
})

// GET /api/updates/latest - Get top latest published updates
updatesRouter.get('/latest', async (c) => {
  const db = getDb(c)
  const limitQuery = c.req.query('limit') || '6'
  const limit = Math.min(parseInt(limitQuery, 10) || 6, 20)

  const updates = await DailyUpdateModel.getLatest(db, limit, 'published')
  return c.json({
    success: true,
    data: updates,
  })
})

// GET /api/updates/:slug - Get single update by slug
updatesRouter.get('/:slug', async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')

  const updateItem = await DailyUpdateModel.getBySlug(db, slug, 'published')
  if (!updateItem) {
    return c.json({ success: false, error: 'Daily Update not found' }, 404)
  }

  return c.json({
    success: true,
    data: updateItem,
  })
})

export default updatesRouter
