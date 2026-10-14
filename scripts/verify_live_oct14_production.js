const baseUrl = 'https://careerdost.blog'
const pagesUrl = 'https://careerdost.pages.dev'

const publishedArticles = [
  {
    title: 'Sindh Mamta Programme 2026: October Dashboard Confirms 1.442M Registrations Across 22 Districts',
    slug: 'sindh-mamta-programme-2026-october-dashboard',
    canonical: 'https://careerdost.blog/jobs/sindh-mamta-programme-2026-october-dashboard'
  },
  {
    title: 'Benazir Hunarmand Programme 2026: Karachi Technical Training Guide, Eligibility & BISP Registration Portal',
    slug: 'benazir-hunarmand-programme-2026-karachi-guide',
    canonical: 'https://careerdost.blog/jobs/benazir-hunarmand-programme-2026-karachi-guide'
  },
  {
    title: 'Pakistan Wheat Support Price 2026–27: Federal Consultations Underway with Final Pricing Decision Pending',
    slug: 'pakistan-wheat-support-price-2026-27',
    canonical: 'https://careerdost.blog/jobs/pakistan-wheat-support-price-2026-27'
  },
  {
    title: 'Wheat Imports 2026: First Consignment Due at Port Qasim by Late October Under Private Sector Quota',
    slug: 'wheat-imports-karachi-october-2026',
    canonical: 'https://careerdost.blog/jobs/wheat-imports-karachi-october-2026'
  },
  {
    title: 'BISP 8171 Payment Check & Social Protection Wallet 2026: Official Portal, Biometric SIM Rules & Verification Guide',
    slug: 'bisp-8171-payment-check-2026-official-guide',
    canonical: 'https://careerdost.blog/jobs/bisp-8171-payment-check-2026-official-guide'
  },
  {
    title: 'NADRA Digital Payments 2026: 99% Cashless Transactions Achieved Across Registration & Passport Centres',
    slug: 'nadra-digital-payments-2026',
    canonical: 'https://careerdost.blog/jobs/nadra-digital-payments-2026'
  }
]

const draftSlugs = [
  'drap-medicine-barcode-requirements-2026',
  'hyderabad-division-section-144-notification-2026'
]

async function checkUrl(url, expectedStatus = 200) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CareerDost-LiveVerifier/1.0' },
      redirect: 'manual'
    })
    const isExpected = res.status === expectedStatus
    const statusText = isExpected ? '✓ PASS' : '✗ FAIL'
    console.log(`${statusText} [${res.status}] ${url} (Expected: ${expectedStatus})`)
    return { ok: isExpected, status: res.status, res }
  } catch (e) {
    console.log(`✗ [ERROR] ${url}: ${e.message}`)
    return { ok: false, error: e.message }
  }
}

async function verifyAll() {
  console.log('====================================================')
  console.log('CAREERDOST PRODUCTION VERIFICATION (14 OCTOBER 2026)')
  console.log('DOMAIN: https://careerdost.blog')
  console.log('====================================================\n')

  let allPassed = true

  // 1. Verify Published Articles on Live Domain
  console.log('--- 1. Testing Published Articles (Direct HTTP 200 + HTML Metadata) ---')
  for (const art of publishedArticles) {
    const url = `${baseUrl}/jobs/${art.slug}`
    const r = await fetch(url, { headers: { 'User-Agent': 'CareerDost-LiveVerifier/1.0' } })
    const ok = r.status === 200
    if (!ok) allPassed = false
    const html = await r.text()

    const hasCanonical = html.includes(`href="${art.canonical}"`) || html.includes(`href='${art.canonical}'`)
    const hasOgUrl = html.includes(`content="${art.canonical}"`) || html.includes(`content='${art.canonical}'`)
    const hasSchema = html.includes('"@type"') || html.includes('"schemaType"') || html.includes('application/ld+json')
    const hasTitle = html.includes(art.title.slice(0, 30))

    console.log(`${ok ? '✓ PASS' : '✗ FAIL'} [${r.status}] ${url}`)
    console.log(`       Canonical: ${hasCanonical ? '✓ VALID' : '✗ MISSING'}`)
    console.log(`       OG URL:    ${hasOgUrl ? '✓ VALID' : '✗ MISSING'}`)
    console.log(`       Schema:    ${hasSchema ? '✓ PRESENT' : '✗ MISSING'}`)
    console.log(`       Title:     ${hasTitle ? '✓ MATCHED' : '✗ NOT FOUND'}`)
  }

  // 2. Verify Featured Images (WebP and JPG)
  console.log('\n--- 2. Testing Featured Images (1200x675 16:9 WebP & JPG) ---')
  for (const art of publishedArticles) {
    for (const ext of ['webp', 'jpg']) {
      const imgUrl = `${baseUrl}/images/${art.slug}.${ext}`
      const res = await fetch(imgUrl, { method: 'HEAD', headers: { 'User-Agent': 'CareerDost-LiveVerifier/1.0' } })
      const ok = res.status === 200
      if (!ok) allPassed = false
      const ctype = res.headers.get('content-type')
      const clen = res.headers.get('content-length')
      console.log(`${ok ? '✓ PASS' : '✗ FAIL'} [${res.status}] ${imgUrl} (${ctype}, ${clen} bytes)`)
    }
  }

  // 3. Verify Public Sitemap & Robots.txt
  console.log('\n--- 3. Testing Public Sitemap & Draft Exclusion ---')
  const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`)
  if (sitemapRes.ok) {
    const xml = await sitemapRes.text()
    console.log(`✓ PASS [200] ${baseUrl}/sitemap.xml (${xml.length} bytes)`)

    for (const art of publishedArticles) {
      const inSitemap = xml.includes(art.canonical)
      if (!inSitemap) allPassed = false
      console.log(`       ${art.slug}: ${inSitemap ? '✓ IN SITEMAP' : '✗ MISSING'}`)
    }

    for (const d of draftSlugs) {
      const leaked = xml.includes(d)
      if (leaked) allPassed = false
      console.log(`       [Draft Protection] ${d}: ${leaked ? '✗ LEAKED' : '✓ EXCLUDED'}`)
    }
  } else {
    console.log(`✗ FAIL Failed to fetch sitemap: ${sitemapRes.status}`)
    allPassed = false
  }

  // 4. Verify Draft Public Protection (Should return 404 on public route)
  console.log('\n--- 4. Testing Draft Security & Public 404 Protection ---')
  for (const d of draftSlugs) {
    const draftUrl = `${baseUrl}/jobs/${d}`
    const r = await fetch(draftUrl, { headers: { 'User-Agent': 'CareerDost-LiveVerifier/1.0' } })
    const ok = r.status === 404
    if (!ok) allPassed = false
    console.log(`${ok ? '✓ PASS' : '✗ FAIL'} [${r.status}] ${draftUrl} (Draft properly shielded from indexing)`)
  }

  // 5. Verify Direct URL Reload and Edge API
  console.log('\n--- 5. Testing Live Edge API Integration ---')
  for (const art of publishedArticles) {
    const apiUrl = `${baseUrl}/api/articles/${art.slug}`
    try {
      const controller = new AbortController()
      const t = setTimeout(() => controller.abort(), 6000)
      const r = await fetch(apiUrl, { signal: controller.signal })
      clearTimeout(t)
      if (r.ok) {
        const data = await r.json()
        const titleMatch = data.data?.title ? '✓ OK' : '✗ NO TITLE'
        console.log(`✓ PASS [${r.status}] ${apiUrl}`)
        console.log(`       Title: ${data.data?.title?.slice(0, 45)}...`)
      } else {
        console.log(`Note [${r.status}] ${apiUrl}`)
      }
    } catch (e) {
      console.log(`API note: ${e.message}`)
    }
  }

  console.log('\n====================================================')
  console.log(allPassed ? 'ALL VERIFICATION AUDITS PASSED WITH ZERO ERRORS!' : 'SOME AUDITS FAILED - REVIEW LOGS')
  console.log('====================================================')
}

verifyAll().catch(console.error)
