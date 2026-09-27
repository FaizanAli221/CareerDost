import { Hono } from 'hono'
import { getDb } from '../db.js'
import { ArticleModel } from '../models/Article.js'
import { CategoryModel } from '../models/Category.js'
import { DailyUpdateModel } from '../models/DailyUpdate.js'

const app = new Hono()

const SITE_URL = 'https://careerdost.pages.dev'

app.get('/robots.txt', (c) => {
  const content = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml`
  return c.text(content, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

app.get('/sitemap.xml', async (c) => {
  const db = getDb(c)

  const articles = await ArticleModel.getAll(db, 'published')
  const updates = await DailyUpdateModel.getAll(db, 'published')
  const categories = await CategoryModel.getAll(db)

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily' },
    { loc: '/daily-updates', priority: '0.9', changefreq: 'daily' },
    { loc: '/about', priority: '0.5', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.5', changefreq: 'monthly' },
    { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly' },
  ]

  const categoryUrls = categories.map((cat) => ({
    loc: `/category/${cat.slug}`,
    priority: '0.8',
    changefreq: 'daily',
  }))

  const updateUrls = updates.map((upd) => ({
    loc: `/daily-updates/${upd.slug}`,
    priority: '0.9',
    changefreq: 'daily',
    lastmod: upd.publishDate ? upd.publishDate.split('T')[0] : new Date().toISOString().split('T')[0],
  }))

  const articleUrls = articles.map((art) => ({
    loc: `/jobs/${art.slug}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: art.publishDate || (art.updatedAt ? art.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0]),
  }))

  const allUrls = [...staticPages, ...categoryUrls, ...updateUrls, ...articleUrls]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

  for (const page of allUrls) {
    xml += `  <url>\n`
    xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`
    if (page.lastmod) {
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`
    }
    if (page.changefreq) {
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`
    }
    xml += `    <priority>${page.priority}</priority>\n`
    xml += `  </url>\n`
  }

  xml += `</urlset>`

  return c.text(xml, 200, { 'Content-Type': 'application/xml; charset=utf-8' })
})

export default app
