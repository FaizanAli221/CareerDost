import fs from 'fs'
import { newArticles } from 'file:///C:/Users/Faizan%20Ali/.gemini/antigravity/brain/7d3c64eb-a002-4480-bc63-a582e7531ef4/scratch/new_articles.js'

function escapeSql(str) {
  if (str === null || str === undefined) return "''"
  return "'" + String(str).replace(/'/g, "''") + "'"
}

const categoryMap = {
  'internships': 'Internships',
  'admissions': 'Admissions',
  'scholarships': 'Scholarships'
}

let sqlStatements = []

for (const item of newArticles) {
  const contentJson = JSON.stringify(item.content)
  const cat = categoryMap[item.category] || 'Latest Jobs'

  const sql = `
INSERT INTO daily_updates (
  slug, title, category, short_description, content, featured_image,
  image_alt, official_link, apply_link, deadline, publish_date, organization,
  location, qualification, experience, positions, job_type, salary, is_verified,
  featured, seo_title, meta_description, focus_keyword, canonical_url, og_title,
  og_description, status
) VALUES (
  ${escapeSql(item.slug)},
  ${escapeSql(item.title)},
  ${escapeSql(cat)},
  ${escapeSql(item.excerpt)},
  ${escapeSql(contentJson)},
  ${escapeSql(item.featuredImage)},
  ${escapeSql(item.imageAlt)},
  ${escapeSql(item.officialLink)},
  ${escapeSql(item.applyLink)},
  ${escapeSql(item.lastDate)},
  ${escapeSql(item.publishDate)},
  ${escapeSql(item.organization)},
  ${escapeSql(item.location)},
  ${escapeSql(item.qualification)},
  ${escapeSql(item.experience)},
  ${escapeSql(item.positions)},
  ${escapeSql(item.jobType)},
  ${escapeSql(item.salary)},
  ${item.isVerified ? 1 : 0},
  ${item.featured ? 1 : 0},
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
  status = excluded.status,
  updated_at = CURRENT_TIMESTAMP;
`
  sqlStatements.push(sql)
}

fs.writeFileSync('scratch/seed_updates_remote.sql', sqlStatements.join('\n\n'), 'utf8')
console.log('Generated scratch/seed_updates_remote.sql successfully!')
