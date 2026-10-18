import fs from 'fs'
import path from 'path'
import { oct18EditorialPackages } from './save_oct18_editorial_packages.js'
import { listings } from '../src/data/listings.js'
import { execSync } from 'child_process'

function updateListings() {
  console.log('=== UPDATING SRC/DATA/LISTINGS.JS FOR OCT 18 APPROVED ARTICLES ===')
  const listingsPath = path.resolve('src/data/listings.js')

  // Strictly include ONLY the 4 verified & approved articles (omit mrpElite which is unverified on employer portal)
  const approvedKeys = ['sambaBank', 'bankAlfalah', 'ezyInternship', 'unileverPakistan']
  const items = approvedKeys.map(k => oct18EditorialPackages[k])

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
  // Also make sure unverified mrpElite is never in listings.js
  newSlugs.add('mrp-elite-graduate-trainee-karachi-2026')

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

  const approvedNewEntries = [
    { slug: 'samba-bank-relationship-associate-jobs-2026', date: '2026-10-18' },
    { slug: 'ezy-business-applications-paid-internship-karachi-2026', date: '2026-10-18' },
    { slug: 'unilever-pakistan-jobs-october-2026', date: '2026-10-18' }
  ]

  // Update date of existing bank-alfalah-jobs-internships-2026 to 2026-10-18
  sitemapScript = sitemapScript.replace(
    /\{\s*slug:\s*'bank-alfalah-jobs-internships-2026',\s*date:\s*'[^']+'\s*\}/g,
    "{ slug: 'bank-alfalah-jobs-internships-2026', date: '2026-10-18' }"
  )

  const insertPattern = 'const publishedDailyUpdates = [\n'
  let entriesToInsert = ''
  for (const e of approvedNewEntries) {
    if (!sitemapScript.includes(e.slug)) {
      entriesToInsert += `  { slug: '${e.slug}', date: '${e.date}' },\n`
    }
  }

  if (entriesToInsert) {
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + entriesToInsert)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('✓ Successfully updated scripts/generate_sitemap.js with Oct 18 approved entries!')
  } else {
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('scripts/generate_sitemap.js already contains Oct 18 entries.')
  }

  console.log('\n=== REGENERATING SITEMAP.XML ===')
  execSync('node scripts/generate_sitemap.js', { stdio: 'inherit' })
}

updateListings()
updateSitemapScript()
