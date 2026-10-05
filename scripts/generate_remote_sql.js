import fs from 'fs'
import path from 'path'
import { newArticles } from 'file:///C:/Users/Faizan%20Ali/.gemini/antigravity/brain/7d3c64eb-a002-4480-bc63-a582e7531ef4/scratch/new_articles.js'

function escapeSql(str) {
  if (str === null || str === undefined) return "''"
  return "'" + String(str).replace(/'/g, "''") + "'"
}

let sqlStatements = []

for (const item of newArticles) {
  const contentJson = JSON.stringify(item.content)
  
  const sql = `
INSERT INTO articles (
  slug, title, category_slug, organization, job_type, location,
  qualification, salary, experience, positions, last_date, no_deadline, publish_date,
  official_link, apply_link, is_verified, featured, logo_initial, featured_image,
  image_alt, excerpt, content, seo_title, meta_description, focus_keyword,
  canonical_url, og_title, og_description, status
) VALUES (
  ${escapeSql(item.slug)},
  ${escapeSql(item.title)},
  ${escapeSql(item.category)},
  ${escapeSql(item.organization)},
  ${escapeSql(item.jobType)},
  ${escapeSql(item.location)},
  ${escapeSql(item.qualification)},
  ${escapeSql(item.salary)},
  ${escapeSql(item.experience)},
  ${escapeSql(item.positions)},
  ${escapeSql(item.lastDate)},
  ${item.noDeadline ? 1 : 0},
  ${escapeSql(item.publishDate)},
  ${escapeSql(item.officialLink)},
  ${escapeSql(item.applyLink)},
  ${item.isVerified ? 1 : 0},
  ${item.featured ? 1 : 0},
  ${escapeSql(item.logoInitial)},
  ${escapeSql(item.featuredImage)},
  ${escapeSql(item.imageAlt)},
  ${escapeSql(item.excerpt)},
  ${escapeSql(contentJson)},
  ${escapeSql(item.seoTitle)},
  ${escapeSql(item.metaDescription)},
  ${escapeSql(item.focusKeyword)},
  ${escapeSql(item.canonicalUrl)},
  ${escapeSql(item.ogTitle)},
  ${escapeSql(item.ogDescription)},
  'published'
)
ON CONFLICT(slug) DO UPDATE SET
  title = excluded.title,
  category_slug = excluded.category_slug,
  organization = excluded.organization,
  job_type = excluded.job_type,
  location = excluded.location,
  qualification = excluded.qualification,
  salary = excluded.salary,
  experience = excluded.experience,
  positions = excluded.positions,
  last_date = excluded.last_date,
  no_deadline = excluded.no_deadline,
  publish_date = excluded.publish_date,
  official_link = excluded.official_link,
  apply_link = excluded.apply_link,
  is_verified = excluded.is_verified,
  featured = excluded.featured,
  logo_initial = excluded.logo_initial,
  featured_image = excluded.featured_image,
  image_alt = excluded.image_alt,
  excerpt = excluded.excerpt,
  content = excluded.content,
  seo_title = excluded.seo_title,
  meta_description = excluded.meta_description,
  focus_keyword = excluded.focus_keyword,
  canonical_url = excluded.canonical_url,
  og_title = excluded.og_title,
  og_description = excluded.og_description,
  status = excluded.status,
  updated_at = CURRENT_TIMESTAMP;
`
  sqlStatements.push(sql)
}

const outputPath = 'scratch/seed_remote.sql'
fs.writeFileSync(outputPath, sqlStatements.join('\n\n'), 'utf8')
console.log(`Generated ${outputPath} with ${newArticles.length} statements!`)
