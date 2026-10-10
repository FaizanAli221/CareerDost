const BASE_URL = 'https://careerdost.blog'

const endpoints = [
  '/',
  '/daily-updates',
  '/jobs/punjab-sti-jobs-2026-27',
  '/jobs/nums-spring-2027-admissions',
  '/jobs/nums-mdcat-result-2026',
  '/jobs/shaikh-ayaz-university-admissions-2027',
  '/jobs/sindh-agriculture-university-admissions-2027',
  '/daily-updates/punjab-sti-jobs-2026-27',
  '/daily-updates/nums-spring-2027-admissions',
  '/daily-updates/nums-mdcat-result-2026',
  '/daily-updates/shaikh-ayaz-university-admissions-2027',
  '/daily-updates/sindh-agriculture-university-admissions-2027',
  '/sitemap.xml',
  '/robots.txt',
  '/images/punjab-sti-2026-27.jpg',
  '/images/nums-spring-2027.jpg',
  '/images/nums-mdcat-result-2026.jpg',
  '/images/shaikh-ayaz-university-admissions-2027.jpg',
  '/images/sau-admissions-2027.jpg',
  '/images/punjab-sti-2026-27.svg',
  '/images/nums-spring-2027.svg',
  '/images/nums-mdcat-result-2026.svg',
  '/images/shaikh-ayaz-university-admissions-2027.svg',
  '/images/sau-admissions-2027.svg'
]

async function verify() {
  console.log(`=== AUDITING LIVE PRODUCTION DOMAIN: ${BASE_URL} ===\n`)

  let failedEndpoints = 0
  for (const ep of endpoints) {
    try {
      const url = `${BASE_URL}${ep}`
      const res = await fetch(url)
      const contentType = res.headers.get('content-type') || ''
      console.log(`[HTTP ${res.status}] ${url} (${contentType})`)
      if (res.status !== 200) {
        failedEndpoints++
      }
    } catch (err) {
      console.error(`[ERROR] ${ep}:`, err.message)
      failedEndpoints++
    }
  }

  // Check API Articles
  console.log('\n=== AUDITING LIVE PRODUCTION API: /api/articles ===\n')
  try {
    const res = await fetch(`${BASE_URL}/api/articles?latest=true&limit=5`)
    const data = await res.json()
    console.log(`[API /articles?latest=true] Success: ${data.success}, Count: ${data.data?.length}`)
    if (data.data) {
      data.data.forEach((item, idx) => {
        console.log(`  ${idx + 1}. [${item.publishDate} | id:${item.id}] ${item.title} (${item.slug})`)
      })
    }
  } catch (err) {
    console.error('[API ERROR]:', err.message)
  }

  // Check API Daily Updates
  console.log('\n=== AUDITING LIVE PRODUCTION API: /api/updates/latest ===\n')
  try {
    const res = await fetch(`${BASE_URL}/api/updates/latest?limit=5`)
    const data = await res.json()
    console.log(`[API /updates/latest] Success: ${data.success}, Count: ${data.data?.length}`)
    if (data.data) {
      data.data.forEach((item, idx) => {
        console.log(`  ${idx + 1}. [${item.publishDate} | id:${item.id}] ${item.title} (${item.slug})`)
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
      'punjab-sti-jobs-2026-27',
      'nums-spring-2027-admissions',
      'nums-mdcat-result-2026',
      'shaikh-ayaz-university-admissions-2027',
      'sindh-agriculture-university-admissions-2027'
    ]
    matches.forEach(m => {
      console.log(`  Contains ${m}: ${xml.includes(m)}`)
    })
  } catch (err) {
    console.error('[SITEMAP ERROR]:', err.message)
  }

  console.log(`\nAudit completed with ${failedEndpoints} errors.`)
}

verify()
