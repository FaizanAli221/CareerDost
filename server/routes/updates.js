import { Hono } from 'hono'
import { getDb } from '../db.js'
import { DailyUpdateModel } from '../models/DailyUpdate.js'
import { CONSOLIDATED_SLUGS_SET } from '../../src/data/consolidatedRedirects.js'
import { KNOWN_ARTICLE_SLUGS } from '../../src/data/articleSlugs.js'

const updatesRouter = new Hono()

async function filterAndAttachArticleStatus(db, updates) {
  const filtered = (updates || []).filter(
    (u) => u && u.slug && !CONSOLIDATED_SLUGS_SET.has(u.slug)
  )
  if (filtered.length === 0) return []

  let publishedSlugs = KNOWN_ARTICLE_SLUGS
  try {
    const { results } = await db
      .prepare("SELECT slug FROM articles WHERE status = 'published'")
      .all()
    if (results && results.length > 0) {
      publishedSlugs = new Set(
        results.map((r) => r.slug).filter((s) => !CONSOLIDATED_SLUGS_SET.has(s))
      )
    }
  } catch {
    // Fallback to KNOWN_ARTICLE_SLUGS if DB query fails
  }

  return filtered.map((u) => {
    const hasArt = publishedSlugs.has(u.slug)
    return {
      ...u,
      hasArticle: hasArt,
      canonicalUrl: hasArt
        ? `https://careerdost.blog/jobs/${u.slug}`
        : `https://careerdost.blog/daily-updates/${u.slug}`,
    }
  })
}

// GET /api/updates - List published daily updates
updatesRouter.get('/', async (c) => {
  c.header('Cache-Control', 'public, max-age=0, s-maxage=15, must-revalidate')
  const db = getDb(c)
  const category = c.req.query('category')
  const limitQuery = c.req.query('limit')
  const q = c.req.query('q')

  let updates = []
  if (q) {
    updates = await DailyUpdateModel.search(db, q, 'published', false)
  } else if (category) {
    updates = await DailyUpdateModel.getByCategory(db, category, 'published', false)
  } else {
    updates = await DailyUpdateModel.getAll(db, 'published', false)
  }

  updates = await filterAndAttachArticleStatus(db, updates)

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
  c.header('Cache-Control', 'public, max-age=0, s-maxage=15, must-revalidate')
  const db = getDb(c)
  const limitQuery = c.req.query('limit') || '6'
  const limit = Math.min(parseInt(limitQuery, 10) || 6, 20)

  const rawUpdates = await DailyUpdateModel.getLatest(db, limit + 10, 'published', false)
  const updates = (await filterAndAttachArticleStatus(db, rawUpdates)).slice(0, limit)
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
    c.header('Cache-Control', 'no-store, no-cache, must-revalidate')
    return c.json({ success: false, error: 'Daily Update not found' }, 404)
  }

  const contentSig = JSON.stringify(updateItem.content || '').length
  const etag = `W/"upd-${updateItem.id}-${encodeURIComponent(String(updateItem.updatedAt || ''))}-${(updateItem.title || '').length}-${contentSig}"`
  c.header('ETag', etag)
  c.header('Cache-Control', 'public, max-age=0, s-maxage=5, must-revalidate')

  if (c.req.header('If-None-Match') === etag) {
    return c.body(null, 304)
  }

  return c.json({
    success: true,
    data: updateItem,
  })
})

export default updatesRouter
