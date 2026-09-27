import fs from 'fs'
import path from 'path'
import { listings } from '../src/data/listings.js'
import { categories } from '../src/data/categories.js'

const SITE_URL = process.env.SITE_URL || 'https://careerdost.pages.dev'

const sampleDailyUpdates = [
  { slug: 'fpsc-consolidated-advertisement-09-2026-announced', date: '2026-09-27' },
  { slug: 'hec-fully-funded-phd-scholarships-2026-open', date: '2026-09-27' },
  { slug: 'state-bank-officer-training-scheme-sbots-batch-27', date: '2026-09-27' },
  { slug: 'nts-nat-2026-october-test-roll-number-slips-uploaded', date: '2026-09-27' },
  { slug: 'pm-youth-laptop-scheme-phase-4-registration-alert', date: '2026-09-27' }
]

function formatLastModDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0]
  try {
    const date = new Date(dateStr)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  } catch {}
  return '2026-09-27'
}

function generateSitemap() {
  const todayStr = formatLastModDate(new Date())

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'daily', lastmod: todayStr },
    { loc: '/daily-updates', priority: '0.9', changefreq: 'daily', lastmod: todayStr },
    { loc: '/about', priority: '0.5', changefreq: 'monthly', lastmod: todayStr },
    { loc: '/contact', priority: '0.5', changefreq: 'monthly', lastmod: todayStr },
    { loc: '/privacy-policy', priority: '0.3', changefreq: 'yearly', lastmod: todayStr },
    { loc: '/disclaimer', priority: '0.3', changefreq: 'yearly', lastmod: todayStr },
    { loc: '/terms-and-conditions', priority: '0.3', changefreq: 'yearly', lastmod: todayStr }
  ]

  const categoryUrls = categories.map(cat => ({
    loc: `/category/${cat.slug}`,
    priority: '0.8',
    changefreq: 'daily',
    lastmod: todayStr
  }))

  const jobUrls = listings.map(l => ({
    loc: `/jobs/${l.slug}`,
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: formatLastModDate(l.publishDate)
  }))

  const updateUrls = sampleDailyUpdates.map(u => ({
    loc: `/daily-updates/${u.slug}`,
    priority: '0.9',
    changefreq: 'daily',
    lastmod: formatLastModDate(u.date)
  }))

  const allUrls = [...staticPages, ...categoryUrls, ...jobUrls, ...updateUrls]

  // Build clean XML string starting strictly at char index 0 without BOM or leading spaces
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  for (const page of allUrls) {
    xml += '  <url>\n'
    xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`
    if (page.lastmod) {
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`
    }
    if (page.changefreq) {
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`
    }
    xml += `    <priority>${page.priority}</priority>\n`
    xml += '  </url>\n'
  }

  xml += '</urlset>'

  const publicDir = path.resolve(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // Write sitemap.xml with clean UTF-8 encoding
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')
  console.log(`Generated sitemap.xml with ${allUrls.length} public URLs at public/sitemap.xml`)

  // Write robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${SITE_URL}/sitemap.xml
`
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8')
  console.log(`Generated robots.txt at public/robots.txt`)
}

generateSitemap()
