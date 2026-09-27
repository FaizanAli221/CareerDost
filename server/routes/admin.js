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

// Article Admin CRUD with Input Validation
app.post('/articles', authMiddleware, async (c) => {
  const db = getDb(c)
  const body = await c.req.json()

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

  const validation = sanitizeArticleInput(body)
  if (!validation.valid) {
    return c.json({ success: false, error: validation.errors.join(' ') }, 400)
  }

  await ArticleModel.update(db, slug, validation.data)
  const updated = await ArticleModel.getBySlug(db, validation.data.slug || slug)
  return c.json({ success: true, data: updated })
})

// Quick update status
app.patch('/articles/:slug/status', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const body = await c.req.json()
  const status = body.status === 'draft' ? 'draft' : 'published'

  const existing = await ArticleModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Article not found.' }, 404)
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
    return c.json({ success: false, error: 'Article not found.' }, 404)
  }

  await ArticleModel.delete(db, slug)
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

  const validation = sanitizeUpdateInput(body)
  if (!validation.valid) {
    return c.json({ success: false, error: validation.errors.join(' ') }, 400)
  }

  await DailyUpdateModel.update(db, slug, validation.data)
  const updated = await DailyUpdateModel.getBySlug(db, validation.data.slug || slug)
  return c.json({ success: true, data: updated })
})

app.patch('/updates/:slug/status', authMiddleware, async (c) => {
  const db = getDb(c)
  const slug = c.req.param('slug')
  const body = await c.req.json()
  const status = body.status === 'draft' ? 'draft' : 'published'

  const existing = await DailyUpdateModel.getBySlug(db, slug)
  if (!existing) {
    return c.json({ success: false, error: 'Daily update not found.' }, 404)
  }

  await DailyUpdateModel.updateStatus(db, slug, status)
  const updated = await DailyUpdateModel.getBySlug(db, slug)
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
