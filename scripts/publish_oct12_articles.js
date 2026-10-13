import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { oct12Articles } from './save_oct12_drafts.js'

export { oct12Articles }

const db = new Database('careerdost.sqlite')

const catMap = {
  scholarships: 'Scholarships',
  admissions: 'Admissions',
  internships: 'Internships',
  results: 'Results',
  'government-jobs': 'Government Jobs',
  'private-jobs': 'Private Jobs'
}

export function publish() {
  console.log('=== PUBLISHING 10 OCT 12 ARTICLES IN LOCAL SQLITE & LISTINGS ===\n')

  const stmtArt = db.prepare(`
    INSERT INTO articles (
      slug, title, category_slug, organization, job_type, location,
      qualification, salary, last_date, publish_date, official_link,
      featured, logo_initial, excerpt, content, seo_title, meta_description,
      status, featured_image, image_alt, experience, positions, apply_link,
      is_verified, focus_keyword, canonical_url, og_title, og_description
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      'published', ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?
    )
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      category_slug = excluded.category_slug,
      organization = excluded.organization,
      job_type = excluded.job_type,
      location = excluded.location,
      qualification = excluded.qualification,
      salary = excluded.salary,
      last_date = excluded.last_date,
      publish_date = excluded.publish_date,
      official_link = excluded.official_link,
      featured = excluded.featured,
      logo_initial = excluded.logo_initial,
      excerpt = excluded.excerpt,
      content = excluded.content,
      seo_title = excluded.seo_title,
      meta_description = excluded.meta_description,
      status = 'published',
      featured_image = excluded.featured_image,
      image_alt = excluded.image_alt,
      experience = excluded.experience,
      positions = excluded.positions,
      apply_link = excluded.apply_link,
      is_verified = excluded.is_verified,
      focus_keyword = excluded.focus_keyword,
      canonical_url = excluded.canonical_url,
      og_title = excluded.og_title,
      og_description = excluded.og_description,
      updated_at = CURRENT_TIMESTAMP;
  `)

  const stmtDaily = db.prepare(`
    INSERT INTO daily_updates (
      slug, title, category, short_description, content, featured_image,
      image_alt, official_link, apply_link, deadline, publish_date,
      organization, location, qualification, experience, positions,
      job_type, salary, is_verified, featured, seo_title, meta_description,
      focus_keyword, canonical_url, og_title, og_description, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, 'published'
    )
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      category = excluded.category,
      short_description = excluded.short_description,
      content = excluded.content,
      featured_image = excluded.featured_image,
      image_alt = excluded.image_alt,
      official_link = excluded.official_link,
      apply_link = excluded.apply_link,
      deadline = excluded.deadline,
      publish_date = excluded.publish_date,
      organization = excluded.organization,
      location = excluded.location,
      qualification = excluded.qualification,
      experience = excluded.experience,
      positions = excluded.positions,
      job_type = excluded.job_type,
      salary = excluded.salary,
      is_verified = excluded.is_verified,
      featured = excluded.featured,
      seo_title = excluded.seo_title,
      meta_description = excluded.meta_description,
      focus_keyword = excluded.focus_keyword,
      canonical_url = excluded.canonical_url,
      og_title = excluded.og_title,
      og_description = excluded.og_description,
      status = 'published',
      updated_at = CURRENT_TIMESTAMP;
  `)

  for (const item of oct12Articles) {
    console.log(`Setting published in SQLite: ${item.slug}`)
    const contentJson = JSON.stringify(item.content)
    const catLabel = catMap[item.category] || 'Jobs'

    stmtArt.run(
      item.slug, item.title, item.category, item.organization, item.jobType, item.location,
      item.qualification, item.salary, item.lastDate, item.publishDate, item.officialLink,
      item.featured ? 1 : 0, item.logoInitial, item.excerpt, contentJson, item.seoTitle, item.metaDescription,
      item.featuredImage, item.imageAlt, item.experience, item.positions, item.applyLink,
      item.isVerified ? 1 : 0, item.focusKeyword, item.canonicalUrl, item.ogTitle, item.ogDescription
    )

    stmtDaily.run(
      item.slug, item.title, catLabel, item.excerpt, contentJson, item.featuredImage,
      item.imageAlt, item.officialLink, item.applyLink, item.lastDate, item.publishDate,
      item.organization, item.location, item.qualification, item.experience, item.positions,
      item.jobType, item.salary, item.isVerified ? 1 : 0, item.featured ? 1 : 0, item.seoTitle, item.metaDescription,
      item.focusKeyword, item.canonicalUrl, item.ogTitle, item.ogDescription
    )
  }
  console.log('Seeded local careerdost.sqlite successfully as published.')

  // Priority IDs for Oct 12:
  // Set IDs 345..336 for articles, 245..236 for daily_updates
  const idMap = [
    { slug: 'sindh-hec-research-support-programme-2026-27', artId: 345, updId: 245 },
    { slug: 'szabist-hyderabad-spring-2027-admissions', artId: 344, updId: 244 },
    { slug: 'shaikh-ayaz-university-admissions-2027', artId: 343, updId: 243 },
    { slug: 'gimhs-hyderabad-bsn-dpt-admissions-2026-phase-2', artId: 342, updId: 242 },
    { slug: 'fjwu-paid-lab-engineer-internship-2026', artId: 341, updId: 241 },
    { slug: 'isra-university-mbbs-bds-scholarship-registration-2026', artId: 340, updId: 240 },
    { slug: 'isra-university-spring-2027-undergraduate-admissions', artId: 339, updId: 239 },
    { slug: 'isra-university-ms-mphil-phd-spring-2027', artId: 338, updId: 238 },
    { slug: 'lums-nano-physics-research-associate-jobs-2026', artId: 337, updId: 237 },
    { slug: 'lums-electronic-technician-jobs-2026', artId: 336, updId: 236 }
  ]

  for (let i = 0; i < idMap.length; i++) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(9100 + i, idMap[i].slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(9100 + i, idMap[i].slug)
  }

  for (const m of idMap) {
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(m.artId, m.slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(m.updId, m.slug)
  }
  console.log('Updated priority IDs in local SQLite.')

  // 2. Prepend to src/data/listings.js
  const listingsPath = path.resolve('src/data/listings.js')
  let listingsCode = fs.readFileSync(listingsPath, 'utf8')

  // Remove existing older shaikh-ayaz-university-admissions-2027 object to avoid duplication
  const sausRegex = /\s*\{\s*"slug":\s*"shaikh-ayaz-university-admissions-2027"[\s\S]*?\n\s*\},/
  if (sausRegex.test(listingsCode)) {
    listingsCode = listingsCode.replace(sausRegex, '')
    console.log('Removed older Shaikh Ayaz University object from listings.js.')
  }

  const formattedItems = oct12Articles.map(a => {
    return JSON.stringify({
      slug: a.slug,
      title: a.title,
      category: a.category,
      organization: a.organization,
      jobType: a.jobType,
      location: a.location,
      qualification: a.qualification,
      salary: a.salary,
      experience: a.experience,
      positions: a.positions,
      lastDate: a.lastDate,
      noDeadline: a.noDeadline,
      publishDate: a.publishDate,
      officialLink: a.officialLink,
      applyLink: a.applyLink,
      isVerified: a.isVerified,
      featured: a.featured,
      logoInitial: a.logoInitial,
      featuredImage: a.featuredImage,
      imageAlt: a.imageAlt,
      excerpt: a.excerpt,
      seoTitle: a.seoTitle,
      metaDescription: a.metaDescription,
      focusKeyword: a.focusKeyword,
      canonicalUrl: a.canonicalUrl,
      ogTitle: a.ogTitle,
      ogDescription: a.ogDescription,
      schemaType: a.schemaType,
      content: a.content
    }, null, 2)
  })

  const arrayStart = listingsCode.indexOf('export const listings = [')
  if (arrayStart !== -1) {
    const insertPos = arrayStart + 'export const listings = [\n'.length
    const prependedCode = formattedItems.map(item => '  ' + item.replace(/\n/g, '\n  ') + ',\n').join('')

    if (!listingsCode.includes('sindh-hec-research-support-programme-2026-27')) {
      listingsCode = listingsCode.slice(0, insertPos) + prependedCode + listingsCode.slice(insertPos)
      listingsCode = listingsCode.replace(/Updated:\s*\d{4}-\d{2}-\d{2}/, 'Updated: 2026-10-12')
      fs.writeFileSync(listingsPath, listingsCode, 'utf8')
      console.log('Successfully updated src/data/listings.js with 10 new articles!')
    } else {
      console.log('src/data/listings.js already contains oct 12 articles.')
    }
  }

  // 3. Update scripts/generate_sitemap.js
  const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
  let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')
  if (!sitemapScript.includes('sindh-hec-research-support-programme-2026-27')) {
    const insertPattern = 'const publishedDailyUpdates = [\n'
    const newSitemapEntries = idMap.map(m => `  { slug: '${m.slug}', date: '2026-10-12' },\n`).join('')
    sitemapScript = sitemapScript.replace(insertPattern, insertPattern + newSitemapEntries)
    fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
    console.log('Updated scripts/generate_sitemap.js with new slugs.')
  }
}

if (process.argv[1] && process.argv[1].endsWith('publish_oct12_articles.js')) {
  publish()
}
