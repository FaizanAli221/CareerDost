import fs from 'fs'
import Database from 'better-sqlite3'
import { editorialPackages } from './save_sindh_first_editorial_packages.js'

const db = new Database('careerdost.sqlite')
const tomlPath = 'C:/Users/Faizan Ali/AppData/Roaming/xdg.config/.wrangler/config/default.toml'
const d1QueryUrl = 'https://api.cloudflare.com/client/v4/accounts/36d1bda226661368340bc17dc3808ae3/d1/database/defc3a6a-54b0-42e9-a36e-f1f6b1125d94/query'

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

async function syncRemote() {
  console.log('=== SYNCING EDITORIAL PACKAGES TO REMOTE CLOUDFLARE D1 ===\n')

  // 1. SPSC - Update image on remote D1 (Duplicate avoided)
  console.log('1. SPSC Advertisement 05/2026: Updating remote featured image...')
  await queryD1(
    "UPDATE articles SET featured_image = ?, image_alt = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?",
    [
      '/images/spsc-jobs-2026-54-vacancies.webp',
      'SPSC Jobs 2026 54 Sindh Government Vacancies Consolidated Advertisement 05/2026 CareerDost',
      'spsc-jobs-2026-54-vacancies'
    ]
  )
  try {
    await queryD1(
      "UPDATE daily_updates SET featured_image = ?, image_alt = ?, updated_at = CURRENT_TIMESTAMP WHERE slug = ?",
      [
        '/images/spsc-jobs-2026-54-vacancies.webp',
        'SPSC Jobs 2026 54 Sindh Government Vacancies Consolidated Advertisement 05/2026 CareerDost',
        'spsc-jobs-2026-54-vacancies'
      ]
    )
  } catch {}
  console.log('   ✓ Remote SPSC image updated to WebP')

  // 2. PM Fuel Relief - Update existing article on remote D1
  console.log('\n2. PM Fuel Relief: Updating remote article with 9 Oct progress metrics...')
  const f = editorialPackages.fuelRelief
  const contentJsonF = JSON.stringify(f.content)
  await queryD1(`
    UPDATE articles SET
      title = ?,
      excerpt = ?,
      content = ?,
      seo_title = ?,
      meta_description = ?,
      featured_image = ?,
      image_alt = ?,
      positions = ?,
      canonical_url = ?,
      og_title = ?,
      og_description = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE slug = ?
  `, [
    f.title, f.excerpt, contentJsonF, f.seo_title, f.meta_description,
    f.featured_image, f.image_alt, f.positions, f.canonical_url,
    f.og_title, f.og_description, f.slug
  ])
  try {
    await queryD1(`
      UPDATE daily_updates SET
        title = ?,
        short_description = ?,
        content = ?,
        seo_title = ?,
        meta_description = ?,
        featured_image = ?,
        image_alt = ?,
        positions = ?,
        canonical_url = ?,
        og_title = ?,
        og_description = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `, [
      f.title, f.excerpt, contentJsonF, f.seo_title, f.meta_description,
      f.featured_image, f.image_alt, f.positions, f.canonical_url,
      f.og_title, f.og_description, f.slug
    ])
  } catch {}
  console.log('   ✓ Remote PM Fuel Relief article updated')

  // 3. Sindh Minimum Wage - Update existing article on remote D1
  console.log('\n3. Sindh Minimum Wage: Updating remote article with 12 Oct official posting...')
  const w = editorialPackages.wage
  const contentJsonW = JSON.stringify(w.content)
  await queryD1(`
    UPDATE articles SET
      title = ?,
      excerpt = ?,
      content = ?,
      seo_title = ?,
      meta_description = ?,
      featured_image = ?,
      image_alt = ?,
      positions = ?,
      salary = ?,
      canonical_url = ?,
      og_title = ?,
      og_description = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE slug = ?
  `, [
    w.title, w.excerpt, contentJsonW, w.seo_title, w.meta_description,
    w.featured_image, w.image_alt, w.positions, w.salary, w.canonical_url,
    w.og_title, w.og_description, w.slug
  ])
  try {
    await queryD1(`
      UPDATE daily_updates SET
        title = ?,
        short_description = ?,
        content = ?,
        seo_title = ?,
        meta_description = ?,
        featured_image = ?,
        image_alt = ?,
        positions = ?,
        salary = ?,
        canonical_url = ?,
        og_title = ?,
        og_description = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `, [
      w.title, w.excerpt, contentJsonW, w.seo_title, w.meta_description,
      w.featured_image, w.image_alt, w.positions, w.salary, w.canonical_url,
      w.og_title, w.og_description, w.slug
    ])
  } catch {}
  console.log('   ✓ Remote Sindh Minimum Wage article updated')

  // 4. DRAP - Save as DRAFT on remote D1
  console.log('\n4. DRAP Medicine Barcode: Saving as DRAFT on remote D1...')
  const d = editorialPackages.drap
  const contentJsonD = JSON.stringify(d.content)
  const catLabelD = catMap[d.category_slug] || 'Government Schemes'

  await queryD1(`
    INSERT INTO articles (
      slug, title, category_slug, organization, job_type, location,
      qualification, salary, last_date, publish_date, official_link,
      featured, logo_initial, excerpt, content, seo_title, meta_description,
      status, featured_image, image_alt, experience, positions, apply_link,
      is_verified, focus_keyword, canonical_url, og_title, og_description,
      no_deadline
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      'draft', ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      content = excluded.content,
      status = 'draft',
      featured_image = excluded.featured_image,
      image_alt = excluded.image_alt,
      updated_at = CURRENT_TIMESTAMP;
  `, [
    d.slug, d.title, d.category_slug, d.organization, d.job_type, d.location,
    d.qualification, d.salary, d.last_date, d.publish_date, d.official_link,
    d.featured ? 1 : 0, d.logo_initial, d.excerpt, contentJsonD, d.seo_title,
    d.meta_description, d.featured_image, d.image_alt, d.experience, d.positions,
    d.apply_link, d.is_verified ? 1 : 0, d.focus_keyword, d.canonical_url,
    d.og_title, d.og_description, d.no_deadline
  ])

  try {
    await queryD1(`
      INSERT INTO daily_updates (
        slug, title, category, short_description, content, featured_image,
        image_alt, official_link, apply_link, deadline, publish_date,
        organization, location, qualification, experience, positions,
        job_type, salary, is_verified, featured, seo_title, meta_description,
        focus_keyword, canonical_url, og_title, og_description, status,
        no_deadline
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, 'draft', ?
      )
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        content = excluded.content,
        status = 'draft',
        featured_image = excluded.featured_image,
        image_alt = excluded.image_alt,
        updated_at = CURRENT_TIMESTAMP;
    `, [
      d.slug, d.title, catLabelD, d.excerpt, contentJsonD, d.featured_image,
      d.image_alt, d.official_link, d.apply_link, d.last_date, d.publish_date,
      d.organization, d.location, d.qualification, d.experience, d.positions,
      d.job_type, d.salary, d.is_verified ? 1 : 0, d.featured ? 1 : 0,
      d.seo_title, d.meta_description, d.focus_keyword, d.canonical_url,
      d.og_title, d.og_description, d.no_deadline
    ])
  } catch {}
  console.log('   ✓ Remote DRAP draft saved')

  // 5. Hyderabad Division Section 144 - Save as DRAFT on remote D1 (EDITORIAL HOLD)
  console.log('\n5. Hyderabad Section 144: Saving as DRAFT on remote D1 (EDITORIAL HOLD)...')
  const h = editorialPackages.hyderabad
  const contentJsonH = JSON.stringify(h.content)
  const catLabelH = catMap[h.category_slug] || 'Government Schemes'

  await queryD1(`
    INSERT INTO articles (
      slug, title, category_slug, organization, job_type, location,
      qualification, salary, last_date, publish_date, official_link,
      featured, logo_initial, excerpt, content, seo_title, meta_description,
      status, featured_image, image_alt, experience, positions, apply_link,
      is_verified, focus_keyword, canonical_url, og_title, og_description,
      no_deadline
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      'draft', ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?
    )
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      content = excluded.content,
      status = 'draft',
      featured_image = excluded.featured_image,
      image_alt = excluded.image_alt,
      updated_at = CURRENT_TIMESTAMP;
  `, [
    h.slug, h.title, h.category_slug, h.organization, h.job_type, h.location,
    h.qualification, h.salary, h.last_date, h.publish_date, h.official_link,
    h.featured ? 1 : 0, h.logo_initial, h.excerpt, contentJsonH, h.seo_title,
    h.meta_description, h.featured_image, h.image_alt, h.experience, h.positions,
    h.apply_link, h.is_verified ? 1 : 0, h.focus_keyword, h.canonical_url,
    h.og_title, h.og_description, h.no_deadline
  ])

  try {
    await queryD1(`
      INSERT INTO daily_updates (
        slug, title, category, short_description, content, featured_image,
        image_alt, official_link, apply_link, deadline, publish_date,
        organization, location, qualification, experience, positions,
        job_type, salary, is_verified, featured, seo_title, meta_description,
        focus_keyword, canonical_url, og_title, og_description, status,
        no_deadline
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, 'draft', ?
      )
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        content = excluded.content,
        status = 'draft',
        featured_image = excluded.featured_image,
        image_alt = excluded.image_alt,
        updated_at = CURRENT_TIMESTAMP;
    `, [
      h.slug, h.title, catLabelH, h.excerpt, contentJsonH, h.featured_image,
      h.image_alt, h.official_link, h.apply_link, h.last_date, h.publish_date,
      h.organization, h.location, h.qualification, h.experience, h.positions,
      h.job_type, h.salary, h.is_verified ? 1 : 0, h.featured ? 1 : 0,
      h.seo_title, h.meta_description, h.focus_keyword, h.canonical_url,
      h.og_title, h.og_description, h.no_deadline
    ])
  } catch {}
  console.log('   ✓ Remote Hyderabad Section 144 draft saved')

  console.log('\n=== VERIFYING REMOTE D1 STATUS ===')
  const slugs = [
    'spsc-jobs-2026-54-vacancies',
    'pm-fuel-relief-scheme-2026-registration-eligibility',
    'drap-medicine-barcode-requirements-2026',
    'sindh-minimum-wage-2026-workers-salary',
    'hyderabad-division-section-144-notification-2026'
  ]
  const rows = await queryD1(
    `SELECT id, slug, status, title, featured_image FROM articles WHERE slug IN (?, ?, ?, ?, ?)`,
    slugs
  )
  for (const r of rows.results) {
    console.log(`  [Remote D1] (${r.status.toUpperCase()}) ${r.slug}: "${r.title}"`)
    console.log(`              Image: ${r.featured_image}`)
  }
}

syncRemote().catch(console.error)
