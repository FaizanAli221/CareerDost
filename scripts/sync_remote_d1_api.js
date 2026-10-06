import fs from 'fs'
import { oct6Articles } from './publish_oct6_articles.js'

const toml = fs.readFileSync('C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml', 'utf8')
const token = toml.match(/oauth_token\s*=\s*"([^"]+)"/)[1]
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query'

async function queryD1(sql, params = []) {
  const res = await fetch(d1QueryUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  })

  const json = await res.json()
  if (!json.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(json.errors)}`)
  }
  return json.result[0]
}

const catMap = {
  scholarships: 'Scholarships',
  admissions: 'Admissions',
  'government-jobs': 'Government Jobs',
  jobs: 'Government Jobs',
  internships: 'Internships'
}

console.log('=== SYNCING 5 OCT 6 ARTICLES TO REMOTE D1 DATABASE ===')

for (const item of oct6Articles) {
  console.log(`Processing: ${item.slug}`)
  const contentJson = JSON.stringify(item.content)
  const catLabel = catMap[item.category] || 'Latest Jobs'

  // Upsert into articles
  const sqlArticle = `
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
`

  const paramsArticle = [
    item.slug, item.title, item.category, item.organization, item.jobType, item.location,
    item.qualification, item.salary, item.lastDate, item.publishDate, item.officialLink,
    item.featured ? 1 : 0, item.logoInitial, item.excerpt, contentJson, item.seoTitle, item.metaDescription,
    item.featuredImage, item.imageAlt, item.experience, item.positions, item.applyLink,
    item.isVerified ? 1 : 0, item.focusKeyword, item.canonicalUrl, item.ogTitle, item.ogDescription
  ]

  const artRes = await queryD1(sqlArticle, paramsArticle)
  console.log(`  ✓ articles table updated: changes = ${artRes.meta.changes}`)

  // Upsert into daily_updates
  const sqlDaily = `
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
`

  const paramsDaily = [
    item.slug, item.title, catLabel, item.excerpt, contentJson, item.featuredImage,
    item.imageAlt, item.officialLink, item.applyLink, item.lastDate, item.publishDate,
    item.organization, item.location, item.qualification, item.experience, item.positions,
    item.jobType, item.salary, item.isVerified ? 1 : 0, item.featured ? 1 : 0, item.seoTitle, item.metaDescription,
    item.focusKeyword, item.canonicalUrl, item.ogTitle, item.ogDescription
  ]

  const dailyRes = await queryD1(sqlDaily, paramsDaily)
  console.log(`  ✓ daily_updates table updated: changes = ${dailyRes.meta.changes}`)
}

// Verification query
console.log('\n--- VERIFYING TOP ARTICLES ON REMOTE D1 ---')
const verifyRes = await queryD1('SELECT slug, title, publish_date, last_date FROM articles ORDER BY publish_date DESC, id DESC LIMIT 5;')
console.log(JSON.stringify(verifyRes.results, null, 2))

console.log('\nAll 5 Oct 6 articles successfully synced to remote Cloudflare D1!')
