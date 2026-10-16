import fs from 'fs'
import path from 'path'
import { oct16JobsPackages } from './save_oct16_jobs_packages.js'

console.log('=== UPDATING SRC/DATA/LISTINGS.JS WITH 5 NEW JOBS/INTERNSHIPS ===\n')

const listingsPath = path.resolve('src/data/listings.js')
const listingsRaw = fs.readFileSync(listingsPath, 'utf8')

// Parse existing listings
const match = listingsRaw.match(/export const listings = (\[[\s\S]*\]);?\s*$/)
if (!match) {
  console.error('Could not parse listings array from src/data/listings.js')
  process.exit(1)
}

let existingListings
try {
  existingListings = JSON.parse(match[1])
} catch (e) {
  console.error('JSON.parse error on listings:', e)
  process.exit(1)
}

const newItems = Object.values(oct16JobsPackages).map(item => ({
  slug: item.slug,
  title: item.title,
  category: item.category_slug,
  organization: item.organization,
  jobType: item.job_type,
  location: item.location,
  qualification: item.qualification,
  salary: item.salary,
  experience: item.experience,
  positions: item.positions,
  lastDate: item.last_date,
  noDeadline: Boolean(item.no_deadline),
  publishDate: item.publish_date,
  officialLink: item.official_link,
  applyLink: item.apply_link,
  isVerified: Boolean(item.is_verified),
  featured: Boolean(item.featured),
  logoInitial: item.logo_initial,
  featuredImage: item.featured_image,
  imageAlt: item.image_alt,
  excerpt: item.excerpt,
  seoTitle: item.seo_title,
  metaDescription: item.meta_description,
  focusKeyword: item.focus_keyword,
  canonicalUrl: item.canonical_url,
  ogTitle: item.og_title,
  ogDescription: item.og_description,
  schemaType: 'JobPosting',
  content: item.content
}))

// Filter out any existing entries with these slugs
const newSlugs = new Set(newItems.map(i => i.slug))
const filteredExisting = existingListings.filter(i => !newSlugs.has(i.slug))

// Prepend new items (they should come after the newest 2026-10-16 electricity-bills, or right at the top)
// Let's place the electricity-bills post first if it exists, or just prepend them right after 2026-10-16 electricity bills.
// Actually, sorting by publishDate DESC keeps the latest on top.
const combinedListings = [...newItems, ...filteredExisting]

// Write back to listings.js
const updatedContent = `// Generated listings file for CareerDost\nexport const listings = ${JSON.stringify(combinedListings, null, 2)}\n`
fs.writeFileSync(listingsPath, updatedContent, 'utf8')
console.log(`✓ Successfully updated src/data/listings.js (Total items: ${combinedListings.length})`)

// Update scripts/generate_sitemap.js
const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')

const updatesToInsert = newItems.map(i => `  { slug: '${i.slug}', date: '${i.publishDate}' },`).join('\n')

if (!sitemapScript.includes('kp-government-project-associate-internship-2026')) {
  sitemapScript = sitemapScript.replace(
    'const publishedDailyUpdates = [\n',
    `const publishedDailyUpdates = [\n${updatesToInsert}\n`
  )
  fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
  console.log('✓ Successfully updated scripts/generate_sitemap.js publishedDailyUpdates list')
}

console.log('\nAll updates completed successfully.')
