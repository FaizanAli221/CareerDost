import { categories } from '../src/data/categories.js'
import { listings } from '../src/data/listings.js'
import { CategoryModel } from './models/Category.js'
import { ArticleModel } from './models/Article.js'
import { AdminModel } from './models/Admin.js'

export async function seedDatabase(db) {
  console.log('Checking database seeding status...')

  // Seed Categories if empty
  const existingCategories = await CategoryModel.getAll(db)
  if (existingCategories.length === 0) {
    console.log(`Seeding ${categories.length} categories...`)
    for (const cat of categories) {
      await CategoryModel.create(db, {
        slug: cat.slug,
        label: cat.label,
        short: cat.short,
        tone: cat.tone,
        description: cat.description,
      })
    }
    console.log('Categories seeded successfully.')
  } else {
    console.log(`Database already has ${existingCategories.length} categories.`)
  }

  // Seed Articles if empty
  const existingArticles = await ArticleModel.getAll(db)
  if (existingArticles.length === 0) {
    console.log(`Seeding ${listings.length} articles...`)
    for (const item of listings) {
      await ArticleModel.create(db, item)
    }
    console.log('Articles seeded successfully.')
  } else {
    console.log(`Database already has ${existingArticles.length} articles.`)
  }

  // Seed Admin user if empty
  const existingAdmins = await AdminModel.getAll(db)
  if (existingAdmins.length === 0) {
    console.log('Seeding default admin user (admin / admin123)...')
    await AdminModel.create(db, {
      username: 'admin',
      email: 'admin@careerdost.pk',
      password: 'admin123',
      role: 'superadmin',
    })
    console.log('Default admin user seeded successfully.')
  } else {
    console.log(`Database already has ${existingAdmins.length} admin accounts.`)
  }
}
