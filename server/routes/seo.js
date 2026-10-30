import { Hono } from 'hono'
import { getDb } from '../db.js'
import { ArticleModel } from '../models/Article.js'
import { CategoryModel } from '../models/Category.js'
import { DailyUpdateModel } from '../models/DailyUpdate.js'

const app = new Hono()

const SITE_URL = 'https://careerdost.blog'

const EXCLUDED_SITEMAP_SLUGS = new Set([
  'httpswwwnjpgovpk',
  'bank-alfalah-cso-jobs-2026',
  'systems-limited-hiring-software-engineers',
  'hbl-management-trainee-officer-2026',
  'benazir-income-support-programme-2026',
  'nts-nat-result-september-2026',
  'commonwealth-scholarships-2027-28-pakistan-hec-csc-uk',
  'cbd-punjab-paid-internship-2026-youth-career-program',
  'sindh-pink-scooty-scheme-2026-online-registration-eligibility',
  'shaikh-ayaz-university-spring-2027-admissions-apply-online',
  'lums-nano-physics-research-associate-jobs-2026',
  'lums-lahore-jobs-advancement-it-staff-2026',
  'virtual-university-admissions-2026-deadline-tomorrow',
  'nts-nat-2026-october-test-roll-number-slips-uploaded',
])

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
  const todayStr = new Date().toISOString().split('T')[0]

  const allArticles = await ArticleModel.getAll(db, null, false)
  const allArticleSlugs = new Set(allArticles.map((a) => a.slug))
  const articles = allArticles.filter(
    (a) => a.status === 'published' && !EXCLUDED_SITEMAP_SLUGS.has(a.slug)
  )
  const updates = (await DailyUpdateModel.getAll(db, 'published', false)).filter(
    (u) => !allArticleSlugs.has(u.slug) && !EXCLUDED_SITEMAP_SLUGS.has(u.slug)
  )
  const categories = await CategoryModel.getAll(db)

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily', lastmod: todayStr },
    { loc: '/daily-updates', priority: '0.9', changefreq: 'daily', lastmod: todayStr },
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
