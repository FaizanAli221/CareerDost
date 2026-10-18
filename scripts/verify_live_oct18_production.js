const BASE_URL = 'https://careerdost.blog'

const publishedArticles = [
  {
    slug: 'samba-bank-relationship-associate-jobs-2026',
    title: 'Samba Bank Jobs 2026: Relationship Associate (SME Banking) in Karachi & Lahore – Apply by 31 October',
    image: 'samba-bank-relationship-associate-jobs-2026',
    metaSnippet: 'Samba Bank Limited'
  },
  {
    slug: 'bank-alfalah-jobs-internships-2026',
    title: 'Bank Alfalah Jobs 2026: Counter Service Officer, Fresh Graduate Vacancies & Internships Guide',
    image: 'bank-alfalah-jobs-internships-2026',
    metaSnippet: 'Bank Alfalah Counter Service Officer'
  },
  {
    slug: 'ezy-business-applications-paid-internship-karachi-2026',
    title: 'EZY Business Applications Paid Sales Internship Karachi 2026: Rs 30,000 Stipend & Night Shift Guide',
    image: 'ezy-business-applications-paid-internship-karachi-2026',
    metaSnippet: 'EZY Business Applications'
  },
  {
    slug: 'unilever-pakistan-jobs-october-2026',
    title: 'Unilever Pakistan Jobs October 2026: 5 Verified Openings in Karachi & Lahore (Apply by 23–24 Oct)',
    image: 'unilever-pakistan-jobs-october-2026',
    metaSnippet: 'Unilever Pakistan jobs for October 2026'
  }
]

const heldDraftSlug = 'mrp-elite-graduate-trainee-karachi-2026'

async function verifyLiveProduction() {
  console.log(`=== VERIFYING LIVE PRODUCTION DEPLOYMENT AT ${BASE_URL} (OCT 18 BATCH) ===\n`)

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
  console.log('--- 1. Live Published Article URLs, SEO Metadata, Canonical & Security Headers ---')
  for (const art of publishedArticles) {
    const pageUrl = `${BASE_URL}/jobs/${art.slug}`
    try {
      const res = await fetchWithRetry(pageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CareerDost-Live-Verifier/1.0' }
      })
      assert(res.status === 200, `[${res.status}] Article HTTP 200: ${pageUrl}`)

      const html = await res.text()
      assert(html.length > 2000, `HTML body returned substantial length (${html.length} chars) for ${art.slug}`)

      const hasH1 = html.includes(art.title) || html.includes('<h1')
      assert(hasH1, `H1 heading is rendered into document for ${art.slug}`)

      const hasCanonical = html.includes(`href="${pageUrl}"`) || html.includes(`href='${pageUrl}'`)
      assert(hasCanonical, `Canonical URL link tag matches: ${pageUrl}`)

      const hasMetaDesc = html.includes(art.metaSnippet) || html.includes('meta name="description"')
      assert(hasMetaDesc, `SEO Meta Description is present in SSR HTML for ${art.slug}`)

      const hasSchema = html.includes('application/ld+json')
      assert(hasSchema, `Schema.org JSON-LD structured data is present for ${art.slug}`)

      const csp = res.headers.get('content-security-policy')
      const xfo = res.headers.get('x-frame-options')
      const xcto = res.headers.get('x-content-type-options')
      assert(xfo !== null || csp !== null || xcto !== null, `Security headers present (X-Frame-Options/CSP/X-Content-Type-Options) on ${art.slug}`)
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

  // 3. Live Sitemap Verification (Published Included, Unverified Draft Excluded)
  console.log('\n--- 3. Live Sitemap Entries & Draft Exclusion ---')
  try {
    const sitemapRes = await fetchWithRetry(`${BASE_URL}/sitemap.xml`)
    assert(sitemapRes.status === 200, `[${sitemapRes.status}] Sitemap HTTP 200`)
    const sitemapText = await sitemapRes.text()
    for (const art of publishedArticles) {
      const inSitemap = sitemapText.includes(art.slug)
      assert(inSitemap, `Published slug '${art.slug}' is present in live sitemap.xml`)
    }
    const draftInSitemap = sitemapText.includes(heldDraftSlug)
    assert(!draftInSitemap, `Unverified draft slug '${heldDraftSlug}' is EXCLUDED from live sitemap.xml`)
  } catch (e) {
    assert(false, `Error fetching sitemap: ${e.message}`)
  }

  // 4. Internal Links Verification
  console.log('\n--- 4. Internal Links Live HTTP 200 ---')
  const internalSlugs = [
    'hbl-jobs-internships-the-league-2026',
    'mcb-bank-infosec-trainee-jobs-2026',
    'unilever-future-leaders-2026',
    '10pearls-shine-virtual-internship-2026',
    'aku-karachi-jobs-traineeships-2026',
    'sindh-minimum-wage-2026-workers-salary'
  ]
  for (const slug of internalSlugs) {
    const url = `${BASE_URL}/jobs/${slug}`
    const res = await fetchWithRetry(url, { method: 'HEAD' })
    assert(res.status === 200, `[${res.status}] Internal link live: ${url}`)
  }

  // 5. Draft & 404 Protection Verification
  console.log('\n--- 5. Draft & 404 Protection Verification ---')
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
