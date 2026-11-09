import { Hono } from 'hono'
import { getDb } from '../db.js'
import { ArticleModel } from '../models/Article.js'
import { CategoryModel } from '../models/Category.js'
import { DailyUpdateModel } from '../models/DailyUpdate.js'
import { CONSOLIDATED_SLUGS_SET } from '../../src/data/consolidatedRedirects.js'

const app = new Hono()

const SITE_URL = 'https://careerdost.blog'

const EXCLUDED_SITEMAP_SLUGS = new Set([
  ...CONSOLIDATED_SLUGS_SET,
  'hyderabad-division-section-144-notification-2026',
  'fpsc-consolidated-advertisement-09-2026-announced',
  'hec-fully-funded-phd-scholarships-2026-open',
])

app.get('/robots.txt', (c) => {
  const content = `User-agent: Mediapartners-Google
Allow: /

User-agent: *
Allow: /
Disallow: /admin
Allow: /api/uploads/
Disallow: /api/admin
Disallow: /api/auth/

Sitemap: ${SITE_URL}/sitemap.xml`
  return c.text(content, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

app.get('/sitemap.xml', async (c) => {
  const db = getDb(c)
  const todayStr = new Date().toISOString().split('T')[0]

  const allArticles = await ArticleModel.getAll(db, null, false)
  const articles = allArticles.filter(
    (a) => a.status === 'published' && !EXCLUDED_SITEMAP_SLUGS.has(a.slug)
  )
  const publishedArticleSlugs = new Set(articles.map((a) => a.slug))
  const updates = (await DailyUpdateModel.getAll(db, 'published', false)).filter(
    (u) => !publishedArticleSlugs.has(u.slug) && !EXCLUDED_SITEMAP_SLUGS.has(u.slug)
  )
  const categories = await CategoryModel.getAll(db)

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily', lastmod: todayStr },
    { loc: '/jobs/sindh-government-jobs-2026', priority: '0.9', changefreq: 'daily', lastmod: todayStr },
    { loc: '/daily-updates', priority: '0.9', changefreq: 'daily', lastmod: todayStr },
    { loc: '/tools/job-readiness-checker', priority: '0.8', changefreq: 'monthly', lastmod: todayStr },
    { loc: '/about', priority: '0.5', changefreq: 'monthly', lastmod: todayStr },
    { loc: '/contact', priority: '0.5', changefreq: 'monthly', lastmod: todayStr },
    { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly', lastmod: todayStr },
    { loc: '/disclaimer', priority: '0.3', changefreq: 'yearly', lastmod: todayStr },
    { loc: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly', lastmod: todayStr },
  ]

  const categoryUrls = categories.map((cat) => ({
    loc: `/category/${cat.slug}`,
    priority: '0.8',
    changefreq: 'daily',
    lastmod: todayStr,
  }))

  const articleUrls = articles.map((art) => ({
    loc: `/jobs/${art.slug}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: (art.updatedAt || art.publishDate || todayStr).split('T')[0].split(' ')[0],
  }))

  const updateUrls = updates.map((upd) => ({
    loc: `/daily-updates/${upd.slug}`,
    priority: '0.8',
    changefreq: 'daily',
    lastmod: (upd.updatedAt || upd.publishDate || todayStr).split('T')[0].split(' ')[0],
  }))

  const seenLocs = new Set()
  const allUrls = []
  for (const page of [...staticPages, ...categoryUrls, ...articleUrls, ...updateUrls]) {
    if (!seenLocs.has(page.loc)) {
      seenLocs.add(page.loc)
      allUrls.push(page)
    }
  }

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
