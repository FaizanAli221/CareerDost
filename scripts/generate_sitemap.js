import fs from 'fs'
import path from 'path'
import { listings } from '../src/data/listings.js'
import { categories } from '../src/data/categories.js'

const SITE_URL = process.env.SITE_URL || 'https://careerdost.blog'

const publishedDailyUpdates = [
  { slug: 'sbbu-ms-mphil-mba-merit-list-2027', date: '2026-10-10' },
  { slug: 'nts-nat-gat-roll-number-slip-2026', date: '2026-10-10' },
  { slug: 'punjab-ophthalmology-college-jobs-2026', date: '2026-10-10' },
  { slug: 'shifa-university-pharmd-admissions-2026', date: '2026-10-10' },
  { slug: 'nts-gat-subject-2026-vi', date: '2026-10-10' },
  { slug: 'women-university-ajk-admissions-2026', date: '2026-10-09' },
  { slug: 'security-papers-jobs-2026', date: '2026-10-09' },
  { slug: 'gepco-jobs-2026', date: '2026-10-09' },
  { slug: 'engineering-development-board-jobs-2026', date: '2026-10-09' },
  { slug: 'university-of-malakand-admissions-2026', date: '2026-10-09' },
  { slug: 'sbbu-merit-list-2027', date: '2026-10-08' },
  { slug: 'ismo-jobs-2026', date: '2026-10-08' },
  { slug: 'nicvd-jobs-2026', date: '2026-10-08' },
  { slug: 'sindh-bs-nursing-admissions-2026-27', date: '2026-10-08' },
  { slug: 'szabist-scholarship-2026-27', date: '2026-10-08' },
  { slug: 'punjab-sti-jobs-2026-27', date: '2026-10-07' },
  { slug: 'nums-spring-2027-admissions', date: '2026-10-07' },
  { slug: 'nums-mdcat-result-2026', date: '2026-10-07' },
  { slug: 'shaikh-ayaz-university-admissions-2027', date: '2026-10-07' },
  { slug: 'sindh-agriculture-university-admissions-2027', date: '2026-10-07' },
  { slug: 'chevening-scholarship-2027-28-pakistan', date: '2026-10-06' },
  { slug: 'hec-jobs-2026', date: '2026-10-06' },
  { slug: 'habib-university-admissions-2027', date: '2026-10-06' },
  { slug: 'swiss-government-excellence-scholarships-2027-pakistan', date: '2026-10-06' },
  { slug: 'hec-outstanding-research-awards-2026-27', date: '2026-10-06' },
  { slug: 'sessi-internship-programme-2026', date: '2026-10-05' },
  { slug: 'uet-reciprocal-admissions-2026', date: '2026-10-05' },
  { slug: 'virtual-university-fall-2026-admissions', date: '2026-10-05' },
  { slug: 'punjab-cbd-youth-career-program-2026-internship', date: '2026-10-05' },
  { slug: 'uoh-haripur-admissions-2026-deadline-today', date: '2026-09-29' },
  { slug: 'hec-peridot-research-program-phase-13-2026', date: '2026-09-29' },
  { slug: 'pec-graduate-engineer-training-get-program-2026', date: '2026-09-29' },
  { slug: 'uhs-mdcat-2026-result-recount-review-portal', date: '2026-09-28' },
  { slug: 'hec-usat-hat-registration-2026-etc-hec', date: '2026-09-28' },
  { slug: 'sbbu-admissions-2026-deadline-extended', date: '2026-09-28' },
  { slug: 'sbbu-fully-funded-scholarship-2026', date: '2026-09-28' },
  { slug: 'uet-lahore-jobs-2026-faculty-research', date: '2026-09-28' },
  { slug: 'petrol-price-reduced-pakistan-september-2026', date: '2026-09-28' },
  { slug: 'sindh-govt-electric-scooty-scheme-2026-women', date: '2026-09-27' },
  { slug: 'hec-uk-commonwealth-scholarships-2027-28', date: '2026-09-27' },
  { slug: 'punjab-university-phase2-admissions-2026-27', date: '2026-09-27' },
  { slug: 'nts-latest-results-answer-keys-2026', date: '2026-09-27' },
  { slug: 'fpsc-latest-updates-adv3-2026-schedule', date: '2026-09-27' },
  { slug: 'comsats-active-scholarships-international-opportunities-2026', date: '2026-09-27' },
  { slug: 'punjab-university-jobs-faculty-staff-2026', date: '2026-09-27' },
  { slug: 'comsats-university-jobs-faculty-staff-2026', date: '2026-09-27' },
  { slug: 'university-of-chakwal-uoc-jobs-2026', date: '2026-09-27' },
  { slug: 'air-university-islamabad-jobs-2026', date: '2026-09-27' },
  { slug: 'bahria-university-jobs-2026', date: '2026-09-27' },
  { slug: 'sarhad-university-suit-peshawar-jobs-2026', date: '2026-09-27' },
  { slug: 'lums-lahore-jobs-advancement-it-staff-2026', date: '2026-09-27' },
  { slug: 'times-university-multan-tum-jobs-2026', date: '2026-09-27' },
  { slug: 'maju-karachi-jobs-faculty-staff-2026', date: '2026-09-27' },
  { slug: 'university-of-lahore-uol-jobs-2026', date: '2026-09-27' },
  { slug: 'fpsc-consolidated-advertisement-09-2026-announced', date: '2026-09-26' },
  { slug: 'hec-fully-funded-phd-scholarships-2026-open', date: '2026-09-26' },
  { slug: 'state-bank-officer-training-scheme-sbots-batch-27', date: '2026-09-26' },
  { slug: 'nts-nat-2026-october-test-roll-number-slips-uploaded', date: '2026-09-26' },
  { slug: 'pm-youth-laptop-scheme-phase-4-registration-alert', date: '2026-09-25' },
  { slug: 'engro-management-trainee-2026', date: '2026-09-18' }
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

  const updateUrls = publishedDailyUpdates.map(u => ({
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
