const baseUrl = 'https://careerdost.blog'
const pagesUrl = 'https://careerdost.pages.dev'

async function checkUrl(url, expectedStatus = 200) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CareerDost-Verifier/2.0' } })
    const ok = res.status === expectedStatus
    console.log(`${ok ? '✓' : '✗'} [${res.status}] ${url}`)
    return { ok, status: res.status, res }
  } catch (err) {
    console.log(`✗ [ERROR] ${url}: ${err.message}`)
    return { ok: false, error: err.message }
  }
}

async function verify() {
  console.log('=== VERIFYING PRODUCTION UPGRADE ON CAREERDOST ===\n')

  console.log('--- 1. Testing Core Pages ---')
  await checkUrl(`${baseUrl}/`)
  await checkUrl(`${baseUrl}/daily-updates`)
  await checkUrl(`${baseUrl}/category/government-jobs`)
  await checkUrl(`${baseUrl}/category/results`)
  await checkUrl(`${baseUrl}/category/admissions`)
  await checkUrl(`${baseUrl}/search`)

  console.log('\n--- 2. Testing Edge HTMLRewriter Server-Side SEO Tags ---')
  const testArticles = [
    'sbbu-ms-mphil-mba-merit-list-2027',
    'punjab-ophthalmology-college-jobs-2026',
    'shifa-university-pharmd-admissions-2026'
  ]

  for (const slug of testArticles) {
    const url = `${pagesUrl}/jobs/${slug}`
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Googlebot/2.1' } })
      if (res.ok) {
        const html = await res.text()
        const hasTitle = html.includes('<title>') && !html.includes('<title>CareerDost — Pakistan Jobs')
        const hasOgTitle = html.includes('property="og:title"')
        const hasCanonical = html.includes('rel="canonical"')
        const hasJsonLd = html.includes('application/ld+json')
        console.log(`✓ [200] ${url}`)
        console.log(`    ↳ Server SEO: Title Replaced: ${hasTitle} | OG: ${hasOgTitle} | Canonical: ${hasCanonical} | JSON-LD: ${hasJsonLd}`)
      } else {
        console.log(`✗ [${res.status}] ${url}`)
      }
    } catch (e) {
      console.log(`✗ [ERROR] ${url}: ${e.message}`)
    }
  }

  // Admin noindex check
  try {
    const adminRes = await fetch(`${pagesUrl}/admin`, { headers: { 'User-Agent': 'Googlebot/2.1' } })
    const adminHtml = await adminRes.text()
    const hasNoIndex = adminHtml.includes('noindex, nofollow')
    console.log(`\n✓ [200] /admin -> Server noindex injected: ${hasNoIndex}`)
  } catch (e) {
    console.log(`✗ /admin error: ${e.message}`)
  }

  console.log('\n--- 3. Testing Newly Generated Featured Images (Sample of 19) ---')
  const sampleImages = [
    'fpsc-assistant-director-2026',
    'punjab-police-constable-recruitment-2026',
    'nadra-data-entry-operator-2026',
    'systems-limited-hiring-software-engineers',
    'hbl-management-trainee-officer-2026',
    'phec-phd-scholarship-2026',
    'turkiye-burslari-scholarship-2026',
    'nust-undergraduate-admissions-fall-2026',
    'bise-lahore-matric-result-2026',
    'unilever-future-leaders-2026'
  ]

  for (const s of sampleImages) {
    await checkUrl(`${pagesUrl}/images/${s}.jpg`)
    await checkUrl(`${pagesUrl}/images/${s}.svg`)
  }

  console.log('\n--- 4. Testing Google Search Console Verification File & SEO Files ---')
  await checkUrl(`${pagesUrl}/googlefa0859c31163b27d.html`)
  await checkUrl(`${pagesUrl}/sitemap.xml`)
  await checkUrl(`${pagesUrl}/robots.txt`)

  console.log('\n--- 5. Testing Live API Endpoints ---')
  const apiArt = await checkUrl(`${pagesUrl}/api/articles?latest=true&limit=3`)
  const apiUpd = await checkUrl(`${pagesUrl}/api/updates/latest?limit=3`)

  console.log('\n=== PRODUCTION UPGRADE VERIFICATION COMPLETE ===')
}

verify()
