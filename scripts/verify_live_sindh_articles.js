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
    console.log(`${ok ? '✓' : '✗'} [${res.status}] ${url}`)
    return { ok, status: res.status }
  } catch (err) {
    console.log(`✗ [ERROR] ${url}: ${err.message}`)
    return { ok: false, error: err.message }
  }
}

async function verify() {
  console.log('=== VERIFYING LIVE PRODUCTION DEPLOYMENT FOR SINDH PUBLIC UPDATES ===\n')

  console.log('--- 1. Testing Live API Endpoints ---')
  try {
    const resArt = await fetch(`${pagesUrl}/api/articles?latest=true&limit=10`)
    if (resArt.ok) {
      const data = await resArt.json()
      const topSlugs = (data.data || []).slice(0, 10).map(a => `${a.id}: ${a.slug} (${a.title})`)
      console.log('Top 10 Articles from /api/articles:')
      console.log(topSlugs.join('\n'))
    } else {
      console.log(`Failed to fetch /api/articles: ${resArt.status}`)
    }
  } catch (e) {
    console.log('API Articles error:', e.message)
  }

  try {
    const resUpd = await fetch(`${pagesUrl}/api/updates/latest?limit=10`)
    if (resUpd.ok) {
      const data = await resUpd.json()
      const topSlugs = (data.data || []).slice(0, 10).map(u => `${u.id}: ${u.slug} (${u.title})`)
      console.log('\nTop 10 Daily Updates from /api/updates/latest:')
      console.log(topSlugs.join('\n'))
    } else {
      console.log(`Failed to fetch /api/updates/latest: ${resUpd.status}`)
    }
  } catch (e) {
    console.log('API Daily Updates error:', e.message)
  }

  console.log('\n--- 2. Testing Live Article Pages on careerdost.blog ---')
  for (const s of slugs) {
    await checkUrl(`${baseUrl}/jobs/${s}`)
  }

  console.log('\n--- 3. Testing Featured Images (WebP & JPG) on careerdost.blog ---')
  for (const s of slugs) {
    await checkUrl(`${baseUrl}/images/${s}.webp`)
    await checkUrl(`${baseUrl}/images/${s}.jpg`)
  }

  console.log('\n--- 4. Checking Sitemap ---')
  await checkUrl(`${baseUrl}/sitemap.xml`)
}

verify().catch(console.error)
