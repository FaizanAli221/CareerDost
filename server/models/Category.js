export class CategoryModel {
  static async getAll(db) {
    const { results } = await db.prepare('SELECT * FROM categories ORDER BY id ASC').all()
    return results || []
  }

  static async getBySlug(db, slug) {
    const category = await db.prepare('SELECT * FROM categories WHERE slug = ?').bind(slug).first()
    return category || null
  }

  static async create(db, { slug, label, short, tone = 'slate', description = '' }) {
    const res = await db
      .prepare(
        'INSERT INTO categories (slug, label, short, tone, description) VALUES (?, ?, ?, ?, ?)'
      )
      .bind(slug, label, short, tone, description)
      .run()
    return res.success
  }

  static async update(db, slug, { label, short, tone, description, newSlug }) {
    const targetSlug = newSlug || slug
    const res = await db
      .prepare(
        'UPDATE categories SET slug = ?, label = ?, short = ?, tone = ?, description = ? WHERE slug = ?'
      )
      .bind(targetSlug, label, short, tone, description, slug)
      .run()
    return res.success
  }

  static async delete(db, slug) {
    const res = await db.prepare('DELETE FROM categories WHERE slug = ?').bind(slug).run()
    return res.success
  }
}
