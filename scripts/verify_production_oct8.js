const slugs = [
  'sbbu-merit-list-2027',
  'ismo-jobs-2026',
  'nicvd-jobs-2026',
  'sindh-bs-nursing-admissions-2026-27',
  'szabist-scholarship-2026-27'
]

const baseUrl = 'https://careerdost.blog'
const pagesUrl = 'https://careerdost.pages.dev'

async function checkUrl(url, expectedStatus = 200) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CareerDost-Verifier/1.0' } })
    const ok = res.status === expectedStatus
    console.log(`${ok ? '✓' : '✗'} [${res.status}] ${url}`)
    return { ok, status: res.status }
  } catch (err) {
    console.log(`✗ [ERROR] ${url}: ${err.message}`)
    return { ok: false, error: err.message }
  }
}

async function verify() {
  console.log('=== VERIFYING PRODUCTION DEPLOYMENT FOR 8 OCTOBER 2026 ===\n')

  console.log('--- 1. Testing Live API Endpoints ---')
  try {
    const resArt = await fetch(`${pagesUrl}/api/articles?limit=5`)
    if (resArt.ok) {
      const data = await resArt.json()
      const topSlugs = (data.articles || data.data || []).slice(0, 5).map(a => `${a.id}: ${a.slug}`)
      console.log('Top 5 Articles from /api/articles:')
      console.log(topSlugs.join('\n'))
    } else {
      console.log(`Failed to fetch /api/articles: ${resArt.status}`)
    }
  } catch (e) {
    console.log('API Articles error:', e.message)
  }

  try {
    const resUpd = await fetch(`${pagesUrl}/api/daily-updates?limit=5`)
    if (resUpd.ok) {
      const data = await resUpd.json()
      const topSlugs = (data.dailyUpdates || data.updates || data.data || []).slice(0, 5).map(u => `${u.id}: ${u.slug}`)
      console.log('\nTop 5 Daily Updates from /api/daily-updates:')
      console.log(topSlugs.join('\n'))
    } else {
      console.log(`Failed to fetch /api/daily-updates: ${resUpd.status}`)
    }
  } catch (e) {
    console.log('API Daily Updates error:', e.message)
  }

  console.log('\n--- 2. Testing Live Article Pages ---')
  for (const s of slugs) {
    await checkUrl(`${baseUrl}/jobs/${s}`)
    await checkUrl(`${pagesUrl}/jobs/${s}`)
  }

  console.log('\n--- 3. Testing Live Daily Update Pages ---')
  for (const s of slugs) {
    await checkUrl(`${baseUrl}/daily-updates/${s}`)
    await checkUrl(`${pagesUrl}/daily-updates/${s}`)
  }

  console.log('\n--- 4. Testing Featured Images (JPG & SVG) ---')
  for (const s of slugs) {
    await checkUrl(`${pagesUrl}/images/${s}.jpg`)
    await checkUrl(`${pagesUrl}/images/${s}.svg`)
  }

  console.log('\n--- 5. Testing Sitemap & Robots.txt ---')
  await checkUrl(`${pagesUrl}/sitemap.xml`)
  await checkUrl(`${pagesUrl}/robots.txt`)

  const sitemapRes = await fetch(`${pagesUrl}/sitemap.xml`)
  if (sitemapRes.ok) {
    const text = await sitemapRes.text()
    console.log('\nSitemap Slug Verification:')
    for (const s of slugs) {
      const found = text.includes(s)
      console.log(`  ${found ? '✓' : '✗'} Contains ${s}`)
    }
  }

  console.log('\n=== VERIFICATION COMPLETE ===')
}

verify()
