import fs from 'fs'
import path from 'path'
import { oct14EditorialPackages } from './save_oct14_editorial_packages.js'
import { listings } from '../src/data/listings.js'

function updateListings() {
  console.log('=== UPDATING SRC/DATA/LISTINGS.JS ===')
  const listingsPath = path.resolve('src/data/listings.js')

  const items = [
    oct14EditorialPackages.mamta,
    oct14EditorialPackages.hunarmand,
    oct14EditorialPackages.wheatPrice,
    oct14EditorialPackages.wheatImports,
    oct14EditorialPackages.wallet,
    oct14EditorialPackages.nadra
  ]

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

  const oct14Entries = [
    { slug: 'sindh-mamta-programme-2026-october-dashboard', date: '2026-10-14' },
    { slug: 'benazir-hunarmand-programme-2026-karachi-guide', date: '2026-10-14' },
    { slug: 'pakistan-wheat-support-price-2026-27', date: '2026-10-14' },
    { slug: 'wheat-imports-karachi-october-2026', date: '2026-10-14' },
    { slug: 'bisp-8171-payment-check-2026-official-guide', date: '2026-10-14' },
    { slug: 'nadra-digital-payments-2026', date: '2026-10-14' }
  ]

  // Remove existing older bisp-8171 entry if present in publishedDailyUpdates
  sitemapScript = sitemapScript.replace(/\s*\{\s*slug:\s*'bisp-8171-payment-check-2026-official-guide'[^}]+\},?/, '')

  const insertPattern = 'const publishedDailyUpdates = [\n'
  const entriesStr = oct14Entries.map(e => `  { slug: '${e.slug}', date: '${e.date}' },\n`).join('')

  if (!sitemapScript.includes('sindh-mamta-programme-2026-october-dashboard')) {
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + entriesStr)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('✓ Successfully updated scripts/generate_sitemap.js with Oct 14 entries!')
  } else {
    console.log('scripts/generate_sitemap.js already contains Oct 14 entries.')
  }
}

updateListings()
updateSitemapScript()
