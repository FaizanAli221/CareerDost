function formatUpdate(row) {
  if (!row) return null
  let content = row.content
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content)
    } catch {
      content = [content]
    }
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    shortDescription: row.short_description || '',
    content: Array.isArray(content) ? content : [content],
    featuredImage: row.featured_image || '',
    imageAlt: row.image_alt || '',
    officialLink: row.official_link || '',
    applyLink: row.apply_link || '',
    deadline: row.deadline || '',
    noDeadline: Boolean(row.no_deadline),
    publishDate: row.publish_date || new Date().toISOString(),
    organization: row.organization || '',
    location: row.location || '',
    qualification: row.qualification || '',
    experience: row.experience || '',
    positions: row.positions || '',
    jobType: row.job_type || '',
    salary: row.salary || '',
    isVerified: Boolean(row.is_verified),
    featured: Boolean(row.featured),
    seoTitle: row.seo_title || row.title,
    metaDescription: row.meta_description || row.short_description || '',
    focusKeyword: row.focus_keyword || '',
    canonicalUrl: row.canonical_url || '',
    ogTitle: row.og_title || '',
    ogDescription: row.og_description || '',
    status: row.status || 'published',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class DailyUpdateModel {
  static async getAll(db, statusOnly = null) {
    let sql = 'SELECT * FROM daily_updates'
    const params = []
    if (statusOnly) {
      sql += ' WHERE status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY publish_date DESC, id DESC'

    const stmt = db.prepare(sql)
    const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all()
    return (results || []).map(formatUpdate)
  }

  static async getBySlug(db, slug, statusOnly = null) {
    let sql = 'SELECT * FROM daily_updates WHERE slug = ?'
    const params = [slug]
    if (statusOnly) {
      sql += ' AND status = ?'
      params.push(statusOnly)
    }
    const row = await db.prepare(sql).bind(...params).first()
    return formatUpdate(row)
  }

  static async getByCategory(db, category, statusOnly = null) {
    let sql = 'SELECT * FROM daily_updates WHERE category = ?'
    const params = [category]
    if (statusOnly) {
      sql += ' AND status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY publish_date DESC, id DESC'

    const { results } = await db.prepare(sql).bind(...params).all()
    return (results || []).map(formatUpdate)
  }

  static async getLatest(db, limit = 6, statusOnly = null) {
    let sql = 'SELECT * FROM daily_updates'
    const params = []
    if (statusOnly) {
      sql += ' WHERE status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY publish_date DESC, id DESC LIMIT ?'
    params.push(limit)

    const { results } = await db.prepare(sql).bind(...params).all()
    return (results || []).map(formatUpdate)
  }

  static async search(db, query, statusOnly = null) {
    const q = `%${query.trim()}%`
    let sql = `SELECT * FROM daily_updates 
               WHERE (title LIKE ? OR category LIKE ? OR short_description LIKE ? OR content LIKE ?)`
    const params = [q, q, q, q]

    if (statusOnly) {
      sql += ' AND status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY publish_date DESC, id DESC'

    const { results } = await db.prepare(sql).bind(...params).all()
    return (results || []).map(formatUpdate)
  }

  static async create(db, data) {
    const contentJson = Array.isArray(data.content)
      ? JSON.stringify(data.content)
      : JSON.stringify([data.content || ''])

    const status = data.status === 'draft' ? 'draft' : 'published'
    const pubDate = data.publishDate || data.publish_date || new Date().toISOString()

    const res = await db
      .prepare(
        `INSERT INTO daily_updates (
          slug, title, category, short_description, content,
          featured_image, image_alt, official_link, apply_link,
          deadline, no_deadline, publish_date, organization, location, qualification,
          experience, positions, job_type, salary, is_verified, featured,
          seo_title, meta_description, focus_keyword, canonical_url, og_title, og_description, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.slug,
        data.title,
        data.category,
        data.shortDescription || data.short_description || '',
        contentJson,
        data.featuredImage || data.featured_image || '',
        data.imageAlt || data.image_alt || '',
        data.officialLink || data.official_link || '',
        data.applyLink || data.apply_link || '',
        data.deadline || '',
        data.noDeadline ? 1 : 0,
        pubDate,
        data.organization || '',
        data.location || '',
        data.qualification || '',
        data.experience || '',
        data.positions || '',
        data.jobType || data.job_type || '',
        data.salary || '',
        data.isVerified ? 1 : 0,
        data.featured ? 1 : 0,
        data.seoTitle || data.seo_title || data.title,
        data.metaDescription || data.meta_description || data.shortDescription || '',
        data.focusKeyword || data.focus_keyword || '',
        data.canonicalUrl || data.canonical_url || '',
        data.ogTitle || data.og_title || data.title,
        data.ogDescription || data.og_description || data.metaDescription || '',
        status
      )
      .run()

    return res.success
  }

  static async update(db, slug, data) {
    const contentJson = Array.isArray(data.content)
      ? JSON.stringify(data.content)
      : JSON.stringify([data.content || ''])

    const newSlug = data.slug || slug
    const status = data.status === 'draft' ? 'draft' : 'published'

    const res = await db
      .prepare(
        `UPDATE daily_updates SET
          slug = ?, title = ?, category = ?, short_description = ?, content = ?,
          featured_image = ?, image_alt = ?, official_link = ?, apply_link = ?,
          deadline = ?, no_deadline = ?, publish_date = ?, organization = ?, location = ?, qualification = ?,
          experience = ?, positions = ?, job_type = ?, salary = ?, is_verified = ?, featured = ?,
          seo_title = ?, meta_description = ?, focus_keyword = ?, canonical_url = ?, og_title = ?, og_description = ?,
          status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE slug = ?`
      )
      .bind(
        newSlug,
        data.title,
        data.category,
        data.shortDescription || data.short_description || '',
        contentJson,
        data.featuredImage || data.featured_image || '',
        data.imageAlt || data.image_alt || '',
        data.officialLink || data.official_link || '',
        data.applyLink || data.apply_link || '',
        data.deadline || '',
        data.noDeadline ? 1 : 0,
        data.publishDate || data.publish_date || '',
        data.organization || '',
        data.location || '',
        data.qualification || '',
        data.experience || '',
        data.positions || '',
        data.jobType || data.job_type || '',
        data.salary || '',
        data.isVerified ? 1 : 0,
        data.featured ? 1 : 0,
        data.seoTitle || data.seo_title || data.title,
        data.metaDescription || data.meta_description || data.shortDescription || '',
        data.focusKeyword || data.focus_keyword || '',
        data.canonicalUrl || data.canonical_url || '',
        data.ogTitle || data.og_title || data.title,
        data.ogDescription || data.og_description || data.metaDescription || '',
        status,
        slug
      )
      .run()

    return res.success
  }

  static async updateStatus(db, slug, status) {
    const validStatus = status === 'draft' ? 'draft' : 'published'
    const res = await db
      .prepare('UPDATE daily_updates SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?')
      .bind(validStatus, slug)
      .run()
    return res.success
  }

  static async delete(db, slug) {
    const res = await db.prepare('DELETE FROM daily_updates WHERE slug = ?').bind(slug).run()
    return res.success
  }

  // Image storage methods
  static async saveImage(db, { id, filename, mimeType, data, size }) {
    const res = await db
      .prepare(
        `INSERT INTO update_images (id, filename, mime_type, data, size) VALUES (?, ?, ?, ?, ?)`
      )
      .bind(id, filename, mimeType, data, size)
      .run()
    return res.success
  }

  static async getImage(db, id) {
    const row = await db
      .prepare(`SELECT * FROM update_images WHERE id = ?`)
      .bind(id)
      .first()
    return row
  }
}
