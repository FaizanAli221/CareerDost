import fs from 'fs'
import path from 'path'
import { bankingScholarshipPackages } from './save_banking_scholarship_editorial_packages.js'
import { listings } from '../src/data/listings.js'
import { execSync } from 'child_process'

function updateListings() {
  console.log('=== UPDATING SRC/DATA/LISTINGS.JS FOR BANKING & SCHOLARSHIP ===')
  const listingsPath = path.resolve('src/data/listings.js')

  // Only include approved published articles (omit meezanBank which is on editorial hold)
  const publishedKeys = ['tenPearls', 'mcbBank', 'japanJds', 'bankAlfalah']
  const items = publishedKeys.map(k => bankingScholarshipPackages[k])

  const newItemsFormatted = items.map(a => ({
    slug: a.slug,
    title: a.title,
    category: a.category_slug,
    organization: a.organization,
    jobType: a.job_type,
    location: a.location,
    qualification: a.qualification,
    salary: a.salary,
    experience: a.experience,
    positions: a.positions,
    lastDate: a.last_date,
    noDeadline: Boolean(a.no_deadline),
    publishDate: a.publish_date,
    officialLink: a.official_link,
    applyLink: a.apply_link,
    isVerified: Boolean(a.is_verified),
    featured: Boolean(a.featured),
    logoInitial: a.logo_initial,
    featuredImage: a.featured_image,
    imageAlt: a.image_alt,
    excerpt: a.excerpt,
    seoTitle: a.seo_title,
    metaDescription: a.meta_description,
    focusKeyword: a.focus_keyword,
    canonicalUrl: a.canonical_url,
    ogTitle: a.og_title,
    ogDescription: a.og_description,
    schemaType: 'Article',
    content: a.content
  }))

  const newSlugs = new Set(items.map(i => i.slug))
  // Filter out any existing matching slugs from older listings
  const filteredOldListings = listings.filter(l => !newSlugs.has(l.slug))

  // Combined list with new articles prepended
  const combinedListings = [...newItemsFormatted, ...filteredOldListings]

  const fileContent = `// Generated listings file for CareerDost\nexport const listings = ${JSON.stringify(combinedListings, null, 2)}\n`
  fs.writeFileSync(listingsPath, fileContent, 'utf8')
  console.log(`✓ Successfully updated src/data/listings.js with ${combinedListings.length} total articles!`)
}

function updateSitemapScript() {
  console.log('\n=== UPDATING SCRIPTS/GENERATE_SITEMAP.JS ===')
  const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
  let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')

  const newEntries = [
    { slug: '10pearls-shine-virtual-internship-2026', date: '2026-10-15' },
    { slug: 'mcb-bank-infosec-trainee-jobs-2026', date: '2026-10-15' },
    { slug: 'japan-jds-scholarship-2026-pakistan', date: '2026-10-15' },
    { slug: 'bank-alfalah-jobs-internships-2026', date: '2026-10-15' }
  ]

  const insertPattern = 'const publishedDailyUpdates = [\n'
  const entriesStr = newEntries.map(e => `  { slug: '${e.slug}', date: '${e.date}' },\n`).join('')

  if (!sitemapScript.includes('10pearls-shine-virtual-internship-2026')) {
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + entriesStr)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('✓ Successfully updated scripts/generate_sitemap.js with new published entries!')
  } else {
    console.log('scripts/generate_sitemap.js already contains new entries.')
  }

  console.log('\n=== REGENERATING SITEMAP.XML ===')
  execSync('node scripts/generate_sitemap.js', { stdio: 'inherit' })
}

updateListings()
updateSitemapScript()
