const baseUrl = 'https://careerdost.blog'
const pagesUrl = 'https://careerdost.pages.dev'

async function checkUrl(url, expectedStatus) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CareerDost-Verifier/1.0' } })
    const ok = res.status === expectedStatus
    console.log(`${ok ? '✓ PASS' : '✗ FAIL'} [${res.status}] ${url} (Expected: ${expectedStatus})`)
    return { ok, status: res.status }
  } catch (err) {
    console.log(`✗ [ERROR] ${url}: ${err.message}`)
    return { ok: false, error: err.message }
  }
}

async function verifyAll() {
  console.log('=== VERIFYING LIVE PRODUCTION STATUS ===\n')

  console.log('--- 1. Testing Published Articles (Expected: 200) ---')
  await checkUrl(`${baseUrl}/jobs/spsc-jobs-2026-54-vacancies`, 200)
  await checkUrl(`${baseUrl}/jobs/pm-fuel-relief-scheme-2026-registration-eligibility`, 200)
  await checkUrl(`${baseUrl}/jobs/sindh-minimum-wage-2026-workers-salary`, 200)

  console.log('\n--- 2. Testing Draft Articles Public Protection (Expected: 404) ---')
  await checkUrl(`${baseUrl}/jobs/drap-medicine-barcode-requirements-2026`, 404)
  await checkUrl(`${baseUrl}/jobs/hyderabad-division-section-144-notification-2026`, 404)

  console.log('\n--- 3. Testing Featured Images (WebP & JPG) (Expected: 200) ---')
  const images = [
    'spsc-jobs-2026-54-vacancies',
    'pm-fuel-relief-scheme-2026-registration-eligibility',
    'drap-medicine-barcode-requirements-2026',
    'sindh-minimum-wage-2026-workers-salary',
    'hyderabad-division-section-144-notification-2026'
  ]
  for (const s of images) {
    await checkUrl(`${baseUrl}/images/${s}.webp`, 200)
    await checkUrl(`${baseUrl}/images/${s}.jpg`, 200)
  }

  console.log('\n--- 4. Checking Public Sitemap (Expected: 200, drafts excluded) ---')
  const smRes = await fetch(`${baseUrl}/sitemap.xml`)
  if (smRes.ok) {
    const xml = await smRes.text()
    const hasDrap = xml.includes('drap-medicine-barcode-requirements-2026')
    const hasHyd = xml.includes('hyderabad-division-section-144-notification-2026')
    const hasSpsc = xml.includes('spsc-jobs-2026-54-vacancies')
    const hasFuel = xml.includes('pm-fuel-relief-scheme-2026-registration-eligibility')
    const hasWage = xml.includes('sindh-minimum-wage-2026-workers-salary')

    console.log(`✓ Sitemap HTTP 200 OK (${xml.length} bytes)`)
    console.log(`  DRAP draft in sitemap: ${hasDrap ? 'LEAK (FAIL)' : 'EXCLUDED (PASS)'}`)
    console.log(`  Hyderabad draft in sitemap: ${hasHyd ? 'LEAK (FAIL)' : 'EXCLUDED (PASS)'}`)
    console.log(`  SPSC in sitemap: ${hasSpsc ? 'PRESENT (PASS)' : 'MISSING (FAIL)'}`)
    console.log(`  Fuel Relief in sitemap: ${hasFuel ? 'PRESENT (PASS)' : 'MISSING (FAIL)'}`)
    console.log(`  Sindh Wage in sitemap: ${hasWage ? 'PRESENT (PASS)' : 'MISSING (FAIL)'}`)
  } else {
    console.log(`✗ Failed to fetch sitemap: ${smRes.status}`)
  }

  console.log('\n--- 5. Checking API Response for Remote D1 ---')
  try {
    const apiRes = await fetch(`${pagesUrl}/api/articles/pm-fuel-relief-scheme-2026-registration-eligibility`)
    if (apiRes.ok) {
      const data = await apiRes.json()
      console.log(`✓ Live API returned Fuel Relief: "${data.data?.title}"`)
      console.log(`  Image: ${data.data?.featuredImage}`)
      console.log(`  Positions: ${data.data?.positions}`)
    } else {
      console.log(`API fetch status: ${apiRes.status}`)
    }
  } catch (e) {
    console.log('API error:', e.message)
  }

  console.log('\n=== LIVE PRODUCTION VERIFICATION COMPLETED ===')
}

verifyAll().catch(console.error)
