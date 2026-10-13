import fs from 'fs'
import path from 'path'
import Database from 'better-sqlite3'
import { sindhPublicArticles } from './save_sindh_public_drafts.js'

const db = new Database('careerdost.sqlite')

const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml'
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query'

async function refreshToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8')
  const rt = toml.match(/refresh_token\s*=\s*"([^"]+)"/)[1]
  console.log('Refreshing Cloudflare OAuth token...')
  const res = await fetch('https://dash.cloudflare.com/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: '54d11594-84e4-41aa-b438-e81b8fa78ee7',
      refresh_token: rt
    })
  })
  const data = await res.json()
  if (data.access_token) {
    const newExpiration = new Date(Date.now() + (data.expires_in || 3600) * 1000).toISOString()
    let updatedToml = toml.replace(/oauth_token\s*=\s*"[^"]+"/, `oauth_token = "${data.access_token}"`)
    updatedToml = updatedToml.replace(/expiration_time\s*=\s*"[^"]+"/, `expiration_time = "${newExpiration}"`)
    if (data.refresh_token) {
      updatedToml = updatedToml.replace(/refresh_token\s*=\s*"[^"]+"/, `refresh_token = "${data.refresh_token}"`)
    }
    fs.writeFileSync(tomlPath, updatedToml, 'utf8')
    console.log('Successfully refreshed token. Expires:', newExpiration)
    return data.access_token
  }
  throw new Error(`Failed to refresh token: ${JSON.stringify(data)}`)
}

function getToken() {
  const toml = fs.readFileSync(tomlPath, 'utf8')
  const tokenMatch = toml.match(/oauth_token\s*=\s*"([^"]+)"/)
  return tokenMatch ? tokenMatch[1] : null
}

async function queryD1(sql, params = []) {
  let token = getToken()
  let res = await fetch(d1QueryUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  })

  let json = await res.json()
  if (!json.success && json.errors && json.errors.some(e => e.code === 10000)) {
    console.log('Token expired or unauthorized. Refreshing...')
    token = await refreshToken()
    console.log('Waiting 3s for token propagation...')
    await new Promise(r => setTimeout(r, 3000))
    res = await fetch(d1QueryUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, params })
    })
    json = await res.json()
  }

  if (!json.success) {
    throw new Error(`D1 Query Error: ${JSON.stringify(json.errors)}`)
  }
  return json.result[0]
}

const catMap = {
  'government-schemes': 'Government Schemes',
  'government-jobs': 'Government Jobs',
  scholarships: 'Scholarships',
  admissions: 'Admissions',
  internships: 'Internships',
  results: 'Results',
  'private-jobs': 'Private Jobs'
}

async function publishAll() {
  console.log('=== PUBLISHING 5 SINDH PUBLIC UPDATES ARTICLES ===\n')

  // 1. Update Local SQLite to 'published'
  console.log('--- 1. Updating Local SQLite ---')
  const stmtArtLocal = db.prepare(`
    UPDATE articles SET
      status = 'published',
      publish_date = '2026-10-12'
    WHERE slug = ?
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
      ?, ?, ?, ?, '2026-10-12',
      ?, ?, ?, ?, ?,
      ?, ?, 0, ?, ?, ?,
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
      publish_date = '2026-10-12',
      organization = excluded.organization,
      location = excluded.location,
      qualification = excluded.qualification,
      experience = excluded.experience,
      positions = excluded.positions,
      job_type = excluded.job_type,
      salary = excluded.salary,
      is_verified = 0,
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

  for (const item of sindhPublicArticles) {
    stmtArtLocal.run(item.slug)
    const catLabel = catMap[item.category] || 'Schemes'
    const contentJson = JSON.stringify(item.content)

    stmtDaily.run(
      item.slug, item.title, catLabel, item.excerpt, contentJson, item.featuredImage,
      item.imageAlt, item.officialLink, item.applyLink, item.lastDate,
      item.organization, item.location, item.qualification, item.experience, item.positions,
      item.jobType, item.salary, item.featured ? 1 : 0, item.seoTitle, item.metaDescription,
      item.focusKeyword, item.canonicalUrl, item.ogTitle, item.ogDescription
    )
    console.log(`✓ Local SQLite published: ${item.slug}`)
  }

  // Priority IDs for the 5 articles
  const artPriorityIds = [355, 354, 353, 352, 351]
  const updPriorityIds = [250, 249, 248, 247, 246]

  for (let i = 0; i < sindhPublicArticles.length; i++) {
    const slug = sindhPublicArticles[i].slug
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(9300 + i, slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(9300 + i, slug)
  }

  for (let i = 0; i < sindhPublicArticles.length; i++) {
    const slug = sindhPublicArticles[i].slug
    db.prepare('UPDATE articles SET id = ? WHERE slug = ?').run(artPriorityIds[i], slug)
    db.prepare('UPDATE daily_updates SET id = ? WHERE slug = ?').run(updPriorityIds[i], slug)
  }
  console.log('✓ Priority IDs set in local SQLite')

  // 2. Prepend to src/data/listings.js
  console.log('\n--- 2. Updating src/data/listings.js ---')
  const listingsPath = path.resolve('src/data/listings.js')
  let listingsCode = fs.readFileSync(listingsPath, 'utf8')

  const formattedForListings = sindhPublicArticles.map(a => ({
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
    isVerified: false,
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
    schemaType: 'Article',
    content: a.content
  }))

  for (const item of sindhPublicArticles) {
    const slugRegex = new RegExp(`\\s*\\{[^\\}]*?"slug":\\s*"${item.slug}"[\\s\\S]*?\\n  \\},?`, 'g')
    listingsCode = listingsCode.replace(slugRegex, '')
  }

  const jsonSnippet = formattedForListings.map(item => `  ${JSON.stringify(item, null, 2).replace(/\n/g, '\n  ')},\n`).join('')
  listingsCode = listingsCode.replace('export const listings = [\n', `export const listings = [\n${jsonSnippet}`)
  fs.writeFileSync(listingsPath, listingsCode, 'utf8')
  console.log('✓ Successfully updated src/data/listings.js')

  // 3. Update scripts/generate_sitemap.js
  console.log('\n--- 3. Updating scripts/generate_sitemap.js ---')
  const sitemapScriptPath = path.resolve('scripts/generate_sitemap.js')
  let sitemapScript = fs.readFileSync(sitemapScriptPath, 'utf8')

  const sitemapEntries = sindhPublicArticles.map(a => `  { slug: '${a.slug}', date: '2026-10-12' },\n`).join('')
  for (const item of sindhPublicArticles) {
    const reg = new RegExp(`\\s*\\{\\s*slug:\\s*'${item.slug}',[\\s\\S]*?\\},?`, 'g')
    sitemapScript = sitemapScript.replace(reg, '')
  }
  sitemapScript = sitemapScript.replace(
    'const publishedDailyUpdates = [\n',
    `const publishedDailyUpdates = [\n${sitemapEntries}`
  )
  fs.writeFileSync(sitemapScriptPath, sitemapScript, 'utf8')
  console.log('✓ Successfully updated scripts/generate_sitemap.js')

  // 4. Update Remote Cloudflare D1
  console.log('\n--- 4. Updating Remote Cloudflare D1 ---')
  for (let i = 0; i < sindhPublicArticles.length; i++) {
    const item = sindhPublicArticles[i]
    const artId = artPriorityIds[i]
    const updId = updPriorityIds[i]
    const contentJson = JSON.stringify(item.content)
    const catLabel = catMap[item.category] || 'Schemes'

    // Update articles table
    const sqlArt = `
      INSERT INTO articles (
        id, slug, title, category_slug, organization, job_type, location,
        qualification, salary, last_date, publish_date, official_link,
        featured, logo_initial, excerpt, content, seo_title, meta_description,
        status, featured_image, image_alt, experience, positions, apply_link,
        is_verified, focus_keyword, canonical_url, og_title, og_description
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, '2026-10-12', ?,
        ?, ?, ?, ?, ?, ?,
        'published', ?, ?, ?, ?, ?,
        0, ?, ?, ?, ?
      )
      ON CONFLICT(slug) DO UPDATE SET
        id = excluded.id,
        title = excluded.title,
        category_slug = excluded.category_slug,
        organization = excluded.organization,
        job_type = excluded.job_type,
        location = excluded.location,
        qualification = excluded.qualification,
        salary = excluded.salary,
        last_date = excluded.last_date,
        publish_date = '2026-10-12',
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
        is_verified = 0,
        focus_keyword = excluded.focus_keyword,
        canonical_url = excluded.canonical_url,
        og_title = excluded.og_title,
        og_description = excluded.og_description;
    `

    const paramsArt = [
      artId,
      item.slug,
      item.title,
      item.category,
      item.organization,
      item.jobType,
      item.location,
      item.qualification,
      item.salary,
      item.lastDate,
      item.officialLink,
      item.featured ? 1 : 0,
      item.logoInitial,
      item.excerpt,
      contentJson,
      item.seoTitle,
      item.metaDescription,
      item.featuredImage,
      item.imageAlt,
      item.experience,
      item.positions,
      item.applyLink,
      item.focusKeyword,
      item.canonicalUrl,
      item.ogTitle,
      item.ogDescription
    ]

    await queryD1(sqlArt, paramsArt)
    console.log(`  ✓ Remote D1 articles updated [ID ${artId}]: ${item.slug}`)

    // Update daily_updates table
    const sqlUpd = `
      INSERT INTO daily_updates (
        id, slug, title, category, short_description, content, featured_image,
        image_alt, official_link, apply_link, deadline, publish_date,
        organization, location, qualification, experience, positions,
        job_type, salary, is_verified, featured, seo_title, meta_description,
        focus_keyword, canonical_url, og_title, og_description, status
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, '2026-10-12',
        ?, ?, ?, ?, ?,
        ?, ?, 0, ?, ?, ?,
        ?, ?, ?, ?, 'published'
      )
      ON CONFLICT(slug) DO UPDATE SET
        id = excluded.id,
        title = excluded.title,
        category = excluded.category,
        short_description = excluded.short_description,
        content = excluded.content,
        featured_image = excluded.featured_image,
        image_alt = excluded.image_alt,
        official_link = excluded.official_link,
        apply_link = excluded.apply_link,
        deadline = excluded.deadline,
        publish_date = '2026-10-12',
        organization = excluded.organization,
        location = excluded.location,
        qualification = excluded.qualification,
        experience = excluded.experience,
        positions = excluded.positions,
        job_type = excluded.job_type,
        salary = excluded.salary,
        is_verified = 0,
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

    const paramsUpd = [
      updId,
      item.slug,
      item.title,
      catLabel,
      item.excerpt,
      contentJson,
      item.featuredImage,
      item.imageAlt,
      item.officialLink,
      item.applyLink,
      item.lastDate,
      item.organization,
      item.location,
      item.qualification,
      item.experience,
      item.positions,
      item.jobType,
      item.salary,
      item.featured ? 1 : 0,
      item.seoTitle,
      item.metaDescription,
      item.focusKeyword,
      item.canonicalUrl,
      item.ogTitle,
      item.ogDescription
    ]

    await queryD1(sqlUpd, paramsUpd)
    console.log(`  ✓ Remote D1 daily_updates updated [ID ${updId}]: ${item.slug}`)
  }

  console.log('\nAll 5 Sindh public updates articles published and synced to Remote D1!')
}

publishAll().catch(console.error)
