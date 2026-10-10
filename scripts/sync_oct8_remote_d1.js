import fs from 'fs'
import { oct8Articles } from './publish_oct8_articles.js'

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
  internships: 'Internships',
  results: 'Results',
  'government-jobs': 'Government Jobs'
}

console.log('=== SYNCING 5 OCT 8 ARTICLES TO REMOTE D1 DATABASE ===\n')

for (const item of oct8Articles) {
  console.log(`Processing: ${item.slug}`)
  const contentJson = JSON.stringify(item.content)
  const catLabel = catMap[item.category] || 'Admissions'

  // 1. Upsert into articles
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

  // 2. Upsert into daily_updates
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

// 3. Set priority IDs on remote D1 (use temporary offset first to avoid unique constraint conflict)
console.log('\n--- SETTING HOMEPAGE PRIORITY IDS ON REMOTE D1 ---')
const idMapArticles = [
  { slug: 'sbbu-merit-list-2027', id: 315 },
  { slug: 'ismo-jobs-2026', id: 314 },
  { slug: 'nicvd-jobs-2026', id: 313 },
  { slug: 'sindh-bs-nursing-admissions-2026-27', id: 312 },
  { slug: 'szabist-scholarship-2026-27', id: 311 }
]

const idMapUpdates = [
  { slug: 'sbbu-merit-list-2027', id: 215 },
  { slug: 'ismo-jobs-2026', id: 214 },
  { slug: 'nicvd-jobs-2026', id: 213 },
  { slug: 'sindh-bs-nursing-admissions-2026-27', id: 212 },
  { slug: 'szabist-scholarship-2026-27', id: 211 }
]

// Step 3a: Apply temporary offset
for (let i = 0; i < idMapArticles.length; i++) {
  await queryD1('UPDATE articles SET id = ? WHERE slug = ?', [6000 + i, idMapArticles[i].slug])
  await queryD1('UPDATE daily_updates SET id = ? WHERE slug = ?', [6000 + i, idMapUpdates[i].slug])
}

// Step 3b: Set final target IDs
for (const item of idMapArticles) {
  await queryD1('UPDATE articles SET id = ? WHERE slug = ?', [item.id, item.slug])
  console.log(`  Set articles id=${item.id} for ${item.slug}`)
}

for (const item of idMapUpdates) {
  await queryD1('UPDATE daily_updates SET id = ? WHERE slug = ?', [item.id, item.slug])
  console.log(`  Set daily_updates id=${item.id} for ${item.slug}`)
}

// 4. Verify remote D1
console.log('\n--- VERIFYING TOP 5 ARTICLES ON REMOTE D1 ---')
const verifyArt = await queryD1('SELECT id, slug, title, publish_date FROM articles ORDER BY publish_date DESC, id DESC LIMIT 5;')
console.log(JSON.stringify(verifyArt.results, null, 2))

console.log('\n--- VERIFYING TOP 5 DAILY UPDATES ON REMOTE D1 ---')
const verifyUpd = await queryD1('SELECT id, slug, title, publish_date FROM daily_updates ORDER BY publish_date DESC, id DESC LIMIT 5;')
console.log(JSON.stringify(verifyUpd.results, null, 2))

console.log('\nAll 5 Oct 8 articles successfully synced to remote Cloudflare D1!')
