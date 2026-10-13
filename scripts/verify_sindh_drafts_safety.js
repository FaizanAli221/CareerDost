import fs from 'fs'

const slugs = [
  'sindh-wheat-subsidy-benazir-hari-card-2026',
  'sindh-kisan-subsidy-2026-eligibility-payments',
  'sindh-minimum-wage-2026-workers-salary',
  'bisp-8171-payment-check-2026-official-guide',
  'sindh-job-portal-2026-junior-clerk-jobs'
]

const baseUrl = 'https://careerdost.blog'
const pagesUrl = 'https://careerdost.pages.dev'

async function checkUrl(url, expectedStatus = 200) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CareerDost-Verifier/1.0' } })
    const ok = res.status === expectedStatus
    console.log(`${ok ? '✓' : '✗'} [${res.status}] (Expected ${expectedStatus}) ${url}`)
    return { ok, status: res.status }
  } catch (err) {
    console.log(`✗ [ERROR] ${url}: ${err.message}`)
    return { ok: false, error: err.message }
  }
}

async function verify() {
  console.log('=== VERIFYING SINDH DRAFTS & DEPLOYMENT SAFETY ===\n')

  console.log('--- 1. Verifying Drafts Are NOT Exposed on Public Article Endpoints (Expected 404) ---')
  for (const s of slugs) {
    await checkUrl(`${pagesUrl}/api/articles/${s}`, 404)
  }

  console.log('\n--- 2. Verifying Drafts Are NOT in Public Latest Articles API ---')
  const resArt = await fetch(`${pagesUrl}/api/articles?latest=true&limit=20`)
  if (resArt.ok) {
    const data = await resArt.json()
    const returnedSlugs = (data.data || []).map(a => a.slug)
    for (const s of slugs) {
      const leaked = returnedSlugs.includes(s)
      console.log(`${!leaked ? '✓' : '✗'} ${s} in /api/articles: ${leaked ? 'LEAKED' : 'SAFE (Not published)'}`)
    }
  }

  console.log('\n--- 3. Verifying Drafts Are NOT in Daily Updates Ticker ---')
  const resUpd = await fetch(`${pagesUrl}/api/updates/latest?limit=20`)
  if (resUpd.ok) {
    const data = await resUpd.json()
    const returnedUpdSlugs = (data.data || []).map(u => u.slug)
    for (const s of slugs) {
      const leaked = returnedUpdSlugs.includes(s)
      console.log(`${!leaked ? '✓' : '✗'} ${s} in /api/updates: ${leaked ? 'LEAKED' : 'SAFE (Not published)'}`)
    }
  }

  console.log('\n--- 4. Verifying Images Are Live on CDN (HTTP 200) ---')
  for (const s of slugs) {
    await checkUrl(`${baseUrl}/images/${s}.webp`, 200)
    await checkUrl(`${baseUrl}/images/${s}.jpg`, 200)
  }

  console.log('\n--- 5. Verifying Sitemap Does NOT Contain Any Drafts ---')
  const resSite = await fetch(`${baseUrl}/sitemap.xml`)
  if (resSite.ok) {
    const sitemapXml = await resSite.text()
    for (const s of slugs) {
      const inSitemap = sitemapXml.includes(s)
      console.log(`${!inSitemap ? '✓' : '✗'} ${s} in sitemap: ${inSitemap ? 'LEAKED' : 'SAFE (Excluded)'}`)
    }
  }

  console.log('\nAll Drafts Safety and Production Checks Completed!')
}

verify().catch(console.error)
