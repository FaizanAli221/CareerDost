import fs from 'fs'
import path from 'path'
import { highReachEditorialPackages } from './save_high_reach_editorial_packages.js'
import { listings } from '../src/data/listings.js'
import { execSync } from 'child_process'

function updateListings() {
  console.log('=== UPDATING SRC/DATA/LISTINGS.JS ===')
  const listingsPath = path.resolve('src/data/listings.js')

  const items = Object.values(highReachEditorialPackages)

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
    { slug: 'zarkhez-e-asaan-digital-zarai-qarza-guide-2026', date: '2026-10-14' },
    { slug: 'benazir-women-agricultural-worker-card-sindh-guide-2026', date: '2026-10-14' },
    { slug: 'sindh-peoples-housing-flood-affectees-sphf-subsidy-guide-2026', date: '2026-10-14' },
    { slug: 'sindh-solar-energy-project-ssep-home-solar-systems-subsidy-2026', date: '2026-10-14' },
    { slug: 'sbp-housing-solar-financing-rules-circular-06-2026', date: '2026-10-14' }
  ]

  const insertPattern = 'const publishedDailyUpdates = [\n'
  const entriesStr = newEntries.map(e => `  { slug: '${e.slug}', date: '${e.date}' },\n`).join('')

  if (!sitemapScript.includes('zarkhez-e-asaan-digital-zarai-qarza-guide-2026')) {
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + entriesStr)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('✓ Successfully updated scripts/generate_sitemap.js with new high-reach entries!')
  } else {
    console.log('scripts/generate_sitemap.js already contains high-reach entries.')
  }

  console.log('\n=== REGENERATING SITEMAP.XML ===')
  execSync('node scripts/generate_sitemap.js', { stdio: 'inherit' })
}

updateListings()
updateSitemapScript()
