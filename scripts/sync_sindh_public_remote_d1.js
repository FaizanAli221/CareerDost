import fs from 'fs'
import { sindhPublicArticles } from './save_sindh_public_drafts.js'

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

async function syncDrafts() {
  console.log('=== SYNCING 5 SINDH PUBLIC UPDATES DRAFTS TO REMOTE D1 ===\n')

  for (const item of sindhPublicArticles) {
    console.log(`Syncing draft to remote D1: ${item.slug}`)
    const contentJson = JSON.stringify(item.content)

    // Upsert into articles as 'draft'
    const sqlArt = `
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
        'draft', ?, ?, ?, ?, ?,
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
        status = 'draft',
        featured_image = excluded.featured_image,
        image_alt = excluded.image_alt,
        experience = excluded.experience,
        positions = excluded.positions,
        apply_link = excluded.apply_link,
        is_verified = excluded.is_verified,
        focus_keyword = excluded.focus_keyword,
        canonical_url = excluded.canonical_url,
        og_title = excluded.og_title,
        og_description = excluded.og_description
    `

    const paramsArt = [
      item.slug,
      item.title,
      item.category,
      item.organization,
      item.jobType,
      item.location,
      item.qualification,
      item.salary,
      item.lastDate,
      item.publishDate,
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
      item.isVerified ? 1 : 0,
      item.focusKeyword,
      item.canonicalUrl,
      item.ogTitle,
      item.ogDescription
    ]

    const resArt = await queryD1(sqlArt, paramsArt)
    console.log(`  ✓ articles table updated: changes = ${resArt.meta.changes}`)
  }

  console.log('\n--- VERIFYING DRAFTS ON REMOTE D1 ---')
  const verifyRes = await queryD1("SELECT id, slug, status, title FROM articles WHERE status = 'draft' ORDER BY id DESC LIMIT 10")
  console.log(JSON.stringify(verifyRes.results, null, 2))
  console.log('\nAll 5 Sindh public updates drafts successfully synced to remote Cloudflare D1!')
}

syncDrafts().catch(console.error)
