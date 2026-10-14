import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://careerdost.blog'

const testArticles = [
  {
    slug: 'zarkhez-e-asaan-digital-zarai-qarza-guide-2026',
    title: 'Zarkhez-e Asaan Digital Zarai Qarza 2026: SBP Production Loan Limit, Digital Application & Farmer Eligibility',
    expectedType: 'scheme',
    expectedBadge: 'Government Scheme',
    expectedHeaderLabel: 'Financial Assistance / Subsidy',
    image: 'zarkhez-e-asaan-digital-zarai-qarza-guide-2026'
  },
  {
    slug: 'benazir-women-agricultural-worker-card-sindh-guide-2026',
    title: 'Benazir Women Agricultural Worker Card 2026: Sindh Cabinet Approval, Beneficiary Rights & Registration Status',
    expectedType: 'scheme',
    expectedBadge: 'Government Scheme',
    expectedHeaderLabel: 'Financial Assistance / Subsidy',
    image: 'benazir-women-agricultural-worker-card-sindh-guide-2026'
  },
  {
    slug: 'sindh-peoples-housing-flood-affectees-sphf-subsidy-guide-2026',
    title: 'Sindh Peoples Housing for Flood Affectees (SPHF) 2026: Rs 300,000 Grant Tranches, CNIC Verification & Women Title Deeds',
    expectedType: 'scheme',
    expectedBadge: 'Government Scheme',
    expectedHeaderLabel: 'Financial Assistance / Subsidy',
    image: 'sindh-peoples-housing-flood-affectees-sphf-subsidy-guide-2026'
  },
  {
    slug: 'sindh-solar-energy-project-ssep-home-solar-systems-subsidy-2026',
    title: 'Sindh Solar Energy Project (SSEP) 2026: 200,000 Home Solar Systems Subsidy, District Quotas & Application Guide',
    expectedType: 'scheme',
    expectedBadge: 'Government Scheme',
    expectedHeaderLabel: 'Financial Assistance / Subsidy',
    image: 'sindh-solar-energy-project-ssep-home-solar-systems-subsidy-2026'
  },
  {
    slug: 'sbp-housing-solar-financing-rules-circular-06-2026',
    title: 'SBP Housing & Solar Financing Rules 2026: Circular 06 PR HF-7 Amendments, Loan Limits & Documentation Checklist',
    expectedType: 'notification',
    expectedBadge: 'Official Notification',
    expectedHeaderLabel: 'Notified Rates / Mandate',
    image: 'sbp-housing-solar-financing-rules-circular-06-2026'
  }
]

async function verifyProduction() {
  console.log('=== VERIFYING LIVE HIGH-REACH PRODUCTION AT https://careerdost.blog ===\n')

  let passCount = 0
  let failCount = 0

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`)
      passCount++
    } else {
      console.error(`  ✗ FAIL: ${message}`)
      failCount++
    }
  }

  // 1. Verify Sitemap
  console.log('1. Checking Live /sitemap.xml...')
  const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`)
  assert(sitemapRes.status === 200, `Sitemap HTTP status is 200 (Got ${sitemapRes.status})`)
  const sitemapXml = await sitemapRes.text()
  assert(sitemapXml.includes('<?xml version="1.0" encoding="UTF-8"?>'), 'Sitemap has valid XML header')
  for (const a of testArticles) {
    assert(sitemapXml.includes(`/jobs/${a.slug}`), `Sitemap includes /jobs/${a.slug}`)
  }

  // 2. Verify Robots.txt
  console.log('\n2. Checking Live /robots.txt...')
  const robotsRes = await fetch(`${BASE_URL}/robots.txt`)
  assert(robotsRes.status === 200, `Robots.txt HTTP status is 200 (Got ${robotsRes.status})`)
  const robotsTxt = await robotsRes.text()
  assert(robotsTxt.includes('Sitemap: https://careerdost.blog/sitemap.xml'), 'Robots.txt points to canonical sitemap')

  // 3. Verify Images (WebP & JPG)
  console.log('\n3. Checking Live Featured Images (WebP & JPG)...')
  for (const a of testArticles) {
    const webpUrl = `${BASE_URL}/images/${a.image}.webp`
    const jpgUrl = `${BASE_URL}/images/${a.image}.jpg`

    const webpRes = await fetch(webpUrl, { method: 'HEAD' })
    assert(webpRes.status === 200, `WebP image exists: ${a.image}.webp (HTTP 200, type: ${webpRes.headers.get('content-type')})`)

    const jpgRes = await fetch(jpgUrl, { method: 'HEAD' })
    assert(jpgRes.status === 200, `JPG image exists: ${a.image}.jpg (HTTP 200, type: ${jpgRes.headers.get('content-type')})`)
  }

  // 4. Verify Article Pages
  console.log('\n4. Checking Live Article HTML & Metadata...')
  for (const a of testArticles) {
    console.log(`\n  Checking article: [${a.slug}]`)
    const artUrl = `${BASE_URL}/jobs/${a.slug}`
    const res = await fetch(artUrl)
    assert(res.status === 200, `HTTP status is 200 for ${artUrl}`)
    const html = await res.text()

    // Title tag check
    assert(html.includes('<title>'), 'HTML contains <title> tag')
    assert(html.includes(a.slug), 'HTML contains reference to slug')

    // Canonical link
    assert(html.includes(`rel="canonical" href="${artUrl}"`) || html.includes(`rel="canonical" href='${artUrl}'`), `Canonical URL is correct (${artUrl})`)

    // Schema.org check
    assert(html.includes('application/ld+json'), 'Schema.org JSON-LD is embedded in HTML')

    // Badge / Content type check
    assert(html.includes(a.expectedBadge), `Displays correct badge: "${a.expectedBadge}"`)

    // Preload image check
    assert(html.includes(`rel="preload" as="image"`) && html.includes(`${a.image}.webp`), `Preload hero image header injected for ${a.image}.webp`)

    // Duplicate heading check
    // Ensure the title does not appear twice as H1 and H2
    const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || []
    assert(h1Matches.length === 1, `Clean single H1 tag found (${h1Matches.length} H1s)`)

    // Check for absence of fake job labels
    assert(!html.includes('Vacancies / Positions'), 'Does not show "Vacancies / Positions"')
    assert(!html.includes('Salary / Scale'), 'Does not show "Salary / Scale"')
  }

  console.log(`\n=== Verification Summary: ${passCount} Passed, ${failCount} Failed ===`)
  if (failCount > 0) {
    process.exit(1)
  }
}

verifyProduction().catch(err => {
  console.error('Verification error:', err)
  process.exit(1)
})
