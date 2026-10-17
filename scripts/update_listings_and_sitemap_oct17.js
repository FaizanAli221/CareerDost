import fs from 'fs'
import path from 'path'
import { oct17EditorialPackages } from './save_oct17_editorial_packages.js'
import { listings } from '../src/data/listings.js'
import { execSync } from 'child_process'

function updateListings() {
  console.log('=== UPDATING SRC/DATA/LISTINGS.JS FOR OCT 17 ===')
  const listingsPath = path.resolve('src/data/listings.js')

  const items = Object.values(oct17EditorialPackages)

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
  const filteredOldListings = listings.filter(l => !newSlugs.has(l.slug))
  const combinedListings = [...newItemsFormatted, ...filteredOldListings]

  const fileContent = `// Generated listings file for CareerDost\nexport const listings = ${JSON.stringify(combinedListings, null, 2)}\n`
  fs.writeFileSync(listingsPath, fileContent, 'utf8')
  console.log(`✓ Successfully updated src/data/listings.js with ${combinedListings.length} total articles!`)
}

function updateSitemapScript() {
  console.log('\n=== UPDATING SCRIPTS/GENERATE_SITEMAP.JS ===')
  const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
  let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')

  const targetSlug = 'pakistan-plans-new-support-poor-flood-affected-families-what-is-confirmed'
  const targetDate = '2026-10-17'

  const insertPattern = 'const publishedDailyUpdates = [\n'
  const entryStr = `  { slug: '${targetSlug}', date: '${targetDate}' },\n`

  if (!sitemapScript.includes(targetSlug)) {
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + entryStr)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('✓ Successfully updated scripts/generate_sitemap.js with new Oct 17 entry!')
  } else {
    console.log('scripts/generate_sitemap.js already contains Oct 17 entry.')
  }

  console.log('\n=== REGENERATING SITEMAP.XML ===')
  execSync('node scripts/generate_sitemap.js', { stdio: 'inherit' })
}

updateListings()
updateSitemapScript()
