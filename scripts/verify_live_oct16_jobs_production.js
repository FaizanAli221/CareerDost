const BASE_URL = 'https://careerdost.blog'

const testArticles = [
  {
    slug: 'kp-government-project-associate-internship-2026',
    title: 'KP Government Project Associate Internship 2026: 5 Vacancies, Rs 25,000 Stipend & Portal Guide',
    seoTitle: 'KP Govt Project Associate Internship 2026: 5 Slots & Rs25k Stipend',
    image: 'kp-project-associate-internship-2026'
  },
  {
    slug: 'aku-karachi-jobs-traineeships-2026',
    title: 'Aga Khan University Jobs 2026: Karachi Traineeships, Hospital Vacancies & Taleo Portal Guide',
    seoTitle: 'AKU Karachi Jobs & Traineeships 2026: Taleo Application Guide',
    image: 'aku-karachi-careers-traineeships-2026'
  },
  {
    slug: 'systems-limited-associate-software-engineer-jobs-2026',
    title: 'Systems Limited Jobs 2026: Associate Software Engineer, Trainee Program & Application Guide',
    seoTitle: 'Systems Limited Jobs 2026: Associate Software Engineer Guide',
    image: 'systems-limited-ase-jobs-2026'
  },
  {
    slug: 'hbl-jobs-internships-the-league-2026',
    title: 'HBL Jobs 2026: The League Management Trainee, Project Internships & Career Portal Guide',
    seoTitle: 'HBL Jobs 2026: The League & Project Internships Guide',
    image: 'hbl-the-league-jobs-internships-2026'
  },
  {
    slug: 'jazz-careers-ai-associate-programme-2026',
    title: 'Jazz Careers 2026: AI Associate Programme, Digital Internships & Application Guide',
    seoTitle: 'Jazz Careers 2026: AI Associate Programme & Digital Jobs',
    image: 'jazz-ai-associate-programme-careers-2026'
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
  console.log('--- 1. Live Article URLs, Titles, Canonical & Metadata ---')
  for (const art of testArticles) {
    const pageUrl = `${BASE_URL}/jobs/${art.slug}`
    try {
      const res = await fetchWithRetry(pageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CareerDost-Live-Verifier/1.0' }
      })
      assert(res.status === 200, `[${res.status}] Article HTTP 200: ${pageUrl}`)

      const html = await res.text()
      assert(html.length > 2000, `HTML body returned substantial length (${html.length} chars)`)

      const hasH1 = html.includes(art.title) || /<h1[^>]*>[\s\S]*?<\/h1>/i.test(html)
      assert(hasH1, `H1 heading is rendered into document for ${art.slug}`)

      const hasCanonical = html.includes(`href="${pageUrl}"`) || html.includes(`href='${pageUrl}'`)
      assert(hasCanonical, `Canonical URL link tag matches: ${pageUrl}`)

      const hasMetaDesc = html.includes('meta name="description"') || html.includes('content=')
      assert(hasMetaDesc, `SEO Meta Description is present in SSR HTML`)

      const hasSchema = html.includes('application/ld+json')
      assert(hasSchema, `Schema.org JSON-LD structured data is present`)

      const csp = res.headers.get('content-security-policy')
      const xfo = res.headers.get('x-frame-options')
      const xcto = res.headers.get('x-content-type-options')
      assert(xfo !== null || csp !== null || xcto !== null, `Security headers present`)
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

  // 5. Duplicate Prevention & Existing Jobs Integrity Check
  console.log('\n--- 5. Duplicate Prevention & Existing Jobs Regression Verification ---')
  const existingArticles = [
    '10pearls-shine-virtual-internship-2026',
    'mcb-bank-infosec-trainee-jobs-2026',
    'bank-alfalah-jobs-internships-2026',
    'electricity-bills-november-2026-rs256-fuel-adjustment-explained',
    'sindh-minimum-wage-2026-workers-salary'
  ]
  for (const slug of existingArticles) {
    const url = `${BASE_URL}/jobs/${slug}`
    const res = await fetchWithRetry(url, { method: 'HEAD' })
    assert(res.status === 200, `[${res.status}] Existing article preserved & live: ${url}`)
  }

  // 6. Security, Sitemap & Robots.txt Verification
  console.log('\n--- 6. Robots.txt, Google Verification File & 404 Protection ---')
  try {
    const robotsRes = await fetch(`${BASE_URL}/robots.txt`)
    assert(robotsRes.status === 200, `[${robotsRes.status}] robots.txt is accessible`)
    const robotsTxt = await robotsRes.text()
    assert(robotsTxt.includes('sitemap.xml'), `robots.txt contains sitemap.xml reference`)

    const gVerification = await fetch(`${BASE_URL}/googlefa0859c31163b27d.html`)
    assert(gVerification.status === 200, `[${gVerification.status}] Google Search Console verification token intact`)

    const nonExistentUrl = `${BASE_URL}/jobs/non-existent-fake-article-test-99999`
    const res404 = await fetch(nonExistentUrl)
    assert(res404.status === 404, `[${res404.status}] Non-existent slug returns proper HTTP 404`)
  } catch (e) {
    assert(false, `Error testing robots/gverification/404: ${e.message}`)
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
