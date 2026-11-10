import { Hono } from 'hono'
import { getDb } from '../db.js'
import { AdminModel } from '../models/Admin.js'
import { ArticleModel } from '../models/Article.js'
import { CategoryModel } from '../models/Category.js'
import { DailyUpdateModel } from '../models/DailyUpdate.js'
import { rateLimiter } from '../middleware/rateLimit.js'
import { verifyTurnstileToken } from '../utils/turnstile.js'
import { sanitizeArticleInput, sanitizeCategoryInput, sanitizeUpdateInput, sanitizeString } from '../utils/validation.js'

const app = new Hono()

// Helper to extract token from Authorization header OR HttpOnly cookie
function extractToken(c) {
  const authHeader = c.req.header('Authorization') || ''
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim()
  }

  const cookieHeader = c.req.header('Cookie') || ''
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=')
    if (key && value) acc[key] = value
    return acc
  }, {})

  return cookies['careerdost_admin_token'] || ''
}

// Server-side Auth middleware
async function authMiddleware(c, next) {
  const token = extractToken(c)
  if (!token) {
    return c.json({ success: false, error: 'Unauthorized: Session missing' }, 401)
  }

  const envSecret = c.env?.ADMIN_JWT_SECRET
  const payload = await AdminModel.verifyToken(token, envSecret)
  if (!payload) {
    return c.json({ success: false, error: 'Unauthorized: Invalid or expired session' }, 401)
  }

  c.set('adminPayload', payload)
  await next()
}

// Admin login with Rate Limiting and Server-side Turnstile verification
app.post(
  '/login',
  rateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000, keyPrefix: 'admin_login' }),
  async (c) => {
    try {
      const body = await c.req.json()
      const username = sanitizeString(body.username, 100)
      const password = typeof body.password === 'string' ? body.password : ''
      const turnstileToken = body['cf-turnstile-response'] || body.turnstileToken

      if (!username || !password) {
        return c.json({ success: false, error: 'Username and password required.' }, 400)
      }

      // Verify Cloudflare Turnstile token server-side if configured
      const isTurnstileValid = await verifyTurnstileToken(c, turnstileToken)
      if (!isTurnstileValid) {
        return c.json({ success: false, error: 'Security check failed. Please verify Turnstile.' }, 400)
      }

      const db = getDb(c)
      const admin = (await AdminModel.getByUsername(db, username)) || (await AdminModel.getByEmail(db, username))
      if (!admin) {
        return c.json({ success: false, error: 'Invalid credentials.' }, 401)
      }

      const validPassword = await AdminModel.verifyPassword(password, admin.password_hash)
      if (!validPassword) {
        return c.json({ success: false, error: 'Invalid credentials.' }, 401)
      }

      const envSecret = c.env?.ADMIN_JWT_SECRET
      const token = await AdminModel.generateToken(admin, envSecret)

      // Set HttpOnly, Secure, SameSite=Strict cookie for enhanced defense-in-depth
      const isSecure = c.req.url.startsWith('https') || c.env?.ENVIRONMENT === 'production'
      const cookieOptions = `Path=/; HttpOnly; ${isSecure ? 'Secure; ' : ''}SameSite=Strict; Max-Age=43200`
      c.header('Set-Cookie', `careerdost_admin_token=${token}; ${cookieOptions}`)

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
    } catch (err) {
      return c.json({ success: false, error: 'Login request failed.' }, 400)
    }
  }
)

// Admin logout: Clear HttpOnly cookie
app.post('/logout', (c) => {
  c.header('Set-Cookie', 'careerdost_admin_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict')
  return c.json({ success: true, message: 'Logged out successfully.' })
})

// Admin Profile
app.get('/me', authMiddleware, async (c) => {
  const adminPayload = c.get('adminPayload')
  return c.json({ success: true, data: adminPayload })
})

// Dashboard Stats
app.get('/stats', authMiddleware, async (c) => {
  const db = getDb(c)
  const articles = await ArticleModel.getAll(db)
  const categories = await CategoryModel.getAll(db)
  const admins = await AdminModel.getAll(db)
  const updates = await DailyUpdateModel.getAll(db)

  return c.json({
    success: true,
    data: {
      totalArticles: articles.length,
      publishedArticles: articles.filter((a) => a.status === 'published').length,
      draftArticles: articles.filter((a) => a.status === 'draft').length,
      totalCategories: categories.length,
      totalAdmins: admins.length,
      featuredArticles: articles.filter((a) => a.featured).length,
      totalUpdates: updates.length,
      publishedUpdates: updates.filter((u) => u.status === 'published').length,
      draftUpdates: updates.filter((u) => u.status === 'draft').length,
    },
  })
})

// Get articles for Admin
app.get('/articles', authMiddleware, async (c) => {
  const db = getDb(c)
  const statusParam = c.req.query('status')
  const articles = await ArticleModel.getAll(db, statusParam || null)
  return c.json({ success: true, data: articles })
})

// Scoped, non-destructive Cloudflare Edge Cache invalidation for mutated article/update routes
async function purgeEdgeCacheForContent(c, slugs = [], categorySlugs = []) {
  try {
    const edgeCache = typeof caches !== 'undefined' ? caches.default : null
    if (!edgeCache || typeof edgeCache.delete !== 'function') return

    const origins = new Set(['https://careerdost.blog'])
    try {
      const reqOrigin = new URL(c.req.url).origin
      if (reqOrigin) origins.add(reqOrigin)
    } catch {}

    const paths = new Set([
      '/',
      '/daily-updates',
      '/sitemap.xml',
      '/api/articles',
      '/api/articles?latest=true&limit=10',
      '/api/articles?latest=true&limit=12',
      '/api/articles?featured=true&limit=4',
      '/api/articles?closingSoon=true&limit=6',
      '/api/updates',
      '/api/updates/latest',
      '/api/updates/latest?limit=4',
      '/api/updates/latest?limit=6',
    ])

    for (const s of slugs.filter(Boolean)) {
      paths.add(`/jobs/${s}`)
      paths.add(`/daily-updates/${s}`)
      paths.add(`/api/articles/${s}`)
      paths.add(`/api/updates/${s}`)
    }

    for (const cat of categorySlugs.filter(Boolean)) {
      paths.add(`/category/${cat}`)
      paths.add(`/api/categories/${cat}`)
      paths.add(`/api/articles?category=${encodeURIComponent(cat)}`)
      paths.add(`/api/articles?category=${encodeURIComponent(cat)}&limit=5`)
    }

    const tasks = []
    for (const origin of origins) {
      for (const p of paths) {
        tasks.push(edgeCache.delete(new Request(`${origin}${p}`, { method: 'GET' })).catch(() => false))
      }
    }

    if (c.executionCtx && typeof c.executionCtx.waitUntil === 'function') {
      c.executionCtx.waitUntil(Promise.allSettled(tasks))
    } else {
      await Promise.allSettled(tasks)
    }
  } catch {
    // Ignore cache API unavailability in non-edge runtimes
  }
}

function deriveSummaryFromContent(contentInput, fallback = '') {
  const blocks = Array.isArray(contentInput) ? contentInput : [String(contentInput || '')]
  for (const raw of blocks) {
    const line = String(raw || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/^#+\s+/gm, '')
      .replace(/^>\s*\[![A-Z]+\]\s*/gim, '')
      .replace(/^>\s*/gm, '')
      .replace(/^Title:\s*/i, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[*_`]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (line.length >= 30) {
      return line.length > 260 ? line.slice(0, 257).trim() + '...' : line
    }
  }
  return fallback
}

// Article Admin CRUD with Input Validation
app.post('/articles', authMiddleware, async (c) => {
  const db = getDb(c)
  const body = await c.req.json()

  if (!body.excerpt || !String(body.excerpt).trim()) {
    body.excerpt = deriveSummaryFromContent(body.content, body.title || '')
  }

  const validation = sanitizeArticleInput(body)
  if (!validation.valid) {
    return c.json({ success: false, error: validation.errors.join(' ') }, 400)
  }

  const articleData = validation.data
  const existing = await ArticleModel.getBySlug(db, articleData.slug)
  if (existing) {
    return c.json({ success: false, error: 'An article with this slug already exists.' }, 400)
  }

  await ArticleModel.create(db, articleData)
  const created = await ArticleModel.getBySlug(db, articleData.slug)
  await purgeEdgeCacheForContent(c, [articleData.slug], [articleData.category])
  return c.json({ success: true, data: created })
})

app.put('/articles/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const body = await c.req.json()

  const existing = await ArticleModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Article not found.' }, 404)
  }

  const normalizedInput = { ...body }
  const incomingTitle = typeof body.title === 'string' ? body.title.trim() : ''
  const titleChanged = Boolean(incomingTitle && incomingTitle !== existing.title)

  // If title changed and SEO/OG title were not independently customized in this edit, regenerate from new title
  if (titleChanged) {
    if (!body.seoTitle || body.seoTitle === existing.seoTitle || body.seoTitle === existing.title) {
      normalizedInput.seoTitle = ''
    }
    if (
      !body.ogTitle ||
      body.ogTitle === existing.ogTitle ||
      body.ogTitle === existing.seoTitle ||
      body.ogTitle === existing.title
    ) {
      normalizedInput.ogTitle = ''
    }
  }

  if (!normalizedInput.excerpt || !String(normalizedInput.excerpt).trim()) {
    normalizedInput.excerpt = deriveSummaryFromContent(body.content, existing.excerpt || incomingTitle)
  }

  const incomingExcerpt = String(normalizedInput.excerpt || '').trim()
  const excerptChanged = Boolean(incomingExcerpt && incomingExcerpt !== (existing.excerpt || '').trim())
  if (excerptChanged) {
    if (
      !body.metaDescription ||
      body.metaDescription === existing.metaDescription ||
      body.metaDescription === existing.excerpt
    ) {
      normalizedInput.metaDescription = ''
    }
    if (
      !body.ogDescription ||
      body.ogDescription === existing.ogDescription ||
      body.ogDescription === existing.metaDescription ||
      body.ogDescription === existing.excerpt
    ) {
      normalizedInput.ogDescription = ''
    }
  }

  const targetSlug = (typeof body.slug === 'string' && body.slug.trim()) ? body.slug.trim().toLowerCase() : slug
  if (!body.canonicalUrl || body.canonicalUrl === existing.canonicalUrl || targetSlug !== slug) {
    normalizedInput.canonicalUrl = `https://careerdost.blog/jobs/${targetSlug}`
  }

  const validation = sanitizeArticleInput(normalizedInput, existing.status)
  if (!validation.valid) {
    return c.json({ success: false, error: validation.errors.join(' ') }, 400)
  }

  const updatedData = validation.data
  if (updatedData.slug !== slug) {
    const slugCollision = await ArticleModel.getBySlug(db, updatedData.slug)
    if (slugCollision) {
      return c.json({ success: false, error: `Another article already uses slug "${updatedData.slug}".` }, 400)
    }
  }

  await ArticleModel.update(db, slug, updatedData, existing.status)

  // Keep paired daily_updates record (if one shares this slug) synchronized so feeds & redirects never diverge
  const linkedUpdate = await DailyUpdateModel.getBySlug(db, slug)
  if (linkedUpdate) {
    await DailyUpdateModel.update(
      db,
      slug,
      {
        slug: updatedData.slug,
        title: updatedData.title,
        category: linkedUpdate.category || 'Latest Jobs',
        shortDescription: updatedData.excerpt || linkedUpdate.shortDescription,
        content: updatedData.content,
        featuredImage: updatedData.featuredImage || linkedUpdate.featuredImage,
        imageAlt: updatedData.imageAlt || linkedUpdate.imageAlt,
        officialLink: updatedData.officialLink,
        applyLink: updatedData.applyLink,
        deadline: updatedData.lastDate || linkedUpdate.deadline,
        noDeadline: updatedData.noDeadline,
        publishDate: linkedUpdate.publishDate || updatedData.publishDate,
        organization: updatedData.organization,
        location: updatedData.location,
        qualification: updatedData.qualification,
        experience: updatedData.experience,
        positions: updatedData.positions,
        jobType: updatedData.jobType,
        salary: updatedData.salary,
        isVerified: updatedData.isVerified,
        featured: updatedData.featured,
        seoTitle: updatedData.seoTitle,
        metaDescription: updatedData.metaDescription,
        focusKeyword: updatedData.focusKeyword,
        canonicalUrl: `https://careerdost.blog/jobs/${updatedData.slug}`,
        ogTitle: updatedData.ogTitle,
        ogDescription: updatedData.ogDescription,
        status: updatedData.status,
      },
      linkedUpdate.status
    )
  }

  const updated = await ArticleModel.getBySlug(db, updatedData.slug || slug)
  await purgeEdgeCacheForContent(
    c,
    [slug, updatedData.slug],
    [existing.category, updatedData.category]
  )
  return c.json({ success: true, data: updated })
})

// Quick update status
app.patch('/articles/:slug/status', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const body = await c.req.json()
  if (body.status !== 'draft' && body.status !== 'published') {
    return c.json({ success: false, error: 'Explicit status ("draft" or "published") is required.' }, 400)
  }
  const status = body.status

  const existing = await ArticleModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Article not found.' }, 404)
  }

  await ArticleModel.updateStatus(db, slug, status)

  const linkedUpdate = await DailyUpdateModel.getBySlug(db, slug)
  if (linkedUpdate) {
    await DailyUpdateModel.updateStatus(db, slug, status)
  }

  const updated = await ArticleModel.getBySlug(db, slug)
  await purgeEdgeCacheForContent(c, [slug], [existing.category])
  return c.json({ success: true, data: updated })
})

app.delete('/articles/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')

  const existing = await ArticleModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Article not found.' }, 404)
  }

  await ArticleModel.delete(db, slug)
  await purgeEdgeCacheForContent(c, [slug], [existing.category])
  return c.json({ success: true, message: 'Article deleted successfully.' })
})

// Category Admin CRUD with Input Validation
app.get('/categories', authMiddleware, async (c) => {
  const db = getDb(c)
  const categories = await CategoryModel.getAll(db)
  return c.json({ success: true, data: categories })
})

app.post('/categories', authMiddleware, async (c) => {
  const db = getDb(c)
  const body = await c.req.json()

  const validation = sanitizeCategoryInput(body)
  if (!validation.valid) {
    return c.json({ success: false, error: validation.errors.join(' ') }, 400)
  }

  const categoryData = validation.data
  const existing = await CategoryModel.getBySlug(db, categoryData.slug)
  if (existing) {
    return c.json({ success: false, error: 'Category with this slug already exists.' }, 400)
  }

  await CategoryModel.create(db, categoryData)
  const created = await CategoryModel.getBySlug(db, categoryData.slug)
  return c.json({ success: true, data: created })
})

app.put('/categories/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const body = await c.req.json()

  const existing = await CategoryModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Category not found.' }, 404)
  }

  const validation = sanitizeCategoryInput(body)
  if (!validation.valid) {
    return c.json({ success: false, error: validation.errors.join(' ') }, 400)
  }

  await CategoryModel.update(db, slug, validation.data)
  const updated = await CategoryModel.getBySlug(db, validation.data.slug || slug)
  return c.json({ success: true, data: updated })
})

app.delete('/categories/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')

  const existing = await CategoryModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Category not found.' }, 404)
  }

  await CategoryModel.delete(db, slug)
  return c.json({ success: true, message: 'Category deleted successfully.' })
})

// Daily Updates Admin CRUD with Server-Side Validation
app.get('/updates', authMiddleware, async (c) => {
  const db = getDb(c)
  const statusParam = c.req.query('status')
  const updates = await DailyUpdateModel.getAll(db, statusParam || null)
  return c.json({ success: true, data: updates })
})

app.post('/updates', authMiddleware, async (c) => {
  const db = getDb(c)
  const body = await c.req.json()

  if (!body.shortDescription && !body.short_description) {
    body.shortDescription = deriveSummaryFromContent(body.content, body.title || '')
  }

  const validation = sanitizeUpdateInput(body)
  if (!validation.valid) {
    return c.json({ success: false, error: validation.errors.join(' ') }, 400)
  }

  const updateData = validation.data
  const existing = await DailyUpdateModel.getBySlug(db, updateData.slug)
  if (existing) {
    return c.json({ success: false, error: 'A daily update with this slug already exists.' }, 400)
  }

  await DailyUpdateModel.create(db, updateData)
  const created = await DailyUpdateModel.getBySlug(db, updateData.slug)
  await purgeEdgeCacheForContent(c, [updateData.slug], [])
  return c.json({ success: true, data: created })
})

app.put('/updates/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const body = await c.req.json()

  const existing = await DailyUpdateModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Daily update not found.' }, 404)
  }

  const normalizedInput = { ...body }
  const incomingTitle = typeof body.title === 'string' ? body.title.trim() : ''
  const titleChanged = Boolean(incomingTitle && incomingTitle !== existing.title)

  if (titleChanged) {
    if (!body.seoTitle || body.seoTitle === existing.seoTitle || body.seoTitle === existing.title) {
      normalizedInput.seoTitle = ''
    }
    if (
      !body.ogTitle ||
      body.ogTitle === existing.ogTitle ||
      body.ogTitle === existing.seoTitle ||
      body.ogTitle === existing.title
    ) {
      normalizedInput.ogTitle = ''
    }
  }

  if (!normalizedInput.shortDescription && !normalizedInput.short_description) {
    normalizedInput.shortDescription = deriveSummaryFromContent(body.content, existing.shortDescription || incomingTitle)
  }

  const incomingShort = String(normalizedInput.shortDescription || normalizedInput.short_description || '').trim()
  const descChanged = Boolean(incomingShort && incomingShort !== (existing.shortDescription || '').trim())
  if (descChanged) {
    if (
      !body.metaDescription ||
      body.metaDescription === existing.metaDescription ||
      body.metaDescription === existing.shortDescription
    ) {
      normalizedInput.metaDescription = ''
    }
    if (
      !body.ogDescription ||
      body.ogDescription === existing.ogDescription ||
      body.ogDescription === existing.metaDescription ||
      body.ogDescription === existing.shortDescription
    ) {
      normalizedInput.ogDescription = ''
    }
  }

  const validation = sanitizeUpdateInput(normalizedInput, existing.status)
  if (!validation.valid) {
    return c.json({ success: false, error: validation.errors.join(' ') }, 400)
  }

  const updatedData = validation.data
  if (updatedData.slug !== slug) {
    const slugCollision = await DailyUpdateModel.getBySlug(db, updatedData.slug)
    if (slugCollision) {
      return c.json({ success: false, error: `Another daily update already uses slug "${updatedData.slug}".` }, 400)
    }
  }

  await DailyUpdateModel.update(db, slug, updatedData, existing.status)

  // If a paired article exists with the same slug (which /daily-updates/:slug 301-redirects to), keep it synchronized
  const linkedArticle = await ArticleModel.getBySlug(db, slug)
  if (linkedArticle) {
    await ArticleModel.update(
      db,
      slug,
      {
        slug: updatedData.slug,
        title: updatedData.title,
        category: linkedArticle.category || 'government-jobs',
        organization: updatedData.organization || linkedArticle.organization,
        jobType: updatedData.jobType || linkedArticle.jobType || 'Full Time',
        location: updatedData.location || linkedArticle.location,
        qualification: updatedData.qualification || linkedArticle.qualification,
        salary: updatedData.salary || linkedArticle.salary,
        experience: updatedData.experience || linkedArticle.experience,
        positions: updatedData.positions || linkedArticle.positions,
        lastDate: updatedData.deadline || linkedArticle.lastDate,
        noDeadline: updatedData.noDeadline,
        publishDate: (updatedData.publishDate || '').split('T')[0] || linkedArticle.publishDate,
        officialLink: updatedData.officialLink || linkedArticle.officialLink,
        applyLink: updatedData.applyLink || linkedArticle.applyLink,
        isVerified: updatedData.isVerified,
        featured: updatedData.featured,
        logoInitial: linkedArticle.logoInitial || '',
        featuredImage: updatedData.featuredImage || linkedArticle.featuredImage,
        imageAlt: updatedData.imageAlt || linkedArticle.imageAlt,
        excerpt: updatedData.shortDescription || linkedArticle.excerpt,
        content: updatedData.content,
        seoTitle: updatedData.seoTitle,
        metaDescription: updatedData.metaDescription,
        focusKeyword: updatedData.focusKeyword || linkedArticle.focusKeyword,
        canonicalUrl: `https://careerdost.blog/jobs/${updatedData.slug}`,
        ogTitle: updatedData.ogTitle,
        ogDescription: updatedData.ogDescription,
        status: updatedData.status,
      },
      linkedArticle.status
    )
  }

  const updated = await DailyUpdateModel.getBySlug(db, updatedData.slug || slug)
  await purgeEdgeCacheForContent(
    c,
    [slug, updatedData.slug],
    linkedArticle ? [linkedArticle.category] : []
  )
  return c.json({ success: true, data: updated })
})

app.patch('/updates/:slug/status', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const body = await c.req.json()
  if (body.status !== 'draft' && body.status !== 'published') {
    return c.json({ success: false, error: 'Explicit status ("draft" or "published") is required.' }, 400)
  }
  const status = body.status

  const existing = await DailyUpdateModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Daily update not found.' }, 404)
  }

  await DailyUpdateModel.updateStatus(db, slug, status)

  const linkedArticle = await ArticleModel.getBySlug(db, slug)
  if (linkedArticle) {
    await ArticleModel.updateStatus(db, slug, status)
  }

  const updated = await DailyUpdateModel.getBySlug(db, slug)
  await purgeEdgeCacheForContent(c, [slug], linkedArticle ? [linkedArticle.category] : [])
  return c.json({ success: true, data: updated })
})

app.delete('/updates/:slug', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')

  const existing = await DailyUpdateModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Daily update not found.' }, 404)
  }

  await DailyUpdateModel.delete(db, slug)
  await purgeEdgeCacheForContent(c, [slug], [])
  return c.json({ success: true, message: 'Daily update deleted successfully.' })
})

// Server-side Image Upload Endpoint with MIME type & Size Verification
app.post('/upload-image', authMiddleware, async (c) => {
  try {
    const contentType = c.req.header('content-type') || ''
    let filename = 'featured-image.jpg'
    let mimeType = 'image/jpeg'
    let base64Data = ''
    let size = 0

    let variants = null

    if (contentType.includes('multipart/form-data')) {
      const formData = await c.req.parseBody()
      const file = formData.file || formData.image
      if (!file) {
        return c.json({ success: false, error: 'No image file uploaded.' }, 400)
      }

      if (typeof file === 'string') {
        base64Data = file
      } else {
        filename = file.name || 'uploaded-image.jpg'
        mimeType = file.type || 'image/jpeg'
        const arrayBuffer = await file.arrayBuffer()
        size = arrayBuffer.byteLength

        const bytes = new Uint8Array(arrayBuffer)
        let binary = ''
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        base64Data = btoa(binary)
      }

      const cardFile = formData.variant_card
      const displayFile = formData.variant_display
      if (cardFile || displayFile) {
        variants = {}
        if (cardFile && typeof cardFile !== 'string') {
          const cardBuf = await cardFile.arrayBuffer()
          const cardBytes = new Uint8Array(cardBuf)
          let cardBinary = ''
          for (let i = 0; i < cardBytes.length; i++) {
            cardBinary += String.fromCharCode(cardBytes[i])
          }
          variants.card = {
            data: btoa(cardBinary),
            size: cardBuf.byteLength,
            mimeType: cardFile.type || 'image/webp',
          }
        }
        if (displayFile && typeof displayFile !== 'string') {
          const dispBuf = await displayFile.arrayBuffer()
          const dispBytes = new Uint8Array(dispBuf)
          let dispBinary = ''
          for (let i = 0; i < dispBytes.length; i++) {
            dispBinary += String.fromCharCode(dispBytes[i])
          }
          variants.display = {
            data: btoa(dispBinary),
            size: dispBuf.byteLength,
            mimeType: displayFile.type || 'image/webp',
          }
        }
      }
    } else {
      const body = await c.req.json()
      filename = body.filename || 'uploaded-image.jpg'
      mimeType = body.mimeType || body.type || 'image/jpeg'
      base64Data = body.data || body.base64 || ''
      if (base64Data.startsWith('data:')) {
        const parts = base64Data.split(',')
        mimeType = parts[0].match(/:(.*?);/)?.[1] || mimeType
        base64Data = parts[1]
      }
      size = Math.round((base64Data.length * 3) / 4)
      if (body.variants && typeof body.variants === 'object') {
        variants = body.variants
      }
    }

    // Server-side MIME validation
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedMimeTypes.includes(mimeType.toLowerCase())) {
      return c.json(
        { success: false, error: 'Invalid file type. Only JPG, JPEG, PNG, and WebP images are allowed.' },
        400
      )
    }

    // Server-side Size validation (Max 3MB)
    const MAX_SIZE = 3 * 1024 * 1024
    if (size > MAX_SIZE) {
      return c.json({ success: false, error: 'File size exceeds limit (Max 3MB).' }, 400)
    }

    const imageId = 'img_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now()
    const db = getDb(c)

    await DailyUpdateModel.saveImage(db, {
      id: imageId,
      filename,
      mimeType,
      data: base64Data,
      size,
    })

    // Persist optimized WebP variants if provided (preserves original in imageId)
    if (variants) {
      try {
        if (variants.card) {
          let cardData = typeof variants.card === 'string' ? variants.card : variants.card.data
          let cardMime = (typeof variants.card === 'object' && variants.card.mimeType) || 'image/webp'
          if (cardData && cardData.startsWith('data:')) {
            const parts = cardData.split(',')
            cardMime = parts[0].match(/:(.*?);/)?.[1] || cardMime
            cardData = parts[1]
          }
          if (cardData) {
            await DailyUpdateModel.saveImage(db, {
              id: `${imageId}_card`,
              filename: filename.replace(/\.[^.]+$/, '') + '-card.webp',
              mimeType: cardMime,
              data: cardData,
              size: Math.round((cardData.length * 3) / 4),
            })
          }
        }

        if (variants.display) {
          let displayData = typeof variants.display === 'string' ? variants.display : variants.display.data
          let displayMime = (typeof variants.display === 'object' && variants.display.mimeType) || 'image/webp'
          if (displayData && displayData.startsWith('data:')) {
            const parts = displayData.split(',')
            displayMime = parts[0].match(/:(.*?);/)?.[1] || displayMime
            displayData = parts[1]
          }
          if (displayData) {
            await DailyUpdateModel.saveImage(db, {
              id: `${imageId}_display`,
              filename: filename.replace(/\.[^.]+$/, '') + '-display.webp',
              mimeType: displayMime,
              data: displayData,
              size: Math.round((displayData.length * 3) / 4),
            })
          }
        }
      } catch (variantErr) {
        console.warn('Could not save image variants:', variantErr)
      }
    }

    const imageUrl = `/api/uploads/${imageId}`
    return c.json({
      success: true,
      data: {
        id: imageId,
        url: imageUrl,
        filename,
        mimeType,
        size,
      },
    })
  } catch (err) {
    console.error('Image upload failed:', err)
    return c.json({ success: false, error: 'Image upload failed server-side.' }, 500)
  }
})

export default app
