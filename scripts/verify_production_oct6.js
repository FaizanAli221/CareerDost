const BASE_URL = 'https://careerdost.blog'

const endpoints = [
  '/',
  '/daily-updates',
  '/jobs/chevening-scholarship-2027-28-pakistan',
  '/jobs/hec-jobs-2026',
  '/jobs/habib-university-admissions-2027',
  '/jobs/swiss-government-excellence-scholarships-2027-pakistan',
  '/jobs/hec-outstanding-research-awards-2026-27',
  '/daily-updates/chevening-scholarship-2027-28-pakistan',
  '/daily-updates/hec-jobs-2026',
  '/daily-updates/habib-university-admissions-2027',
  '/daily-updates/swiss-government-excellence-scholarships-2027-pakistan',
  '/daily-updates/hec-outstanding-research-awards-2026-27',
  '/sitemap.xml',
  '/robots.txt',
  '/images/chevening-scholarship-2027-28.jpg',
  '/images/habib-university-admissions-2027.jpg',
  '/images/hec-jobs-2026.svg',
  '/images/swiss-government-excellence-scholarships-2027.jpg',
  '/images/hec-outstanding-research-awards-2026-27.svg'
]

async function verify() {
  console.log(`=== AUDITING LIVE PRODUCTION DOMAIN: ${BASE_URL} ===\n`)

  for (const ep of endpoints) {
    try {
      const url = `${BASE_URL}${ep}`
      const res = await fetch(url)
      const contentType = res.headers.get('content-type') || ''
      console.log(`[HTTP ${res.status}] ${url} (${contentType})`)
    } catch (err) {
      console.error(`[ERROR] ${ep}:`, err.message)
    }
  }

  // Check API
  console.log('\n=== AUDITING LIVE PRODUCTION API ===\n')
  try {
    const res = await fetch(`${BASE_URL}/api/articles?latest=true&limit=5`)
    const data = await res.json()
    console.log(`[API /articles?latest=true] Success: ${data.success}, Count: ${data.data?.length}`)
    if (data.data) {
      data.data.forEach((item, idx) => {
        console.log(`  ${idx + 1}. [${item.publishDate}] ${item.title} (${item.slug})`)
      })
    }
  } catch (err) {
    console.error('[API ERROR]:', err.message)
  }

  try {
    const res = await fetch(`${BASE_URL}/api/updates/latest?limit=5`)
    const data = await res.json()
    console.log(`\n[API /updates/latest] Success: ${data.success}, Count: ${data.data?.length}`)
    if (data.data) {
      data.data.forEach((item, idx) => {
        console.log(`  ${idx + 1}. [${item.publishDate}] ${item.title} (${item.slug})`)
      })
    }
  } catch (err) {
    console.error('[API ERROR]:', err.message)
  }

  // Verify Sitemap
  console.log('\n=== AUDITING LIVE SITEMAP ===\n')
  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`)
    const xml = await res.text()
    console.log(`Sitemap status: ${res.status}, Length: ${xml.length} bytes`)
    console.log(`Starts with <?xml: ${xml.startsWith('<?xml')}`)
    const matches = [
      'chevening-scholarship-2027-28-pakistan',
      'hec-jobs-2026',
      'habib-university-admissions-2027',
      'swiss-government-excellence-scholarships-2027-pakistan',
      'hec-outstanding-research-awards-2026-27'
    ]
    matches.forEach(m => {
      console.log(`  Contains ${m}: ${xml.includes(m)}`)
    })
  } catch (err) {
    console.error('[SITEMAP ERROR]:', err.message)
  }
}

verify()
