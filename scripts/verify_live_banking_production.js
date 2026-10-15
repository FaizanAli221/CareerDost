import fs from 'fs'

const BASE_URL = 'https://careerdost.blog'

const publishedArticles = [
  {
    slug: '10pearls-shine-virtual-internship-2026',
    title: '10Pearls Internship 2026: Free Online Internship for CS Students – Apply by 19 October',
    image: '10pearls-shine-virtual-internship-2026'
  },
  {
    slug: 'mcb-bank-infosec-trainee-jobs-2026',
    title: 'MCB Bank Jobs 2026: Information Security Trainee for CS Graduates in Karachi',
    image: 'mcb-bank-infosec-trainee-jobs-2026'
  },
  {
    slug: 'japan-jds-scholarship-2026-pakistan',
    title: 'Japan JDS Scholarship 2026 for Pakistan: Eligibility, Benefits and 27 November Deadline',
    image: 'japan-jds-scholarship-2026-pakistan'
  },
  {
    slug: 'bank-alfalah-jobs-internships-2026',
    title: 'Bank Alfalah Jobs 2026: Fresh Graduate Vacancies, Karachi Jobs & Paid Internships',
    image: 'bank-alfalah-jobs-internships-2026'
  }
]

async function verifyLiveProduction() {
  console.log(`=== VERIFYING LIVE BANKING & SCHOLARSHIP PRODUCTION AT ${BASE_URL} ===\n`)

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
  console.log('--- 1. Live Published Articles on Custom Domain ---')
  for (const art of publishedArticles) {
    const pageUrl = `${BASE_URL}/jobs/${art.slug}`
    try {
      const res = await fetchWithRetry(pageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CareerDost-Live-Verifier/1.0' }
      })
      assert(res.status === 200, `[${res.status}] Article HTTP 200: ${pageUrl}`)
      
      const html = await res.text()
      assert(html.length > 2000, `HTML body returned substantial length (${html.length} chars)`)
      
      // Check H1
      const hasH1 = html.includes(art.title) || html.includes('<h1')
      assert(hasH1, `H1 heading is rendered into document`)

      // Check Canonical URL
      const hasCanonical = html.includes(`href="${pageUrl}"`) || html.includes(`href='${pageUrl}'`)
      assert(hasCanonical, `Canonical URL link tag matches: ${pageUrl}`)

      // Check Schema JSON-LD
      const hasSchema = html.includes('application/ld+json')
      assert(hasSchema, `Schema.org JSON-LD structured data is present`)

      // Check Security Headers
      const csp = res.headers.get('content-security-policy')
      const xfo = res.headers.get('x-frame-options')
      assert(xfo !== null || csp !== null, `Security headers present (X-Frame-Options/CSP)`)
    } catch (e) {
      assert(false, `Error fetching ${pageUrl}: ${e.message}`)
    }
  }

  // 2. Featured Images Verification
  console.log('\n--- 2. Live Featured Images (WebP & JPG) ---')
  for (const art of publishedArticles) {
    for (const ext of ['webp', 'jpg']) {
      const imgUrl = `${BASE_URL}/images/${art.image}.${ext}`
      try {
        const res = await fetchWithRetry(imgUrl, { method: 'HEAD' })
        const contentType = res.headers.get('content-type') || ''
        assert(res.status === 200, `[${res.status}] Image ${ext.toUpperCase()}: ${imgUrl}`)
        assert(contentType.includes('image'), `Content-Type is image/* (${contentType})`)
      } catch (e) {
        assert(false, `Error fetching image ${imgUrl}: ${e.message}`)
      }
    }
  }

  // 3. Draft Protection: Meezan Justuju
  console.log('\n--- 3. Editorial Hold / Draft Protection (Meezan Justuju) ---')
  try {
    const sitemapRes = await fetchWithRetry(`${BASE_URL}/sitemap.xml`)
    const sitemapText = await sitemapRes.text()
    const meezanInSitemap = sitemapText.includes('meezan-justuju-batch-5-2026')
    assert(!meezanInSitemap, `Meezan Justuju draft is strictly EXCLUDED from live sitemap.xml`)

    const apiRes = await fetchWithRetry(`${BASE_URL}/api/articles?latest=true&limit=30`)
    if (apiRes.ok) {
      const apiData = await apiRes.json()
      const returnedSlugs = (apiData.data || []).map(a => a.slug)
      assert(!returnedSlugs.includes('meezan-justuju-batch-5-2026'), `Meezan Justuju draft is NOT leaked in public /api/articles`)
    }
  } catch (e) {
    assert(false, `Error checking draft safety: ${e.message}`)
  }

  // 4. Live Sitemap Verification for Published Articles
  console.log('\n--- 4. Live Sitemap Entries for Published Articles ---')
  try {
    const sitemapRes = await fetchWithRetry(`${BASE_URL}/sitemap.xml`)
    assert(sitemapRes.status === 200, `[${sitemapRes.status}] Sitemap HTTP 200`)
    const sitemapText = await sitemapRes.text()
    for (const art of publishedArticles) {
      const inSitemap = sitemapText.includes(art.slug)
      assert(inSitemap, `Slug '${art.slug}' is present in live sitemap.xml`)
    }
  } catch (e) {
    assert(false, `Error fetching sitemap: ${e.message}`)
  }

  // 5. Daily Updates Route Alias & Direct URL Loading
  console.log('\n--- 5. Direct Daily Updates URL Reload ---')
  for (const art of publishedArticles) {
    const dailyUrl = `${BASE_URL}/daily-updates/${art.slug}`
    try {
      const res = await fetchWithRetry(dailyUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CareerDost-Live-Verifier/1.0' }
      })
      assert(res.status === 200, `[${res.status}] Daily update route loads HTTP 200: ${dailyUrl}`)
    } catch (e) {
      assert(false, `Error fetching daily update URL ${dailyUrl}: ${e.message}`)
    }
  }

  // 6. 404 Protection & Security Verification
  console.log('\n--- 6. 404 Protection & Security Verification ---')
  try {
    const nonExistentUrl = `${BASE_URL}/jobs/non-existent-fake-article-test-12345`
    const res = await fetchWithRetry(nonExistentUrl)
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
