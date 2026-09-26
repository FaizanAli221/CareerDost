import { categories } from '../src/data/categories.js'
import { listings } from '../src/data/listings.js'
import { CategoryModel } from './models/Category.js'
import { ArticleModel } from './models/Article.js'
import { AdminModel } from './models/Admin.js'

export async function seedDatabase(db) {
  try {
    // 1. Ensure table structure exists first
    await db.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        label TEXT NOT NULL,
        short TEXT NOT NULL,
        tone TEXT NOT NULL DEFAULT 'slate',
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category_slug TEXT NOT NULL,
        organization TEXT NOT NULL,
        job_type TEXT DEFAULT 'Full Time',
        location TEXT,
        qualification TEXT,
        salary TEXT,
        last_date TEXT,
        publish_date TEXT,
        official_link TEXT,
        featured INTEGER DEFAULT 0,
        logo_initial TEXT,
        excerpt TEXT,
        content TEXT NOT NULL,
        seo_title TEXT,
        meta_description TEXT,
        status TEXT NOT NULL DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_slug) REFERENCES categories(slug) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_slug);
      CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
      CREATE INDEX IF NOT EXISTS idx_articles_publish_date ON articles(publish_date);
      CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
      CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    `)
  } catch (err) {
    console.warn('Table creation check note:', err.message)
  }

  // 2. Seed Categories if empty
  try {
    const existingCategories = await CategoryModel.getAll(db)
    if (existingCategories.length === 0) {
      for (const cat of categories) {
        await CategoryModel.create(db, {
          slug: cat.slug,
          label: cat.label,
          short: cat.short,
          tone: cat.tone,
          description: cat.description,
        })
      }
    }
  } catch (err) {
    console.warn('Category seeding note:', err.message)
  }

  // 3. Seed Articles if empty
  try {
    const existingArticles = await ArticleModel.getAll(db)
    if (existingArticles.length === 0) {
      for (const item of listings) {
        await ArticleModel.create(db, item)
      }
    }
  } catch (err) {
    console.warn('Article seeding note:', err.message)
  }

  // 4. Seed Admin user if empty
  try {
    const existingAdmins = await AdminModel.getAll(db)
    if (existingAdmins.length === 0) {
      await AdminModel.create(db, {
        username: 'admin',
        email: 'admin@careerdost.pk',
        password: 'admin123',
        role: 'superadmin',
      })
    }
  } catch (err) {
    console.warn('Admin seeding note:', err.message)
  }
}
