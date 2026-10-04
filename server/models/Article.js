function formatArticle(row) {
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
    category: row.category_slug,
    organization: row.organization,
    jobType: row.job_type,
    location: row.location,
    qualification: row.qualification,
    salary: row.salary,
    experience: row.experience || '',
    positions: row.positions || '',
    lastDate: row.last_date,
    noDeadline: Boolean(row.no_deadline),
    publishDate: row.publish_date,
    officialLink: row.official_link,
    applyLink: row.apply_link || '',
    isVerified: Boolean(row.is_verified),
    featured: Boolean(row.featured),
    logoInitial: row.logo_initial,
    featuredImage: row.featured_image || '',
    imageAlt: row.image_alt || '',
    excerpt: row.excerpt,
    content: Array.isArray(content) ? content : [content],
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    focusKeyword: row.focus_keyword || '',
    canonicalUrl: row.canonical_url || '',
    ogTitle: row.og_title || '',
    ogDescription: row.og_description || '',
    status: row.status || 'published',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export class ArticleModel {
  static async getAll(db, statusOnly = null) {
    let sql = 'SELECT * FROM articles'
    const params = []
    if (statusOnly) {
      sql += ' WHERE status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY publish_date DESC, id DESC'

    const stmt = db.prepare(sql)
    const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all()
    return (results || []).map(formatArticle)
  }

  static async getBySlug(db, slug, statusOnly = null) {
    let sql = 'SELECT * FROM articles WHERE slug = ?'
    const params = [slug]
    if (statusOnly) {
      sql += ' AND status = ?'
      params.push(statusOnly)
    }
    const row = await db.prepare(sql).bind(...params).first()
    return formatArticle(row)
  }

  static async getByCategory(db, categorySlug, statusOnly = null) {
    let sql = 'SELECT * FROM articles WHERE category_slug = ?'
    const params = [categorySlug]
    if (statusOnly) {
      sql += ' AND status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY publish_date DESC, id DESC'

    const { results } = await db.prepare(sql).bind(...params).all()
    return (results || []).map(formatArticle)
  }

  static async getFeatured(db, limit = 4, statusOnly = null) {
    let sql = 'SELECT * FROM articles WHERE featured = 1'
    const params = []
    if (statusOnly) {
      sql += ' AND status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY publish_date DESC, id DESC LIMIT ?'
    params.push(limit)

    const { results } = await db.prepare(sql).bind(...params).all()
    return (results || []).map(formatArticle)
  }

  static async getLatest(db, limit = 12, statusOnly = null) {
    let sql = 'SELECT * FROM articles'
    const params = []
    if (statusOnly) {
      sql += ' WHERE status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY publish_date DESC, id DESC LIMIT ?'
    params.push(limit)

    const { results } = await db.prepare(sql).bind(...params).all()
    return (results || []).map(formatArticle)
  }

  static async getClosingSoon(db, limit = 6, statusOnly = null) {
    const todayStr = new Date().toISOString().split('T')[0]
    let sql = "SELECT * FROM articles WHERE (no_deadline IS NULL OR no_deadline = 0) AND last_date IS NOT NULL AND last_date != '' AND last_date >= ?"
    const params = [todayStr]

    if (statusOnly) {
      sql += ' AND status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY last_date ASC, id DESC LIMIT ?'
    params.push(limit)

    const { results } = await db.prepare(sql).bind(...params).all()
    return (results || []).map(formatArticle)
  }

  static async search(db, query, statusOnly = null) {
    const q = `%${query.trim()}%`
    let sql = `SELECT * FROM articles 
               WHERE (title LIKE ? OR organization LIKE ? OR location LIKE ? OR category_slug LIKE ? OR excerpt LIKE ?)`
    const params = [q, q, q, q, q]

    if (statusOnly) {
      sql += ' AND status = ?'
      params.push(statusOnly)
    }
    sql += ' ORDER BY publish_date DESC, id DESC'

    const { results } = await db.prepare(sql).bind(...params).all()
    return (results || []).map(formatArticle)
  }

  static async create(db, data) {
    const contentJson = Array.isArray(data.content)
      ? JSON.stringify(data.content)
      : JSON.stringify([data.content || ''])

    const status = data.status === 'draft' ? 'draft' : 'published'

    const res = await db
      .prepare(
        `INSERT INTO articles (
          slug, title, category_slug, organization, job_type, location,
          qualification, salary, experience, positions, last_date, no_deadline, publish_date, official_link, apply_link,
          is_verified, featured, logo_initial, featured_image, image_alt, excerpt, content, seo_title, meta_description,
          focus_keyword, canonical_url, og_title, og_description, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.slug,
        data.title,
        data.category || data.category_slug,
        data.organization || '',
        data.jobType || data.job_type || 'Full Time',
        data.location || '',
        data.qualification || '',
        data.salary || '',
        data.experience || '',
        data.positions || '',
        data.lastDate || data.last_date || '',
        data.noDeadline ? 1 : 0,
        data.publishDate || data.publish_date || new Date().toISOString().split('T')[0],
        data.officialLink || data.official_link || '',
        data.applyLink || data.apply_link || '',
        data.isVerified ? 1 : 0,
        data.featured ? 1 : 0,
        data.logoInitial || data.logo_initial || '',
        data.featuredImage || data.featured_image || '',
        data.imageAlt || data.image_alt || '',
        data.excerpt || '',
        contentJson,
        data.seoTitle || data.seo_title || data.title,
        data.metaDescription || data.meta_description || data.excerpt || '',
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
        `UPDATE articles SET
          slug = ?, title = ?, category_slug = ?, organization = ?, job_type = ?,
          location = ?, qualification = ?, salary = ?, experience = ?, positions = ?, last_date = ?, no_deadline = ?, publish_date = ?,
          official_link = ?, apply_link = ?, is_verified = ?, featured = ?, logo_initial = ?, featured_image = ?, image_alt = ?, excerpt = ?, content = ?,
          seo_title = ?, meta_description = ?, focus_keyword = ?, canonical_url = ?, og_title = ?, og_description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE slug = ?`
      )
      .bind(
        newSlug,
        data.title,
        data.category || data.category_slug,
        data.organization || '',
        data.jobType || data.job_type || 'Full Time',
        data.location || '',
        data.qualification || '',
        data.salary || '',
        data.experience || '',
        data.positions || '',
        data.lastDate || data.last_date || '',
        data.noDeadline ? 1 : 0,
        data.publishDate || data.publish_date || '',
        data.officialLink || data.official_link || '',
        data.applyLink || data.apply_link || '',
        data.isVerified ? 1 : 0,
        data.featured ? 1 : 0,
        data.logoInitial || data.logo_initial || '',
        data.featuredImage || data.featured_image || '',
        data.imageAlt || data.image_alt || '',
        data.excerpt || '',
        contentJson,
        data.seoTitle || data.seo_title || data.title,
        data.metaDescription || data.meta_description || data.excerpt || '',
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
      .prepare('UPDATE articles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?')
      .bind(validStatus, slug)
      .run()
    return res.success
  }

  static async delete(db, slug) {
    const res = await db.prepare('DELETE FROM articles WHERE slug = ?').bind(slug).run()
    return res.success
  }
}
