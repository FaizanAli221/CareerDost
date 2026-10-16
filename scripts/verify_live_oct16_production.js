const BASE_URL = 'https://careerdost.blog'

const testArticles = [
  {
    slug: 'electricity-bills-november-2026-rs256-fuel-adjustment-explained',
    title: 'Electricity Bills November 2026: Rs2.56 Per Unit Fuel Adjustment Explained',
    seoTitle: 'Electricity Bills November 2026: Rs2.56/Unit Fuel Adjustment Explained',
    image: 'electricity-bills-november-2026-rs256-fuel-adjustment-explained'
  }
]

async function verifyLiveProduction() {
  console.log(`=== VERIFYING LIVE PRODUCTION DEPLOYMENT AT ${BASE_URL} ===\n`)

  let passCount = 0
  let failCount = 0

  function assert(cond, msg) {
    if (cond) {
      console.log(`  ✓ PASS: ${msg}`)
      passCount++
    } else {
      console.error(`  ✗ FAIL: ${msg}`)
      failCount++
    }
  }

  async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        return await fetch(url, options)
      } catch (err) {
        if (i === retries - 1) throw err
        await new Promise(r => setTimeout(r, 1500 * (i + 1)))
      }
    }
  }

  // 1. Live Article Pages Verification
  console.log('--- 1. Live Article URL, SEO Metadata, Canonical & Security Headers ---')
  for (const art of testArticles) {
    const pageUrl = `${BASE_URL}/jobs/${art.slug}`
    try {
      const res = await fetchWithRetry(pageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CareerDost-Live-Verifier/1.0' }
      })
      assert(res.status === 200, `[${res.status}] Article HTTP 200: ${pageUrl}`)

      const html = await res.text()
      assert(html.length > 2000, `HTML body returned substantial length (${html.length} chars)`)

      const hasH1 = html.includes(art.title) || html.includes('<h1')
      assert(hasH1, `H1 heading is rendered into document`)

      const hasCanonical = html.includes(`href="${pageUrl}"`) || html.includes(`href='${pageUrl}'`)
      assert(hasCanonical, `Canonical URL link tag matches: ${pageUrl}`)

      const hasMetaDesc = html.includes('Rs2.56/unit') || html.includes('meta name="description"')
      assert(hasMetaDesc, `SEO Meta Description is present in SSR HTML`)

      const hasSchema = html.includes('application/ld+json')
      assert(hasSchema, `Schema.org JSON-LD structured data is present`)

      const csp = res.headers.get('content-security-policy')
      const xfo = res.headers.get('x-frame-options')
      const xcto = res.headers.get('x-content-type-options')
      assert(xfo !== null || csp !== null || xcto !== null, `Security headers present (X-Frame-Options/CSP/X-Content-Type-Options)`)
    } catch (e) {
      assert(false, `Error fetching ${pageUrl}: ${e.message}`)
    }
  }

  // 2. Featured Images Verification
  console.log('\n--- 2. Live Featured Images (WebP & JPG) ---')
  for (const art of testArticles) {
    for (const ext of ['webp', 'jpg']) {
      const imgUrl = `${BASE_URL}/images/${art.image}.${ext}`
      try {
        const res = await fetch(imgUrl, { method: 'HEAD' })
        const contentType = res.headers.get('content-type') || ''
        assert(res.status === 200, `[${res.status}] Image ${ext.toUpperCase()}: ${imgUrl}`)
        assert(contentType.includes('image'), `Content-Type is image/* (${contentType})`)
      } catch (e) {
        assert(false, `Error fetching image ${imgUrl}: ${e.message}`)
      }
    }
  }

  // 3. Live Sitemap Verification
  console.log('\n--- 3. Live Sitemap Entries ---')
  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`)
    assert(sitemapRes.status === 200, `[${sitemapRes.status}] Sitemap HTTP 200`)
    const sitemapText = await sitemapRes.text()
    for (const art of testArticles) {
      const inSitemap = sitemapText.includes(art.slug)
      assert(inSitemap, `Slug '${art.slug}' is present in live sitemap.xml`)
    }
  } catch (e) {
    assert(false, `Error fetching sitemap: ${e.message}`)
  }

  // 4. Daily Updates Route Alias & Direct URL Loading
  console.log('\n--- 4. Direct Daily Updates URL Reload ---')
  for (const art of testArticles) {
    const dailyUrl = `${BASE_URL}/daily-updates/${art.slug}`
    try {
      const res = await fetch(dailyUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CareerDost-Live-Verifier/1.0' }
      })
      assert(res.status === 200, `[${res.status}] Daily update route loads HTTP 200: ${dailyUrl}`)
    } catch (e) {
      assert(false, `Error fetching daily update URL ${dailyUrl}: ${e.message}`)
    }
  }

  // 5. Internal Links & Existing Sindh Content Verification
  console.log('\n--- 5. Internal Links & Existing Sindh Articles Live HTTP 200 ---')
  const internalSlugs = [
    'sindh-solar-energy-project-ssep-home-solar-systems-subsidy-2026',
    'sbp-housing-solar-financing-rules-circular-06-2026',
    'pm-fuel-relief-scheme-2026-registration-eligibility',
    'sindh-wheat-subsidy-benazir-hari-card-2026',
    'bisp-8171-payment-check-2026-official-guide',
    'sindh-mamta-programme-2026-october-dashboard'
  ]
  for (const slug of internalSlugs) {
    const url = `${BASE_URL}/jobs/${slug}`
    const res = await fetchWithRetry(url, { method: 'HEAD' })
    assert(res.status === 200, `[${res.status}] Internal link & Sindh article live: ${url}`)
  }

  // 6. 404 Protection & Draft Exclusion
  console.log('\n--- 6. 404 Protection & Security Verification ---')
  try {
    const nonExistentUrl = `${BASE_URL}/jobs/non-existent-fake-article-test-12345`
    const res = await fetch(nonExistentUrl)
    assert(res.status === 404, `[${res.status}] Non-existent slug returns proper HTTP 404 (No Soft 404)`)
  } catch (e) {
    assert(false, `Error testing 404: ${e.message}`)
  }

  console.log(`\n=== LIVE PRODUCTION AUDIT SUMMARY: ${passCount} PASSED, ${failCount} FAILED ===\n`)
  if (failCount > 0) {
    process.exit(1)
  }
}

verifyLiveProduction().catch(err => {
  console.error('Fatal verification error:', err)
  process.exit(1)
})
